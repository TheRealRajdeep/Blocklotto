from django.db import models

# Create your models here.
class UserWallet(models.Model):
    address = models.CharField(max_length=42, unique=True)  # Ethereum Wallet Address
    nonce = models.CharField(max_length=32, blank=True, null=True)  # Random Nonce

class Lottery(models.Model):
    contract_address = models.CharField(max_length=42, unique=True)  # Smart contract address
    ticket_price = models.DecimalField(max_digits=10, decimal_places=6)  # In ETH
    max_tickets = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Lottery {self.id} - {self.contract_address}"
    
class Ticket(models.Model):
    lottery = models.ForeignKey(Lottery, on_delete=models.CASCADE)
    buyer = models.CharField(max_length=42)  # Ethereum address of buyer
    ticket_number = models.IntegerField()

    def __str__(self):
        return f"Ticket {self.ticket_number} - {self.buyer}"