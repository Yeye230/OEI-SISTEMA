
"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useRef, useState } from "react";
import type {
  GeoJSON as LeafletGeoJSON,
  Map as LeafletMap,
  Path,
} from "leaflet";
import { Map as MapIcon } from "lucide-react";

import {
  actasColor,
  actasLegend,
  avanceColor,
  avanceLegend,
  normalizeName,
  statsByKey,
  type Metric,
} from "@/lib/demo-data";

/** Activar solo si se desea mostrar un mapa base de calles. */
const SHOW_BASEMAP = false;

type DepartmentFeature = {
  type?: "Feature";
  properties: {
    shapeName: string;
    shapeID?: string;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: unknown;
  };
};

type GeoJSONCollection = {
  type: "FeatureCollection";
  features: DepartmentFeature[];
};

const mapCss = `
  .dept-map {
    position: relative;
    isolation: isolate;
    width: 100%;
    height: 360px;
    overflow: hidden;
    border-radius: 12px;
    background: #eef4f9;
  }

  @media (min-width: 640px) {
    .dept-map {
      height: 420px;
    }
  }

  @media (min-width: 1280px) {
    .dept-map {
      height: 460px;
    }
  }

  .dept-map .dept-map-canvas {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .dept-map .dept-overlay {
    position: absolute;
    z-index: 500;
  }

  .dept-map .leaflet-container {
    width: 100%;
    height: 100%;
    background: #eef4f9;
    font-family: inherit;
  }

  .dept-map.basemap .leaflet-container {
    background: #e7edf0;
  }

  .dept-map.basemap .leaflet-tile-pane {
    filter: grayscale(1) contrast(.9) brightness(1.04);
    opacity: .75;
  }

  .dept-map .dept-label {
    background: transparent;
    border: 0;
    box-shadow: none;
    padding: 0;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0,0,0,.65), 0 0 3px rgba(0,0,0,.45);
    white-space: nowrap;
  }

  .dept-map .dept-label::before {
    display: none;
  }

  .dept-map .leaflet-control-zoom {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(15,23,42,.12);
  }

  .dept-map .leaflet-control-zoom a {
    width: 32px;
    height: 32px;
    line-height: 32px;
    color: #172b3a;
    font-weight: 700;
  }

  .dept-map .leaflet-control-attribution {
    font-size: 9px;
  }

  @media (max-width: 480px) {
    .dept-map {
      height: 330px;
    }

    .dept-map .dept-label {
      font-size: 9px;
    }
  }
`;

