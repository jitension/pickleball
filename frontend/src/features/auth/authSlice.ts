import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    profile: {
        skill_level: string;
        status: string;
        avatar: string | null;
        stats?: Record<string, unknown>;
    };
}

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
}

const initialState: AuthState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; access: string; refresh: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.access;
            state.refreshToken = action.payload.refresh;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.access);
            localStorage.setItem('refreshToken', action.payload.refresh);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => !!state.auth.token;
