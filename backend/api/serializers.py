from rest_framework.serializers import ModelSerializer, ValidationError
from .models import Person
from datetime import date

class PersonSerializer(ModelSerializer):
    class Meta:
        model = Person
        fields = "__all__"

    def validate_personal_birthdate(self, value):
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < 18:
            raise ValidationError("You must be at least 18 years old.")
        return value







         