from rest_framework import serializers
from apps.referral_app.models import Referral

class ReferralListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Referral
        fields = "__all__"   
