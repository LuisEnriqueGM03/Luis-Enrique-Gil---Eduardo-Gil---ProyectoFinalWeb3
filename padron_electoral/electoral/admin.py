from django.contrib import admin
from .models import Recinto, Votante


@admin.register(Recinto)
class RecintoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'ubicacion']
    search_fields = ['nombre', 'ubicacion']


@admin.register(Votante)
class VotanteAdmin(admin.ModelAdmin):
    list_display = ['nombre_completo', 'ci', 'recinto', 'fecha_registro']
    list_filter = ['recinto', 'fecha_registro']
    search_fields = ['nombre_completo', 'ci']
    readonly_fields = ['codigo_unico', 'fecha_registro']
