import { BaseModel } from './base';
import { Seccion } from './seccion';

// Cargo types
export interface Cargo extends BaseModel {
  nombre: string;
  secciones_afectadas: Seccion[];
}

export interface CargoFormData {
  nombre: string;
  secciones_afectadas_ids: number[];
} 