# Generated by Django 5.0.6 on 2024-07-02 13:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_personconnection_connected_person_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='phone_type',
            field=models.CharField(choices=[('', ''), ('Mobile_Phone', 'Mobile_Phone'), ('Home_Phone', 'Home_Phone'), ('Office_Phone', 'Office_Phone')], default='', max_length=30),
        ),
    ]
