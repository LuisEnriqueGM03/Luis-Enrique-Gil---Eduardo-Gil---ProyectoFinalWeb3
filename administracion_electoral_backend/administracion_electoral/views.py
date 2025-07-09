from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch

from .models import Seccion, Cargo, Recinto, MesaElectoral, Jurado, Eleccion, Candidatura
from .serializers import (
    SeccionSerializer, SeccionDetailSerializer,
    CargoSerializer, 
    RecintoSerializer, RecintoDetailSerializer,
    MesaElectoralSerializer, MesaElectoralDetailSerializer,
    JuradoSerializer,
    EleccionSerializer,
    CandidaturaSerializer,
    PapeletaSerializer, CargoConCandidatosSerializer
)


class SeccionViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar Secciones"""
    queryset = Seccion.objects.all()
    serializer_class = SeccionSerializer
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SeccionDetailSerializer
        return SeccionSerializer


class CargoViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar Cargos"""
    queryset = Cargo.objects.prefetch_related('secciones_afectadas').all()
    serializer_class = CargoSerializer


class RecintoViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar Recintos"""
    queryset = Recinto.objects.all()
    serializer_class = RecintoSerializer
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return RecintoDetailSerializer
        return RecintoSerializer


class MesaElectoralViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar Mesas Electorales"""
    queryset = MesaElectoral.objects.select_related('recinto').all()
    serializer_class = MesaElectoralSerializer
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return MesaElectoralDetailSerializer
        return MesaElectoralSerializer


class JuradoViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar Jurados"""
    queryset = Jurado.objects.select_related('mesa__recinto').all()
    serializer_class = JuradoSerializer


class EleccionViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar Elecciones"""
    queryset = Eleccion.objects.select_related('seccion').all()
    serializer_class = EleccionSerializer


class CandidaturaViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar Candidaturas"""
    queryset = Candidatura.objects.select_related('cargo').all()
    serializer_class = CandidaturaSerializer


@api_view(['GET'])
def generar_papeleta_por_seccion(request, seccion_id):
    """
    Vista para generar papeleta virtual por sección.
    
    Devuelve un JSON con la estructura:
    {
        "seccion": "Central",
        "papeleta": [
            {
                "cargo": "Gobernador",
                "candidatos": [
                    { "nombre_candidato": "Luis Perez", "partido_politico": "UN", "sigla": "UN", "color": "#0055AA" },
                    { "nombre_candidato": "Ana Rojas", "partido_politico": "MAS", "sigla": "MAS", "color": "#00AA00" }
                ]
            }
        ]
    }
    """
    try:
        # Obtener la sección
        seccion = get_object_or_404(Seccion, id=seccion_id)
        
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


# Vista adicional para obtener todas las papeletas disponibles
@api_view(['GET'])
def listar_papeletas_disponibles(request):
    """
    Vista para listar todas las secciones disponibles para generar papeletas
    """
    try:
        secciones = Seccion.objects.filter(cargos__isnull=False).distinct()
        papeletas_disponibles = []
        
        for seccion in secciones:
            papeletas_disponibles.append({
                'seccion_id': seccion.id,
                'seccion_nombre': seccion.nombre,
                'url_papeleta': f'/api/papeletas/{seccion.id}/',
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
