from rest_framework import serializers, viewsets
from administracion_electoral.models import Candidatura, Cargo
from .cargo_viewset import CargoSerializer

class CandidaturaSerializer(serializers.ModelSerializer):
    
    cargo = CargoSerializer(read_only=True)
    cargo_id = serializers.PrimaryKeyRelatedField(
        queryset=Cargo.objects.all(), 
        source='cargo',
        write_only=True
    )
    
    class Meta:
        model = Candidatura
        fields = [
            'id', 'nombre_candidato', 'partido_politico', 
            'sigla', 'color', 'cargo', 'cargo_id'
        ]
    
    def validate_color(self, value):
        if not value.startswith('#'):
            raise serializers.ValidationError("El color debe comenzar con '#'")
        if len(value) != 7:
            raise serializers.ValidationError("El color debe tener 7 caracteres (#RRGGBB)")
        try:
            int(value[1:], 16)
        except ValueError:
            raise serializers.ValidationError("El color debe ser un código hexadecimal válido")
        return value


class CandidaturaViewSet(viewsets.ModelViewSet):
    queryset = Candidatura.objects.select_related('cargo').all()
    serializer_class = CandidaturaSerializer 