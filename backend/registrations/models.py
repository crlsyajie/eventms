from django.db import models


from events.models import Event

class Registration(models.Model):
	event = models.ForeignKey(Event, on_delete=models.CASCADE)
	user = models.ForeignKey('users.User', on_delete=models.CASCADE, null=True, blank=True)
	user_name = models.CharField(max_length=100)
	status = models.CharField(max_length=20, default='pending')
	registered_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = 'registrations'
		verbose_name = 'Registration'
		verbose_name_plural = 'Registrations'
		ordering = ['-registered_at']

	def __str__(self):
		return f"{self.user_name} - {self.event.title}"
