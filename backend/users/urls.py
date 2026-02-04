from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('profile/', views.profile_view),
    path('<int:user_id>/update/', views.update_user_by_id),
    path('', views.user_list),
]
