import { BaseApiService } from "./baseApi";
import { LoginRequest } from "../models/dto/LoginRequest";
import { LoginResponse } from "../models/dto/LoginResponse";
import { UserInfoResponse } from "../models/dto/UserInfoResponse";

export class AuthService extends BaseApiService {
    async login(loginData: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/Auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*',
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                throw new Error('Credenciales inválidas');
            }

            const data = await response.json();
            localStorage.setItem('auth_token', data.token);
            return data;
        } catch (error) {
            throw new Error('Error al iniciar sesión: ' + (error as Error).message);
        }
    }

    async getCurrentUser(): Promise<UserInfoResponse> {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const payload = this.decodeJwtToken(token);
            return {
                id: parseInt(payload.nameid),
                nombre: payload.unique_name,
                email: payload.email,
                rol: payload.role
            };
        } catch (error) {
            throw new Error('Error al obtener información del usuario: ' + (error as Error).message);
        }
    }

    private decodeJwtToken(token: string): any {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            throw new Error('Token inválido');
        }
    }

    async logout(): Promise<void> {
        try {
            const token = localStorage.getItem('auth_token');
            if (token) {
                await fetch(`${this.BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            localStorage.removeItem('auth_token');
        }
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('auth_token');
    }

    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }
}

export const authService = new AuthService();
export default authService; 