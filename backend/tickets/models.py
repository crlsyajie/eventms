from django.db import models
import hashlib


from events.models import Event

class Ticket(models.Model):
	event = models.ForeignKey(Event, on_delete=models.CASCADE)
	registration = models.ForeignKey('registrations.Registration', on_delete=models.CASCADE)
	seat = models.CharField(max_length=20, blank=True)
	issued_at = models.DateTimeField(auto_now_add=True)

	@property
	def ticket_number(self):
		# Generate unique hash from event_id + registration_id + ticket_id for fraud prevention
		unique_string = f"EVT{self.event_id}-REG{self.registration_id}-TKT{self.id}"
		hash_suffix = hashlib.sha256(unique_string.encode()).hexdigest()[:8].upper()
		return f"TKT-{self.event_id:04d}-{self.registration_id:04d}-{hash_suffix}"

	def __str__(self):
		return f"Ticket #{self.ticket_number} for {self.event.title}"
