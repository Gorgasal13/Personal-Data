from django.db import models

class Person(models.Model):

    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    CONNECTION_CHOICES = [
        ("Other", "Other"),
        ("Relative","Relative"),
        ("Colleague","Colleague"),
        ("Familiar","Familiar"),
    ]
    PERSONS_CHOICES = [
        ("None", "None"),
        ("Persons", "Persons"),
    ]

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=15, default='')
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='O')
    photo = models.ImageField(upload_to='images/',default='avatar.svg', blank=True, null=True)
    personal_number = models.CharField(max_length=12,unique=True,default='')
    personal_birthdate = models.DateField(null=True, blank=True)
    city = models.CharField(max_length=30, default='')
    connection = models.CharField(max_length=10,choices=CONNECTION_CHOICES,default='Other')
    # persons = models.ForeignKey(to='self',null=True,on_delete=models.CASCADE, default='')
    persons = models.CharField(max_length=10,choices=PERSONS_CHOICES, default='Persons')


     
     
