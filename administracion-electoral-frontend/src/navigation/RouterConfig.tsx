import { Routes, Route, Navigate } from 'react-router-dom';
import { URLS } from './CONSTANTS';

// Import pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Secciones from '../pages/Secciones';
import Cargos from '../pages/Cargos';
import Recintos from '../pages/Recintos';
import MesasElectorales from '../pages/MesasElectorales';
import Jurados from '../pages/Jurados';
import Elecciones from '../pages/Elecciones';
import Candidaturas from '../pages/Candidaturas';
import Papeletas from '../pages/Papeletas';

import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const RouterConfig = () => {
    return (
        <Routes>
            <Route path={URLS.LOGIN} element={<Login />} />
            
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path={URLS.DASHBOARD} element={<Dashboard />} />
                    <Route path={URLS.SECCIONES} element={<Secciones />} />
                    <Route path={URLS.CARGOS} element={<Cargos />} />
                    <Route path={URLS.RECINTOS} element={<Recintos />} />
                    <Route path={URLS.MESAS_ELECTORALES} element={<MesasElectorales />} />
                    <Route path={URLS.JURADOS} element={<Jurados />} />
                    <Route path={URLS.ELECCIONES} element={<Elecciones />} />
                    <Route path={URLS.CANDIDATURAS} element={<Candidaturas />} />
                    <Route path={URLS.PAPELETAS} element={<Papeletas />} />
                    <Route path="*" element={<Navigate to={URLS.DASHBOARD} replace />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default RouterConfig; 