from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    is_admin = models.BooleanField(default=False)
    is_client = models.BooleanField(default=False)
    failed_login_attempts = models.IntegerField(default=0)
    lockout_until = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username
