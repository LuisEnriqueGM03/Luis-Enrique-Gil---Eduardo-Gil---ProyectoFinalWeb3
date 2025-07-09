from django.db import models
from django.core.validators import MinLengthValidator

class Seccion(models.Model):
    """Modelo para representar una sección electoral"""
    nombre = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.nombre
    
    class Meta:
        verbose_name = "Sección"
        verbose_name_plural = "Secciones"
        ordering = ['nombre']

class Cargo(models.Model):
    """Modelo para representar un cargo en disputa"""
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

class Recinto(models.Model):
    """Modelo para representar un recinto electoral"""
    nombre = models.CharField(max_length=200, unique=True)
    ubicacion = models.CharField(max_length=300, help_text="Dirección o ubicación del recinto")
    
    def __str__(self):
        return f"{self.nombre} - {self.ubicacion}"
    
    class Meta:
        verbose_name = "Recinto"
        verbose_name_plural = "Recintos"
        ordering = ['nombre']

class MesaElectoral(models.Model):
    """Modelo para representar una mesa electoral"""
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

class Jurado(models.Model):
    """Modelo para representar un jurado electoral"""
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

class Eleccion(models.Model):
    """Modelo para representar una elección"""
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

class Candidatura(models.Model):
    """Modelo para representar una candidatura"""
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
