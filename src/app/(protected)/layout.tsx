import { Suspense, type ReactElement, type ReactNode } from "react";
import ProtectedAppShell from "@/components/ProtectedAppShell";
import { requireSession } from "@/core/server/auth/session";

type Props = { children: ReactNode };

export default function ProtectedLayout({ children }: Props): ReactElement {
  return (
    <Suspense fallback={<ProtectedLayoutFallback />}>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </Suspense>
  );
}

async function AuthenticatedLayout({ children }: Props): Promise<ReactElement> {
  const user = await requireSession();
  return <ProtectedAppShell user={user}>{children}</ProtectedAppShell>;
}

function ProtectedLayoutFallback(): ReactElement {
  return (
    <div className="eq-app" aria-busy="true" aria-label="Cargando espacio de trabajo">
      <main className="eq-main">
        <div className="eq-content">
          <p role="status">Cargando espacio de trabajo...</p>
        </div>
      </main>
    </div>
  );
}
