# apps/referral_app/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

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