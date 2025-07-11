import { Routes, Route, Navigate } from 'react-router-dom';
import { URLS } from './CONSTANTS';

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import VotantePage from '../pages/VotantePage';
import VontanteVer from '../pages/VotanteVer'
import AdminDashboard from '../pages/AdminDashboard';
import ListaVotantes from '../pages/VotanteListPage'

import ProtectedRoute from '../components/auth/ProtectedRoute';

const RouterConfig = () => {
    return (
        <Routes>
            <Route path={URLS.HOME} element={<HomePage />} />
            <Route path={URLS.LOGIN} element={<LoginPage />} />
            <Route path={URLS.VERVOTANTES} element={<VontanteVer />} />

            <Route element={<ProtectedRoute />}>
                <Route path={URLS.DASHBOARD} element={<AdminDashboard />} />
                <Route path={URLS.VOTANTES} element={<VotantePage />} />
                <Route path={URLS.LISTAVOTANTES} element={<ListaVotantes />} />
            </Route>

            <Route path="*" element={<Navigate to={URLS.HOME} replace />} />
        </Routes>
    );
};

export default RouterConfig; 