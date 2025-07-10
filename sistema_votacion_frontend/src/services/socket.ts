// Servicio Socket.IO para comunicación en tiempo real

import { io, Socket } from "socket.io-client";
import {
  VotanteData,
  CandidatoData,
  ResultadosData,
  ConnectionStatus,
} from "../types";
import { API_CONFIG, SOCKET_EVENTS } from "../models/constants";

class SocketService {
  private socket: Socket | null = null;
  private connectionStatus: ConnectionStatus = "disconnected";
  private statusCallbacks: Set<(status: ConnectionStatus) => void> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket(): void {
    this.socket = io(API_CONFIG.SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket", "polling"],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Eventos de conexión
    this.socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log("🔌 Socket conectado:", this.socket?.id);
      this.setConnectionStatus("connected");
      this.reconnectAttempts = 0;
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log("🔌 Socket desconectado:", reason);
      this.setConnectionStatus("disconnected");
    });

    this.socket.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
      console.error("❌ Error de conexión Socket:", error);
      this.setConnectionStatus("error");
      this.reconnectAttempts++;
    });

    // Eventos de reconexión
    this.socket.on("reconnect", (attempt) => {
      console.log("🔄 Socket reconectado en intento:", attempt);
      this.setConnectionStatus("connected");
    });

    this.socket.on("reconnect_attempt", (attempt) => {
      console.log("🔄 Intento de reconexión:", attempt);
      this.setConnectionStatus("connecting");
    });

    this.socket.on("reconnect_failed", () => {
      console.error("❌ Falló la reconexión del socket");
      this.setConnectionStatus("error");
    });
  }

  private setConnectionStatus(status: ConnectionStatus): void {
    if (this.connectionStatus !== status) {
      this.connectionStatus = status;
      this.statusCallbacks.forEach((callback) => callback(status));
    }
  }

  // Gestión de conexión
  connect(): void {
    if (!this.socket) {
      this.initializeSocket();
    }

    if (this.socket && !this.socket.connected) {
      console.log("🔌 Conectando socket...");
      this.setConnectionStatus("connecting");
      this.socket.connect();
    }
  }

  disconnect(): void {
    if (this.socket) {
      console.log("🔌 Desconectando socket...");
      this.socket.disconnect();
      this.setConnectionStatus("disconnected");
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  // Gestión de listeners de estado
  onStatusChange(callback: (status: ConnectionStatus) => void): () => void {
    this.statusCallbacks.add(callback);

    // Retornar función para remover el listener
    return () => {
      this.statusCallbacks.delete(callback);
    };
  }

  // Eventos del sistema de votación
  joinMesa(mesaId: string): void {
    if (!this.socket) return;

    console.log("🏛️ Uniéndose a mesa:", mesaId);
    this.socket.emit(SOCKET_EVENTS.UNIRSE_MESA, mesaId);
  }

  emitVoto(candidatoId: number, mesaId: string): void {
    if (!this.socket) return;

    console.log("🗳️ Emitiendo voto:", { candidatoId, mesaId });
    this.socket.emit(SOCKET_EVENTS.EMITIR_VOTO, {
      candidato_id: candidatoId,
      mesa_id: mesaId,
    });
  }

  // Listeners para eventos de votación
  onHabilitarPapeleta(
    callback: (data: {
      votante: VotanteData;
      candidatos: CandidatoData[];
      timestamp: string;
    }) => void
  ): () => void {
    if (!this.socket) return () => {};

    this.socket.on(SOCKET_EVENTS.HABILITAR_PAPELETA, callback);

    return () => {
      this.socket?.off(SOCKET_EVENTS.HABILITAR_PAPELETA, callback);
    };
  }

  onVotoExitoso(
    callback: (data: {
      mensaje: string;
      voto_id: string;
      timestamp: string;
    }) => void
  ): () => void {
    if (!this.socket) return () => {};

    this.socket.on(SOCKET_EVENTS.VOTO_EXITOSO, callback);

    return () => {
      this.socket?.off(SOCKET_EVENTS.VOTO_EXITOSO, callback);
    };
  }

  onPapeletaCerrada(
    callback: (data: { mensaje: string; timestamp: string }) => void
  ): () => void {
    if (!this.socket) return () => {};

    this.socket.on(SOCKET_EVENTS.PAPELETA_CERRADA, callback);

    return () => {
      this.socket?.off(SOCKET_EVENTS.PAPELETA_CERRADA, callback);
    };
  }

  onResultadosActualizados(
    callback: (data: {
      resultados: ResultadosData[];
      timestamp: string;
    }) => void
  ): () => void {
    if (!this.socket) return () => {};

    this.socket.on(SOCKET_EVENTS.RESULTADOS_ACTUALIZADOS, callback);

    return () => {
      this.socket?.off(SOCKET_EVENTS.RESULTADOS_ACTUALIZADOS, callback);
    };
  }

  onErrorVoto(callback: (data: { error: string }) => void): () => void {
    if (!this.socket) return () => {};

    this.socket.on(SOCKET_EVENTS.ERROR_VOTO, callback);

    return () => {
      this.socket?.off(SOCKET_EVENTS.ERROR_VOTO, callback);
    };
  }

  // Método genérico para eventos personalizados
  on<T>(event: string, callback: (data: T) => void): () => void {
    if (!this.socket) return () => {};

    this.socket.on(event, callback);

    return () => {
      this.socket?.off(event, callback);
    };
  }

  emit(event: string, data?: any): void {
    if (!this.socket) return;

    this.socket.emit(event, data);
  }

  // Limpieza
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.setupEventListeners(); // Mantener los listeners de conexión
    }
  }

  destroy(): void {
    this.removeAllListeners();
    this.disconnect();
    this.statusCallbacks.clear();
    this.socket = null;
  }
}

// Instancia singleton del servicio
export const socketService = new SocketService();

// Re-exportar para compatibilidad
export const socket = socketService;

export default socketService;
