from apps.referral_app.models import Department,Role
from apps.referral_app.serializers.department_serializer import DepartmentListSerializer,RoleListSerializer
from helpers.pagination import CustomPageNumberPagination

class DepartmentActions:
    
    @staticmethod
    def department_list(request):
        try:
            department_list = Department.objects.all().order_by("id")
            paginator = CustomPageNumberPagination()
            result_page = paginator.paginate_queryset(department_list, request)
            serializer = DepartmentListSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            raise

    @staticmethod
    def role_list(request):
        try:
            role_list = Role.objects.all().order_by("id")
            paginator = CustomPageNumberPagination()
            result_page = paginator.paginate_queryset(role_list, request)
            serializer = RoleListSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            raise