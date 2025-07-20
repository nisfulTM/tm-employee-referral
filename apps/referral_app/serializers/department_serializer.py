from rest_framework import serializers
from apps.referral_app.models import Department,Role

class DepartmentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id','name']   


class RoleListSerializer(serializers.ModelSerializer):
    department = serializers.StringRelatedField()
    class Meta:
        model = Role
        fields = ['id','name','department']   