import type { ReactElement } from "react";
import WorkspaceClient from "@/core/features/workspace/workspace-client";

const allowedSections = ["equipos", "personas", "proyectos", "mapa", "historial", "reportes", "configuracion"];

type SectionPageProps = { params: Promise<{ section: string }> };

export default async function SectionPage({ params }: SectionPageProps): Promise<ReactElement> {
  const { section } = await params;
  if (!allowedSections.includes(section)) {
    return <main className="min-h-screen bg-background p-10 text-foreground"><h1 className="text-2xl font-bold">Página no encontrada</h1></main>;
  }
  return <WorkspaceClient slug={section} />;
}
