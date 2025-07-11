from django.db import models
import uuid

class Votante(models.Model):
    codigo_unico = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    ci = models.CharField(max_length=20, unique=True)
    nombre_completo = models.CharField(max_length=200)
    direccion = models.TextField()
    foto_carnet_anverso = models.ImageField(upload_to='carnet_anverso/')
    foto_carnet_reverso = models.ImageField(upload_to='carnet_reverso/')
    foto_votante = models.ImageField(upload_to='votantes/')
    recinto_id_externo = models.IntegerField()
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.nombre_completo} - {self.ci}"
    
    class Meta:
        verbose_name = "Votante"
        verbose_name_plural = "Votantes" 