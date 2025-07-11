import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginUser, logoutUser, getCurrentUser, clearError } from "../redux/slices/authSlice";
import type { LoginRequest } from "../models/dto/LoginRequest";
import type { RootState } from "../redux/store";

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, isLoading, error } = useAppSelector((state: RootState) => state.auth);

    const doLogin = async (loginData: LoginRequest) => {
        try {
            await dispatch(loginUser(loginData)).unwrap();
            return true;
        } catch (error) {
            return false;
        }
    };

    const doLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            return true;
        } catch (error) {
            return false;
        }
    };

    const clearAuthError = () => {
        dispatch(clearError());
    };

    // Verificar autenticación y rol al cargar la aplicación
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token && !isAuthenticated) {
            dispatch(getCurrentUser());
        }
    }, [dispatch, isAuthenticated]);

    // Verificar si el usuario tiene el rol correcto
    const hasAdminRole = user?.rol === 'adminPadron';

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        hasAdminRole,
        login: doLogin,
        logout: doLogout,
        clearError: clearAuthError
    };
};
