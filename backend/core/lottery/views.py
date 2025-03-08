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
from .models import UserWallet  # Only wallet model is used now
from unittest.mock import MagicMock

# Initialize Web3 using your Infura URL
INFURA_URL = "https://sepolia.infura.io/v3/22c1da807d244b30b3e9ecb0b8049b87"
web3 = Web3(Web3.HTTPProvider(INFURA_URL))

# Provide your actual deployed contract address and ABI here
CONTRACT_ADDRESS = "0xYourContractAddress"
ABI = []  # Replace with actual ABI

# Create the contract instance (or a mock if not properly configured)
if not web3.isConnected():
    raise ValueError("Web3 provider connection failed. Check your INFURA_URL.")

if CONTRACT_ADDRESS == "0xYourContractAddress" or not ABI:
    contract = MagicMock()
else:
    contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)

# Define the entry fee (as in the Solidity contract: 0.0001 ether)
ENTRY_FEE_ETHER = 0.0001

def generate_nonce(length=8):
    """Generate a random nonce string."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

class ConnectWalletView(APIView):
    """
    Step 1: User requests a nonce to sign.
    """
    def post(self, request):
        address = request.data.get("address")
        if not Web3.isAddress(address):
            return Response({"error": "Invalid Ethereum address"}, status=status.HTTP_400_BAD_REQUEST)
        # Convert to checksum address
        address = Web3.toChecksumAddress(address)
        user, created = UserWallet.objects.get_or_create(address=address)
        user.nonce = generate_nonce()
        user.save()
        return Response({"nonce": user.nonce}, status=status.HTTP_200_OK)

class VerifySignatureView(APIView):
    """
    Step 2: User submits the signed nonce for verification.
    """
    def post(self, request):
        address = request.data.get("address")
        signature = request.data.get("signature")
        if not Web3.isAddress(address):
            return Response({"error": "Invalid Ethereum address"}, status=status.HTTP_400_BAD_REQUEST)
        address = Web3.toChecksumAddress(address)
        user = get_object_or_404(UserWallet, address=address)
        nonce = user.nonce
        if not nonce:
            return Response({"error": "No nonce found. Request a new nonce first."}, status=status.HTTP_400_BAD_REQUEST)
        message = encode_defunct(text=nonce)
        try:
            recovered_address = web3.eth.account.recover_message(message, signature=signature)
        except Exception as e:
            return Response({"error": f"Signature verification failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        if recovered_address.lower() == address.lower():
            payload = {"address": address}
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
            # Clear the nonce after successful verification
            user.nonce = None
            user.save()
            return Response({"token": token}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid signature"}, status=status.HTTP_401_UNAUTHORIZED)

class EnterLotteryView(APIView):
    """
    Users enter the lottery by calling the on-chain 'enterLottery' function.
    The correct ETH amount is calculated as ENTRY_FEE * number_of_tickets.
    """
    def post(self, request):
        address = request.data.get("address")
        number_of_tickets = request.data.get("number_of_tickets")
        if not address or not number_of_tickets:
            return Response({"error": "Address and number_of_tickets are required"}, status=status.HTTP_400_BAD_REQUEST)
        if not Web3.isAddress(address):
            return Response({"error": "Invalid Ethereum address"}, status=status.HTTP_400_BAD_REQUEST)
        address = Web3.toChecksumAddress(address)
        try:
            number_of_tickets = int(number_of_tickets)
        except ValueError:
            return Response({"error": "number_of_tickets must be an integer"}, status=status.HTTP_400_BAD_REQUEST)
        if number_of_tickets <= 0:
            return Response({"error": "Must buy at least one ticket"}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate the total ETH value: ENTRY_FEE * number_of_tickets
        total_value = web3.toWei(ENTRY_FEE_ETHER * number_of_tickets, 'ether')

        try:
            # Build transaction data for enterLottery(number_of_tickets)
            tx = contract.functions.enterLottery(number_of_tickets).buildTransaction({
                'from': address,
                'value': total_value,
                'nonce': web3.eth.get_transaction_count(address)
            })
            # Note: The transaction should be signed client-side (or by your secure backend if holding the key)
            return Response({"transaction": tx}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CloseLotteryView(APIView):
    """
    Closes the active lottery on-chain.
    """
    def post(self, request):
        admin_wallet = settings.ADMIN_WALLET_ADDRESS
        try:
            tx = contract.functions.closeLottery().buildTransaction({
                'from': admin_wallet,
                'nonce': web3.eth.get_transaction_count(admin_wallet)
            })
            # The admin must sign and send this transaction
            return Response({"transaction": tx}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetLotteryStateView(APIView):
    """
    Returns the current on-chain lottery state.
    For example, the list of players and the current lottery ID.
    """
    def get(self, request):
        try:
            players = contract.functions.getPlayers().call()
            current_lottery_id = contract.functions.lotteryId().call()
            return Response({
                "players": players,
                "lotteryId": current_lottery_id
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetLatestWinnerView(APIView):
    """
    Returns the latest winner from on-chain state.
    The contract emits a 'WinnerPicked' event and stores the winner in a public mapping.
    """
    def get(self, request):
        try:
            current_lottery_id = contract.functions.lotteryId().call()
            if current_lottery_id == 0:
                return Response({"message": "No lottery rounds have been completed yet."}, status=status.HTTP_200_OK)
            latest_lottery_id = current_lottery_id - 1
            winner = contract.functions.lotteryWinners(latest_lottery_id).call()
            return Response({"latest_winner": winner, "lottery_id": latest_lottery_id}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
