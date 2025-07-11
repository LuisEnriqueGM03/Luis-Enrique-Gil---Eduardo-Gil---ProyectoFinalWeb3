from rest_framework import serializers
from .models import Votante


class VotanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Votante
        fields = '__all__'


class ConsultaPadronSerializer(serializers.ModelSerializer):
    class Meta:
        model = Votante
        fields = ['nombre_completo', 'direccion', 'recinto_id_externo'] 