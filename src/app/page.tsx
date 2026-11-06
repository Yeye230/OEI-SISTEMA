import { Suspense } from "react";
import { redirect } from "next/navigation";
import { hasDemoSession } from "@/core/server/auth/demo-session";

async function HomeRedirect(): Promise<null> {
  const hasSession = await hasDemoSession();
  redirect(hasSession ? "/dashboard" : "/login");
}

export default function HomePage(): React.JSX.Element {
  return (
    <Suspense fallback={<main className="min-h-screen" aria-label="Cargando" />}>
      <HomeRedirect />
    </Suspense>
  );
}
