
from rest_framework.decorators import api_view
from rest_framework.response import Response


from rest_framework import status
from .models import Event
from .serializers import EventSerializer


from users.models import User
from rest_framework.permissions import IsAuthenticated

@api_view(['GET', 'POST'])
def event_list(request):
	if request.method == 'GET':
		# Get user_id from query params for client filtering
		user_id = request.GET.get('user_id')
		admin_flag = request.GET.get('admin')
		
		# If user_id provided, return all events for that user
		if user_id:
			events = Event.objects.filter(submitted_by=user_id)
		# If admin flag is set, return all events (for admin view)
		elif admin_flag:
			events = Event.objects.all()
		# Admins see all events
		elif request.user.is_authenticated and request.user.is_admin:
			events = Event.objects.all()
		# Clients see approved events + their own submitted events
		elif request.user.is_authenticated and request.user.is_client:
			from django.db.models import Q
			events = Event.objects.filter(
				Q(status='approved') | Q(submitted_by=request.user.id)
			)
		# Non-authenticated users see only approved events
		else:
			events = Event.objects.filter(status='approved')
		serializer = EventSerializer(events, many=True)
		return Response({'events': serializer.data})
	elif request.method == 'POST':
		# Check if user is authenticated and is a client
		# For development: if request includes submitted_by, use that
		data = request.data.copy()
		
		# Handle submitted_by field and determine user
		user = None
		if 'submitted_by' in data and data['submitted_by']:
			try:
				user = User.objects.get(pk=data['submitted_by'])
			except User.DoesNotExist:
				pass
		elif request.user.is_authenticated:
			user = request.user
			data['submitted_by'] = request.user.id
		else:
			return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
		
		# Auto-approve if admin creates the event, otherwise pending
		if user and getattr(user, 'is_admin', False):
			data['status'] = 'approved'
		else:
			data['status'] = 'pending'
		
		serializer = EventSerializer(data=data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Admin endpoint to approve/reject events
@api_view(['POST'])
def approve_event(request, pk):
	# Accept user_id from request body for development (no session auth)
	user_id = request.data.get('user_id')
	if user_id:
		try:
			user = User.objects.get(pk=user_id)
			if not user.is_admin:
				return Response({'error': 'Only admins can approve events.'}, status=status.HTTP_403_FORBIDDEN)
		except User.DoesNotExist:
			return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
	elif request.user.is_authenticated and getattr(request.user, 'is_admin', False):
		pass  # Authenticated admin user
	else:
		return Response({'error': 'Only admins can approve events.'}, status=status.HTTP_403_FORBIDDEN)
	
	try:
		event = Event.objects.get(pk=pk)
	except Event.DoesNotExist:
		return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
	action = request.data.get('action')
	if action == 'approve':
		event.status = 'approved'
	elif action == 'reject':
		event.status = 'rejected'
	else:
		return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
	event.save()
	return Response({'message': f'Event {action}d successfully.'})

# Client endpoint to get their own submissions
@api_view(['GET'])
def my_submissions(request):
	# Accept user_id from query params for development
	user_id = request.GET.get('user_id')
	if not user_id:
		if request.user.is_authenticated:
			user_id = request.user.id
		else:
			return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
	events = Event.objects.filter(submitted_by=user_id)
	serializer = EventSerializer(events, many=True)
	return Response({'events': serializer.data})

@api_view(['GET', 'PUT', 'DELETE'])
def event_detail(request, pk):
	try:
		event = Event.objects.get(pk=pk)
	except Event.DoesNotExist:
		return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
	
	if request.method == 'GET':
		serializer = EventSerializer(event)
		return Response(serializer.data)
	elif request.method == 'PUT':
		serializer = EventSerializer(event, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	elif request.method == 'DELETE':
		event.delete()
		return Response({'message': 'Event deleted'}, status=status.HTTP_204_NO_CONTENT)
