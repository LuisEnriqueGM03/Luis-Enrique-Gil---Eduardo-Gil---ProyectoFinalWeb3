import { io, Socket } from "socket.io-client";

// Configuración del socket
const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:3001";

// Crear instancia del socket
export const socket: Socket = io(SERVER_URL, {
  autoConnect: false, // No conectar automáticamente
  transports: ["websocket", "polling"],
  timeout: 20000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

// Tipos de eventos del servidor
export interface ServerToClientEvents {
  // Eventos generales
  conectado_mesa: (data: {
    mesa_id: string;
    mensaje: string;
    timestamp: string;
  }) => void;

  // Eventos de habilitación de papeleta
  habilitar_papeleta: (data: {
    votante: VotanteData;
    candidatos: CandidatoData[];
    timestamp: string;
  }) => void;

  // Eventos de votación
  papeleta_cerrada: (data: { mensaje: string; timestamp: string }) => void;
  voto_exitoso: (data: {
    mensaje: string;
    voto_id: string;
    timestamp: string;
  }) => void;
  error_voto: (data: { error: string }) => void;

  // Eventos de resultados
  resultados_actualizados: (data: {
    resultados: ResultadoData[];
    timestamp: string;
  }) => void;
  resultados_globales: (data: {
    resultados: ResultadoData[];
    timestamp: string;
  }) => void;
  error_resultados: (data: { error: string }) => void;
}

// Tipos de eventos del cliente
export interface ClientToServerEvents {
  // Eventos de conexión
  unirse_mesa: (mesa_id: string) => void;

  // Eventos de votación
  emitir_voto: (data: { candidato_id: string; mesa_id: string }) => void;

  // Eventos de resultados
  solicitar_resultados: () => void;
}

// Tipos de datos
export interface VotanteData {
  ci: string;
  nombre: string;
  apellido: string;
  edad: number;
  direccion: string;
}

export interface CandidatoData {
  id: string;
  nombre: string;
  partido: string;
  cargo: string;
  color: string;
}

export interface ResultadoData {
  id: string;
  nombre: string;
  partido: string;
  cargo: string;
  color: string;
  votos: number;
}

// Utilidades para manejar el socket
export const socketUtils = {
  // Conectar el socket
  connect: () => {
    if (!socket.connected) {
      socket.connect();
    }
  },

  // Desconectar el socket
  disconnect: () => {
    if (socket.connected) {
      socket.disconnect();
    }
  },

  // Verificar si está conectado
  isConnected: () => socket.connected,

  // Unirse a una mesa
  joinMesa: (mesaId: string) => {
    socket.emit("unirse_mesa", mesaId);
  },

  // Emitir voto
  emitVoto: (candidatoId: string, mesaId: string) => {
    socket.emit("emitir_voto", { candidato_id: candidatoId, mesa_id: mesaId });
  },

  // Solicitar resultados
  requestResults: () => {
    socket.emit("solicitar_resultados");
  },

  // Configurar listeners de eventos
  setupEventListeners: () => {
    socket.on("connect", () => {
      console.log("🔌 Conectado al servidor:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Desconectado del servidor:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Error de conexión:", error);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Reconectado al servidor, intento:", attemptNumber);
    });

    socket.on("reconnect_error", (error) => {
      console.error("❌ Error de reconexión:", error);
    });

    socket.on("reconnect_failed", () => {
      console.error("❌ Falló la reconexión al servidor");
    });
  },

  // Limpiar listeners
  cleanup: () => {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("connect_error");
    socket.off("reconnect");
    socket.off("reconnect_error");
    socket.off("reconnect_failed");
  },
};

// Estados de conexión
export enum ConnectionStatus {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  RECONNECTING = "reconnecting",
  ERROR = "error",
}

// Hook personalizado para usar con React
export const useSocket = () => {
  return {
    socket,
    ...socketUtils,
  };
};

// Configuración inicial
socketUtils.setupEventListeners();

export default socket;
