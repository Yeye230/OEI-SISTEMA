/*
 API endpoints
*/
export const REGISTER_API_URL = "/api/auth/register";
export const DEFAULT_AUTH_REDIRECT_PATH = "/auth/iniciar-sesion";
export const INVALID_SESSION_REDIRECT_PATH = "/api/auth/session/reset?redirect=/auth/iniciar-sesion";
export const LOGIN_API_URL = "/api/auth/login";

/**
 * FORGOT_PASSWORD
 */
export const FORGOT_PASSWORD_RESET_EMAIL_OTP_API_URL = "/api/auth/forgot-password/verify-email";
export const FORGOT_PASSWORD_CHECK_API_URL = "/api/auth/forgot-password/verify-code";
export const FORGOT_PASSWORD_API_URL = "/api/auth/forgot-password";

export const BOOTSTRAP_API_URL = "/api/auth/bootstrap";

export const LOGOUT_API_URL = "/api/auth/logout";