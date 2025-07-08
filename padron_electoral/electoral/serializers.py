from rest_framework import serializers
from .models import Recinto, Votante


class RecintoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recinto
        fields = '__all__'


class VotanteSerializer(serializers.ModelSerializer):
    recinto_nombre = serializers.CharField(source='recinto.nombre', read_only=True)
    
    class Meta:
        model = Votante
        fields = '__all__'


class ConsultaPadronSerializer(serializers.ModelSerializer):
    recinto_nombre = serializers.CharField(source='recinto.nombre', read_only=True)
    
    class Meta:
        model = Votante
        fields = ['nombre_completo', 'direccion', 'recinto_nombre'] 