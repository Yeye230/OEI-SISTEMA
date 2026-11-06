import { NextResponse } from "next/server";
import { loginSchema } from "@/core/schemas/login.schema";
import { setDemoSessionCookie } from "@/core/server/auth/demo-session";

export async function POST(request: Request): Promise<NextResponse> {
  const body: unknown = await request.json().catch(() => null);
  const validation = loginSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { message: "Ingresa un correo válido y una contraseña." },
      { status: 400 }
    );
  }

  // Modo de demostración: no consulta servicios externos ni bases de datos.
  await setDemoSessionCookie();

  return NextResponse.json({
    success: true,
    message: "Sesión de demostración iniciada."
  });
}
