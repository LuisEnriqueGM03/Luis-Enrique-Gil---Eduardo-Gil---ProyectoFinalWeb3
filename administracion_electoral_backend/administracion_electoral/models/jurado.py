from django.db import models
from django.core.validators import MinLengthValidator
from .mesa_electoral import MesaElectoral

class Jurado(models.Model):
    nombre_completo = models.CharField(max_length=200)
    ci = models.CharField(
        max_length=20, 
        unique=True,
        validators=[MinLengthValidator(6)],
        help_text="Cédula de identidad del jurado"
    )
    mesa = models.ForeignKey(
        MesaElectoral, 
        on_delete=models.CASCADE, 
        related_name='jurados'
    )
    
    def __str__(self):
        return f"{self.nombre_completo} (CI: {self.ci}) - {self.mesa}"
    
    class Meta:
        verbose_name = "Jurado"
        verbose_name_plural = "Jurados"
        ordering = ['nombre_completo'] 