// app/(protected)/_components/bootstrap-loader.tsx
"use client";

import { useEffect, useRef } from "react";

import { useAuthStore } from "../stores/auth.store";
import { useBootstrap } from "../hooks/use-bootstrap";

export function BootstrapLoader(): null {
  const { fetchBootstrap } = useBootstrap();
  const hasUser = useAuthStore((s) => s.user !== null);
  const requestStarted = useRef(false);

  useEffect(() => {
    if (hasUser || requestStarted.current) {
      return;
    }

    requestStarted.current = true;
    void fetchBootstrap().catch((error: unknown) => {
      // Avoid an unhandled rejection. A later mount can retry the bootstrap.
      console.error("[BootstrapLoader] No se pudo cargar la sesión inicial:", error);
      requestStarted.current = false;
    });
  }, [hasUser, fetchBootstrap]);

  return null;
}
