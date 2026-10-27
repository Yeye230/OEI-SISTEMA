import { NextResponse } from "next/server";
import { AuthResponse, BackendResponse } from "./types";
import { REGISTER_FALLBACK_ERROR } from "./messages";
import { clearSessionCookie, setSessionCookie } from './auth/session-cookie';

export const toBackendRouterResponse = <T>(
  response: Response,
  payload: BackendResponse<T> | null
): NextResponse => {
  const message = payload?.message ?? REGISTER_FALLBACK_ERROR;
  const errors = payload?.errors ?? [];

  return NextResponse.json(
    {
      statusCode: response.status,
      message,
      data: payload?.data,
      errors
    },
    { status: response.status }
  );
};

export const toSessionSuccessResponse = async (
  response: Response,
  payload: BackendResponse<AuthResponse> | null
): Promise<NextResponse> => {
  const token = payload?.data?.token;
  const user = payload?.data?.user;

  if (!token || !user) {
    return toBackendRouterResponse(response, payload);
  }

  await setSessionCookie(token);

  return toBackendRouterResponse(response, payload);
};

export const clearCookieWhenUnauthorized = async (response: Response): Promise<void> => {
  if (response.status === 401) {
    await clearSessionCookie();
  }
};

export const handleRouteError = (context: string, err: unknown): NextResponse => {
  console.log(`[${context}] Route error:`, err);
  return toBackendRouterResponse(
    new Response(null, { status: 500, statusText: `${context}: Internal Server Error` }),
    null
  );
};

export const unauthorizedResponse = (message = "Debes iniciar sesión para continuar."): NextResponse =>
  NextResponse.json({ statusCode: 401, message, data: null, errors: [] }, { status: 401 });
