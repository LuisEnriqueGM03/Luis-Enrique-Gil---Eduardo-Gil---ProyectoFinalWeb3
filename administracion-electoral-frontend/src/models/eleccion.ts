import { BaseModel } from './base';
import { Seccion } from './seccion';

// Eleccion types
export type TipoEleccion =
  | "PRESIDENCIAL"
  | "DEPARTAMENTAL"
  | "MUNICIPAL"
  | "JUDICIAL"
  | "LEGISLATIVA";

export interface Eleccion extends BaseModel {
  tipo: TipoEleccion;
  tipo_display: string;
  fecha: string; // ISO date string
  seccion: Seccion;
}

export interface EleccionFormData {
  tipo: TipoEleccion;
  fecha: string;
  seccion_id: number;
} 