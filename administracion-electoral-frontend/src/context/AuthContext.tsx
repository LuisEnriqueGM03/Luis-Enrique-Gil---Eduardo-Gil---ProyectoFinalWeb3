import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User } from '../types';

// Auth action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'INITIALIZE'; payload: { user: User | null; isAuthenticated: boolean } };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'INITIALIZE':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
        isLoading: false,
      };
    default:
      return state;
  }
}

// Auth context type
interface AuthContextType {
  state: AuthState;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userString = localStorage.getItem('auth_user');
        
        if (token && userString) {
          const user = JSON.parse(userString) as User;
          dispatch({
            type: 'INITIALIZE',
            payload: { user, isAuthenticated: true }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: { user: null, isAuthenticated: false }
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        dispatch({
          type: 'INITIALIZE',
          payload: { user: null, isAuthenticated: false }
        });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // For now, we'll use a simple mock authentication
      // In a real app, this would call the API
      if (username === 'admin' && password === 'admin123') {
        const mockUser: User = {
          id: 1,
          username: 'admin',
          email: 'admin@electoral.com',
          is_staff: true,
          is_superuser: true,
        };

        // Store auth data
        localStorage.setItem('auth_token', 'mock-jwt-token');
        localStorage.setItem('auth_user', JSON.stringify(mockUser));

        dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Clear stored auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    dispatch({ type: 'LOGOUT' });
  };

  const contextValue: AuthContextType = {
    state,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext; 