"use client";

import { useCallback } from "react";
import { BOOTSTRAP_API_URL } from "../server/urls";
import { BackendResponse, BootstrapResponse } from '../server/types';
import { useAuthStore } from '../stores/auth.store';

export const useBootstrap = (): {
  fetchBootstrap: () => Promise<void>;
} => {
  const setBootstrap = useAuthStore((s) => s.setBootstrap);

  const fetchBootstrap = useCallback(async (): Promise<void> => {
    const res = await fetch(BOOTSTRAP_API_URL, {
      method: "GET",
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error(`Bootstrap failed with status ${res.status}`);
    }

    const payload = (await res.json()) as BackendResponse<BootstrapResponse>;

    if (!payload.data) {
      throw new Error("Bootstrap response missing data");
    }

    setBootstrap(payload.data);
  }, [setBootstrap]);

  return { fetchBootstrap };
};
