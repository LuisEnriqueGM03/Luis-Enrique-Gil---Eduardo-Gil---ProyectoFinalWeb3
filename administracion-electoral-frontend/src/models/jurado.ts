import { BaseModel } from './base';
import { MesaElectoral } from './mesaElectoral';

// Jurado types
export interface Jurado extends BaseModel {
  nombre_completo: string;
  ci: string;
  mesa: MesaElectoral;
}

export interface JuradoFormData {
  nombre_completo: string;
  ci: string;
  mesa_id: number;
} 