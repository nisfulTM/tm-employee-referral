# apps/referral_app/views.py
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    UserSerializer,
    UserProfileUpdateSerializer,
    PasswordChangeSerializer,
    EmployeeListSerializer
)

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    """User registration endpoint"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        
        # Determine dashboard URL based on user type
        dashboard_url = '/hr-dashboard/' if user.type == 'hr' else '/employee-dashboard/'
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens,
            'dashboard_url': dashboard_url,
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """User login endpoint"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        tokens = get_tokens_for_user(user)
        
        # Redirect based on user type
        dashboard_url = '/hr-dashboard/' if user.type == 'hr' else '/employee-dashboard/'
            
        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens,
            'dashboard_url': dashboard_url,
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """User logout endpoint"""
    try:
        # Blacklist the refresh token
        refresh_token = request.data.get("refresh")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'message': 'Error during logout',
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profile_view(request):
    """Get current user profile"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def profile_update_view(request):
    """Update user profile"""
    serializer = UserProfileUpdateSerializer(
        request.user, 
        data=request.data, 
        partial=request.method == 'PATCH'
    )
    if serializer.is_valid():
        serializer.save()
        return Response({
            'user': UserSerializer(request.user).data,
            'message': 'Profile updated successfully'
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password_view(request):
    """Change user password"""
    serializer = PasswordChangeSerializer(
        data=request.data, 
        context={'request': request}
    )
    if serializer.is_valid():
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        
        # Generate new tokens after password change
        tokens = get_tokens_for_user(request.user)
        
        return Response({
            'tokens': tokens,
            'message': 'Password changed successfully'
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# HR-only views
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def hr_dashboard_view(request):
    """HR dashboard with statistics"""
    if not request.user.is_hr():
        return Response({
            'error': 'Access denied. HR access required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Get statistics
    stats = User.objects.aggregate(
        total_users=Count('id'),
        employee_count=Count('id', filter=Q(type='employee')),
        hr_count=Count('id', filter=Q(type='hr')),
        active_users=Count('id', filter=Q(is_active=True))
    )
    
    return Response({
        'message': 'Welcome to HR Dashboard',
        'user': UserSerializer(request.user).data,
        'stats': stats
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def employee_list_view(request):
    """Get list of all employees (HR only)"""
    if not request.user.is_hr():
        return Response({
            'error': 'Access denied. HR access required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    employees = User.objects.filter(type='employee').order_by('-date_joined')
    serializer = EmployeeListSerializer(employees, many=True)
    return Response({
        'employees': serializer.data,
        'count': employees.count()
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def hr_list_view(request):
    """Get list of all HR users (HR only)"""
    if not request.user.is_hr():
        return Response({
            'error': 'Access denied. HR access required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    hr_users = User.objects.filter(type='hr').order_by('-date_joined')
    serializer = EmployeeListSerializer(hr_users, many=True)
    return Response({
        'hr_users': serializer.data,
        'count': hr_users.count()
    })

# Employee-only views
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def employee_dashboard_view(request):
    """Employee dashboard"""
    if not request.user.is_employee():
        return Response({
            'error': 'Access denied. Employee access required.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    return Response({
        'message': 'Welcome to Employee Dashboard',
        'user': UserSerializer(request.user).data,
    })

# Utility views
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_type_check_view(request):
    """Check current user type"""
    return Response({
        'user_type': request.user.type,
        'is_hr': request.user.is_hr(),
        'is_employee': request.user.is_employee()
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats_view(request):
    """Get user statistics (accessible to all authenticated users)"""
    stats = User.objects.aggregate(
        total_users=Count('id'),
        employee_count=Count('id', filter=Q(type='employee')),
        hr_count=Count('id', filter=Q(type='hr')),
        active_users=Count('id', filter=Q(is_active=True))
    )
    
    return Response(stats)