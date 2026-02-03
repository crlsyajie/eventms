#!/usr/bin/env python
"""Update existing users to set is_client=True for non-admin users"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eventms_backend.settings')
django.setup()

from users.models import User

# Update all non-admin users to have is_client=True
updated = User.objects.filter(is_admin=False, is_client=False).update(is_client=True)
print(f"Updated {updated} users to be clients")

# Display all users
users = User.objects.all()
for user in users:
    print(f"User: {user.username} - Admin: {user.is_admin}, Client: {user.is_client}")
