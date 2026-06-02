import { create } from 'zustand';
import api from '../../api/client';
import type { IUser } from '../../shared/types';

interface AuthState {
  user: IUser | null;
  token: string | null;
  setUser: (user: IUser) => void;
  setAuth: (user: IUser, token: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),

  setUser: (user) => set({ user }),

  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  fetchUser: async () => {
    const { token, user } = get();
    if (!token || user) return;
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data });
    } catch {
      get().logout();
    }
  },
}));
