// Constantes del sistema de votación

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:3001",
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || "http://localhost:3001",
  ENDPOINTS: {
    HEALTH: "/health",
    HABILITAR: "/habilitar",
    VOTO: "/voto",
    RESULTADOS: "/resultados",
    CANDIDATOS: "/candidatos",
  },
} as const;

export const SOCKET_EVENTS = {
  // Eventos del cliente
  UNIRSE_MESA: "unirse_mesa",
  EMITIR_VOTO: "emitir_voto",

  // Eventos del servidor
  CONECTADO_MESA: "conectado_mesa",
  HABILITAR_PAPELETA: "habilitar_papeleta",
  VOTO_EXITOSO: "voto_exitoso",
  PAPELETA_CERRADA: "papeleta_cerrada",
  RESULTADOS_ACTUALIZADOS: "resultados_actualizados",
  ERROR_VOTO: "error_voto",

  // Eventos de conexión
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
} as const;

export const MESAS_DISPONIBLES = [
  { id: "1", nombre: "Mesa 1" },
  { id: "2", nombre: "Mesa 2" },
  { id: "3", nombre: "Mesa 3" },
  { id: "4", nombre: "Mesa 4" },
] as const;

export const ROUTES = {
  HOME: "/",
  JURADO: "/jurado",
  VOTANTE: "/votante",
  RESULTADOS: "/resultados",
} as const;

export const CONNECTION_STATUS_MESSAGES = {
  connected: "Conectado al servidor",
  disconnected: "Desconectado del servidor",
  connecting: "Conectando...",
  error: "Error de conexión",
} as const;

export const CHART_COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#EC4899", // Pink
  "#6B7280", // Gray
] as const;

export const MESSAGES = {
  VOTANTE: {
    ESPERANDO_HABILITACION: "Esperando que el jurado habilite tu papeleta...",
    PAPELETA_HABILITADA: "Selecciona un candidato para cada cargo",
    CANDIDATOS_SELECCIONADOS: "Confirma tu voto para continuar",
    CONFIRMANDO_VOTO: "Procesando tus votos...",
    VOTO_EMITIDO: "Gracias por votar. Tu papeleta ha sido cerrada.",
    ERROR: "Ha ocurrido un error. Contacta al jurado.",
  },
  JURADO: {
    INACTIVO: "Ingresa el CI del votante para verificar su identidad",
    VERIFICANDO_VOTANTE: "Verificando datos del votante...",
    VOTANTE_VERIFICADO:
      "Datos verificados. Habilita la papeleta si la identidad es correcta.",
    PAPELETA_HABILITADA:
      "Papeleta habilitada. Esperando que el votante emita su voto.",
    ESPERANDO_VOTO: "El votante está seleccionando sus candidatos...",
    VOTO_COMPLETADO: "Voto registrado exitosamente.",
    ERROR: "Error en el proceso. Intenta nuevamente.",
  },
} as const;

export const VALIDATION_RULES = {
  CI: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 15,
    PATTERN: /^[0-9]+$/,
  },
} as const;

export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  CHART_UPDATE_INTERVAL: 5000,
  CONNECTION_RETRY_INTERVAL: 3000,
} as const;
