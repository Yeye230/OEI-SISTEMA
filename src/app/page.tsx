import { redirect } from "next/navigation";
import { hasDemoSession } from "@/core/server/auth/demo-session";

export default async function HomePage(): Promise<null> {
  const hasSession = await hasDemoSession();
  redirect(hasSession ? "/dashboard" : "/login");
}