export default function DepartmentMap({
  metric,
  onMetricChange,
  selected,
  onSelect,
}: {
  metric: Metric;
  onMetricChange: (metric: Metric) => void;
  selected: string;
  onSelect: (key: string) => void;
}) {
  const [features, setFeatures] = useState<DepartmentFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LeafletGeoJSON | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const fittedRef = useRef(false);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  /* Cargar los departamentos desde el GeoJSON local. */
  useEffect(() => {
    let active = true;

    async function loadMap() {
      try {
        const response = await fetch(
          "/data/el-salvador-departments.geojson"
        );

        if (!response.ok) {
          throw new Error(`Error al cargar el mapa (${response.status})`);
        }

        const data = (await response.json()) as GeoJSONCollection;

        if (
          data.type !== "FeatureCollection" ||
          !Array.isArray(data.features)
        ) {
          throw new Error("El archivo GeoJSON no tiene el formato esperado");
        }

        if (active) {
          setFeatures(data.features);
          setMapError(false);
        }
      } catch (error) {
        console.error("Error cargando el mapa:", error);

        if (active) {
          setMapError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadMap();

    return () => {
      active = false;
    };
  }, []);

  /* Inicializar Leaflet una sola vez. */
  useEffect(() => {
    let cancelled = false;
    let resizeObserver: ResizeObserver | undefined;

    async function initMap() {
      if (!containerRef.current || mapRef.current) return;

      const L = (await import("leaflet")).default;

      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: SHOW_BASEMAP,
        minZoom: 7,
        maxZoom: 12,
        zoomSnap: 0.25,
      }).setView([13.75, -88.9], 9);

      L.control.zoom({ position: "topright" }).addTo(map);

      if (SHOW_BASEMAP) {
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            attribution: "&copy; OpenStreetMap &copy; CARTO",
            subdomains: "abcd",
          }
        ).addTo(map);
      }

      leafletRef.current = L;
      mapRef.current = map;

      const container = containerRef.current;

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          map.invalidateSize({ pan: false });
        });

        resizeObserver.observe(container);
      }

      requestAnimationFrame(() => {
        if (!cancelled) {
          map.invalidateSize({ pan: false });
        }
      });

      setMapReady(true);
    }

    void initMap().catch((error) => {
      console.error("Error inicializando Leaflet:", error);

      if (!cancelled) {
        setMapError(true);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
      leafletRef.current = null;
      fittedRef.current = false;
    };
  }, []);

  /* Dibujar los departamentos y actualizar sus colores. */
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;

    if (!mapReady || !L || !map || !features.length) return;

    layerRef.current?.remove();

    const paint = (key: string) => {
      const stat = statsByKey[key];

      if (!stat) return "#cbd5e1";

      return metric === "avance"
        ? avanceColor(stat.avance)
        : actasColor(stat.actas);
    };

    const layer = L.geoJSON(
      { type: "FeatureCollection", features } as never,
      {
        style: (feature) => {
          const key = normalizeName(
            feature?.properties?.shapeName ?? ""
          );

          const isSelected = key === selected;

          return {
            fillColor: paint(key),
            fillOpacity: 0.95,
            color: isSelected ? "#0b2945" : "#ffffff",
            weight: isSelected ? 3 : 1.6,
            lineJoin: "round",
          };
        },

        onEachFeature: (feature, featureLayer) => {
          const key = normalizeName(
            feature.properties?.shapeName ?? ""
          );

          const stat = statsByKey[key];

          const text = stat
            ? metric === "avance"
              ? `${stat.avance}%`
              : String(stat.actas)
            : "";

          if (text) {
            featureLayer.bindTooltip(text, {
              permanent: true,
              direction: "center",
              className: "dept-label",
            });
          }

          featureLayer.on({
            click: () => onSelectRef.current(key),

            mouseover: () => {
              (featureLayer as Path).setStyle({
                fillOpacity: 1,
                weight: 2.5,
              });
            },

            mouseout: () => {
              layer.resetStyle(featureLayer);
            },
          });
        },
      }
    ).addTo(map);

    layerRef.current = layer;

    if (!fittedRef.current) {
      map.fitBounds(layer.getBounds(), {
        padding: [24, 24],
        animate: false,
      });

      fittedRef.current = true;
    }
  }, [features, metric, selected, mapReady]);

  const legend = metric === "avance" ? avanceLegend : actasLegend;

  return (
    <div className="min-w-0 w-full">
      <style>{mapCss}</style>

      {/* Controles del mapa */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <MapIcon size={17} className="shrink-0 text-teal-600" />

          <span className="text-sm font-medium text-slate-600">
            {metric === "avance"
              ? "Avance por departamento"
              : "Actas por departamento"}
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Métrica del mapa"
          className="inline-flex shrink-0 rounded-lg border border-slate-200 bg-slate-100 p-1"
        >
          {(
            [
              { id: "avance", label: "Avance" },
              { id: "actas", label: "Actas" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={metric === tab.id}
              onClick={() => onMetricChange(tab.id)}
              className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
                metric === tab.id
                  ? "bg-[#0b2945] text-white shadow-sm"
                  : "text-slate-600 hover:bg-white hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mapa interactivo */}
      {mapError ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
          <MapIcon size={30} className="mb-3 text-rose-500" />

          <h3 className="font-semibold text-slate-800">
            No se pudo cargar el mapa
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
            Comprueba que exista el archivo{" "}
            <code className="break-all text-xs">
              public/data/el-salvador-departments.geojson
            </code>
            .
          </p>
        </div>
      ) : (
        <div className={SHOW_BASEMAP ? "dept-map basemap" : "dept-map"}>
          <div ref={containerRef} className="dept-map-canvas" />

          {loading && (
            <div
              className="dept-overlay flex items-center justify-center bg-white/80 text-sm text-slate-500"
              style={{ inset: 0 }}
            >
              Cargando mapa de El Salvador...
            </div>
          )}

          {/* Leyenda */}
          <div
            className="dept-overlay max-w-[calc(100%-24px)] rounded-xl border border-slate-200/80 bg-white/95 px-3 py-3 shadow-md backdrop-blur-sm sm:px-4"
            style={{ bottom: 12, left: 12 }}
          >
            <p className="mb-2 text-xs font-semibold text-slate-700">
              {metric === "avance" ? "Rango de avance" : "Rango de actas"}
            </p>

            <ul className="space-y-1.5">
              {legend.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2 text-xs text-slate-600"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />

                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <p className="mt-3 text-[11px] leading-5 text-slate-400">
        Selecciona un departamento para consultar su información. Las
        estadísticas actuales proceden de los datos de demostración.
      </p>
    </div>
  );
}
