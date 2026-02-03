import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eventms_backend.settings')
django.setup()

from users.models import User

if not User.objects.filter(username='admin').exists():
    User.objects.create_user(username='admin', email='admin@example.com', password='admin123', is_admin=True)
    print('Admin user created!')
else:
    print('Admin user already exists')

if not User.objects.filter(username='user').exists():
    User.objects.create_user(username='user', email='user@example.com', password='user123', is_admin=False)
    print('Regular user created!')
else:
    print('Regular user already exists')

print('\n--- Default Credentials ---')
print('Admin:  username=admin, password=admin123')
print('User:   username=user, password=user123')
