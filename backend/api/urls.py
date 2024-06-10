from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    path('api/', views.get_persons, name='person_view'), 
    path('api/<int:pk>', views.get_person_view, name='get_person_view'),
    path('api/create/', views.create_person, name='create_person'), 
    path('api/<int:pk>/', views.delete_person, name='delete_person'), 
    path('api/update/<int:pk>/', views.update_person, name='update_person'),
]



# urlpatterns = [
#     path('api/', views.get_persons, name='person_view'), 
#     path('api/<int:pk>', views.get_person_view, name='get_person_view'),
#     path('api/create/', views.create_person, name='create_person'), 
#     path('api/<int:pk>/', views.delete_person, name='delete_person'), 
#     path('api/update/<int:pk>/', views.update_person, name='update_person'),

# ]
# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)




