from rest_framework import serializers
from .models import Ticket
from events.serializers import EventSerializer

class TicketSerializer(serializers.ModelSerializer):
    ticket_number = serializers.CharField(read_only=True)
    event_details = EventSerializer(source='event', read_only=True)
    location = serializers.CharField(source='event.location', read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['id', 'ticket_number', 'event', 'event_details', 'registration', 'seat', 'location', 'issued_at']
