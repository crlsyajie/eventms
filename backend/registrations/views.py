from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Registration
from .serializers import RegistrationSerializer
from tickets.models import Ticket

class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer

    def create(self, request, *args, **kwargs):
        """
        Ensures a user cannot register for the same event twice.
        """
        event_id = request.data.get('event')
        user_name = request.data.get('user_name')

        # Duplicate check: matches user_name field in your Registration model
        existing = Registration.objects.filter(
            event_id=event_id, 
            user_name=user_name
        ).first()
        
        if existing:
            return Response(
                {'error': 'You are already registered for this event'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        """
        This hook triggers the Ticket creation automatically.
        """
        # 1. Save the registration and set status to 'confirmed'
        registration = serializer.save(status='confirmed')

        # 2. Create the ticket linked to this specific registration
        # Since 'user' and 'user_name' aren't in your Ticket model, 
        # we only pass what the model expects.
        Ticket.objects.create(
            event=registration.event,
            registration=registration
        )

    def list(self, request, *args, **kwargs):
        """
        Keeps the response format consistent for your React frontend.
        """
        response = super().list(request, *args, **kwargs)
        return Response({'registrations': response.data})

    def destroy(self, request, *args, **kwargs):
        """
        Handles registration cancellation.
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': 'Registration cancelled'}, status=status.HTTP_204_NO_CONTENT)