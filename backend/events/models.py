from django.db import models



class Event(models.Model):
	STATUS_CHOICES = [
		('pending', 'Pending'),
		('approved', 'Approved'),
		('rejected', 'Rejected'),
	]
	title = models.CharField(max_length=200)
	description = models.TextField(blank=True)
	date = models.DateTimeField()
	location = models.CharField(max_length=200)
	is_paid = models.BooleanField(default=False)
	price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
	status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
	submitted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True)

	class Meta:
		db_table = 'events'
		verbose_name = 'Event'
		verbose_name_plural = 'Events'
		ordering = ['-date']

	def __str__(self):
		return self.title
