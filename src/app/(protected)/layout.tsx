import type { ReactElement, ReactNode } from "react";
import { requireSession } from "@/core/server/auth/session";
import ProtectedAppShell from "@/components/ProtectedAppShell";

type Props = { children: ReactNode };

export default async function ProtectedLayout({ children }: Props): Promise<ReactElement> {
  const user = await requireSession();
  return <ProtectedAppShell user={user}>{children}</ProtectedAppShell>;
}
