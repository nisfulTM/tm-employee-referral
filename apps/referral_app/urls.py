# apps/referral_app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Authentication URLs
    path('api/register/', views.register_view, name='register'),
    path('api/login/', views.login_view, name='login'),
    path('api/logout/', views.logout_view, name='logout'),
    
    # Profile URLs
    path('api/profile/', views.profile_view, name='profile'),
    path('api/profile/update/', views.profile_update_view, name='profile-update'),
    path('api/change-password/', views.change_password_view, name='change-password'),
    
    # Dashboard URLs
    path('api/hr-dashboard/', views.hr_dashboard_view, name='hr-dashboard'),
    path('api/employee-dashboard/', views.employee_dashboard_view, name='employee-dashboard'),
    
    # HR-only URLs
    path('api/employees/', views.employee_list_view, name='employee-list'),
    path('api/hr-users/', views.hr_list_view, name='hr-list'),
    
    # Utility URLs
    path('api/user-type/', views.user_type_check_view, name='user-type-check'),
    path('api/user-stats/', views.user_stats_view, name='user-stats'),
]