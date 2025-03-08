from django.contrib import admin
from .models import UserWallet,Lottery,Ticket  # Import the UserWallet model


# Register your models here.
admin.site.register(UserWallet)
admin.site.register(Lottery)  # Register the Lottery model
admin.site.register(Ticket)  # Register the Ticket model