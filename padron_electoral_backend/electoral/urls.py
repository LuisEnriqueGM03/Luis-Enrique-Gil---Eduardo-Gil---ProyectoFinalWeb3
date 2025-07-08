from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'recintos', views.RecintoViewSet)
router.register(r'votantes', views.VotanteViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('consulta-padron/', views.consulta_padron, name='consulta_padron'),
] 