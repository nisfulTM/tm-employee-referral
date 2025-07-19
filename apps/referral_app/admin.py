# apps/referral_app/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserAdmin(UserAdmin):
    # Add 'type' to the fieldsets
    fieldsets = UserAdmin.fieldsets + (
        ('User Type', {'fields': ('type',)}),
    )

    # Add 'type' to the add form
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('User Type', {'fields': ('type',)}),
    )

    # Display 'type' in the list view
    list_display = UserAdmin.list_display + ('type',)
    list_filter = UserAdmin.list_filter + ('type',)

    # Add search by type
    search_fields = UserAdmin.search_fields + ('type',)

    def get_queryset(self, request):
        """Optimize queryset for better performance"""
        return super().get_queryset(request).select_related()

# Register the custom user admin
admin.site.register(User, CustomUserAdmin)