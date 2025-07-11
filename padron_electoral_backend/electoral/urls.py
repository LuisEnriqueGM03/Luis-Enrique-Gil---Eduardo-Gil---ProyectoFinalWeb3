from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .apis.votante import VotanteViewSet
from .apis.consulta_padron import consulta_padron

router = DefaultRouter()
router.register(r'votantes', VotanteViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('consulta-padron/', consulta_padron, name='consulta_padron'),
] 