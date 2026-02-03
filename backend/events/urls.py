from django.urls import path
from . import views

urlpatterns = [
    path('', views.event_list),
    path('my-submissions/', views.my_submissions),
    path('<int:pk>/', views.event_detail),
    path('<int:pk>/approve/', views.approve_event),
]