import { Suspense, type ReactElement, type ReactNode } from "react";
import { requireSession } from "@/core/server/auth/session";

type ProtectedContentProps = {
  children: ReactNode;
};

async function ProtectedContent({ children }: ProtectedContentProps): Promise<ReactElement> {
  await requireSession();
  return <>{children}</>;
}

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps): ReactElement {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
          <p className="text-sm text-muted">Verificando sesión...</p>
        </main>
      }
    >
      <ProtectedContent>{children}</ProtectedContent>
    </Suspense>
  );
}
