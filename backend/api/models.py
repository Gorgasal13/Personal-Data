from django.db import models
from datetime import date

class Person(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]
    CITIES_CHOICES = [
        ("Other", "Other"),
        ("Gori", "Gori"),
        ("Tbilisi", "Tbilisi"),
        ("Batumi", "Batumi"),
        ("Zugdidi", "Zugdidi"),
        ("Telavi", "Telavi"),
        ("Poti", "Poti"),
        ("Kobuleti", "Kobuleti"),
    ]

    PHONE_TYPE_CHOICES = [
        ("",""),
        ("Mobile_Phone", "Mobile_Phone"),
        ("Home_Phone", "Home_Phone"),
        ("Office_Phone", "Office_Phone"),
    ]

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=15, default='')
    phone_type = models.CharField(max_length=30,choices=PHONE_TYPE_CHOICES,default='')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='Other')
    photo = models.ImageField(upload_to='images/', default='avatar.svg', blank=True, null=True)
    personal_number = models.CharField(max_length=12, unique=True, default='')
    personal_birthdate = models.DateField(null=True, blank=True)
    city = models.CharField(max_length=30, choices=CITIES_CHOICES, default='Other')

    

class PersonConnection(models.Model):
    CONNECTION_CHOICES = [
        ("Other", "Other"),
        ("Relative", "Relative"),
        ("Colleague", "Colleague"),
    ]
    person = models.ForeignKey(Person, related_name='main_person', on_delete=models.CASCADE)
    connected_person = models.ForeignKey(Person, related_name='connected_person', on_delete=models.CASCADE)
    connection_type = models.CharField(max_length=20, choices=CONNECTION_CHOICES)

