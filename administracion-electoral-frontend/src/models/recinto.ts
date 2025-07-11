import { BaseModel } from './base';
import { MapCoordinates } from './seccion';

// Recinto types
export interface Recinto extends BaseModel {
  nombre: string;
  direccion: string;
  latitud: number | null;
  longitud: number | null;
  capacidad: number;
  horario_apertura: string;
  horario_cierre: string;
}

export interface RecintoDetail extends Recinto {
  mesas: string[];
  total_mesas: number;
}

export interface RecintoFormData {
  nombre: string;
  direccion: string;
  latitud: number | null;
  longitud: number | null;
  capacidad: number;
  horario_apertura: string;
  horario_cierre: string;
}

// Geography types for Recintos
export interface RecintoGeography extends Recinto {
  coordinates?: MapCoordinates;
} 