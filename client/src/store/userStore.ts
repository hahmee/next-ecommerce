import { create } from 'zustand';
import { Member } from '@/interface/Member';

interface UserState {
  user: Member | null;
  setUser: (user: Member | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
