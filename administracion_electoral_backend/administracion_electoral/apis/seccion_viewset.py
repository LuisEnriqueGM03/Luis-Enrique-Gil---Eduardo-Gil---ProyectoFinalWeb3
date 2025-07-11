from rest_framework import serializers, viewsets
from administracion_electoral.models import Seccion

class SeccionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Seccion
        fields = ['id', 'nombre', 'polygon']


class SeccionDetailSerializer(serializers.ModelSerializer):
    cargos = serializers.StringRelatedField(many=True, read_only=True)
    elecciones = serializers.StringRelatedField(many=True, read_only=True)
    
    class Meta:
        model = Seccion
        fields = ['id', 'nombre', 'polygon', 'cargos', 'elecciones']


class SeccionViewSet(viewsets.ModelViewSet):
    queryset = Seccion.objects.all()
    serializer_class = SeccionSerializer
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SeccionDetailSerializer
        return SeccionSerializer 