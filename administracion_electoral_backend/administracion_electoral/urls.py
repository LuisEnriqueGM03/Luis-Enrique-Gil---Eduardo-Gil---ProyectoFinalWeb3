from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .apis import (
    SeccionViewSet, CargoViewSet, RecintoViewSet, 
    MesaElectoralViewSet, JuradoViewSet, EleccionViewSet, 
    CandidaturaViewSet, PapeletaViewSet
)

router = DefaultRouter()
router.register(r'secciones', SeccionViewSet)
router.register(r'cargos', CargoViewSet)
router.register(r'recintos', RecintoViewSet)
router.register(r'mesas-electorales', MesaElectoralViewSet)
router.register(r'jurados', JuradoViewSet)
router.register(r'elecciones', EleccionViewSet)
router.register(r'candidaturas', CandidaturaViewSet)
router.register(r'papeletas', PapeletaViewSet, basename='papeleta')

urlpatterns = [
    path('', include(router.urls)),
] 