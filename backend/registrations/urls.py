from django.urls import path
from . import views

urlpatterns = [
    path('', views.registration_list),
    path('<int:pk>/', views.registration_detail),
]