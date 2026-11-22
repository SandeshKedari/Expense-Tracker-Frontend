import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import type { AuthResponse, AuthUser } from '../../types/auth';

interface AuthState {
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  error: string | null;
}
const initialState: AuthState = { user: null, status: 'idle', error: null };

export const fetchMe = createAsyncThunk<AuthUser>('auth/me', async () => {
  const { data } = await api.get<AuthResponse>('/auth/me');
  return data.user;
});
export const login = createAsyncThunk<AuthUser, { email: string; password: string }>(
  'auth/login', async (credentials) => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data.user;
  },
);
export const register = createAsyncThunk<AuthUser, { name: string; email: string; password: string }>(
  'auth/register', async (payload) => {
    await api.post('/auth/register', payload);
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email: payload.email, password: payload.password,
    });
    return data.user;
  },
);
export const logout = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { clearAuthError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchMe.fulfilled, (state, action) => { state.user = action.payload; state.status = 'authenticated'; })
      .addCase(fetchMe.rejected, (state) => { state.user = null; state.status = 'unauthenticated'; })
      .addCase(login.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.user = action.payload; state.status = 'authenticated'; })
      .addCase(login.rejected, (state, action) => { state.status = 'unauthenticated'; state.error = action.error.message || 'Login failed'; })
      .addCase(register.fulfilled, (state, action) => { state.user = action.payload; state.status = 'authenticated'; })
      .addCase(register.rejected, (state, action) => { state.error = action.error.message || 'Registration failed'; })
      .addCase(logout.fulfilled, (state) => { state.user = null; state.status = 'unauthenticated'; });
  },
});
export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
