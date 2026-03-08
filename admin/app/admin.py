from django.contrib import admin

# Register your models here.
from .models import Skin

class SkinAdmin(admin.ModelAdmin):
    ordering = ['name']
    search_fields = ['name']

admin.site.register(Skin, SkinAdmin)