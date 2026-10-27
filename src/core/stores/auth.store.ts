"use client";

import { create } from "zustand";
import { BootstrapResponse } from '../server/types';

export type AuthState = Pick<BootstrapResponse, "user" | "menu" | "permissions"> & {
  roleName: string | null;
  setBootstrap: (data: BootstrapResponse) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  menu: [],
  permissions: [],
  roleName: null,

  setBootstrap: (data) =>
    set({
      user: data.user,
      menu: data.menu,
      permissions: data.permissions,
      roleName: data.roleName
    }),

  clearAuth: () =>
    set({
      user: null,
      menu: [],
      permissions: [],
      roleName: null
    })
}));
