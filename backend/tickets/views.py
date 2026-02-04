
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .models import Ticket
from .serializers import TicketSerializer

@api_view(['GET', 'POST'])
def ticket_list(request):
    if request.method == 'GET':
        tickets = Ticket.objects.all()
        
        # Add search functionality
        search = request.GET.get('search', None)
        if search:
            tickets = tickets.filter(
                Q(event__title__icontains=search) | 
                Q(event__location__icontains=search)
            )
        
        serializer = TicketSerializer(tickets, many=True)
        return Response({'tickets': serializer.data})
    elif request.method == 'POST':
        serializer = TicketSerializer(data=request.data)
        if serializer.is_valid():
            ticket = serializer.save()
            return Response(TicketSerializer(ticket).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
