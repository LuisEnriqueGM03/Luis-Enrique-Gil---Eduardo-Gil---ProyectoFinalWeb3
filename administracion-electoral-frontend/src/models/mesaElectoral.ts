import { BaseModel } from './base';
import { Recinto } from './recinto';

// Mesa Electoral types
export interface MesaElectoral extends BaseModel {
  numero: number;
  recinto: Recinto;
}

export interface MesaElectoralDetail extends BaseModel {
  numero: number;
  recinto: Recinto;
  jurados: string[];
  total_jurados: number;
}

export interface MesaElectoralFormData {
  numero: number;
  recinto_id: number;
} 