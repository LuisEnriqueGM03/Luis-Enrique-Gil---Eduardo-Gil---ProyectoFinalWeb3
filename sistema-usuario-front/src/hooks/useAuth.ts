import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginUser, logoutUser, getCurrentUser, clearError } from "../redux/slices/authSlice";
import type { LoginRequest } from "../models/dto/LoginRequest";

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

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

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token && !isAuthenticated) {
            dispatch(getCurrentUser());
        }
    }, [dispatch, isAuthenticated]);

    const hasAdminRole = user?.rol === 'SuperAdministrador';

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
