from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from web3 import Web3
from eth_account.messages import encode_defunct
import random
import string
import jwt
from .models import UserWallet,Lottery,Ticket
from unittest.mock import MagicMock

# Web3 instance (change RPC URL to your blockchain provider)
INFURA_URL = "https://sepolia.infura.io/v3/22c1da807d244b30b3e9ecb0b8049b87"  # Change to Sepolia testnet
web3 = Web3(Web3.HTTPProvider(INFURA_URL))

# Your deployed smart contract details
CONTRACT_ADDRESS = "0xYourContractAddress"
ABI = []  # Paste your contract ABI here

contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)
if not web3.is_connected():
    raise ValueError("Web3 provider connection failed. Check your INFURA_URL.")

# Placeholder contract to avoid errors
if CONTRACT_ADDRESS == "0xYourContractAddress" or not ABI:
    contract = MagicMock()  # Mock object prevents crashes
else:
    contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)

def generate_nonce(length=8):
    """Generate a random nonce string."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

class ConnectWalletView(APIView):
    """Step 1: User requests a nonce to sign"""
    def post(self, request):
        address = request.data.get("address")
        if not web3.is_address(address):
            return Response({"error": "Invalid Ethereum address"}, status=status.HTTP_400_BAD_REQUEST)

        # Convert to checksum address (good practice)
        address = web3.to_checksum_address(address)

        # Fetch or create the user wallet entry
        user, created = UserWallet.objects.get_or_create(address=address)
        user.nonce = generate_nonce()
        user.save()

        return Response({"nonce": user.nonce}, status=status.HTTP_200_OK)

class VerifySignatureView(APIView):
    """Step 2: User submits the signed nonce for verification"""
    def post(self, request):
        address = request.data.get("address")
        signature = request.data.get("signature")

        if not web3.is_address(address):
            return Response({"error": "Invalid Ethereum address"}, status=status.HTTP_400_BAD_REQUEST)

        # Convert to checksum address
        address = web3.to_checksum_address(address)

        user = get_object_or_404(UserWallet, address=address)
        nonce = user.nonce  # Retrieve stored nonce

        if not nonce:
            return Response({"error": "No nonce found. Request a new nonce first."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a message in EIP-191 format
        message = encode_defunct(text=nonce)

        try:
            # Recover signer address from the signature
            recovered_address = web3.eth.account.recover_message(message, signature=signature)
        except Exception as e:
            return Response({"error": f"Signature verification failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        if recovered_address.lower() == address.lower():
            # Signature is valid, generate JWT token
            payload = {"address": address}
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

            # Clear nonce after successful verification (important for security!)
            user.nonce = None
            user.save()

            return Response({"token": token}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid signature"}, status=status.HTTP_401_UNAUTHORIZED)
        

class CreateLotteryView(APIView):
    """Creates a new lottery round"""
    def post(self, request):
        admin_wallet = settings.ADMIN_WALLET_ADDRESS
        ticket_price = request.data.get("ticket_price")
        max_tickets = request.data.get("max_tickets")

        if not ticket_price or not max_tickets:
            return Response({"error": "Ticket price and max tickets required"}, status=status.HTTP_400_BAD_REQUEST)

        ticket_price_wei = web3.to_wei(ticket_price, 'ether')

        try:
            tx_hash = contract.functions.createLottery(ticket_price_wei, max_tickets).transact({'from': admin_wallet})
            web3.eth.wait_for_transaction_receipt(tx_hash)

            Lottery.objects.create(
                contract_address=CONTRACT_ADDRESS,
                ticket_price=ticket_price,
                max_tickets=max_tickets,
                is_active=True
            )

            return Response({"message": "Lottery created successfully!", "tx_hash": tx_hash.hex()}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ActiveLotteryView(APIView):
    """Fetch the currently active lottery"""
    def get(self, request):
        active_lottery = Lottery.objects.filter(is_active=True).first()
        if not active_lottery:
            return Response({"message": "No active lottery found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "contract_address": active_lottery.contract_address,
            "ticket_price": active_lottery.ticket_price,
            "max_tickets": active_lottery.max_tickets,
            "is_active": active_lottery.is_active
        })


class BuyTicketView(APIView):
    """Users buy a ticket for the active lottery"""
    def post(self, request):
        address = request.data.get("address")

        if not web3.is_address(address):
            return Response({"error": "Invalid Ethereum address"}, status=status.HTTP_400_BAD_REQUEST)

        active_lottery = Lottery.objects.filter(is_active=True).first()
        if not active_lottery:
            return Response({"error": "No active lottery"}, status=status.HTTP_404_NOT_FOUND)

        ticket_count = Ticket.objects.filter(lottery=active_lottery).count()
        if ticket_count >= active_lottery.max_tickets:
            return Response({"error": "Lottery is full"}, status=status.HTTP_400_BAD_REQUEST)

        ticket_number = ticket_count + 1

        try:
            tx_hash = contract.functions.buyTicket().transact({'from': address, 'value': web3.to_wei(active_lottery.ticket_price, 'ether')})
            web3.eth.wait_for_transaction_receipt(tx_hash)

            Ticket.objects.create(lottery=active_lottery, buyer=address, ticket_number=ticket_number)

            return Response({"message": "Ticket purchased!", "ticket_number": ticket_number, "tx_hash": tx_hash.hex()}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CloseLotteryView(APIView):
    """Closes the active lottery"""
    def post(self, request):
        admin_wallet = settings.ADMIN_WALLET_ADDRESS
        active_lottery = Lottery.objects.filter(is_active=True).first()

        if not active_lottery:
            return Response({"error": "No active lottery to close"}, status=status.HTTP_404_NOT_FOUND)

        try:
            tx_hash = contract.functions.closeLottery().transact({'from': admin_wallet})
            web3.eth.wait_for_transaction_receipt(tx_hash)

            active_lottery.is_active = False
            active_lottery.save()

            return Response({"message": "Lottery closed!", "tx_hash": tx_hash.hex()}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WinnerView(APIView):
    """Selects and announces the winner"""
    def post(self, request):
        admin_wallet = settings.ADMIN_WALLET_ADDRESS
        closed_lottery = Lottery.objects.filter(is_active=False).order_by("-created_at").first()

        if not closed_lottery:
            return Response({"error": "No closed lottery found"}, status=status.HTTP_404_NOT_FOUND)

        tickets = Ticket.objects.filter(lottery=closed_lottery)
        if not tickets:
            return Response({"error": "No tickets were purchased"}, status=status.HTTP_400_BAD_REQUEST)

        winner_ticket = random.choice(tickets)

        try:
            tx_hash = contract.functions.pickWinner().transact({'from': admin_wallet})
            web3.eth.wait_for_transaction_receipt(tx_hash)

            return Response({"message": "Winner selected!", "winner": winner_ticket.buyer, "tx_hash": tx_hash.hex()}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)