from django.db import models
from .seccion import Seccion

class Cargo(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    secciones_afectadas = models.ManyToManyField(
        Seccion, 
        related_name='cargos',
        help_text="Secciones donde este cargo está en disputa"
    )
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name = "Cargo"
        verbose_name_plural = "Cargos"
        ordering = ['nombre'] 