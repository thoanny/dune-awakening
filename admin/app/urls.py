from django.urls import path
from app.views import skin_list

urlpatterns = [
    path('skins/', skin_list, name='skin_list'),
]