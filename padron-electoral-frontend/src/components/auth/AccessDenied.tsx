import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AccessDenied: React.FC = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <Shield className="w-8 h-8 text-red-600" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Permisos Insuficientes
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Tu cuenta ({user?.email}) no tiene el rol de <strong>Admin Padron</strong> requerido para acceder a este sistema.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="flex items-center justify-center mb-6">
                        <AlertTriangle className="w-12 h-12 text-yellow-500" />
                    </div>
                    
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Permisos Insuficientes
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Tu cuenta ({user?.email}) no tiene el rol de <strong>Admin Padron</strong> requerido para acceder a este sistema.
                        </p>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        Rol Actual: {user?.rol || 'Sin rol'}
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>
                                            Se requiere el rol <strong>Admin Padron</strong> para acceder al sistema.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied; 