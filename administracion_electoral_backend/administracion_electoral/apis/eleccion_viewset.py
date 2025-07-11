from rest_framework import serializers, viewsets
from administracion_electoral.models import Eleccion, Seccion
from .seccion_viewset import SeccionSerializer

class EleccionSerializer(serializers.ModelSerializer):
    seccion = SeccionSerializer(read_only=True)
    seccion_id = serializers.PrimaryKeyRelatedField(
        queryset=Seccion.objects.all(), 
        source='seccion',
        write_only=True
    )
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    
    class Meta:
        model = Eleccion
        fields = ['id', 'tipo', 'tipo_display', 'fecha', 'seccion', 'seccion_id']


class EleccionViewSet(viewsets.ModelViewSet):
    queryset = Eleccion.objects.select_related('seccion').all()
    serializer_class = EleccionSerializer 