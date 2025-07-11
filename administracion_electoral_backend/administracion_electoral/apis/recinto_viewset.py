from rest_framework import serializers, viewsets, status
from rest_framework.response import Response
from django.utils.dateparse import parse_time
from administracion_electoral.models import Recinto

class RecintoSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Recinto
        fields = [
            'id', 'nombre', 'direccion', 'capacidad', 
            'horario_apertura', 'horario_cierre', 
            'latitud', 'longitud'
        ]
    
    def validate_nombre(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("El nombre del recinto no puede estar vacío")
        return value.strip()
    
    def validate_direccion(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("La dirección del recinto no puede estar vacía")
        return value.strip()
    
    def validate_capacidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("La capacidad debe ser mayor a 0")
        return value
    
    def validate_horario_apertura(self, value):
        if isinstance(value, str):
            parsed_time = parse_time(value)
            if parsed_time is None:
                raise serializers.ValidationError("Formato de hora inválido. Use HH:MM")
            return parsed_time
        return value
    
    def validate_horario_cierre(self, value):
        if isinstance(value, str):
            parsed_time = parse_time(value)
            if parsed_time is None:
                raise serializers.ValidationError("Formato de hora inválido. Use HH:MM")
            return parsed_time
        return value


class RecintoDetailSerializer(serializers.ModelSerializer):
    mesas = serializers.StringRelatedField(many=True, read_only=True)
    total_mesas = serializers.SerializerMethodField()
    
    class Meta:
        model = Recinto
        fields = [
            'id', 'nombre', 'direccion', 'capacidad', 
            'horario_apertura', 'horario_cierre', 
            'latitud', 'longitud', 'mesas', 'total_mesas'
        ]
    
    def get_total_mesas(self, obj):
        return obj.mesas.count()


class RecintoViewSet(viewsets.ModelViewSet):
    queryset = Recinto.objects.all()
    serializer_class = RecintoSerializer
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return RecintoDetailSerializer
        return RecintoSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        
        # Proporcionar información detallada del error
        error_response = {
            'error': 'Error de validación',
            'details': serializer.errors,
            'data_received': request.data
        }
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST) 