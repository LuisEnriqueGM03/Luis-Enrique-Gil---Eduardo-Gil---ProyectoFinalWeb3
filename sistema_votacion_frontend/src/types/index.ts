// Tipos para el sistema de votación

export interface VotanteData {
  id: string;
  ci: string;
  nombre: string;
  apellido: string;
  mesa_id: string;
}

export interface CandidatoData {
  id: number;
  nombre: string;
  partido: string;
  cargo: string;
  color: string;
}

export interface VotoData {
  id: string;
  candidato_id: number;
  timestamp: string;
}

export interface ResultadosData {
  candidato_id: number;
  candidato_nombre: string;
  candidato_partido: string;
  candidato_color: string;
  total_votos: number;
}

// Tipos para eventos de Socket.IO
export interface SocketEvents {
  // Eventos del cliente
  unirse_mesa: (mesaId: string) => void;
  emitir_voto: (data: { candidato_id: number; mesa_id: string }) => void;

  // Eventos del servidor
  habilitar_papeleta: (data: {
    votante: VotanteData;
    candidatos: CandidatoData[];
    timestamp: string;
  }) => void;

  voto_exitoso: (data: {
    mensaje: string;
    voto_id: string;
    timestamp: string;
  }) => void;

  papeleta_cerrada: (data: { mensaje: string; timestamp: string }) => void;

  resultados_actualizados: (data: {
    resultados: ResultadosData[];
    timestamp: string;
  }) => void;

  error_voto: (data: { error: string }) => void;
}

// Tipos para API REST
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface HabilitarPapeletaRequest {
  ci: string;
  mesa_id: string;
}

export interface HabilitarPapeletaResponse {
  votante: VotanteData;
  candidatos: CandidatoData[];
  mensaje: string;
}

// Estados de conexión
export type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "connecting"
  | "error";

// Estados del votante
export enum EstadoVotante {
  ESPERANDO_HABILITACION = "esperando_habilitacion",
  PAPELETA_HABILITADA = "papeleta_habilitada",
  CANDIDATOS_SELECCIONADOS = "candidatos_seleccionados",
  CONFIRMANDO_VOTO = "confirmando_voto",
  VOTO_EMITIDO = "voto_emitido",
  ERROR = "error",
}

// Estados del jurado
export enum EstadoJurado {
  INACTIVO = "inactivo",
  VERIFICANDO_VOTANTE = "verificando_votante",
  VOTANTE_VERIFICADO = "votante_verificado",
  PAPELETA_HABILITADA = "papeleta_habilitada",
  ESPERANDO_VOTO = "esperando_voto",
  VOTO_COMPLETADO = "voto_completado",
  ERROR = "error",
}

// Tipos de mesa
export type MesaId = "1" | "2" | "3" | "4";

// Props comunes
export interface BasePageProps {
  className?: string;
}

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}
