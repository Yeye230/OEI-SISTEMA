"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  GeoJSON as LeafletGeoJSON,
  Map as LeafletMap,
} from "leaflet";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

type Metric = "avance" | "actas";

type DepartmentFeature = {
  type?: "Feature";
  properties: { shapeName: string; shapeID?: string };
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: unknown };
};

type GeoJSONCollection = {
  type: "FeatureCollection";
  features: DepartmentFeature[];
};

type DemoData = { avance: number; actas: number };

/* ------------------------------------------------------------------ */
/* Datos de demostración (reemplazar luego por datos reales)           */
/* ------------------------------------------------------------------ */

const demoData: Record<string, DemoData> = {
  Ahuachapan: { avance: 80.4, actas: 290 },
  Cabanas: { avance: 67.6, actas: 180 },
  Chalatenango: { avance: 65.3, actas: 260 },
  Cuscatlan: { avance: 83.7, actas: 240 },
  "La Libertad": { avance: 73.9, actas: 417 },
  "La Paz": { avance: 68.1, actas: 280 },
  "La Union": { avance: 76, actas: 321 },
  Morazan: { avance: 86.2, actas: 170 },
  "San Miguel": { avance: 83, actas: 471 },
  "San Salvador": { avance: 62, actas: 476 },
  "San Vicente": { avance: 77.4, actas: 190 },
  "Santa Ana": { avance: 66.2, actas: 504 },
  Sonsonate: { avance: 73.1, actas: 319 },
  Usulutan: { avance: 76.6, actas: 390 },
};

/* ------------------------------------------------------------------ */
/* Colores y leyendas                                                  */
/* ------------------------------------------------------------------ */

const avanceLegend = [
  { label: "≥ 85%", color: "#4cd27a" },
  { label: "75-84%", color: "#3cc4b4" },
  { label: "65-74%", color: "#f5a92d" },
  { label: "55-64%", color: "#ff8fa3" },
  { label: "< 55%", color: "#ef4444" },
];

const actasLegend = [
  { label: "≥ 450", color: "#075477" },
  { label: "350-449", color: "#1879a8" },
  { label: "250-349", color: "#55a6d1" },
  { label: "200-249", color: "#a5d5ed" },
  { label: "< 200", color: "#dceef8" },
];

function avanceColor(value: number) {
  if (value >= 85) return avanceLegend[0].color;
  if (value >= 75) return avanceLegend[1].color;
  if (value >= 65) return avanceLegend[2].color;
  if (value >= 55) return avanceLegend[3].color;
  return avanceLegend[4].color;
}

function actasColor(value: number) {
  if (value >= 450) return actasLegend[0].color;
  if (value >= 350) return actasLegend[1].color;
  if (value >= 250) return actasLegend[2].color;
  if (value >= 200) return actasLegend[3].color;
  return actasLegend[4].color;
}

function colorFor(metric: Metric, data: DemoData) {
  return metric === "avance"
    ? avanceColor(data.avance)
    : actasColor(data.actas);
}

function labelFor(metric: Metric, data: DemoData) {
  return metric === "avance" ? `${data.avance}%` : String(data.actas);
}

