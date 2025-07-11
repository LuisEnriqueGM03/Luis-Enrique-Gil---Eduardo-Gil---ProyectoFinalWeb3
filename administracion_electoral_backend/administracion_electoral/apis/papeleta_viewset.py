from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from administracion_electoral.models import Seccion, Cargo, Candidatura

class CandidaturaSimpleSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Candidatura
        fields = ['nombre_candidato', 'partido_politico', 'sigla', 'color']


class CargoConCandidatosSerializer(serializers.ModelSerializer):
    candidatos = CandidaturaSimpleSerializer(source='candidaturas', many=True, read_only=True)
    
    class Meta:
        model = Cargo
        fields = ['nombre', 'candidatos']


class PapeletaSerializer(serializers.Serializer):
    seccion = serializers.CharField()
    papeleta = CargoConCandidatosSerializer(many=True)


class PapeletaViewSet(viewsets.ViewSet):
    
    def list(self, request):
        """Lista todas las papeletas disponibles (redirige a disponibles)"""
        return self.listar_papeletas_disponibles(request)
    
    @action(detail=True, methods=['get'], url_path='generar')
    def generar_papeleta_por_seccion(self, request, pk=None):

        try:
            # Obtener la sección
            seccion = get_object_or_404(Seccion, id=pk)
            
            # Obtener todos los cargos que afectan a esta sección con sus candidaturas
            cargos = Cargo.objects.filter(
                secciones_afectadas=seccion
            ).prefetch_related(
                Prefetch(
                    'candidaturas',
                    queryset=Candidatura.objects.all(),
                    to_attr='candidatos_list'
                )
            ).distinct()
            
            # Serializar los cargos con candidatos
            cargos_serializer = CargoConCandidatosSerializer(cargos, many=True)
            
            # Construir la respuesta
            papeleta_data = {
                'seccion': seccion.nombre,
                'papeleta': cargos_serializer.data
            }
            
            return Response(papeleta_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error al generar papeleta: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], url_path='disponibles')
    def listar_papeletas_disponibles(self, request):

        try:
            secciones = Seccion.objects.filter(cargos__isnull=False).distinct()
            papeletas_disponibles = []
            
            for seccion in secciones:
                papeletas_disponibles.append({
                    'seccion_id': seccion.id,
                    'seccion_nombre': seccion.nombre,
                    'url_papeleta': f'/api/papeletas/{seccion.id}/generar/',
                    'total_cargos': seccion.cargos.count()
                })
            
            return Response({
                'papeletas_disponibles': papeletas_disponibles,
                'total_secciones': len(papeletas_disponibles)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Error al listar papeletas: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 