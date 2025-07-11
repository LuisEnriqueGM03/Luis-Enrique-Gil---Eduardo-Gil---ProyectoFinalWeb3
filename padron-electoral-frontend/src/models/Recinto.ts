export interface Recinto {
  id?: number;
  nombre: string;
  direccion: string;
  capacidad: number;
  horario_apertura?: string;
  horario_cierre?: string;   
  latitud?: string | number;
  longitud?: string | number;
} 