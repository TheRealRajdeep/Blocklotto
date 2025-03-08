from django.db import models

# Create your models here.
class UserWallet(models.Model):
    address = models.CharField(max_length=42, unique=True)  # Ethereum Wallet Address
    nonce = models.CharField(max_length=32, blank=True, null=True)  # Random Nonce