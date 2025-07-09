from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Configurar el router para los ViewSets
router = DefaultRouter()
router.register(r'secciones', views.SeccionViewSet)
router.register(r'cargos', views.CargoViewSet)
router.register(r'recintos', views.RecintoViewSet)
router.register(r'mesas-electorales', views.MesaElectoralViewSet)
router.register(r'jurados', views.JuradoViewSet)
router.register(r'elecciones', views.EleccionViewSet)
router.register(r'candidaturas', views.CandidaturaViewSet)

# URLs de la aplicación
urlpatterns = [
    # Incluir las rutas del router (CRUD para todos los modelos)
    path('api/', include(router.urls)),
    
    # Rutas personalizadas para papeletas
    path('api/papeletas/<int:seccion_id>/', views.generar_papeleta_por_seccion, name='generar_papeleta'),
    path('api/papeletas/', views.listar_papeletas_disponibles, name='listar_papeletas'),
] 