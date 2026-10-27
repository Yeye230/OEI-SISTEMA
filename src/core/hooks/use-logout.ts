"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/auth.store";
import { LOGOUT_API_URL } from "../server/urls";

export const useLogout = (): {
  logout: () => Promise<void>;
} => {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const logout = async (): Promise<void> => {
    try {
      const res = await fetch(LOGOUT_API_URL, {
        method: "POST",
        cache: "no-store"
      });

      if (!res.ok) {
        throw new Error(`Logout failed with status ${res.status}`);
      }

      clearAuth();
      router.push("/auth/iniciar-sesion");
      router.refresh();
    } catch (err) {
      clearAuth();
      throw err;
    }
  };

  return { logout };
};
