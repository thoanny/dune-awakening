from django.urls import path
from app.views import item_list, recipe_list, skin_list

urlpatterns = [
    path('items/', item_list, name='item_list'),
    path('recipes/', recipe_list, name='recipe_list'),
    path('skins/', skin_list, name='skin_list'),
]