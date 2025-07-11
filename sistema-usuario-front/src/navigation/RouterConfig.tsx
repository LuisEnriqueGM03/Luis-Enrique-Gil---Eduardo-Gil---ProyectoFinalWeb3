import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { URLS } from './CONSTANTS';

import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import UsuariosPage from '../pages/UsuariosPage';
import PerfilPage from '../pages/PerfilPage';

import Layout from '../components/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const RouterConfig = () => {
    return (
        <Routes>
        
            <Route path={URLS.LOGIN} element={<LoginPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout><Outlet /></Layout>}>
                    <Route path={URLS.DASHBOARD} element={<DashboardPage />} />
                    <Route path={URLS.USUARIOS} element={<UsuariosPage />} />
                    <Route path={URLS.PERFIL} element={<PerfilPage />} />
                    <Route path="*" element={<Navigate to={URLS.DASHBOARD} replace />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default RouterConfig; 