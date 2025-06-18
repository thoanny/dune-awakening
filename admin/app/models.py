from django.db import models


class Item_Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "catégorie d'objets"
        verbose_name_plural = "catégories d'objets"
        ordering = ["name"]

    def natural_key(self):
        return {
            "id": self.id, 
            "name": self.name
        }


class Item_SubCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "sous-catégorie d'objets"
        verbose_name_plural = "sous-catégories d'objets"
        ordering = ["name"]
    
    def natural_key(self):
        return {
            "id": self.id, 
            "name": self.name
        }


class Item_Type(models.Model):
    name = models.CharField(max_length=100)
    parent =  models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        if(self.parent):
            return (f"{self.name} ({self.parent.name})")
        else:
            return (f"{self.name}")
    
    class Meta:
        verbose_name = "type d'objets"
        verbose_name_plural = "types d'objets"
        ordering = ['name']

    def natural_key(self):
        if(self.parent):
            return {
                "id": self.id, 
                "name": self.name, 
                "parent_id": self.parent.id, 
                "parent_name": self.parent.name
            }
        else:
            return {
                "id": self.id, 
                "name": self.name, 
                "parent_id": None, 
                "parent_name": None
            }


class Item_Source(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "source d'objets"
        verbose_name_plural = "sources d'objets"
        ordering = ['name']

    def natural_key(self):
        return {
            "id": self.id, 
            "name": self.name
        }


class Item_Stat(models.Model):
    name = models.CharField(max_length=255)
    value = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return(f"{self.name} ({self.value})")
    
    class Meta:
        verbose_name = "stat d'objets"
        verbose_name_plural = "stats d'objets"
        ordering = ['name', 'value']

    def natural_key(self):
        return {
            "id": self.id, 
            "name": self.name, 
            "value": self.value
        }


class Item(models.Model):
    QUALITY = {
        'GRAY': "Gris",
        'BLUE': "Bleu",
        'GREEN': "Vert",
        'ORANGE': "Orange",
        'PURPLE': "Violet",
    }
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Item_Category, on_delete=models.SET_NULL, null=True, blank=True)
    subcategory = models.ForeignKey(Item_SubCategory, on_delete=models.SET_NULL, null=True, blank=True)
    type = models.ForeignKey(Item_Type, on_delete=models.SET_NULL, null=True, blank=True)
    details = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    icon = models.CharField(max_length=255, null=True, blank=True)
    volume = models.IntegerField(null=True, blank=True)
    stack = models.IntegerField(null=True, blank=True)
    level = models.IntegerField(null=True, blank=True)
    quality = models.CharField(max_length=10, choices=QUALITY, null=True, blank=True)
    sources = models.ManyToManyField(Item_Source, blank=True)
    stats = models.ManyToManyField(Item_Stat, blank=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "objet"
        verbose_name_plural = "objets"

    def natural_key(self):
        return {
            "id": self.id, 
            "name": self.name, 
            "details": self.details, 
            "icon": self.icon, 
            "level": self.level, 
            "quality": self.quality
        }


class Recipe_Ingredient(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return (f"{self.quantity} × {self.item.name}")

    class Meta:
        verbose_name = "ingrédient"
        verbose_name_plural = "ingrédients"

    def natural_key(self):
        return {
            "id": self.id, 
            "item": {
                "id": self.item.id, 
                "name": self.item.name, 
                "icon": self.item.icon, 
                "level": self.item.level, 
                "quality": self.item.quality, 
            },
            "quantity": self.quantity
        }


class Recipe(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    workshop = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='workshop', null=True, blank=True)
    ingredients = models.ManyToManyField(Recipe_Ingredient, blank=True)

    def __str__(self):
        return (f"{self.quantity} × {self.item.name}")
    
    class Meta:
        verbose_name = "recette"
        verbose_name_plural = "recettes"