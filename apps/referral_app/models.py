# apps/referral_app/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = [
        ('employee', 'Employee'),
        ('hr', 'HR'),
    ]

    type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='employee'
    )

    def __str__(self):
        return f"{self.username} ({self.get_type_display()})"

    def is_hr(self):
        return self.type == 'hr'

    def is_employee(self):
        return self.type == 'employee'

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

class Department(models.Model):
    name = models.CharField(_("Department Name"), max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Department")
        verbose_name_plural = _("Departments")


class Role(models.Model):
    name          = models.CharField(_("Role Name"), max_length=255)
    department    = models.ForeignKey(Department,on_delete=models.CASCADE,related_name="roles",verbose_name=_("Department"))

    def __str__(self):
        return f"{self.name} ({self.department.name})"

    class Meta:
        verbose_name = _("Role")
        verbose_name_plural = _("Roles")

class Referral(models.Model):
    referred_by   = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.SET_NULL,null=True,related_name='referrals_made',verbose_name=_("Referred By"))
    fullname      = models.CharField(_("Full Name"), max_length=20, blank=True, null=True)
    email         = models.EmailField(_("Email"), blank=True, null=True)
    phone_number  = models.CharField(_("Phone Number"), max_length=20, blank=True, null=True)
    linkedin_url  = models.URLField(_("LinkedIn URL"), blank=True, null=True)
    role          = models.ForeignKey('Role', on_delete   = models.SET_NULL, null=True, verbose_name=_("Role"))
    resume_path   = models.FileField(_("Resume"), upload_to='resumes/', blank=True, null=True)
    status        = models.CharField(_("Status"), max_length=50)
    created_at    = models.DateTimeField(_("Created At"), auto_now_add=True)

    def __str__(self):
        return self.fullname

    class Meta:
        verbose_name = _("Referral")
        verbose_name_plural = _("Referrals")


class ReferralStatusLog(models.Model):
    referral    = models.ForeignKey(Referral, on_delete=models.CASCADE, related_name='status_logs', verbose_name=_("Referral"))
    updated_by  = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, verbose_name=_("Updated By"))
    old_status  = models.CharField(_("Old Status"), max_length=50)
    new_status  = models.CharField(_("New Status"), max_length=50)
    updated_at  = models.DateTimeField(_("Updated At"), auto_now_add=True)

    def __str__(self):
        return f"{self.referral} | {self.old_status} → {self.new_status}"

    class Meta:
        verbose_name = _("Referral Status Log")
        verbose_name_plural = _("Referral Status Logs")

