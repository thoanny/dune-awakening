from django.db import models

class Skin(models.Model):
    name = models.CharField(max_length=100)
    color_top = models.CharField(max_length=7)
    color_right = models.CharField(max_length=7)
    color_bottom = models.CharField(max_length=7)
    color_left = models.CharField(max_length=7)

    def __str__(self):
        return self.name