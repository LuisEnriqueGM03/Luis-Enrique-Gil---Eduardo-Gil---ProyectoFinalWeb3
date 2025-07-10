import React, { useState, useEffect } from 'react';
import { socket, ConnectionStatus } from '../socket';

interface ConnectionStatusProps {
  className?: string;
}

const ConnectionStatusComponent: React.FC<ConnectionStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [lastConnected, setLastConnected] = useState<string>('');

  useEffect(() => {
    // Actualizar estado inicial
    if (socket.connected) {
      setStatus(ConnectionStatus.CONNECTED);
    } else {
      setStatus(ConnectionStatus.DISCONNECTED);
    }

    // Listeners para cambios de estado
    const handleConnect = () => {
      setStatus(ConnectionStatus.CONNECTED);
      setLastConnected(new Date().toLocaleTimeString());
    };

    const handleDisconnect = () => {
      setStatus(ConnectionStatus.DISCONNECTED);
    };

    const handleConnecting = () => {
      setStatus(ConnectionStatus.CONNECTING);
    };

    const handleReconnecting = () => {
      setStatus(ConnectionStatus.RECONNECTING);
    };

    const handleConnectError = () => {
      setStatus(ConnectionStatus.ERROR);
    };

    // Registrar listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('reconnect_attempt', handleReconnecting);

    // Cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('reconnect_attempt', handleReconnecting);
    };
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case ConnectionStatus.CONNECTED:
        return {
          text: 'Conectado',
          color: 'status-connected',
          icon: '🟢',
          description: lastConnected ? `Última conexión: ${lastConnected}` : 'Conectado al servidor'
        };
      case ConnectionStatus.CONNECTING:
        return {
          text: 'Conectando...',
          color: 'status-waiting',
          icon: '🟡',
          description: 'Estableciendo conexión con el servidor'
        };
      case ConnectionStatus.RECONNECTING:
        return {
          text: 'Reconectando...',
          color: 'status-waiting',
          icon: '🔄',
          description: 'Intentando reconectar al servidor'
        };
      case ConnectionStatus.ERROR:
        return {
          text: 'Error de conexión',
          color: 'status-disconnected',
          icon: '🔴',
          description: 'No se pudo conectar al servidor'
        };
      default:
        return {
          text: 'Desconectado',
          color: 'status-disconnected',
          icon: '🔴',
          description: 'Sin conexión al servidor'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm" title={statusInfo.description}>
        {statusInfo.icon}
      </span>
      <span className={`text-sm font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    </div>
  );
};

export default ConnectionStatusComponent; 