
from rest_framework.decorators import api_view
from rest_framework.response import Response


from rest_framework import status
from .models import Registration
from .serializers import RegistrationSerializer

@api_view(['GET', 'POST'])
def registration_list(request):
	if request.method == 'GET':
		regs = Registration.objects.all()
		serializer = RegistrationSerializer(regs, many=True)
		return Response({'registrations': serializer.data})
	elif request.method == 'POST':
		# Check for duplicate registration
		event_id = request.data.get('event')
		user_name = request.data.get('user_name')
		existing = Registration.objects.filter(event_id=event_id, user_name=user_name).first()
		if existing:
			return Response({'error': 'You are already registered for this event'}, status=status.HTTP_400_BAD_REQUEST)
		
		serializer = RegistrationSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def registration_detail(request, pk):
	try:
		registration = Registration.objects.get(pk=pk)
	except Registration.DoesNotExist:
		return Response({'error': 'Registration not found'}, status=status.HTTP_404_NOT_FOUND)
	
	if request.method == 'GET':
		serializer = RegistrationSerializer(registration)
		return Response(serializer.data)
	elif request.method == 'PUT':
		serializer = RegistrationSerializer(registration, data=request.data, partial=True)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	elif request.method == 'DELETE':
		registration.delete()
		return Response({'message': 'Registration cancelled'}, status=status.HTTP_204_NO_CONTENT)
