"use client";

import { useState, type FormEvent, type ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

type ActaRecord = { id: string; createdAt: string; updatedAt: string; numero: string; tipo: string; responsable: string; proyecto: string; fecha: string; codigo: string; serie: string; observaciones: string };
const storageKey = "oei-demo:actas:v1";

export default function ActaFormClient(): ReactElement {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(data.entries());
    const records: ActaRecord[] = (() => { try { const parsed: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]"); return Array.isArray(parsed) ? parsed as ActaRecord[] : []; } catch { return []; } })();
    const now = new Date().toISOString();
    const record: ActaRecord = { id: crypto.randomUUID(), createdAt: now, updatedAt: now, numero: String(values.numero ?? "").trim(), tipo: String(values.tipo ?? ""), responsable: String(values.responsable ?? "").trim(), proyecto: String(values.proyecto ?? "").trim(), fecha: String(values.fecha ?? ""), codigo: String(values.codigo ?? "").trim(), serie: String(values.serie ?? "").trim(), observaciones: String(values.observaciones ?? "").trim() };
    if (!record.numero || !record.responsable || !record.fecha) { setMessage("Completa el número, responsable y fecha."); return; }
    if (records.some((item) => item.numero.toLowerCase() === record.numero.toLowerCase())) { setMessage("Ya existe un acta con ese número."); return; }
    window.localStorage.setItem(storageKey, JSON.stringify([record, ...records]));
    window.dispatchEvent(new Event("oei-workspace-change"));
    router.push("/actas");
  };
  return <section className="eq-module-page">
    <header className="eq-heading-row"><div><div className="eq-breadcrumb"><span>OEI El Salvador</span><i>›</i><strong>Nueva acta</strong></div><h1>Nueva acta de entrega</h1><p className="eq-subtitle">Completa la información del equipo y de la persona que lo recibe.</p></div></header>
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Link href="/actas" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft size={16} /> Volver a actas</Link>
      <form onSubmit={submit} className="space-y-6 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7">
        <section><h2 className="text-lg font-semibold">Datos del acta</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label><span className="mb-1.5 block text-sm font-medium">Número de acta *</span><input name="numero" required className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" /></label>
          <label><span className="mb-1.5 block text-sm font-medium">Tipo de equipo *</span><select name="tipo" required className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"><option value="">Seleccionar...</option><option>Laptop</option><option>Tablet</option><option>Proyector</option></select></label>
          <label><span className="mb-1.5 block text-sm font-medium">Fecha de entrega *</span><input name="fecha" type="date" required className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" /></label>
          <label><span className="mb-1.5 block text-sm font-medium">Proyecto</span><input name="proyecto" className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" /></label>
        </div></section>
        <section className="border-t border-border pt-5"><h2 className="text-lg font-semibold">Equipo entregado</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label><span className="mb-1.5 block text-sm font-medium">Código de inventario</span><input name="codigo" className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" /></label>
          <label><span className="mb-1.5 block text-sm font-medium">Número de serie</span><input name="serie" className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" /></label>
        </div></section>
        <section className="border-t border-border pt-5"><h2 className="text-lg font-semibold">Persona que recibe</h2>
          <label className="mt-4 block"><span className="mb-1.5 block text-sm font-medium">Nombre completo *</span><input name="responsable" required className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" /></label>
          <label className="mt-4 block"><span className="mb-1.5 block text-sm font-medium">Observaciones</span><textarea name="observaciones" rows={4} className="w-full rounded-xl border border-border bg-background p-3 text-sm" /></label>
        </section>
        {message && <p role="alert" className="rounded-xl bg-danger-soft p-3 text-sm">{message}</p>}
        <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end"><Link href="/actas" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold">Cancelar</Link><button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"><Save size={16} /> Guardar acta</button></div>
      </form>
      <p className="text-xs text-muted">Esta acta de demostración se almacena en el navegador. No genera un documento institucional firmado ni se envía al servidor.</p>
    </div>
  </section>;
}
