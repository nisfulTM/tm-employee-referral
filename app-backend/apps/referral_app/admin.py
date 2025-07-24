# -*- coding: utf-8 -*-
from django.contrib import admin

from .models import CustomUser, UserToken, Department, Role, Referral, ReferralStatusLog


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'password',
        'last_login',
        'is_superuser',
        'first_name',
        'last_name',
        'is_staff',
        'is_active',
        'date_joined',
        'email',
        'username',
        'type',
    )
    list_filter = (
        'last_login',
        'is_superuser',
        'is_staff',
        'is_active',
        'date_joined',
    )
    raw_id_fields = ('groups', 'user_permissions')


@admin.register(UserToken)
class UserTokenAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'refresh_token',
        'access_token',
        'created_at',
        'is_active',
    )
    list_filter = ('user', 'created_at', 'is_active')
    date_hierarchy = 'created_at'


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'department')
    list_filter = ('department',)
    search_fields = ('name',)


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'referred_by',
        'fullname',
        'email',
        'phone_number',
        'linkedin_url',
        'department',
        'comments',
        'role',
        'resume',
        'status',
        'created_at',
    )
    list_filter = ('referred_by', 'role', 'created_at')
    date_hierarchy = 'created_at'


@admin.register(ReferralStatusLog)
class ReferralStatusLogAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'referral',
        'updated_by',
        'old_status',
        'new_status',
        'updated_at',
    )
    list_filter = ('referral', 'updated_by', 'updated_at')
    date_hierarchy = 'updated_at'