function normalizeName(name: string) {
  return name
    .replace(/^Departamento de /i, "")
    .replace(/ Department$/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

const emptyData: DemoData = { avance: 0, actas: 0 };

/* Estilos de Leaflet que necesita este mapa (etiquetas, tonos del mapa base) */
const mapCss = `
  .dept-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; align-items: start; width: 100%; min-width: 0; }
  @media (min-width: 1100px) {
    .dept-grid { grid-template-columns: minmax(0, 2fr) minmax(320px, 0.95fr); }
  }
  .dept-map { position: relative; height: 340px; overflow: hidden; border-radius: 12px; background: #dcdcdc; }
  @media (min-width: 640px) { .dept-map { height: 390px; } }
  .dept-map .dept-map-canvas { position: absolute; inset: 0; z-index: 0; }
  .dept-map .dept-overlay { position: absolute; z-index: 500; }
  .dept-map .leaflet-container { width: 100%; height: 100%; background: #dcdcdc; font-family: inherit; }
  .dept-map .leaflet-tile-pane { filter: grayscale(1) contrast(0.9) brightness(1.04); opacity: .75; }
  .dept-map .dept-label {
    background: transparent; border: 0; box-shadow: none;
    padding: 0; font-size: 10px; font-weight: 700; color: #1f2937;
    text-shadow: 0 0 3px rgba(255,255,255,.85), 0 0 3px rgba(255,255,255,.85);
  }
  .dept-map .dept-label::before { display: none; }
  .dept-map .leaflet-control-zoom {
    border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;
    box-shadow: 0 1px 3px rgba(15,23,42,.12);
  }
  .dept-map .leaflet-control-zoom a {
    width: 30px; height: 30px; line-height: 30px; color: #172b3a; font-weight: 700;
  }
  .dept-map .leaflet-control-attribution { font-size: 9px; }
`;

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */

export default function DepartmentMap() {
  const [features, setFeatures] = useState<DepartmentFeature[]>([]);
  const [selected, setSelected] = useState("San Salvador");
  const [metric, setMetric] = useState<Metric>("avance");
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LeafletGeoJSON | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const fittedRef = useRef(false);

  /* 1. Cargar el GeoJSON ------------------------------------------- */
  useEffect(() => {
    let active = true;

    async function loadMap() {
      try {
        const response = await fetch("/data/el-salvador-departments.geojson");
        if (!response.ok) {
          throw new Error(`Error al cargar el mapa (${response.status})`);
        }

        const data = (await response.json()) as GeoJSONCollection;
        if (data.type !== "FeatureCollection" || !Array.isArray(data.features)) {
          throw new Error("El archivo GeoJSON no tiene el formato esperado");
        }

        if (active) {
          setFeatures(data.features);
          setMapError(false);
        }
      } catch (error) {
        console.error("Error cargando el mapa:", error);
        if (active) setMapError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadMap();
    return () => {
      active = false;
    };
  }, []);

  /* 2. Crear el mapa Leaflet una sola vez --------------------------- */
  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      if (!containerRef.current || mapRef.current) return;

      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: true,
        minZoom: 7,
        maxZoom: 12,
        zoomSnap: 0.25,
      }).setView([13.75, -88.9], 9);

      L.control.zoom({ position: "topright" }).addTo(map);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "&copy; OpenStreetMap &copy; CARTO",
          subdomains: "abcd",
        }
      ).addTo(map);

      leafletRef.current = L;
      mapRef.current = map;
      setMapReady(true);
    }

    void initMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
      fittedRef.current = false;
      setMapReady(false);
    };
  }, []);

  /* 3. Dibujar / actualizar departamentos --------------------------- */
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!mapReady || !L || !map || !features.length) return;

    layerRef.current?.remove();

    const layer = L.geoJSON(
      { type: "FeatureCollection", features } as never,
      {
        style: (feature) => {
          const name = normalizeName(feature?.properties?.shapeName ?? "");
          const data = demoData[name] ?? emptyData;
          const isSelected = name === selected;

          return {
            fillColor: colorFor(metric, data),
            fillOpacity: 0.92,
            color: isSelected ? "#102f45" : "#ffffff",
            weight: isSelected ? 3 : 1.5,
            lineJoin: "round",
          };
        },
        onEachFeature: (feature, featureLayer) => {
          const name = normalizeName(feature.properties?.shapeName ?? "");
          const data = demoData[name] ?? emptyData;

          featureLayer.bindTooltip(labelFor(metric, data), {
            permanent: true,
            direction: "center",
            className: "dept-label",
          });

          featureLayer.on({
            click: () => setSelected(name),
            mouseover: () => {
              (featureLayer as never as { setStyle: (s: object) => void })
                .setStyle({ fillOpacity: 1 });
            },
            mouseout: () => layer.resetStyle(featureLayer),
          });

          featureLayer.bindPopup(
            `<strong>${name}</strong><br/>Avance: ${data.avance}%<br/>Actas: ${data.actas}`,
            { closeButton: false }
          );
        },
      }
    ).addTo(map);

    layerRef.current = layer;

    if (!fittedRef.current) {
      map.fitBounds(layer.getBounds(), { padding: [50, 50] });
      fittedRef.current = true;
    }
  }, [features, metric, selected, mapReady]);

  /* Ranking --------------------------------------------------------- */
  const ranking = useMemo(
    () =>
      features
        .map((feature) => {
          const name = normalizeName(feature.properties.shapeName);
          return { name, ...(demoData[name] ?? emptyData) };
        })
        .sort((a, b) => b.actas - a.actas),
    [features]
  );

  const maxActas = Math.max(...ranking.map((item) => item.actas), 1);
  const legend = metric === "avance" ? avanceLegend : actasLegend;

  if (mapError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-5">
        <h2 className="font-semibold text-slate-800">
          No se pudo cargar el mapa
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Comprueba que el archivo exista en{" "}
          public/data/el-salvador-departments.geojson.
        </p>
      </div>
    );
  }

  return (
    <section className="dept-grid">
      <style>{mapCss}</style>

      {/* TARJETA DEL MAPA */}
      <article className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-[#172b3a]">
            Rendimiento Geográfico
          </h2>

          <div
            role="tablist"
            aria-label="Métrica del mapa"
            className="inline-flex overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-semibold tracking-wide"
          >
            {(
              [
                { id: "avance", label: "AVANCE" },
                { id: "actas", label: "ACTAS" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={metric === tab.id}
                onClick={() => setMetric(tab.id)}
                className={`px-3.5 py-2 transition ${
                  metric === tab.id
                    ? "bg-[#e8f2fa] text-[#2f5bd6] shadow-[inset_0_-2px_0_#2f5bd6]"
                    : "text-slate-500 hover:bg-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="dept-map">
          <div ref={containerRef} className="dept-map-canvas" />

          {loading && (
            <div
              className="dept-overlay flex items-center justify-center bg-white/70 text-sm text-slate-500"
              style={{ inset: 0 }}
            >
              Cargando mapa de El Salvador...
            </div>
          )}

          {/* Leyenda flotante */}
          <div
            className="dept-overlay rounded-xl bg-white/95 px-3 py-2.5 shadow-md"
            style={{ bottom: 12, left: 12 }}
          >
            <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
              {metric === "avance" ? "Avance" : "Actas"}
            </p>
            <ul className="space-y-1">
              {legend.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2 text-[10px] text-slate-600"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-3 text-[10px] text-slate-400">
          Datos ficticios de demostración; todavía no están conectados a la
          base de datos.
        </p>
      </article>

      {/* TARJETA DEL RANKING */}
      <aside className="flex min-w-0 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-3">
          <h2 className="text-base font-bold text-[#172b3a]">
            Ranking Territorial
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Actas registradas por departamento
          </p>
        </div>

        <ol className="max-h-[390px] overflow-y-auto pr-1">
          {ranking.map((department, index) => {
            const isSelected = selected === department.name;
            return (
              <li
                key={department.name}
                className="border-b border-slate-100 last:border-0"
              >
                <button
                  type="button"
                  onClick={() => setSelected(department.name)}
                  className={`w-full rounded-lg px-1 py-3 text-left transition ${
                    isSelected ? "bg-sky-50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 shrink-0 text-[11px] font-semibold text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#172b3a]">
                      {department.name}
                    </span>
                    <span className="text-sm font-bold tabular-nums text-[#172b3a]">
                      {department.actas}
                    </span>
                  </div>

                  <div className="ml-8 mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(department.actas / maxActas) * 100}%`,
                        backgroundColor: avanceColor(department.avance),
                      }}
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>
    </section>
  );
}