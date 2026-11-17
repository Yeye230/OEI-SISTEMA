"use client";

import { useState, type FormEvent, type ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

type ProjectId = "docentes" | "directores";
type ActaRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  numero: string;
  tipo: string;
  responsable: string;
  proyectoId: ProjectId;
  fecha: string;
  codigo: string;
  marca: string;
  modelo: string;
  serie: string;
  mouse: string;
  modem: string;
  simBarra: string;
  audifonos: string;
  cargadorLaptop: string;
  mochila: string;
  accesorios: string;
  observaciones: string;
};
const storageKey = "oei-demo:actas:v1";
const controlClass = "min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm";

export default function ActaFormClient(): ReactElement {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (name: string): string => String(data.get(name) ?? "").trim();
    const records: ActaRecord[] = (() => {
      try {
        const parsed: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
        return Array.isArray(parsed) ? parsed as ActaRecord[] : [];
      } catch {
        return [];
      }
    })();
    const now = new Date().toISOString();
    const record: ActaRecord = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      numero: value("numero"),
      tipo: value("tipo"),
      responsable: value("responsable"),
      proyectoId: value("proyectoId") as ProjectId,
      fecha: value("fecha"),
      codigo: value("codigo"),
      marca: value("marca"),
      modelo: value("modelo"),
      serie: value("serie"),
      mouse: value("mouse"),
      modem: value("modem"),
      simBarra: value("simBarra"),
      audifonos: value("audifonos"),
      cargadorLaptop: value("cargadorLaptop"),
      mochila: value("mochila"),
      accesorios: value("accesorios"),
      observaciones: value("observaciones")
    };

    if (!record.numero || !record.tipo || !record.responsable || !record.fecha ||
      !["docentes", "directores"].includes(record.proyectoId)) {
      setMessage("Completa todos los campos obligatorios, incluido el proyecto.");
      return;
    }
    if (records.some((item) => item.numero.toLowerCase() === record.numero.toLowerCase())) {
      setMessage("Ya existe un acta con ese número.");
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify([record, ...records]));
    window.dispatchEvent(new Event("oei-workspace-change"));

    const historyKey = "oei-demo:historial:v1";
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(historyKey) ?? "[]");
      const history = Array.isArray(parsed) ? parsed as Array<Record<string, string>> : [];
      history.unshift({
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        fecha: now.slice(0, 10),
        accion: "Creación",
        modulo: "Actas",
        responsable: record.responsable,
        proyectoId: record.proyectoId,
        proyecto: record.proyectoId === "docentes" ? "Docentes" : "Directores",
        detalle: `Acta ${record.numero} · ${record.tipo}`
      });
      window.localStorage.setItem(historyKey, JSON.stringify(history));
    } catch {
      /* El registro del acta no depende del historial. */
    }
    window.dispatchEvent(new Event("oei-workspace-change"));
    router.push("/actas");
  };

  const yesNoOptions = (name: string, label: string): ReactElement => (
    <label>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <select name={name} defaultValue="No" className={controlClass}>
        <option value="No">No</option>
        <option value="Sí">Sí</option>
      </select>
    </label>
  );

  return (
    <section className="eq-module-page">
      <header className="eq-heading-row">
        <div>
          <div className="eq-breadcrumb"><span>OEI El Salvador</span><i>›</i><strong>Nueva acta</strong></div>
          <h1>Nueva acta de entrega</h1>
          <p className="eq-subtitle">Completa los datos del equipo y de la persona destinataria.</p>
        </div>
      </header>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <Link href="/actas" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft size={16} /> Volver a actas
        </Link>
        <form onSubmit={submit} className="space-y-6 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7">
          <section>
            <h2 className="text-lg font-semibold">Datos del acta</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-1.5 block text-sm font-medium">Número de acta *</span>
                <input name="numero" required className={controlClass} />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium">Proyecto interno *</span>
                <select name="proyectoId" required defaultValue="" className={controlClass}>
                  <option value="" disabled>Seleccionar proyecto...</option>
                  <option value="docentes">Docentes</option>
                  <option value="directores">Directores</option>
                </select>
                <span className="mt-1 block text-xs text-muted">Este dato solo organiza las actas dentro del sistema; no aparecerá en el Word oficial.</span>
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium">Equipo *</span>
                <select name="tipo" required defaultValue="" className={controlClass}>
                  <option value="" disabled>Seleccionar...</option>
                  <option>Laptop</option>
                  <option>Tablet</option>
                  <option>Proyector</option>
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium">Fecha de entrega *</span>
                <input name="fecha" type="date" required className={controlClass} />
              </label>
            </div>
          </section>

          <section className="border-t border-border pt-5">
            <h2 className="text-lg font-semibold">Datos del equipo</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-1.5 block text-sm font-medium">Código de inventario</span>
                <input name="codigo" className={controlClass} />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium">Marca</span>
                <input name="marca" className={controlClass} />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium">Modelo</span>
                <input name="modelo" className={controlClass} />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium">N.º Serial</span>
                <input name="serie" className={controlClass} />
              </label>
            </div>
          </section>

          <section className="border-t border-border pt-5">
            <h2 className="text-lg font-semibold">Accesorios y complementos</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {yesNoOptions("mouse", "Mouse")}
              {yesNoOptions("modem", "Módem")}
              <label>
                <span className="mb-1.5 block text-sm font-medium">SIM Barra</span>
                <input name="simBarra" placeholder="Número o identificación de SIM" className={controlClass} />
              </label>
              {yesNoOptions("audifonos", "Audífonos")}
              {yesNoOptions("cargadorLaptop", "Cargador de laptop")}
              {yesNoOptions("mochila", "Mochila")}
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium">Accesorios adicionales</span>
                <textarea name="accesorios" rows={3} className="w-full rounded-xl border border-border bg-background p-3 text-sm" />
              </label>
            </div>
          </section>

          <section className="border-t border-border pt-5">
            <h2 className="text-lg font-semibold">Persona destinataria</h2>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium">Nombre completo *</span>
              <input name="responsable" required className={controlClass} />
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium">Observaciones</span>
              <textarea name="observaciones" rows={3} className="w-full rounded-xl border border-border bg-background p-3 text-sm" />
            </label>
          </section>

          {message && <p role="alert" className="rounded-xl bg-danger-soft p-3 text-sm">{message}</p>}
          <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <Link href="/actas" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold">Cancelar</Link>
            <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">
              <Save size={16} /> Guardar acta
            </button>
          </div>
        </form>
        <p className="text-xs text-muted">Esta versión de demostración guarda los registros en este navegador. La generación del Word oficial y la conexión a la base de datos se integrarán en sus siguientes etapas.</p>
      </div>
    </section>
  );
}
