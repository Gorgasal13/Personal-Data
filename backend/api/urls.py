from django.urls import path
from . import views

urlpatterns = [
    path('api/', views.get_persons, name='person_view'),
    path('api/create_person_connection/', views.create_person_connection, name='create_person_connection'),
    path('api/<int:pk>', views.get_person_view, name='get_person_view'),
    path('api/create/', views.create_person, name='create_person'), 
    path('api/<int:pk>/', views.delete_person, name='delete_person'), 
    path('api/update/<int:pk>/', views.update_person, name='update_person'),
    path('api/delete_person_connection/<int:pk>/', views.delete_person_connection, name='delete_person_connection'),
]
