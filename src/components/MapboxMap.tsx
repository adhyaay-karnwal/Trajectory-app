"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { cn } from "@/lib/utils";

export interface MapMarker {
  id: string;
  longitude: number;
  latitude: number;
  title?: string;
}

interface MapboxMapProps {
  token: string;
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  zonePolygon?: GeoJSON.Feature | GeoJSON.FeatureCollection | null;
  zoneLabel?: string;
  zoneHeightFt?: number | null;
  zoneFAR?: number | null;
  darkMode?: boolean;
  className?: string;
}

const ZONE_SOURCE = "zone-source";
const ZONE_FILL = "zone-fill";
const ZONE_LINE = "zone-line";
const ZONE_EXTRUDE = "zone-extrude";

export function MapboxMap({
  token,
  center = [-98.5795, 39.8283],
  zoom = 4,
  markers = [],
  zonePolygon,
  zoneLabel,
  zoneHeightFt,
  zoneFAR,
  darkMode = false,
  className,
}: MapboxMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const labelRef = useRef<mapboxgl.Popup | null>(null);
  const [is3D, setIs3D] = useState(false);
  const [ready, setReady] = useState(false);

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = token;
    const style = darkMode
      ? "mapbox://styles/mapbox/dark-v11"
      : "mapbox://styles/mapbox/light-v11";

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style,
      center,
      zoom,
      antialias: true,
      attributionControl: false,
    });

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: true }),
      "bottom-right",
    );

    map.on("load", () => {
      setReady(true);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Sync dark mode style (only fires when darkMode actually changes, not on every ready flip)
  const prevDarkMode = useRef(darkMode);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    if (prevDarkMode.current === darkMode) return;
    prevDarkMode.current = darkMode;
    const style = darkMode
      ? "mapbox://styles/mapbox/dark-v11"
      : "mapbox://styles/mapbox/light-v11";
    setReady(false);
    map.setStyle(style);
    map.once("styledata", () => setReady(true));
  }, [darkMode, ready]);

  // Add 3D buildings after every style load
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    if (map.getLayer("3d-buildings")) return;
    map.addLayer({
      id: "3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 14,
      paint: {
        "fill-extrusion-color": darkMode ? "#1a1a2e" : "#e2e8f0",
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-base": ["get", "min_height"],
        "fill-extrusion-opacity": is3D ? 0.6 : 0,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Markers
  useEffect(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    const map = mapRef.current;
    if (!map || !ready) return;

    markers.forEach((m) => {
      const el = document.createElement("div");
      el.innerHTML = `
        <div style="
          width:32px;height:40px;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.35));
          cursor:pointer;
        ">
          <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 10.627 14.4 23.04 15.04 23.573a1.28 1.28 0 001.92 0C17.6 39.04 32 26.627 32 16 32 7.163 24.837 0 16 0z" fill="#4f46e5"/>
            <circle cx="16" cy="16" r="6" fill="white" opacity="0.9"/>
          </svg>
        </div>`;

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "bottom",
      }).setLngLat([m.longitude, m.latitude]);

      if (m.title) {
        marker.setPopup(
          new mapboxgl.Popup({
            offset: 8,
            closeButton: false,
            className: "petal-popup",
          }).setHTML(
            `<div style="font-family:sans-serif;font-size:12px;font-weight:600;color:#1e293b;padding:2px 4px">${m.title}</div>`,
          ),
        );
      }
      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [markers, ready]);

  // Zone polygon
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !zonePolygon) return;

    const heightM = zoneHeightFt ? zoneHeightFt * 0.3048 : 25;
    const geojson: GeoJSON.Feature | GeoJSON.FeatureCollection = (() => {
      if (zonePolygon.type === "FeatureCollection") {
        return {
          ...zonePolygon,
          features: (zonePolygon as GeoJSON.FeatureCollection).features.map(
            (f) => ({
              ...f,
              properties: { ...(f.properties ?? {}), height: heightM },
            }),
          ),
        };
      }
      return {
        ...zonePolygon,
        properties: { ...(zonePolygon.properties ?? {}), height: heightM },
      };
    })();

    // Remove old layers
    [ZONE_EXTRUDE, ZONE_FILL, ZONE_LINE].forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    if (map.getSource(ZONE_SOURCE)) map.removeSource(ZONE_SOURCE);

    map.addSource(ZONE_SOURCE, {
      type: "geojson",
      data: geojson as GeoJSON.GeoJSON,
    });

    // Fill
    map.addLayer({
      id: ZONE_FILL,
      type: "fill",
      source: ZONE_SOURCE,
      paint: {
        "fill-color": "#4f46e5",
        "fill-opacity": is3D ? 0 : 0.12,
      },
    });

    // Outline
    map.addLayer({
      id: ZONE_LINE,
      type: "line",
      source: ZONE_SOURCE,
      paint: {
        "line-color": "#4f46e5",
        "line-width": 2,
        "line-opacity": 0.8,
      },
    });

    // 3D extrusion
    map.addLayer({
      id: ZONE_EXTRUDE,
      type: "fill-extrusion",
      source: ZONE_SOURCE,
      paint: {
        "fill-extrusion-color": "#4f46e5",
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-base": 0,
        "fill-extrusion-opacity": is3D ? 0.55 : 0,
      },
    });

    // Fit bounds
    try {
      const coords: number[][] = [];
      const collect = (g: GeoJSON.Geometry) => {
        if (g.type === "Polygon") coords.push(...g.coordinates.flat());
        if (g.type === "MultiPolygon")
          g.coordinates.forEach((p) => coords.push(...p.flat()));
      };
      if (geojson.type === "FeatureCollection") {
        (geojson as GeoJSON.FeatureCollection).features.forEach((f) =>
          collect(f.geometry),
        );
      } else {
        collect((geojson as GeoJSON.Feature).geometry);
      }
      if (coords.length) {
        const lngs = coords.map((c) => c[0]);
        const lats = coords.map((c) => c[1]);
        map.fitBounds(
          [
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)],
          ],
          { padding: 100, maxZoom: 17, duration: 900 },
        );
      }
    } catch {
      /* ignore */
    }

    // Label popup
    labelRef.current?.remove();
    if (zoneLabel) {
      const centerCoord = markers[0]
        ? ([markers[0].longitude, markers[0].latitude] as [number, number])
        : (map.getCenter().toArray() as [number, number]);
      labelRef.current = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: "petal-zone-label",
        offset: [0, -8],
      })
        .setLngLat(centerCoord)
        .setHTML(
          `
          <div style="
            background:rgba(79,70,229,0.92);backdrop-filter:blur(8px);
            color:white;font-family:sans-serif;font-size:11px;font-weight:700;
            padding:4px 8px;border-radius:6px;letter-spacing:0.04em;
            box-shadow:0 2px 8px rgba(79,70,229,0.4);
          ">${zoneLabel}${zoneHeightFt ? ` · ${zoneHeightFt}ft max` : ""}${zoneFAR ? ` · FAR ${zoneFAR}` : ""}</div>
        `,
        )
        .addTo(map);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zonePolygon, zoneLabel, zoneHeightFt, zoneFAR, ready]);

  // Toggle 3D
  const toggle3D = () => {
    const map = mapRef.current;
    if (!map) return;
    const next = !is3D;
    setIs3D(next);
    map.easeTo({
      pitch: next ? 55 : 0,
      bearing: next ? -20 : 0,
      duration: 1000,
    });
    if (map.getLayer(ZONE_FILL))
      map.setPaintProperty(ZONE_FILL, "fill-opacity", next ? 0 : 0.12);
    if (map.getLayer(ZONE_EXTRUDE))
      map.setPaintProperty(
        ZONE_EXTRUDE,
        "fill-extrusion-opacity",
        next ? 0.55 : 0,
      );
    if (map.getLayer("3d-buildings"))
      map.setPaintProperty(
        "3d-buildings",
        "fill-extrusion-opacity",
        next ? 0.6 : 0,
      );
  };

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <div ref={containerRef} className="w-full h-full" />

      {/* 3D toggle */}
      <button
        onClick={toggle3D}
        title={is3D ? "Switch to 2D" : "Switch to 3D"}
        className={cn(
          "absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold font-manrope transition-all",
          "border shadow-sm backdrop-blur-sm",
          is3D
            ? "bg-sky-600 border-sky-500 text-white shadow-sky-500/30"
            : "bg-white/90 dark:bg-black/60 border-black/[0.1] dark:border-white/[0.1] text-gray-700 dark:text-gray-300 hover:bg-white",
        )}
      >
        {is3D ? "2D" : "3D"}
      </button>

      {/* Loading shimmer */}
      {!ready && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-[#111] animate-pulse" />
      )}
    </div>
  );
}
