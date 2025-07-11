from django.db import models

class Recinto(models.Model):
    nombre = models.CharField(max_length=200, unique=True)
    direccion = models.CharField(max_length=300, help_text="Dirección del recinto")
    capacidad = models.IntegerField(default=100, help_text="Capacidad máxima del recinto")
    horario_apertura = models.TimeField(
        null=True, 
        blank=True,
        help_text="Hora de apertura del recinto (formato: HH:MM)"
    )
    horario_cierre = models.TimeField(
        null=True, 
        blank=True,
        help_text="Hora de cierre del recinto (formato: HH:MM)"
    )
    latitud = models.DecimalField(
        max_digits=20, 
        decimal_places=15, 
        null=True, 
        blank=True,
        help_text="Latitud del recinto"
    )
    longitud = models.DecimalField(
        max_digits=20, 
        decimal_places=15, 
        null=True, 
        blank=True,
        help_text="Longitud del recinto"
    )
    
    def __str__(self):
        return f"{self.nombre} - {self.direccion}"
    
    class Meta:
        verbose_name = "Recinto"
        verbose_name_plural = "Recintos"
        ordering = ['nombre'] 