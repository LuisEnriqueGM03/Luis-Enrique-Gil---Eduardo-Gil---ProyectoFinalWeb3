from django.db import models
from .seccion import Seccion

class Eleccion(models.Model):
    TIPOS_ELECCION = [
        ('PRESIDENCIAL', 'Presidencial'),
        ('DEPARTAMENTAL', 'Departamental'),
        ('MUNICIPAL', 'Municipal'),
        ('JUDICIAL', 'Judicial'),
        ('LEGISLATIVA', 'Legislativa'),
    ]
    
    tipo = models.CharField(max_length=20, choices=TIPOS_ELECCION)
    fecha = models.DateField()
    seccion = models.ForeignKey(
        Seccion, 
        on_delete=models.CASCADE, 
        related_name='elecciones'
    )
    
    def __str__(self):
        return f"Elección {self.tipo} - {self.fecha} ({self.seccion.nombre})"
    
    class Meta:
        verbose_name = "Elección"
        verbose_name_plural = "Elecciones"
        ordering = ['-fecha', 'tipo'] 