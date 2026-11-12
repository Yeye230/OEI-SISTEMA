"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import "leaflet/dist/leaflet.css";

type LocationRecord = { id: string; nombre?: string; departamento?: string; municipio?: string; referencia?: string; latitud?: string; longitud?: string };
const storageKey = "oei-demo:mapa:v1";
const empty: LocationRecord[] = [];
let rawSnapshot: string | null | undefined;
let recordsSnapshot: LocationRecord[] = empty;

const readLocations = (): LocationRecord[] => {
  const raw = window.localStorage.getItem(storageKey);
  if (rawSnapshot === raw) return recordsSnapshot;
  rawSnapshot = raw;
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    recordsSnapshot = Array.isArray(parsed) ? parsed as LocationRecord[] : [];
  } catch {
    recordsSnapshot = [];
  }
  return recordsSnapshot;
};

const subscribe = (callback: () => void): (() => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("oei-workspace-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("oei-workspace-change", callback);
  };
};

export default function LocationMap(): React.JSX.Element {
  const records = useSyncExternalStore(subscribe, readLocations, () => empty);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);

  useEffect(() => {
    let cancelled = false;
    let resizeObserver: ResizeObserver | undefined;
    const initialize = async (): Promise<void> => {
      if (!containerRef.current || mapRef.current) return;
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;
      const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView([13.75, -88.9], 8);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18
      }).addTo(map);
      const markers = L.layerGroup().addTo(map);
      leafletRef.current = L;
      mapRef.current = map;
      markerLayerRef.current = markers;
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => map.invalidateSize({ pan: false }));
        resizeObserver.observe(containerRef.current);
      }
      requestAnimationFrame(() => map.invalidateSize({ pan: false }));
    };
    void initialize().catch(() => undefined);
    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
      leafletRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = markerLayerRef.current;
    if (!L || !map || !layer) return;
    layer.clearLayers();
    const valid = records.flatMap((record) => {
      const lat = Number(record.latitud);
      const lng = Number(record.longitud);
      const hasCoordinates = Boolean(record.latitud?.trim()) && Boolean(record.longitud?.trim());
      return hasCoordinates && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
        ? [{ record, lat, lng }]
        : [];
    });
    valid.forEach(({ record, lat, lng }) => {
      L.circleMarker([lat, lng], { radius: 8, color: "#ffffff", weight: 2, fillColor: "#2a9d8f", fillOpacity: 0.95 })
        .bindPopup(`<strong>${(record.nombre ?? "Ubicación").replace(/[&<>"']/g, "")}</strong><br/>${(record.municipio ?? "").replace(/[&<>"']/g, "")} · ${(record.departamento ?? "").replace(/[&<>"']/g, "")}`)
        .addTo(layer);
    });
    if (valid.length > 0) {
      const bounds = L.latLngBounds(valid.map(({ lat, lng }) => L.latLng(lat, lng)));
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
    }
  }, [records]);

  const mappedCount = records.filter((record) => Boolean(record.latitud?.trim()) && Boolean(record.longitud?.trim()) && Number.isFinite(Number(record.latitud)) && Number.isFinite(Number(record.longitud)) && Math.abs(Number(record.latitud)) <= 90 && Math.abs(Number(record.longitud)) <= 180).length;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-4">
        <div><h2 className="font-semibold">Ubicaciones registradas</h2><p className="mt-1 text-xs text-muted">Agrega latitud y longitud en el formulario para mostrar un punto.</p></div>
        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">{mappedCount} puntos en mapa</span>
      </div>
      <div ref={containerRef} className="h-[360px] w-full bg-surface-muted sm:h-[440px]" aria-label="Mapa de ubicaciones de El Salvador" />
      {mappedCount === 0 && <p className="border-t border-border px-4 py-3 text-xs text-muted">El mapa muestra El Salvador. Aún no hay ubicaciones con coordenadas válidas.</p>}
    </section>
  );
}
