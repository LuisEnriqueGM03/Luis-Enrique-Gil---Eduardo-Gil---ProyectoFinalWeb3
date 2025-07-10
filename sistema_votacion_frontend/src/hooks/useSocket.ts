// Custom hook para manejar la conexión Socket.IO

import { useEffect, useState, useCallback } from "react";
import { socketService } from "../services/socket";
import { ConnectionStatus } from "../types";

interface UseSocketReturn {
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  connect: () => void;
  disconnect: () => void;
  joinMesa: (mesaId: string) => void;
  emitVoto: (candidatoId: number, mesaId: string) => void;
}

export const useSocket = (): UseSocketReturn => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    socketService.getConnectionStatus()
  );

  useEffect(() => {
    // Suscribirse a cambios de estado de conexión
    const unsubscribe = socketService.onStatusChange(setConnectionStatus);

    // Cleanup
    return unsubscribe;
  }, []);

  const connect = useCallback(() => {
    socketService.connect();
  }, []);

  const disconnect = useCallback(() => {
    socketService.disconnect();
  }, []);

  const joinMesa = useCallback((mesaId: string) => {
    socketService.joinMesa(mesaId);
  }, []);

  const emitVoto = useCallback((candidatoId: number, mesaId: string) => {
    socketService.emitVoto(candidatoId, mesaId);
  }, []);

  return {
    isConnected: connectionStatus === "connected",
    connectionStatus,
    connect,
    disconnect,
    joinMesa,
    emitVoto,
  };
};
