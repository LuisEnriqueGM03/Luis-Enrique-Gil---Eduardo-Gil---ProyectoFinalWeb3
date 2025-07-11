from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from electoral.models import Votante
from electoral.serializers import VotanteSerializer

class VotanteViewSet(viewsets.ModelViewSet):
    queryset = Votante.objects.all()
    serializer_class = VotanteSerializer
    permission_classes = [AllowAny] 