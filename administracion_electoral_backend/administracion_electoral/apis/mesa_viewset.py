from rest_framework import serializers, viewsets
from administracion_electoral.models import MesaElectoral, Recinto
from .recinto_viewset import RecintoSerializer

class MesaElectoralSerializer(serializers.ModelSerializer):
    recinto = RecintoSerializer(read_only=True)
    recinto_id = serializers.PrimaryKeyRelatedField(
        queryset=Recinto.objects.all(), 
        source='recinto',
        write_only=True
    )
    
    class Meta:
        model = MesaElectoral
        fields = ['id', 'numero', 'recinto', 'recinto_id']


class MesaElectoralDetailSerializer(serializers.ModelSerializer):
    recinto = RecintoSerializer(read_only=True)
    jurados = serializers.StringRelatedField(many=True, read_only=True)
    total_jurados = serializers.SerializerMethodField()
    
    class Meta:
        model = MesaElectoral
        fields = ['id', 'numero', 'recinto', 'jurados', 'total_jurados']
    
    def get_total_jurados(self, obj):
        return obj.jurados.count()


class MesaElectoralViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar Mesas Electorales"""
    queryset = MesaElectoral.objects.select_related('recinto').all()
    serializer_class = MesaElectoralSerializer
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return MesaElectoralDetailSerializer
        return MesaElectoralSerializer 