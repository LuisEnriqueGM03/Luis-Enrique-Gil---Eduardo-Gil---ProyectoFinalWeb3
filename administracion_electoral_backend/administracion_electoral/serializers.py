from rest_framework import serializers
from .models import Seccion, Cargo, Recinto, MesaElectoral, Jurado, Eleccion, Candidatura


class SeccionSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Seccion"""
    
    class Meta:
        model = Seccion
        fields = ['id', 'nombre']


class SeccionDetailSerializer(serializers.ModelSerializer):
    """Serializer detallado para Seccion con cargos relacionados"""
    cargos = serializers.StringRelatedField(many=True, read_only=True)
    elecciones = serializers.StringRelatedField(many=True, read_only=True)
    
    class Meta:
        model = Seccion
        fields = ['id', 'nombre', 'cargos', 'elecciones']


class CargoSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Cargo"""
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


class RecintoSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Recinto"""
    
    class Meta:
        model = Recinto
        fields = ['id', 'nombre', 'ubicacion']


class RecintoDetailSerializer(serializers.ModelSerializer):
    """Serializer detallado para Recinto con mesas relacionadas"""
    mesas = serializers.StringRelatedField(many=True, read_only=True)
    total_mesas = serializers.SerializerMethodField()
    
    class Meta:
        model = Recinto
        fields = ['id', 'nombre', 'ubicacion', 'mesas', 'total_mesas']
    
    def get_total_mesas(self, obj):
        return obj.mesas.count()


class MesaElectoralSerializer(serializers.ModelSerializer):
    """Serializer para el modelo MesaElectoral"""
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
    """Serializer detallado para MesaElectoral con jurados"""
    recinto = RecintoSerializer(read_only=True)
    jurados = serializers.StringRelatedField(many=True, read_only=True)
    total_jurados = serializers.SerializerMethodField()
    
    class Meta:
        model = MesaElectoral
        fields = ['id', 'numero', 'recinto', 'jurados', 'total_jurados']
    
    def get_total_jurados(self, obj):
        return obj.jurados.count()


class JuradoSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Jurado"""
    mesa = MesaElectoralSerializer(read_only=True)
    mesa_id = serializers.PrimaryKeyRelatedField(
        queryset=MesaElectoral.objects.all(), 
        source='mesa',
        write_only=True
    )
    
    class Meta:
        model = Jurado
        fields = ['id', 'nombre_completo', 'ci', 'mesa', 'mesa_id']


class EleccionSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Eleccion"""
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


class CandidaturaSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Candidatura"""
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
        """Validar que el color sea un código hexadecimal válido"""
        if not value.startswith('#'):
            raise serializers.ValidationError("El color debe comenzar con '#'")
        if len(value) != 7:
            raise serializers.ValidationError("El color debe tener 7 caracteres (#RRGGBB)")
        try:
            int(value[1:], 16)
        except ValueError:
            raise serializers.ValidationError("El color debe ser un código hexadecimal válido")
        return value


class CandidaturaSimpleSerializer(serializers.ModelSerializer):
    """Serializer simple para Candidatura (usado en papeletas)"""
    
    class Meta:
        model = Candidatura
        fields = ['nombre_candidato', 'partido_politico', 'sigla', 'color']


class CargoConCandidatosSerializer(serializers.ModelSerializer):
    """Serializer para Cargo con sus candidatos (usado en papeletas)"""
    candidatos = CandidaturaSimpleSerializer(source='candidaturas', many=True, read_only=True)
    
    class Meta:
        model = Cargo
        fields = ['nombre', 'candidatos']


class PapeletaSerializer(serializers.Serializer):
    """Serializer para la estructura de papeleta por sección"""
    seccion = serializers.CharField()
    papeleta = CargoConCandidatosSerializer(many=True) 