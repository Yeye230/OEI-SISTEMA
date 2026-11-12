import type { ReactElement } from "react";
import SectionLayout from "@/components/SectionLayout";
import WorkspaceClient from "@/core/features/workspace/workspace-client";\nimport LocationMap from "@/core/features/workspace/location-map";

const sectionDetails: Record<string, { title: string; description: string }> = {
  equipos: { title: "Equipos", description: "Controla el inventario institucional y el estado de cada equipo." },
  personas: { title: "Personas", description: "Administra responsables y colaboradores." },
  proyectos: { title: "Proyectos", description: "Da seguimiento a proyectos y responsables." },
  mapa: { title: "Mapa territorial", description: "Consulta ubicaciones registradas en esta demostración." },
  historial: { title: "Historial", description: "Revisa los movimientos registrados localmente." },
  reportes: { title: "Reportes", description: "Prepara y exporta reportes de la información capturada." },
  configuracion: { title: "Configuración", description: "Administra las preferencias de esta demostración." }
};

type SectionPageProps = { params: Promise<{ section: string }> };

export default async function SectionPage({ params }: SectionPageProps): Promise<ReactElement> {
  const { section } = await params;
  const details = sectionDetails[section];
  if (!details) {
    return <main className="min-h-screen bg-background p-10 text-foreground"><h1 className="text-2xl font-bold">Página no encontrada</h1></main>;
  }
  return <SectionLayout title={details.title} subtitle={details.description}>{section === "mapa" && <LocationMap />}<WorkspaceClient slug={section} /></SectionLayout>;
}
