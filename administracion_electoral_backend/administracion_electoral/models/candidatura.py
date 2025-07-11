from django.db import models
from django.core.validators import MinLengthValidator
from .cargo import Cargo

class Candidatura(models.Model):
    nombre_candidato = models.CharField(max_length=200)
    partido_politico = models.CharField(max_length=150)
    sigla = models.CharField(max_length=20, help_text="Sigla del partido político")
    color = models.CharField(
        max_length=7, 
        help_text="Color hexadecimal del partido (ej: #FF0000)",
        validators=[MinLengthValidator(7)]
    )
    cargo = models.ForeignKey(
        Cargo, 
        on_delete=models.CASCADE, 
        related_name='candidaturas'
    )
    
    def __str__(self):
        return f"{self.nombre_candidato} ({self.sigla}) - {self.cargo.nombre}"
    
    class Meta:
        verbose_name = "Candidatura"
        verbose_name_plural = "Candidaturas"
        ordering = ['cargo', 'nombre_candidato']
        unique_together = [['nombre_candidato', 'cargo']] 