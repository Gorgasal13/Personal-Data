from rest_framework.serializers import ModelSerializer
from .models import Person, PersonConnection

class PersonSerializer(ModelSerializer):
    class Meta:
        model = Person
        fields = "__all__"

class PersonConnectionSerializer(ModelSerializer):
    class Meta:
        model = PersonConnection
        fields = "__all__"    