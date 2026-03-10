from django.http import HttpResponse
from django.core import serializers
from .models import Skin

def skin_list(request):
    queryset = Skin.objects.all()
    data = serializers.serialize('json', queryset, use_natural_foreign_keys=True)
    return HttpResponse(data, content_type='application/json')
