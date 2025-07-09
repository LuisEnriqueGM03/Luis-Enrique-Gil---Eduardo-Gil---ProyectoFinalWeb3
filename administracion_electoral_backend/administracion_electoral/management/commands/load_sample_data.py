from django.core.management.base import BaseCommand
from django.db import transaction
from administracion_electoral.models import (
    Seccion, Cargo, Recinto, MesaElectoral, Jurado, Eleccion, Candidatura
)
from datetime import date


class Command(BaseCommand):
    help = 'Carga datos de prueba para el sistema de administración electoral'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Cargando datos de prueba...'))
        
        try:
            with transaction.atomic():
                # Limpiar datos existentes
                self.stdout.write('Limpiando datos existentes...')
                Candidatura.objects.all().delete()
                Eleccion.objects.all().delete()
                Jurado.objects.all().delete()
                MesaElectoral.objects.all().delete()
                Recinto.objects.all().delete()
                Cargo.objects.all().delete()
                Seccion.objects.all().delete()
                
                # Crear Secciones
                self.stdout.write('Creando secciones...')
                seccion_central = Seccion.objects.create(nombre="Central")
                seccion_norte = Seccion.objects.create(nombre="Norte")
                seccion_sur = Seccion.objects.create(nombre="Sur")
                seccion_este = Seccion.objects.create(nombre="Este")
                
                # Crear Cargos
                self.stdout.write('Creando cargos...')
                cargo_presidente = Cargo.objects.create(nombre="Presidente")
                cargo_presidente.secciones_afectadas.set([seccion_central, seccion_norte, seccion_sur, seccion_este])
                
                cargo_gobernador = Cargo.objects.create(nombre="Gobernador")
                cargo_gobernador.secciones_afectadas.set([seccion_central, seccion_norte])
                
                cargo_alcalde_central = Cargo.objects.create(nombre="Alcalde Central")
                cargo_alcalde_central.secciones_afectadas.set([seccion_central])
                
                cargo_alcalde_norte = Cargo.objects.create(nombre="Alcalde Norte")
                cargo_alcalde_norte.secciones_afectadas.set([seccion_norte])
                
                # Crear Recintos
                self.stdout.write('Creando recintos...')
                recinto_universidad = Recinto.objects.create(
                    nombre="Universidad Nur",
                    ubicacion="Av. Cristo Redentor #123, Santa Cruz"
                )
                
                recinto_colegio = Recinto.objects.create(
                    nombre="Colegio San Patricio",
                    ubicacion="Calle Libertad #456, Santa Cruz"
                )
                
                recinto_centro_civico = Recinto.objects.create(
                    nombre="Centro Cívico",
                    ubicacion="Plaza Principal, Santa Cruz"
                )
                
                # Crear Mesas Electorales
                self.stdout.write('Creando mesas electorales...')
                mesas = []
                for i in range(1, 11):  # 10 mesas en Universidad Nur
                    mesa = MesaElectoral.objects.create(numero=i, recinto=recinto_universidad)
                    mesas.append(mesa)
                
                for i in range(1, 6):  # 5 mesas en Colegio San Patricio
                    mesa = MesaElectoral.objects.create(numero=i, recinto=recinto_colegio)
                    mesas.append(mesa)
                
                for i in range(1, 4):  # 3 mesas en Centro Cívico
                    mesa = MesaElectoral.objects.create(numero=i, recinto=recinto_centro_civico)
                    mesas.append(mesa)
                
                # Crear Jurados
                self.stdout.write('Creando jurados...')
                jurados_data = [
                    ("María González López", "12345678", mesas[0]),
                    ("Carlos Rodríguez Paz", "87654321", mesas[1]),
                    ("Ana Fernández Silva", "11111111", mesas[2]),
                    ("Luis Morales Castro", "22222222", mesas[3]),
                    ("Carmen Vega Torres", "33333333", mesas[4]),
                    ("Roberto Jiménez Luna", "44444444", mesas[5]),
                    ("Sofia Herrera Ramos", "55555555", mesas[6]),
                    ("Diego Castillo Flores", "66666666", mesas[7]),
                    ("Elena Vargas Soto", "77777777", mesas[8]),
                    ("Andrés Ruiz Mendoza", "88888888", mesas[9]),
                ]
                
                for nombre, ci, mesa in jurados_data:
                    Jurado.objects.create(nombre_completo=nombre, ci=ci, mesa=mesa)
                
                # Crear Elecciones
                self.stdout.write('Creando elecciones...')
                Eleccion.objects.create(
                    tipo="PRESIDENCIAL",
                    fecha=date(2024, 10, 20),
                    seccion=seccion_central
                )
                
                Eleccion.objects.create(
                    tipo="DEPARTAMENTAL",
                    fecha=date(2024, 10, 20),
                    seccion=seccion_norte
                )
                
                # Crear Candidaturas
                self.stdout.write('Creando candidaturas...')
                
                # Candidatos para Presidente
                Candidatura.objects.create(
                    nombre_candidato="Luis Alberto Arce Catacora",
                    partido_politico="Movimiento Al Socialismo",
                    sigla="MAS",
                    color="#1E3A8A",
                    cargo=cargo_presidente
                )
                
                Candidatura.objects.create(
                    nombre_candidato="Carlos Diego Mesa Gisbert",
                    partido_politico="Comunidad Ciudadana",
                    sigla="CC",
                    color="#DC2626",
                    cargo=cargo_presidente
                )
                
                Candidatura.objects.create(
                    nombre_candidato="Fernando Camacho Vaca",
                    partido_politico="Creemos",
                    sigla="CREEMOS",
                    color="#059669",
                    cargo=cargo_presidente
                )
                
                # Candidatos para Gobernador
                Candidatura.objects.create(
                    nombre_candidato="Mario Cronenbold Salles",
                    partido_politico="Movimiento Al Socialismo",
                    sigla="MAS",
                    color="#1E3A8A",
                    cargo=cargo_gobernador
                )
                
                Candidatura.objects.create(
                    nombre_candidato="Rubén Costas Aguilera",
                    partido_politico="Demócratas",
                    sigla="DEM",
                    color="#F59E0B",
                    cargo=cargo_gobernador
                )
                
                # Candidatos para Alcalde Central
                Candidatura.objects.create(
                    nombre_candidato="Johnny Fernández Rioja",
                    partido_politico="Súmate",
                    sigla="SÚMATE",
                    color="#8B5CF6",
                    cargo=cargo_alcalde_central
                )
                
                Candidatura.objects.create(
                    nombre_candidato="Angélica Sosa Coronado",
                    partido_politico="Movimiento Al Socialismo",
                    sigla="MAS",
                    color="#1E3A8A",
                    cargo=cargo_alcalde_central
                )
                
                # Candidatos para Alcalde Norte
                Candidatura.objects.create(
                    nombre_candidato="Patricia Arce Guzmán",
                    partido_politico="Movimiento Al Socialismo",
                    sigla="MAS",
                    color="#1E3A8A",
                    cargo=cargo_alcalde_norte
                )
                
                Candidatura.objects.create(
                    nombre_candidato="José María Leyes",
                    partido_politico="Comunidad Ciudadana",
                    sigla="CC",
                    color="#DC2626",
                    cargo=cargo_alcalde_norte
                )
                
                self.stdout.write(
                    self.style.SUCCESS('¡Datos de prueba cargados exitosamente!')
                )
                
                # Mostrar resumen
                self.stdout.write('\n=== RESUMEN DE DATOS CREADOS ===')
                self.stdout.write(f'Secciones: {Seccion.objects.count()}')
                self.stdout.write(f'Cargos: {Cargo.objects.count()}')
                self.stdout.write(f'Recintos: {Recinto.objects.count()}')
                self.stdout.write(f'Mesas Electorales: {MesaElectoral.objects.count()}')
                self.stdout.write(f'Jurados: {Jurado.objects.count()}')
                self.stdout.write(f'Elecciones: {Eleccion.objects.count()}')
                self.stdout.write(f'Candidaturas: {Candidatura.objects.count()}')
                
                self.stdout.write('\n=== ENDPOINTS PARA PROBAR ===')
                self.stdout.write('• GET /api/secciones/ - Ver todas las secciones')
                self.stdout.write('• GET /api/cargos/ - Ver todos los cargos')
                self.stdout.write('• GET /api/candidaturas/ - Ver todas las candidaturas')
                self.stdout.write('• GET /api/papeletas/ - Ver papeletas disponibles')
                self.stdout.write('• GET /api/papeletas/1/ - Ver papeleta de sección Central')
                self.stdout.write('• GET /admin/ - Panel de administración')
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error al cargar datos: {str(e)}')
            ) 