from django.db import models
import json

class Seccion(models.Model):

    nombre = models.CharField(max_length=100, unique=True)
    polygon = models.JSONField(
        null=True, 
        blank=True,
        help_text="Coordenadas del polígono de la sección en formato GeoJSON"
    )
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name = "Sección"
        verbose_name_plural = "Secciones"
        ordering = ['nombre'] 