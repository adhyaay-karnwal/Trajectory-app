"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { cn } from "@/lib/utils";

interface MapboxMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string;
    longitude: number;
    latitude: number;
    title?: string;
  }>;
  zonePolygon?:
    | GeoJSON.Feature
    | GeoJSON.FeatureCollection
    | Record<string, unknown>
    | null;
  zoneLabel?: string | null;
  zoneHeightFt?: number | null;
  zoneFAR?: number | null;
  className?: string;
  mapStyle?: string;
  showControls?: boolean;
  interactive?: boolean;
  enable3D?: boolean;
}

function CubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RotateIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M21 12a9 9 0 1 1-3.29-6.94"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M21 3v6h-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MapboxMap({
  center = [-118.2437, 34.0522],
  zoom = 15,
  markers = [],
  zonePolygon = null,
  zoneLabel,
  zoneHeightFt = null,
  zoneFAR = null,
  className = "",
  mapStyle = "mapbox://styles/mapbox/light-v11",
  showControls = true,
  interactive = true,
  enable3D = true,
}: MapboxMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const rotationRef = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const defaultHeightFt = 85;
  const effectiveHeightFt = zoneHeightFt ?? defaultHeightFt;
  const heightMeters = effectiveHeightFt * 0.3048;

  const toggle3D = useCallback(() => {
    if (!mapRef.current || !loaded) return;
    const next = !is3D;
    setIs3D(next);
    if (next) {
      mapRef.current.easeTo({ pitch: 58, bearing: -20, duration: 1400 });
    } else {
      mapRef.current.easeTo({ pitch: 0, bearing: 0, duration: 1000 });
      if (rotationRef.current) {
        cancelAnimationFrame(rotationRef.current);
        rotationRef.current = null;
        setIsRotating(false);
      }
    }
  }, [is3D, loaded]);

  const toggleRotation = useCallback(() => {
    if (!mapRef.current || !loaded || !is3D) return;
    if (isRotating) {
      if (rotationRef.current) cancelAnimationFrame(rotationRef.current);
      rotationRef.current = null;
      setIsRotating(false);
    } else {
      setIsRotating(true);
      const spin = () => {
        if (!mapRef.current) return;
        mapRef.current.rotateTo(mapRef.current.getBearing() + 0.3, {
          duration: 0,
        });
        rotationRef.current = requestAnimationFrame(spin);
      };
      spin();
    }
  }, [is3D, isRotating, loaded]);

  // Init map
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!containerRef.current || mapRef.current || !token) return;

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: mapStyle,
      center,
      zoom,
      pitch: 0,
      bearing: 0,
      interactive,
      attributionControl: false,
      antialias: true,
    });

    mapRef.current = map;

    if (showControls) {
      map.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        "bottom-right",
      );
      map.addControl(
        new mapboxgl.ScaleControl({ maxWidth: 120, unit: "imperial" }),
        "bottom-left",
      );
    }

    map.on("load", () => {
      if (!map) return;

      if (enable3D) {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
        map.setTerrain({ source: "mapbox-dem", exaggeration: 1.1 });

        map.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0, 0],
            "sky-atmosphere-sun-intensity": 15,
          },
        });

        const layers = map.getStyle().layers ?? [];
        const labelLayerId = layers.find(
          (l) =>
            l.type === "symbol" &&
            (l.layout as Record<string, unknown>)?.["text-field"],
        )?.id;
        map.addLayer(
          {
            id: "3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 14,
            paint: {
              "fill-extrusion-color": [
                "interpolate",
                ["linear"],
                ["get", "height"],
                0,
                "#e2e8f0",
                50,
                "#cbd5e1",
                100,
                "#94a3b8",
              ],
              "fill-extrusion-height": ["get", "height"],
              "fill-extrusion-base": ["get", "min_height"],
              "fill-extrusion-opacity": 0.65,
            },
          },
          labelLayerId,
        );
      }

      setLoaded(true);
    });

    return () => {
      if (rotationRef.current) cancelAnimationFrame(rotationRef.current);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fly to center/zoom changes
  useEffect(() => {
    if (!mapRef.current || !loaded) return;
    mapRef.current.flyTo({ center, zoom, duration: 800 });
  }, [center, zoom, loaded]);

  // Markers
  useEffect(() => {
    if (!mapRef.current || !loaded) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    markers.forEach((data) => {
      const el = document.createElement("div");
      el.style.cssText = `
        width: 30px; height: 30px; cursor: pointer;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='%234f46e5' stroke='%23ffffff' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3C/svg%3E");
        background-size: contain; background-repeat: no-repeat;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));
        transition: filter 0.15s;
      `;
      el.addEventListener("mouseenter", () => {
        el.style.filter =
          "drop-shadow(0 3px 8px rgba(79,70,229,0.5)) brightness(1.08)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.35))";
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([data.longitude, data.latitude])
        .addTo(mapRef.current!);

      if (data.title) {
        marker.setPopup(
          new mapboxgl.Popup({ offset: 26, closeButton: false }).setHTML(
            `<div style="font-family:system-ui;font-size:13px;font-weight:600;color:#111;padding:2px 4px">${data.title}</div>`,
          ),
        );
      }

      markersRef.current.push(marker);
    });
  }, [markers, loaded]);

  // Zone polygon
  useEffect(() => {
    if (!mapRef.current || !loaded) return;
    const map = mapRef.current;

    [
      "zone-fill",
      "zone-outline",
      "zone-glow",
      "zone-extrusion",
      "zone-label",
    ].forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    if (map.getSource("zone-data")) map.removeSource("zone-data");

    if (!zonePolygon) return;

    // Decorate with height properties
    const data = structuredClone(zonePolygon) as
      | GeoJSON.Feature
      | GeoJSON.FeatureCollection;
    const decorateFeature = (f: GeoJSON.Feature): GeoJSON.Feature => ({
      ...f,
      properties: {
        ...(f.properties ?? {}),
        zoneLabel,
        heightMeters,
        heightFt: effectiveHeightFt,
        far: zoneFAR,
      },
    });
    if (data.type === "FeatureCollection") {
      (data as GeoJSON.FeatureCollection).features = (
        data as GeoJSON.FeatureCollection
      ).features.map(decorateFeature);
    } else if (data.type === "Feature") {
      (data as GeoJSON.Feature).properties = {
        ...((data as GeoJSON.Feature).properties ?? {}),
        zoneLabel,
        heightMeters,
        heightFt: effectiveHeightFt,
        far: zoneFAR,
      };
    }

    map.addSource("zone-data", {
      type: "geojson",
      data: data as GeoJSON.GeoJSON,
    });

    // 3D extrusion
    map.addLayer({
      id: "zone-extrusion",
      type: "fill-extrusion",
      source: "zone-data",
      paint: {
        "fill-extrusion-color": [
          "interpolate",
          ["linear"],
          ["get", "heightMeters"],
          0,
          "#4338ca",
          heightMeters * 0.5,
          "#6366f1",
          heightMeters,
          "#818cf8",
        ],
        "fill-extrusion-height": ["get", "heightMeters"],
        "fill-extrusion-base": 0,
        "fill-extrusion-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          14,
          0.55,
          16,
          0.72,
          18,
          0.82,
        ],
        "fill-extrusion-vertical-gradient": true,
      },
    });

    // Flat fill (always visible at low pitch)
    map.addLayer({
      id: "zone-fill",
      type: "fill",
      source: "zone-data",
      paint: { "fill-color": "#4f46e5", "fill-opacity": 0.15 },
    });

    // Outline
    map.addLayer({
      id: "zone-outline",
      type: "line",
      source: "zone-data",
      paint: {
        "line-color": "#4f46e5",
        "line-width": ["interpolate", ["linear"], ["zoom"], 14, 2, 17, 3.5],
        "line-opacity": 0.9,
      },
    });

    // Glow
    map.addLayer({
      id: "zone-glow",
      type: "line",
      source: "zone-data",
      paint: {
        "line-color": "#818cf8",
        "line-width": ["interpolate", ["linear"], ["zoom"], 14, 8, 17, 14],
        "line-blur": 7,
        "line-opacity": 0.35,
      },
    });

    // Zone label on map
    if (zoneLabel) {
      map.addLayer({
        id: "zone-label",
        type: "symbol",
        source: "zone-data",
        layout: {
          "text-field": zoneHeightFt
            ? `${zoneLabel}\n${zoneHeightFt}' max`
            : zoneLabel,
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 14, 12, 17, 16],
          "text-anchor": "center",
          "text-allow-overlap": false,
          "text-line-height": 1.3,
        },
        paint: {
          "text-color": "#4338ca",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2.5,
        },
      });
    }

    // Fit bounds
    const bounds = new mapboxgl.LngLatBounds();
    const addCoords = (value: unknown) => {
      if (!Array.isArray(value) || value.length === 0) return;
      if (typeof value[0] === "number") {
        bounds.extend(value as [number, number]);
        return;
      }
      value.forEach(addCoords);
    };
    const extendGeom = (geom: GeoJSON.Geometry | null | undefined) => {
      if (!geom) return;
      if (geom.type === "GeometryCollection") {
        geom.geometries?.forEach(extendGeom);
        return;
      }
      if (geom.type === "Point") {
        bounds.extend(geom.coordinates as [number, number]);
        return;
      }
      addCoords(
        (geom as GeoJSON.LineString | GeoJSON.Polygon | GeoJSON.MultiPolygon)
          .coordinates,
      );
    };

    if (data.type === "FeatureCollection") {
      (data as GeoJSON.FeatureCollection).features.forEach((f) =>
        extendGeom(f.geometry),
      );
    } else if ((data as GeoJSON.Feature).geometry) {
      extendGeom((data as GeoJSON.Feature).geometry);
    }

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 72, maxZoom: 17, duration: 0 });
    }
  }, [
    zonePolygon,
    zoneLabel,
    zoneHeightFt,
    zoneFAR,
    loaded,
    heightMeters,
    effectiveHeightFt,
  ]);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={containerRef}
        className="h-full w-full"
        style={{ minHeight: "inherit" }}
      />

      {/* 3D / Rotation controls — only in interactive mode with zone polygon */}
      {loaded && showControls && zonePolygon && enable3D && (
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
          <button
            type="button"
            onClick={toggle3D}
            title={is3D ? "2D view" : "3D view"}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl border shadow-md backdrop-blur-sm transition-all",
              is3D
                ? "border-sky-400 bg-sky-500/90 text-white"
                : "border-neutral-200/80 bg-white/90 text-neutral-700 hover:border-sky-300 hover:text-sky-600",
            )}
          >
            <CubeIcon className="h-4 w-4" />
          </button>

          {is3D && (
            <button
              type="button"
              onClick={toggleRotation}
              title={isRotating ? "Stop rotation" : "Auto-rotate"}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl border shadow-md backdrop-blur-sm transition-all",
                isRotating
                  ? "border-sky-400 bg-sky-500/90 text-white"
                  : "border-neutral-200/80 bg-white/90 text-neutral-700 hover:border-sky-300 hover:text-sky-600",
              )}
            >
              <RotateIcon
                className={cn("h-4 w-4", isRotating && "animate-spin")}
              />
            </button>
          )}
        </div>
      )}

      {/* 3D Height legend */}
      {loaded && showControls && zonePolygon && enable3D && is3D && (
        <div className="absolute bottom-14 left-3 z-10 rounded-xl border border-neutral-200/80 bg-white/95 p-3 shadow-md backdrop-blur-sm dark:border-white/[0.1] dark:bg-[#1c1c1c]/95">
          <p className="mb-1.5 font-manrope text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
            Envelope
          </p>
          <div className="flex items-end gap-1.5">
            <div className="h-14 w-3.5 rounded-sm bg-gradient-to-t from-sky-600 via-sky-400 to-sky-300" />
            <div
              className="flex flex-col justify-between py-0.5 font-manrope text-[9px] text-neutral-500"
              style={{ height: 56 }}
            >
              <span>{effectiveHeightFt}&apos;</span>
              <span>{Math.round(effectiveHeightFt * 0.5)}&apos;</span>
              <span>0&apos;</span>
            </div>
          </div>
          {zoneHeightFt && (
            <p className="mt-1.5 rounded-md bg-sky-50 px-2 py-0.5 font-manrope text-[9px] font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
              Max {zoneHeightFt}&apos;
            </p>
          )}
        </div>
      )}

      {/* Loading overlay */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100/80 backdrop-blur-sm dark:bg-[#1c1c1c]/80">
          <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-neutral-200 border-t-sky-500" />
        </div>
      )}
    </div>
  );
}
