# Generated by Django 5.0.6 on 2024-06-29 03:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_person_gender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='personconnection',
            name='connected_person',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='connected_person', to='api.person'),
        ),
        migrations.AlterField(
            model_name='personconnection',
            name='connection_type',
            field=models.CharField(choices=[('Other', 'Other'), ('Relative', 'Relative'), ('Colleague', 'Colleague')], max_length=20),
        ),
        migrations.AlterField(
            model_name='personconnection',
            name='person',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='main_person', to='api.person'),
        ),
    ]