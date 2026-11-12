import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "oei_demo_session";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 8
};

export async function POST(): Promise<NextResponse> {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "El modo demostración está deshabilitado." }, { status: 404 });
  }
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "local-demo", COOKIE_OPTIONS);
  return NextResponse.json({ message: "Sesión de demostración iniciada." });
}

export async function DELETE(): Promise<NextResponse> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", { ...COOKIE_OPTIONS, maxAge: 0 });
  return NextResponse.json({ message: "Sesión cerrada." });
}
