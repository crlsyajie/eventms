#!/usr/bin/env python
"""Delete specific users"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eventms_backend.settings')
django.setup()

from users.models import User

# Delete users
users_to_delete = ['Carlos', 'user']
for username in users_to_delete:
    try:
        user = User.objects.get(username=username)
        user.delete()
        print(f"Deleted user: {username}")
    except User.DoesNotExist:
        print(f"User not found: {username}")

# Display remaining users
print("\nRemaining users:")
users = User.objects.all()
for user in users:
    print(f"User: {user.username} - Admin: {user.is_admin}, Client: {user.is_client}")
