# Generated by Django 3.0.3 on 2020-04-09 04:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0020_auto_20200409_0342'),
    ]

    operations = [
        migrations.AddField(
            model_name='holding',
            name='average_cost',
            field=models.DecimalField(decimal_places=2, default=69.0, max_digits=10),
        ),
    ]