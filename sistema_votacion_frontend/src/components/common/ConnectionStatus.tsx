// Componente para mostrar el estado de conexión con el servidor

import React from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { useSocket } from '../../hooks';
import { CONNECTION_STATUS_MESSAGES } from '../../models/constants';

interface ConnectionStatusProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  className = '', 
  showText = true,
  size = 'md' 
}) => {
  const { connectionStatus, isConnected } = useSocket();

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: CheckCircleIcon,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          message: CONNECTION_STATUS_MESSAGES.connected
        };
      case 'disconnected':
        return {
          icon: XCircleIcon,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          message: CONNECTION_STATUS_MESSAGES.disconnected
        };
      case 'connecting':
        return {
          icon: ClockIcon,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          message: CONNECTION_STATUS_MESSAGES.connecting
        };
      case 'error':
        return {
          icon: ExclamationTriangleIcon,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          message: CONNECTION_STATUS_MESSAGES.error
        };
      default:
        return {
          icon: ClockIcon,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          message: 'Estado desconocido'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          icon: 'w-4 h-4',
          text: 'text-xs',
          padding: 'px-2 py-1'
        };
      case 'lg':
        return {
          icon: 'w-6 h-6',
          text: 'text-base',
          padding: 'px-4 py-2'
        };
      default:
        return {
          icon: 'w-5 h-5',
          text: 'text-sm',
          padding: 'px-3 py-1.5'
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = getSizeClasses();
  const IconComponent = config.icon;

  return (
    <div 
      className={`
        inline-flex items-center space-x-2 rounded-full border 
        ${config.bgColor} ${config.borderColor} ${sizeClasses.padding}
        ${className}
      `}
      title={config.message}
    >
      <IconComponent 
        className={`${config.color} ${sizeClasses.icon} ${
          connectionStatus === 'connecting' ? 'animate-spin' : ''
        }`} 
      />
      {showText && (
        <span className={`font-medium ${config.color} ${sizeClasses.text}`}>
          {config.message}
        </span>
      )}
    </div>
  );
};

export default ConnectionStatus; 