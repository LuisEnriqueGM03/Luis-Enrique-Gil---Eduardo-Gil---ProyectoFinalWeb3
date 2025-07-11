import { BaseModel } from './base';

// Seccion types
export interface Seccion extends BaseModel {
  nombre: string;
  polygon?: { lat: number; lng: number }[];
}

export interface SeccionDetail extends Seccion {
  cargos: string[];
  elecciones: string[];
}

export interface SeccionFormData {
  nombre: string;
  polygon?: { lat: number; lng: number }[];
}

// Geography types for Secciones
export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface SeccionGeography extends Seccion {
  coordinates?: MapCoordinates[];
  bounds?: MapBounds;
} 