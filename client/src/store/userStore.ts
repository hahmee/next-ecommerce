import { create } from 'zustand';
import { Member } from '@/interface/Member';
import {MemberPublic} from "@/interface/MemberPublic";

interface UserState {
  user: MemberPublic | null;
  setUser: (user: MemberPublic | null) => void;
  logout: () => void;
  token: string | null;
  setToken: (token: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  token: null,
  setToken: (token) => set({ token }),
}));
