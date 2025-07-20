from rest_framework import serializers
from apps.referral_app.models import Referral
from django.conf import settings

class ReferralListSerializer(serializers.ModelSerializer):
    resume = serializers.SerializerMethodField()

    class Meta:
        model = Referral
        fields = "__all__"


    def get_resume(self, obj):
        if obj.resume:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume.url)
            else:
                return f"{settings.MEDIA_URL}{obj.resume.name}"
        return None
