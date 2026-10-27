import { AppRole } from './rolres';

export type AppUser = {
  id: number | string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string; // ISO date string
  updatedAt: string;
  lastLoginDate: string | null;
  roleId: number;
  roleName: AppRole;
};
export interface BackendResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  errors?: string[];
}

export type AuthResponse = {
  token: string;
  redirect: boolean;
  url?: string;
  user: Pick<AppUser, "id" | "name" | "email" | "image" | "roleId">;
};

export interface AuthorizationPermission {
  resource: string;
  action: string;
}

export interface MenuItem {
  id: number;
  title: string;
  path: string;
  icon?: string;
  sub?: string;
  order: number;
  parentId?: number | null;
  Children?: MenuItem[];
}

export interface BootstrapResponse {
  user: Pick<AppUser, "id" | "name" | "email" | "image" | "roleId"> | null;
  roleName: AppRole;
  permissions: AuthorizationPermission[];
  menu: MenuItem[];
}
