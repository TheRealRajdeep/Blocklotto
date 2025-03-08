from django.contrib import admin
from django.urls import path, include
from .views import ConnectWalletView, VerifySignatureView

urlpatterns = [
     path("auth/connect-wallet/", ConnectWalletView.as_view(), name="connect-wallet"),
    path("auth/verify-signature/", VerifySignatureView.as_view(), name="verify-signature"),
]