// Papeleta types
export interface CandidatoSimple {
  nombre_candidato: string;
  partido_politico: string;
  sigla: string;
  color: string;
}

export interface CargoConCandidatos {
  nombre: string;
  candidatos: CandidatoSimple[];
}

export interface Papeleta {
  seccion: string;
  papeleta: CargoConCandidatos[];
}

export interface PapeletaDisponible {
  seccion_id: number;
  seccion_nombre: string;
  url_papeleta: string;
  total_cargos: number;
}

export interface PapeletasResponse {
  papeletas_disponibles: PapeletaDisponible[];
  total_secciones: number;
} 