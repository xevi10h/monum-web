'use client';
import IUser from '@/shared/interfaces/IUser';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
  user: IUser;
  setUser: (user: IUser) => void;
  deleteUser: () => void;
  getUser: () => IUser;
}

export const undefinedUser: IUser = {
  id: '',
  email: '',
  username: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: '',
  photo: '',
  googleId: '',
  token: '',
  hasPassword: false,
  language: 'en_US',
  permissions: [],
  websiteUrl: '',
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: undefinedUser,
      setUser: (user: IUser) => set({ user }),
      deleteUser: () => set({ user: undefinedUser }),
      getUser: () => get().user,
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
