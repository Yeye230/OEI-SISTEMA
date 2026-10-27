export const APP_ROLES = {
  admin: "ADMIN",
  user: "USER"
} as const;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];
