# apps/referral_app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Authentication URLs
    path("login/", views.Login.as_view()),
    path("logout/", views.Logout.as_view()),

    # Referral URLs
    path("save-referral-data/", views.SaveReferralInfo.as_view()),

    # Referral List for HR
    path("referral-list/", views.ReferralList.as_view()),


]