from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Person, PersonConnection
from .serializers import PersonSerializer, PersonConnectionSerializer
from django.db.models import Q
from datetime import date 
from django.db.utils import IntegrityError



@api_view(['GET'])
def get_persons(request):
    query = request.query_params.get('search', None)
    if query:
        persons = Person.objects.filter(
            Q(first_name__icontains=query) | Q(last_name__icontains=query)
        )
    else:
        persons = Person.objects.all()
    serializer = PersonSerializer(persons, many=True)
    return Response(serializer.data)



@api_view(['GET'])
def get_person_view(request, pk):
    person = Person.objects.get(id=pk)
    connections = PersonConnection.objects.filter(person=person)
    connection_serializer = PersonConnectionSerializer(connections, many=True)
    person_serializer = PersonSerializer(person, many=False)
    
    data = person_serializer.data
    data['connections'] = connection_serializer.data

    return Response(data)


@api_view(['POST'])
def create_person(request):
    serializer = PersonSerializer(data=request.data)
    if serializer.is_valid():
        personal_number = serializer.validated_data.get('personal_number')
        birth_date = serializer.validated_data.get('personal_birthdate')
        
        if len(personal_number) != 11:
            return JsonResponse({'personal_number': 'Personal number must be exactly 11 characters long.'}, status=status.HTTP_400_BAD_REQUEST)
        
        age = (date.today() - birth_date).days // 365
        if age < 18:
            return JsonResponse({'personal_birthdate': 'You are very young'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return JsonResponse({'personal_number': 'Personal number already exists'}, status=status.HTTP_409_CONFLICT)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['PUT'])
def update_person(request, pk):
    person = get_object_or_404(Person, pk=pk)
    serializer = PersonSerializer(person, data=request.data, partial=True)
    if serializer.is_valid():
        personal_number = serializer.validated_data.get('personal_number')
        birth_date = serializer.validated_data.get('personal_birthdate')
        
        if len(personal_number) != 11:
            return JsonResponse({'personal_number': 'Personal number must be exactly 11 characters long.'}, status=status.HTTP_400_BAD_REQUEST)
        
        age = (date.today() - birth_date).days // 365
        if age < 18:
            return JsonResponse({'personal_birthdate': 'You are very young'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_person(request, pk):
    person = Person.objects.get(id=pk)
    person.delete()
    return Response("Person was deleted")

@api_view(['POST'])
def create_person_connection(request):
    person_id = request.data.get('person')
    connected_person_ids = request.data.get('connected_persons', [])
    connection_type = request.data.get('connection_type')

    if not person_id or not connected_person_ids or not connection_type:
        return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

    connections = []
    for connected_person_id in connected_person_ids:
        connection_data = {
            "person": person_id,
            "connected_person": connected_person_id,
            "connection_type": connection_type,
        }
        serializer = PersonConnectionSerializer(data=connection_data)
        if serializer.is_valid():
            serializer.save()
            connections.append(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response(connections, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
def delete_person_connection(request, pk):
    connection = get_object_or_404(PersonConnection, pk=pk)
    connection.delete()
    return Response({"message": "Connection deleted successfully"}, status=status.HTTP_204_NO_CONTENT)









# @api_view(['GET'])
# def get_person_view(request, pk):
#     person = Person.objects.get(id=pk)
#     serializer = PersonSerializer(person, many=False)
#     return Response(serializer.data)

