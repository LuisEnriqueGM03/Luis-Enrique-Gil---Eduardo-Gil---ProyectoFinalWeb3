from django.contrib import admin
from .models import Seccion, Cargo, Recinto, MesaElectoral, Jurado, Eleccion, Candidatura


@admin.register(Seccion)
class SeccionAdmin(admin.ModelAdmin):
    list_display = ['nombre']
    search_fields = ['nombre']
    ordering = ['nombre']


@admin.register(Cargo)
class CargoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'get_secciones_count']
    search_fields = ['nombre']
    filter_horizontal = ['secciones_afectadas']
    ordering = ['nombre']
    
    def get_secciones_count(self, obj):
        return obj.secciones_afectadas.count()
    get_secciones_count.short_description = 'Secciones Afectadas'


@admin.register(Recinto)
class RecintoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'ubicacion', 'get_mesas_count']
    search_fields = ['nombre', 'ubicacion']
    ordering = ['nombre']
    
    def get_mesas_count(self, obj):
        return obj.mesas.count()
    get_mesas_count.short_description = 'Total Mesas'


@admin.register(MesaElectoral)
class MesaElectoralAdmin(admin.ModelAdmin):
    list_display = ['numero', 'recinto', 'get_jurados_count']
    list_filter = ['recinto']
    search_fields = ['numero', 'recinto__nombre']
    ordering = ['recinto', 'numero']
    
    def get_jurados_count(self, obj):
        return obj.jurados.count()
    get_jurados_count.short_description = 'Total Jurados'


@admin.register(Jurado)
class JuradoAdmin(admin.ModelAdmin):
    list_display = ['nombre_completo', 'ci', 'mesa']
    list_filter = ['mesa__recinto']
    search_fields = ['nombre_completo', 'ci', 'mesa__numero']
    ordering = ['nombre_completo']


@admin.register(Eleccion)
class EleccionAdmin(admin.ModelAdmin):
    list_display = ['tipo', 'fecha', 'seccion']
    list_filter = ['tipo', 'fecha', 'seccion']
    search_fields = ['tipo', 'seccion__nombre']
    date_hierarchy = 'fecha'
    ordering = ['-fecha', 'tipo']


@admin.register(Candidatura)
class CandidaturaAdmin(admin.ModelAdmin):
    list_display = ['nombre_candidato', 'partido_politico', 'sigla', 'cargo', 'color_display']
    list_filter = ['cargo', 'partido_politico']
    search_fields = ['nombre_candidato', 'partido_politico', 'sigla']
    ordering = ['cargo', 'nombre_candidato']
    
    def color_display(self, obj):
        return f'<div style="width: 20px; height: 20px; background-color: {obj.color}; border: 1px solid #ccc; display: inline-block;"></div> {obj.color}'
    color_display.allow_tags = True
    color_display.short_description = 'Color'


# Configuración del sitio admin
admin.site.site_header = "Administración Electoral"
admin.site.site_title = "Sistema Electoral"
admin.site.index_title = "Panel de Administración Electoral"
