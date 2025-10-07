import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@utils/apiClient';
import type { AuthUser, UserRole } from '@types/index';

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: 'idle' | 'loading';
  error: string | null;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

const toAuthUser = (payload: LoginResponse['user']): AuthUser => ({
  id: payload.id,
  email: payload.email,
  fullName: payload.fullName,
  role: (payload.role ?? 'user').toLowerCase() as UserRole
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      status: 'idle',
      error: null,
      async login(payload) {
        set({ status: 'loading', error: null });
        try {
          const response = await apiClient<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload)
          }, { authenticated: false });
          const user = toAuthUser(response.user);
          set({
            user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            status: 'idle',
            error: null
          });
          return user;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Не удалось войти';
          set({ status: 'idle', error: message });
          throw error;
        }
      },
      logout() {
        set({ user: null, accessToken: null, refreshToken: null, status: 'idle', error: null });
      },
      setUserRole(role) {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, role } });
      }
    }),
    {
      name: 'minifyai-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken
      })
    }
  )
);

export const selectIsAuthenticated = (state: AuthState) => Boolean(state.accessToken && state.user);
