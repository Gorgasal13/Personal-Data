from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import IntegrityError
from .models import Person
from rest_framework import status
from django.http import JsonResponse
from .serializers import PersonSerializer
from django.shortcuts import get_object_or_404
from django.db.models import Q




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
def get_person_view(request,pk):
    person = Person.objects.get(id=pk)
    serializer = PersonSerializer(person, many=False)
    return Response(serializer.data)
    


@api_view(['POST'])
def create_person(request):
    serializer = PersonSerializer(data=request.data)
    if serializer.is_valid():
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
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['DELETE'])
def delete_person(request,pk):
    person = Person.objects.get(id=pk)
    person.delete()
    return Response("Note was Deleted")

    




