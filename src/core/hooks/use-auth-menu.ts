import { BootstrapResponse } from "../server/types";
import { useAuthStore } from "../stores/auth.store";

type UseAuthMenuReturn = Pick<BootstrapResponse, "user" | "menu" | "permissions"> & {
  roleName: string | null;
};
export function useAuthMenu(): UseAuthMenuReturn {
  const menu = useAuthStore((s) => s.menu);
  const user = useAuthStore((s) => s.user);
  const roleName = useAuthStore((s) => s.roleName);
  const permissions = useAuthStore((s) => s.permissions);

  return {
    menu,
    user,
    roleName,
    permissions
  };
}
