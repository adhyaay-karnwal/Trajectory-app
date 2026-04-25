"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

interface ZoningBoundaryMapProps {
  latitude: number;
  longitude: number;
  polygon?: Record<string, unknown> | null;
  zoneCode?: string | null;
  maxHeightFt?: number | null;
  className?: string;
  interactive?: boolean;
}

function extendBoundsFromGeometry(bounds: mapboxgl.LngLatBounds, geometry: unknown) {
  if (!geometry || typeof geometry !== "object") return;
  const g = geometry as { type?: string; coordinates?: unknown; geometries?: unknown[] };
  if (g.type === "GeometryCollection" && Array.isArray(g.geometries)) {
    g.geometries.forEach((entry) => extendBoundsFromGeometry(bounds, entry));
    return;
  }
  const addCoords = (value: unknown) => {
    if (!Array.isArray(value) || value.length === 0) return;
    if (typeof value[0] === "number" && typeof value[1] === "number") {
      bounds.extend([value[0], value[1]]);
      return;
    }
    value.forEach((n) => addCoords(n));
  };
  addCoords(g.coordinates);
}

export function ZoningBoundaryMap({
  latitude,
  longitude,
  polygon,
  zoneCode,
  className,
  interactive = false,
}: ZoningBoundaryMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!containerRef.current || !token || mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [longitude, latitude],
      zoom: 15.5,
      pitch: 0,
      bearing: 0,
      interactive,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      const zoneData =
        polygon && typeof polygon === "object"
          ? (structuredClone(polygon) as Record<string, unknown>)
          : null;

      if (zoneData) {
        // Decorate features with zoneCode property
        if (zoneData.type === "FeatureCollection" && Array.isArray(zoneData.features)) {
          zoneData.features = zoneData.features.map((f) => {
            const feat = f as Record<string, unknown>;
            return { ...feat, properties: { ...((feat.properties as Record<string, unknown>) ?? {}), zoneCode: zoneCode ?? null } };
          });
        } else if (zoneData.type === "Feature") {
          zoneData.properties = { ...((zoneData.properties as Record<string, unknown>) ?? {}), zoneCode: zoneCode ?? null };
        }

        map.addSource("zone-data", {
          type: "geojson",
          data: zoneData as unknown as GeoJSON.GeoJSON,
        });

        // Flat fill — matches site selection style
        map.addLayer({
          id: "zone-fill",
          type: "fill",
          source: "zone-data",
          paint: {
            "fill-color": "#4f46e5",
            "fill-opacity": 0.12,
          },
        });

        // Bold boundary outline
        map.addLayer({
          id: "zone-outline",
          type: "line",
          source: "zone-data",
          paint: {
            "line-color": "#4f46e5",
            "line-width": 2.5,
            "line-opacity": 0.9,
          },
        });

        // Fit map to polygon bounds
        const bounds = new mapboxgl.LngLatBounds();
        if (zoneData.type === "FeatureCollection" && Array.isArray(zoneData.features)) {
          zoneData.features.forEach((f) => extendBoundsFromGeometry(bounds, (f as Record<string, unknown>).geometry));
        } else if (zoneData.type === "Feature") {
          extendBoundsFromGeometry(bounds, zoneData.geometry);
        }

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { padding: 40, maxZoom: 17, duration: 0 });
        }
      }

      // Center pin marker
      const el = document.createElement("div");
      el.style.cssText = "width:10px;height:10px;border-radius:50%;background:#fff;border:2.5px solid #4f46e5;box-shadow:0 0 0 4px rgba(79,70,229,0.2)";
      new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([longitude, latitude])
        .addTo(map);

      map.resize();
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [interactive, latitude, longitude, polygon, zoneCode]);

  return <div ref={containerRef} className={className} />;
}
