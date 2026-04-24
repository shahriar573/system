import { create } from "zustand";
import authApi from "@/lib/api/authApi";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  init: async () => {
    try {
      const { user } = await authApi.me();
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  register: async (email, password, fullName) => {
    const { user } = await authApi.register(email, password, fullName);
    set({ user });
    return user;
  },

  login: async (email, password) => {
    const { user } = await authApi.login(email, password);
    set({ user });
    return user;
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null });
  },

  // Re-fetch user from /auth/me — call after profile update or plan upgrade
  refresh: async () => {
    try {
      const { user } = await authApi.me();
      set({ user });
    } catch {
      set({ user: null });
    }
  },
}));

export default useAuthStore;
