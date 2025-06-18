from django.http import HttpResponse
from django.core import serializers
from .models import Item, Recipe

def item_list(request):
    queryset = Item.objects.all()
    data = serializers.serialize('json', queryset, use_natural_foreign_keys=True)
    return HttpResponse(data, content_type='application/json')

def recipe_list(request):
    queryset = Recipe.objects.all()
    data = serializers.serialize('json', queryset, use_natural_foreign_keys=True)
    return HttpResponse(data, content_type='application/json')
