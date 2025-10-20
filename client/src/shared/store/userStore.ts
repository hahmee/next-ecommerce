// src/shared/store/userStore.ts

import { create } from 'zustand';

import { MemberPublic } from '@/entities/member/model/MemberPublic';

interface UserState {
  user: MemberPublic | null;
  setUser: (user: MemberPublic | null) => void;
  resetUser: () => void;
  token: string | null;
  setToken: (token: string) => void;
  isSessionExpired: boolean;
  setSessionExpired: () => void;
  clearSessionExpired: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),
  token: null,
  setToken: (token) => set({ token }),
  isSessionExpired: false,
  setSessionExpired: () => set({ isSessionExpired: true }),
  clearSessionExpired: () => set({ isSessionExpired: false }),
}));
