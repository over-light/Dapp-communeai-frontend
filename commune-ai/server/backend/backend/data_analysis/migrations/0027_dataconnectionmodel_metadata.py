# Generated by Django 4.2.6 on 2023-11-28 20:16

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("data_analysis", "0026_dataconnectionmodel_connectionusedin"),
    ]

    operations = [
        migrations.AddField(
            model_name="dataconnectionmodel",
            name="metadata",
            field=models.JSONField(null=True),
        ),
    ]
