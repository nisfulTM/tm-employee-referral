from rest_framework import serializers
from apps.referral_app.models import Referral
from helpers.base64tofile import base64_to_file

class ReferralSerializer(serializers.ModelSerializer):
    department    = serializers.CharField(allow_null=True,allow_blank=True, required=False)
    resume        = serializers.CharField(allow_null=True,allow_blank=True, required=False)

    class Meta:
        model = Referral
        fields = ['fullname', 'email','phone_number','linkedin_url','department','role','resume']

    def validate(self, attrs):
        return super().validate(attrs)

    def create(self, validated_data):
        resume =base64_to_file(self.context.get('resume_file', None))
        instance = Referral()
        instance.fullname= validated_data.get('fullname', None)
        instance.email= validated_data.get('email', None)
        instance.phone_number= validated_data.get('phone_number', None)
        instance.linkedin_url= validated_data.get('linkedin_url', None)
        instance.resume.save(resume.name, resume, save=False)
        instance.save()

        return instance
