from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Recinto, Votante
from .serializers import RecintoSerializer, VotanteSerializer, ConsultaPadronSerializer


class RecintoViewSet(viewsets.ModelViewSet):
    queryset = Recinto.objects.all()
    serializer_class = RecintoSerializer
    permission_classes = [IsAuthenticated]


class VotanteViewSet(viewsets.ModelViewSet):
    queryset = Votante.objects.all()
    serializer_class = VotanteSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET'])
def consulta_padron(request):
    """
    Vista pública para consultar votantes por CI
    """
    ci = request.GET.get('ci')
    
    if not ci:
        return Response(
            {'error': 'El parámetro "ci" es requerido'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        votante = get_object_or_404(Votante, ci=ci)
        serializer = ConsultaPadronSerializer(votante)
        return Response(serializer.data)
    except Votante.DoesNotExist:
        return Response(
            {'error': 'Votante no encontrado'}, 
            status=status.HTTP_404_NOT_FOUND
        )
