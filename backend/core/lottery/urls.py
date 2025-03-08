from django.contrib import admin
from django.urls import path, include
from .views import ConnectWalletView, VerifySignatureView,CreateLotteryView,ActiveLotteryView,BuyTicketView,CloseLotteryView,WinnerView

urlpatterns = [
    path("auth/connect-wallet/", ConnectWalletView.as_view(), name="connect-wallet"),
    path("auth/verify-signature/", VerifySignatureView.as_view(), name="verify-signature"),
    path("create-lottery/", CreateLotteryView.as_view(), name="create-lottery"),
    path("active-lottery/", ActiveLotteryView.as_view(), name="active-lottery"),
    path("buy-ticket/", BuyTicketView.as_view(), name="buy-ticket"),
    path("close-lottery/", CloseLotteryView.as_view(), name="close-lottery"),
    path("winner/", WinnerView.as_view(), name="winner"),
]