# Generated by Django 5.2.3 on 2025-06-18 11:53

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_alter_item_category_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='recipe',
            options={'verbose_name': 'recette', 'verbose_name_plural': 'recettes'},
        ),
        migrations.AlterField(
            model_name='recipe',
            name='workshop',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='workshop', to='app.item'),
        ),
    ]
