from rest_framework import serializers, viewsets
from administracion_electoral.models import Jurado, MesaElectoral
from .mesa_viewset import MesaElectoralSerializer

class JuradoSerializer(serializers.ModelSerializer):
    mesa = MesaElectoralSerializer(read_only=True)
    mesa_id = serializers.PrimaryKeyRelatedField(
        queryset=MesaElectoral.objects.all(), 
        source='mesa',
        write_only=True
    )
    
    class Meta:
        model = Jurado
        fields = ['id', 'nombre_completo', 'ci', 'mesa', 'mesa_id']


class JuradoViewSet(viewsets.ModelViewSet):
    queryset = Jurado.objects.select_related('mesa__recinto').all()
    serializer_class = JuradoSerializer 