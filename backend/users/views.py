from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
from .models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer

@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        # Check for user and lockout
        try:
            user_obj = User.objects.get(username=username)
        except User.DoesNotExist:
            user_obj = None

        if user_obj:
            if user_obj.lockout_until and user_obj.lockout_until > timezone.now():
                wait_time = int((user_obj.lockout_until - timezone.now()).total_seconds())
                minutes = wait_time // 60
                seconds = wait_time % 60
                return Response(
                    {'error': f'Account locked. Please try again in {minutes}m {seconds}s.'},
                    status=status.HTTP_403_FORBIDDEN
                )

        user = authenticate(
            username=username,
            password=password
        )
        if user:
            # Login successful, reset counters
            user.failed_login_attempts = 0
            user.lockout_until = None
            user.save()
            return Response({
                'user': UserSerializer(user).data,
                'message': 'Login successful'
            })

        # Login failed
        if user_obj:
            user_obj.failed_login_attempts += 1
            if user_obj.failed_login_attempts >= 3:
                user_obj.lockout_until = timezone.now() + timedelta(minutes=2)
                user_obj.save()
                return Response(
                    {'error': 'Account locked due to too many failed attempts. Please wait 2 minutes.'},
                    status=status.HTTP_403_FORBIDDEN
                )
            user_obj.save()

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def user_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response({'users': serializer.data})

@api_view(['GET', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def profile_view(request):
    # For now, use the first user as we don't have proper token auth
    # In production, this would be request.user
    users = User.objects.all()
    if not users.exists():
        return Response({'error': 'No users found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Get user from username in request if updating, otherwise get first user
    if request.method == 'PUT':
        current_username = request.data.get('current_username')
        if current_username:
            try:
                user = User.objects.get(username=current_username)
            except User.DoesNotExist:
                user = users.first()
        else:
            user = users.first()
    else:
        user = users.first()  # For GET request
    
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            # Check if username is being changed and if it's already taken
            if 'username' in serializer.validated_data:
                new_username = serializer.validated_data['username']
                if new_username != user.username and User.objects.filter(username=new_username).exists():
                    return Response({'username': ['This username is already taken.']}, 
                                  status=status.HTTP_400_BAD_REQUEST)
            
            # Check if email is being changed and if it's already taken
            if 'email' in serializer.validated_data:
                new_email = serializer.validated_data['email']
                if new_email != user.email and User.objects.filter(email=new_email).exists():
                    return Response({'email': ['This email is already taken.']}, 
                                  status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_user_by_id(request, user_id):
    """Update user profile by user ID - replaces old username with new one"""
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    new_username = request.data.get('username')
    new_email = request.data.get('email')
    
    # Check if new username is taken by another user
    if new_username and new_username != user.username:
        if User.objects.filter(username=new_username).exclude(id=user_id).exists():
            return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if new email is taken by another user
    if new_email and new_email != user.email:
        if User.objects.filter(email=new_email).exclude(id=user_id).exists():
            return Response({'error': 'Email already taken'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Update user fields (this replaces the old values)
    if new_username:
        user.username = new_username
    if new_email:
        user.email = new_email
    
    user.save()
    
    return Response(UserSerializer(user).data)

@api_view(['PUT'])
def update_profile(request):
    # Get user from request data (simplified - in production use proper authentication)
    username = request.data.get('username')
    email = request.data.get('email')
    
    # Find user by their current username stored in localStorage
    # This is a simplified approach - in production, use proper token authentication
    try:
        # Try to find by the new username first, if it's different from current
        stored_user = None
        for user in User.objects.all():
            if user.username == username or user.email == email:
                stored_user = user
                break
        
        if not stored_user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if username is taken by another user
        if username != stored_user.username and User.objects.filter(username=username).exists():
            return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if email is taken by another user
        if email != stored_user.email and User.objects.filter(email=email).exists():
            return Response({'error': 'Email already taken'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update user
        stored_user.username = username
        stored_user.email = email
        stored_user.save()
        
        return Response(UserSerializer(stored_user).data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
