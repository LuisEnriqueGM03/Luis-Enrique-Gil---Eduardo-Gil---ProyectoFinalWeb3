from rest_framework import serializers, viewsets
from django.db import models
from administracion_electoral.models import Cargo, Seccion
from .seccion_viewset import SeccionSerializer


class CargoSerializer(serializers.ModelSerializer):
    secciones_afectadas = SeccionSerializer(many=True, read_only=True)
    secciones_afectadas_ids = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Seccion.objects.all(),
        source='secciones_afectadas',
        write_only=True
    )
    
    class Meta:
        model = Cargo
        fields = ['id', 'nombre', 'secciones_afectadas', 'secciones_afectadas_ids']


class CargoViewSet(viewsets.ModelViewSet):
    queryset = Cargo.objects.prefetch_related('secciones_afectadas').all() 
    serializer_class = CargoSerializer 