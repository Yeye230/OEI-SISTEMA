import { getSessionToken, verifySession } from "@/core/server/auth/session";
import { INVALID_SESSION_REDIRECT_PATH } from "@/core/server/urls";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// cookies() es dato de runtime: con cacheComponents debe leerse dentro de <Suspense>.
const HomeRedirect = async (): Promise<null> => {
  const sessionToken = await getSessionToken();
  const user = await verifySession();

  if (user) {
    redirect("/dashboard");
  }

  if (sessionToken) {
    redirect(INVALID_SESSION_REDIRECT_PATH);
  }

  redirect("/auth/iniciar-sesion");
};

export default function HomePage(): React.JSX.Element {
  return (
    <Suspense>
      <HomeRedirect />
    </Suspense>
  );
}
