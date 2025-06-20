from django.contrib import admin

# Register your models here.
from .models import Item, Item_Category, Item_SubCategory, Item_Type, Item_Source, Item_Stat
from .models import Recipe, Recipe_Ingredient

class ItemAdmin(admin.ModelAdmin):
    filter_horizontal = ('sources', 'stats',)
    list_display = ('name', 'category', 'subcategory', 'type',)
    search_fields = ['name']
    ordering = ('name',)

class ItemTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent',)

class RecipeAdmin(admin.ModelAdmin):
    filter_horizontal = ('ingredients',)
    list_display = ('__str__', 'workshop',)
    ordering = ('item__name', 'quantity',)
    search_fields = ['item__name']

class ItemSourceAdmin(admin.ModelAdmin):
    ordering = ('name',)

class ItemStatAdmin(admin.ModelAdmin):
    ordering = ('name', 'value',)

admin.site.register(Item, ItemAdmin)
admin.site.register(Item_Category)
admin.site.register(Item_SubCategory)
admin.site.register(Item_Type, ItemTypeAdmin)
admin.site.register(Item_Source, ItemSourceAdmin)
admin.site.register(Item_Stat, ItemStatAdmin)
admin.site.register(Recipe, RecipeAdmin)
admin.site.register(Recipe_Ingredient)