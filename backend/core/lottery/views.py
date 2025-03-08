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
from .models import UserWallet

# Web3 instance (change RPC URL to your blockchain provider)
INFURA_URL = "https://sepolia.infura.io/v3/22c1da807d244b30b3e9ecb0b8049b87"  # Change to Sepolia testnet
web3 = Web3(Web3.HTTPProvider(INFURA_URL))

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
