from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from apps.referral_app.models import Referral, UserToken
from apps.referral_app.serializers.user_serializer import (
    UserLoginSerializer, 
    UserSerializer,
)
from apps.referral_app.serializers.referral_serializers import (
    ReferralSerializer,
    ReferralStatusChangeSerializer
)
from drf_yasg.utils import swagger_auto_schema
from helpers.helper import get_object_or_none, get_token_user_or_none
from django.contrib.auth import logout
from apps.referral_app.services.user_services import UserActions
from apps.referral_app.services.hr_services import HRActions
from apps.referral_app.services.department_services import DepartmentActions
from drf_yasg import openapi


class Login(APIView):

    @swagger_auto_schema(tags=["Authentication"],request_body=UserLoginSerializer,operation_id='login',operation_description="This API allows users to log in using their email and password. Upon successful authentication, it returns a bearer token and a refresh token in the response, enabling secure access to protected resources.",)
    def post(self, request):
        try:

            serializer = UserLoginSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(
                    {
                        "errors": serializer.errors,
                        "status": False,
                    },
                 status=status.HTTP_400_BAD_REQUEST
                )
            
            user = serializer.validated_data.get('user',None)
            tokens = UserActions.get_tokens_for_user(user)
        
            dashboard_url = '/hr-dashboard/' if user.type == 'hr' else '/employee-dashboard/'
                
            return Response(
                {
                'user': UserSerializer(user).data,
                'tokens': tokens,
                'dashboard_url': dashboard_url,
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {
                    "message": "An unexpected error occurred. Please try again later.",
                    "status": False,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        

class Logout(APIView):
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(tags=["Authentication"],operation_id='logout',operation_description="This endpoint is used to log out the user",)

    def post(self, request):
        try:
            user_instance = get_token_user_or_none(request)
            if user_instance is  None:
                return Response(
                    {
                        "message": "User Instance is not found",
                        "status": False,
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            

            token_instance = user_instance.user_tokens.last()

            refresh_token = token_instance.refresh_token
            if refresh_token:
                try:
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                except Exception as token_error:
                    print(f"Token blacklist error: {token_error}")

            logout(request)
            token_instance.delete()

            return Response(
                {
                    "message": "Logged out successfully",
                    "status": True,
                },
                status=status.HTTP_200_OK,
                )

        except Exception as e:
            print(str(e))
            return Response(
                {
                    "message": "An unexpected error occurred. Please try again later.",
                    "status": False,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SaveReferralInfo(APIView):
    @swagger_auto_schema(tags=["Referral - Employee"],request_body=ReferralSerializer,operation_id='referral-data',operation_description="This API allows employees to save their referral",)
    def post(self, request):
        try:
            resume_file  = request.data.get('resume', None)
            serializer = ReferralSerializer(data=request.data,context={'request': request,'resume_file':resume_file})
            if not serializer.is_valid():
                return Response(
                    {
                        "errors": serializer.errors,
                        "status": False,
                    },
                 status=status.HTTP_400_BAD_REQUEST
                )
            serializer.save()
                
            return Response(
                {
                'message': 'Successfully saved referral information',
                "status": True,
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {
                    "message": "An unexpected error occurred. Please try again later.",
                    "status": False,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class DepartmentList(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=["Department"],operation_id='department-list',operation_description="This API allows to list all departments",)
    def get(self, request):
        try:
            referral_list = DepartmentActions.department_list(request)
            return Response(
                {
                    "data": referral_list.data,
                    "message": "Data fetch successful",
                    "status": True,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {
                    "message": "An unexpected error occurred. Please try again later.",
                    "status": False,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        

class RoleList(APIView):
    permission_classes = [IsAuthenticated]

    chat_room        = openapi.Parameter('chat_room', openapi.IN_QUERY, type=openapi.TYPE_STRING,description="The Chat Room Name", required=False)

    @swagger_auto_schema(tags=["Department"],operation_id='role-list',operation_description="This API allows to list all roles under a department",)
    def get(self, request):
        try:
            role_list = DepartmentActions.role_list(request)
            return Response(
                {
                    "data": role_list.data,
                    "message": "Data fetch successful",
                    "status": True,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {
                    "message": "An unexpected error occurred. Please try again later.",
                    "status": False,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ReferralList(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=["Referral - HR"],operation_id='referral-list',operation_description="This API allows to list all resumes which after completion of the referral",)
    def get(self, request):
        try:
            referral_list = HRActions.referral_list(request)
            return Response(
                {
                    "data": referral_list,
                    "message": "Data fetch successful",
                    "status": True,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {
                    "message": "An unexpected error occurred. Please try again later.",
                    "status": False,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ReferralStatusChange(APIView):
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(tags=["Referral - HR"],request_body=ReferralStatusChangeSerializer,operation_id='referral-status-change',operation_description="This API allows HR to change the status of the Referral",)
    def post(self, request):
        try:
            referral_instance = get_object_or_none(Referral, id=request.data.get('id', None))
            if not referral_instance:
                return Response(
                    {
                        "message": "Referral instance is not found",
                        "status": False,
                    },
                 status=status.HTTP_404_NOT_FOUND
                )
            
            serializer = ReferralStatusChangeSerializer(referral_instance,data=request.data,context={'request': request})
            if not serializer.is_valid():
                return Response(
                    {
                        "errors": serializer.errors,
                        "status": False,
                    },
                 status=status.HTTP_400_BAD_REQUEST
                )
            serializer.save()
                
            return Response(
                {
                'message': 'Successfully update status of  referral information',
                "status": True,
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(str(e),"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
            return Response(
                {
                    "message": "An unexpected error occurred. Please try again later.",
                    "status": False,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
