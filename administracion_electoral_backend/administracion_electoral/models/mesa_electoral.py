from django.db import models
from .recinto import Recinto

class MesaElectoral(models.Model):
    numero = models.IntegerField()
    recinto = models.ForeignKey(
        Recinto, 
        on_delete=models.CASCADE, 
        related_name='mesas'
    )
    
    def __str__(self):
        return f"Mesa {self.numero} - {self.recinto.nombre}"
    
    class Meta:
        verbose_name = "Mesa Electoral"
        verbose_name_plural = "Mesas Electorales"
        ordering = ['recinto', 'numero']
        unique_together = [['numero', 'recinto']] 