import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserInfoResponse } from '../../models/dto/UserInfoResponse';
import { authService } from '../../services/authService';
import type { LoginRequest } from '../../models/dto/LoginRequest';

interface AuthState {
    user: UserInfoResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async (loginData: LoginRequest, { rejectWithValue }) => {
        try {
            const response = await authService.login(loginData);
            const userInfo = await authService.getCurrentUser();
            return userInfo;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);



export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            return await authService.getCurrentUser();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        }
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });



        // Get Current User
        builder
            .addCase(getCurrentUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload as string;
            });

        // Logout
        builder
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            });
    }
});

export const { clearError, setAuthenticated } = authSlice.actions;
export default authSlice.reducer; 