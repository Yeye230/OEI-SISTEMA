/**
 * Shared session-cookie configuration.
 *
 * Keep this module free of Next.js server-only APIs so it can be consumed by
 * both the Next.js proxy and server-side session helpers.
 */
export const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME ?? process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME ?? "session_token";
