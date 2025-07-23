from rest_framework import serializers
from apps.referral_app.models import Referral
from django.conf import settings

class ReferralListSerializer(serializers.ModelSerializer):
    resume                  = serializers.SerializerMethodField()
    referred_by_name        = serializers.CharField(source='referred_by.name', read_only=True)
    referred_by_emp_code    = serializers.CharField(source='referred_by.emp_code', read_only=True)

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


class GroupedReferralSerializer(serializers.Serializer):
    new = ReferralListSerializer(many=True)
    active = ReferralListSerializer(many=True) 
    history = ReferralListSerializer(many=True)