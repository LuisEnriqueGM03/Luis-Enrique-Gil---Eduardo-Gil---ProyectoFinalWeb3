import { BaseModel } from './base';
import { Cargo } from './cargo';

// Candidatura types
export interface Candidatura extends BaseModel {
  nombre_candidato: string;
  partido_politico: string;
  sigla: string;
  color: string; // Hex color
  cargo: Cargo;
}

export interface CandidaturaFormData {
  nombre_candidato: string;
  partido_politico: string;
  sigla: string;
  color: string;
  cargo_id: number;
} 