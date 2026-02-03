from rest_framework import serializers
from .models import Ticket

class TicketSerializer(serializers.ModelSerializer):
    ticket_number = serializers.CharField(read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['id', 'ticket_number', 'event', 'registration', 'seat', 'issued_at']
