from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from electoral.models import Votante
from electoral.serializers import ConsultaPadronSerializer

@api_view(['GET'])
def consulta_padron(request):

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