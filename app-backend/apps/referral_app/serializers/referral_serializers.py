from rest_framework import serializers
from apps.referral_app.models import Referral,ReferralStatusLog
from helpers.base64tofile import base64_to_file
from helpers.helper import get_token_user_or_none

class ReferralSerializer(serializers.ModelSerializer):
    resume        = serializers.CharField(allow_null=True,allow_blank=True, required=False)
    
    class Meta:
        model = Referral
        fields = ['fullname', 'email','phone_number','linkedin_url','department','role','resume']

    def validate(self, attrs):
        return super().validate(attrs)

    def create(self, validated_data):
        request = self.context.get('request')

        resume =base64_to_file(self.context.get('resume_file', None))

        instance = Referral()
        instance.fullname       = validated_data.get('fullname', None)
        instance.email          = validated_data.get('email', None)
        instance.phone_number   = validated_data.get('phone_number', None)
        instance.department     = validated_data.get('department', None)
        instance.role           = validated_data.get('role', None)
        instance.linkedin_url   = validated_data.get('linkedin_url', None)
        instance.referred_by    = get_token_user_or_none(request)
        if resume:
            ext = resume.name.split('.')[-1]
            clean_name = instance.fullname.replace(" ", "_").lower() if instance.fullname else "resume"
            filename = f"{clean_name}_resume.{ext}"
            instance.resume.save(filename, resume, save=False)

        instance.save()

        return instance


class ReferralStatusChangeSerializer(serializers.ModelSerializer):
    id    = serializers.IntegerField(required=True)
    notes = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    
    class Meta:
        model = Referral
        fields = ['id', 'status','notes']

    def validate(self, attrs):
        return super().validate(attrs)
    
    def update(self, instance, validated_data):
        request       = self.context.get('request')
        old_status    = instance.status

        instance.status = validated_data.get('status', instance.status)
        instance.save()

        log_status  = ReferralStatusLog()
        log_status.referral  = instance
        log_status.updated_by  = get_token_user_or_none(request)
        log_status.old_status  = old_status
        log_status.new_status  = instance.status
        log_status.save()

        return instance