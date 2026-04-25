"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import Image from "next/image";
import { AppGate } from "@/components/app-gate";
import { AppShell } from "@/components/app-shell";
import { MapboxMap } from "@/components/MapboxMap";
import { useTheme } from "@/components/theme-provider";
import {
  HugeSearchIcon,
  HugeLocationIcon,
  HugeLayersIcon,
  HugeBuildingIcon,
  HugeCheckCircleIcon,
  HugeArrowUpIcon,
  HugeRulerIcon,
  HugeChatIcon,
  HugeArrowRightIcon,
  HugeSparklesIcon,
  HugeMapIcon,
} from "@/components/huge-icons";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AiBrief {
  use: string;
  constraint: string;
  opportunity: string;
}

const GEOJSON_GEOMETRY_TYPES = new Set<string>([
  "Point", "MultiPoint", "LineString", "MultiLineString",
  "Polygon", "MultiPolygon", "GeometryCollection",
]);

type GeoJsonLike = GeoJSON.Feature | GeoJSON.FeatureCollection | GeoJSON.Geometry;

function isGeoJsonLike(value: unknown): value is GeoJsonLike {
  if (!value || typeof value !== "object") return false;
  const type = (value as { type?: unknown }).type;
  if (typeof type !== "string") return false;
  if (type === "Feature") return typeof (value as GeoJSON.Feature).geometry !== "undefined";
  if (type === "FeatureCollection") return Array.isArray((value as GeoJSON.FeatureCollection).features);
  return GEOJSON_GEOMETRY_TYPES.has(type);
}

interface PermittedUse {
  plu_name?: string | null;
  use_name?: string | null;
  zone_code?: string | null;
  zone_name?: string | null;
  zoning_code?: string | null;
  geom?: GeoJSON.GeoJSON | null;
  geometry?: GeoJSON.GeoJSON | null;
  zone_geom?: GeoJSON.GeoJSON | null;
  [key: string]: unknown;
}

interface ZoningData {
  zone_details?: Record<string, unknown> | null;
  zone_code?: string | null;
  zone_name?: string | null;
  geom?: GeoJSON.GeoJSON | null;
  geometry?: GeoJSON.GeoJSON | null;
  zone_geometry?: GeoJSON.GeoJSON | null;
  zoning_geometry?: GeoJSON.GeoJSON | null;
  plu?: PermittedUse[];
  permitted_land_uses?: PermittedUse[];
  parcels?: Array<{
    geom?: GeoJSON.GeoJSON | null;
    geometry?: GeoJSON.GeoJSON | null;
    zone_geom?: GeoJSON.GeoJSON | null;
    [key: string]: unknown;
  }>;
  controls?: Record<string, unknown>;
  parcel_geometry?: {
    type: string;
    features: Array<{ properties?: { zoning?: string } | null; [key: string]: unknown }>;
  } | null;
  data?: { geom?: GeoJSON.GeoJSON; geometry?: GeoJSON.GeoJSON };
  overlays?: unknown;
  overlay_districts?: unknown;
  [key: string]: unknown;
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 my-1">
      <div className="h-px flex-1 bg-black/[0.05] dark:bg-white/[0.05]" />
      <span className="text-[9px] font-bold tracking-[0.25em] uppercase font-manrope text-gray-300 dark:text-gray-700">{label}</span>
      <div className="h-px flex-1 bg-black/[0.05] dark:bg-white/[0.05]" />
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col rounded-xl border border-black/[0.07] dark:border-white/[0.07] bg-gray-50/70 dark:bg-white/[0.03] px-3.5 py-3">
      <span className="text-[10px] font-manrope text-gray-400 dark:text-gray-600 uppercase tracking-wider">{label}</span>
      <span className="mt-0.5 text-lg font-bold font-manrope text-gray-900 dark:text-white leading-tight">{value}</span>
      {sub && <span className="text-[10px] font-manrope text-gray-400 dark:text-gray-600 mt-0.5">{sub}</span>}
    </div>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

function SiteSelectionContent() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const trackFeatureVisit = useMutation(api.dashboard.trackFeatureVisit);

  // Track sites visit on mount (only once per session)
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('petal_visited_sites');
    if (!hasVisited) {
      sessionStorage.setItem('petal_visited_sites', 'true');
      void trackFeatureVisit({ feature: "mission" });
    }
  }, [trackFeatureVisit]);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ description: string; placeId: string; lat: number; lng: number }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Map state
  const [mapCenter, setMapCenter] = useState<[number, number]>([-98.5795, 39.8283]);
  const [mapZoom, setMapZoom] = useState(4);
  const [mapMarkers, setMapMarkers] = useState<Array<{ id: string; longitude: number; latitude: number; title?: string }>>([]);
  const [zonePolygon, setZonePolygon] = useState<GeoJSON.Feature | GeoJSON.FeatureCollection | null>(null);
  const [zoneLabel, setZoneLabel] = useState("");
  const [zoneNameLabel, setZoneNameLabel] = useState("");
  const [zoneHeightFt, setZoneHeightFt] = useState<number | null>(null);
  const [zoneFAR, setZoneFAR] = useState<number | null>(null);

  // Result state
  const [selectedAddress, setSelectedAddress] = useState("");
  const [zoningInfo, setZoningInfo] = useState<ZoningData | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [aiBrief, setAiBrief] = useState<AiBrief | null>(null);
  const [aiRaw, setAiRaw] = useState("");           // streamed text before parse
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // ─── Autocomplete ─────────────────────────────────────────────────────────

  const fetchSuggestions = useCallback(async (input: string) => {
    if (input.length < 3) { setSuggestions([]); setShowSuggestions(false); return; }
    try {
      const res = await fetch("/api/autocomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      if (res.ok) {
        const data = await res.json();
        const s = data.suggestions ?? [];
        setSuggestions(s);
        setShowSuggestions(s.length > 0);
      }
    } catch { /* ignore */ }
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void fetchSuggestions(value), 200);
  }, [fetchSuggestions]);

  const selectSuggestion = useCallback(async (s: { description: string; placeId: string }) => {
    setSearchQuery(s.description);
    setShowSuggestions(false);
    setSuggestions([]);
    await new Promise((r) => setTimeout(r, 80));
    const btn = document.querySelector('button[data-search-btn]') as HTMLButtonElement | null;
    if (btn && !btn.disabled) btn.click();
  }, []);

  // ─── AI summary ───────────────────────────────────────────────────────────

  const generateAISummary = useCallback(async (zoneData: ZoningData) => {
    setIsGeneratingSummary(true);
    setAiBrief(null);
    setAiRaw("");
    try {
      const details = (zoneData.zone_details ?? {}) as Record<string, unknown>;
      const regridZoning = zoneData.parcel_geometry?.features?.[0]?.properties?.zoning;
      const zoneCode = (details.zone_code as string) || zoneData.zone_code || regridZoning || zoneData.plu?.[0]?.zone_code || "Unknown";
      const zoneName = (details.zone_name as string) || zoneData.zone_name || zoneData.plu?.[0]?.zone_name || "Unknown";
      const permittedUses = (zoneData.plu ?? []).slice(0, 10).map((u) => u.plu_name || u.use_name).filter(Boolean);
      const controls = zoneData.controls ? JSON.stringify(zoneData.controls).substring(0, 500) : "Not available";

      const prompt = `You are a real estate development analyst. Given zoning data, return a JSON object with exactly 3 fields. Be direct, specific, and developer-focused. No fluff.

Zone: ${zoneCode} - ${zoneName}
Permitted Uses: ${permittedUses.join(", ") || "Not specified"}
Controls: ${controls}

Return ONLY valid JSON, no markdown, no explanation:
{
  "use": "One sentence on the primary development type allowed (max 18 words)",
  "constraint": "One sentence on the single most important development constraint (max 18 words)",
  "opportunity": "One sentence on the highest-value opportunity for a developer here (max 18 words)"
}`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });
      if (!res.ok || !res.body) throw new Error("No response");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamed = "";
      let doneStreaming = false;
      while (!doneStreaming) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") { doneStreaming = true; break; }
          try {
            const chunk = JSON.parse(data);
            if (chunk.type === "text_delta" && chunk.content) {
              streamed += chunk.content;
              setAiRaw(streamed);
            }
          } catch { /* ignore */ }
        }
      }

      // Parse the JSON response
      try {
        const jsonMatch = streamed.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as AiBrief;
          if (parsed.use && parsed.constraint && parsed.opportunity) {
            setAiBrief(parsed);
          } else {
            setAiBrief({ use: streamed, constraint: "", opportunity: "" });
          }
        } else {
          setAiBrief({ use: streamed, constraint: "", opportunity: "" });
        }
      } catch {
        setAiBrief({ use: streamed, constraint: "", opportunity: "" });
      }
    } catch (err) {
      setAiBrief({ use: `Unable to generate analysis: ${err instanceof Error ? err.message : "Unknown error"}`, constraint: "", opportunity: "" });
    } finally {
      setIsGeneratingSummary(false);
    }
  }, []);

  // ─── Search ───────────────────────────────────────────────────────────────

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);
    setZonePolygon(null);
    setZoningInfo(null);
    setAiBrief(null);
    setAiRaw("");
    setZoneLabel("");
    setZoneNameLabel("");
    setZoneHeightFt(null);
    setZoneFAR(null);
    setHasSearched(false);

    try {
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const geocodeRes = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxToken}&limit=1`
      );
      const geocodeData = await geocodeRes.json();
      if (!geocodeData.features?.length) { setIsSearching(false); return; }

      const feature = geocodeData.features[0];
      const [centerLng, centerLat] = feature.center as [number, number];
      const locationName = String(feature.place_name || feature.text || searchQuery);
      setSelectedAddress(locationName);
      setMapCenter([centerLng, centerLat]);
      setMapZoom(16);
      setMapMarkers([{ id: "search-location", longitude: centerLng, latitude: centerLat, title: locationName }]);

      const zoningRes = await fetch("/api/zoning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: locationName, lat: centerLat, lng: centerLng }),
      });
      const zoningJson = await zoningRes.json();
      if (!zoningJson.success) throw new Error(zoningJson.error || "Failed to fetch zoning data");

      const zData: ZoningData = zoningJson.data;
      setZoningInfo(zData);
      setHasSearched(true);
      void generateAISummary(zData);

      const details = (zData.zone_details ?? {}) as Record<string, unknown>;
      const regridZoning = zData.parcel_geometry?.features?.[0]?.properties?.zoning;
      const zoneCode = String((details.zone_code as string) || (details.zoning_code as string) || zData.zone_code || regridZoning || zData.plu?.[0]?.zone_code || "Unknown");
      const zoneName = String((details.zone_name as string) || (details.zoning_name as string) || zData.zone_name || zData.plu?.[0]?.zone_name || (regridZoning ? `${regridZoning} Zone` : "Unknown"));

      const controls = zData.controls as Record<string, unknown> | undefined;
      const heightFt = (controls?.height_max_ft as number) || (controls?.max_height_ft as number) || (details.height_max_ft as number) || (details.max_height as number) || null;
      const far = (controls?.far_max as number) || (controls?.floor_area_ratio as number) || (details.far as number) || (details.far_max as number) || null;
      setZoneHeightFt(heightFt);
      setZoneFAR(far);
      setZoneLabel(zoneCode);
      setZoneNameLabel(zoneName);

      // Extract geometry
      let geometry: GeoJsonLike | null = null;
      if (zData.parcel_geometry?.features?.length) {
        geometry = zData.parcel_geometry as unknown as GeoJSON.FeatureCollection;
      } else {
        const candidates = [
          zData.geom, zData.geometry, zData.zone_geometry, zData.zoning_geometry,
          zData.zone_details?.geom, zData.zone_details?.geometry,
          (zData.zone_details as Record<string, unknown> | null | undefined)?.boundary,
          zData.data?.geom, zData.data?.geometry,
        ];
        for (const c of candidates) {
          if (isGeoJsonLike(c)) { geometry = c; break; }
        }
        if (!geometry && zData.parcels?.length) {
          for (const p of zData.parcels) {
            const g = p.geom || p.geometry || p.zone_geom;
            if (isGeoJsonLike(g)) { geometry = g; break; }
          }
        }
        if (!geometry && zData.plu?.length) {
          for (const p of zData.plu) {
            const g = p.geom || p.geometry || p.zone_geom;
            if (isGeoJsonLike(g)) { geometry = g; break; }
          }
        }
      }
      if (!geometry) {
        const latOff = 0.0015, lngOff = 0.002;
        geometry = { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [[[centerLng - lngOff, centerLat - latOff], [centerLng + lngOff, centerLat - latOff], [centerLng + lngOff, centerLat + latOff], [centerLng - lngOff, centerLat + latOff], [centerLng - lngOff, centerLat - latOff]]] } } as GeoJSON.Feature;
      }
      setZonePolygon(geometry as GeoJSON.Feature | GeoJSON.FeatureCollection);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, isSearching, generateAISummary]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); setShowSuggestions(false); void handleSearch(); }
    else if (e.key === "Escape") setShowSuggestions(false);
  };

  const openInChat = useCallback(() => {
    const address = selectedAddress || searchQuery.trim();
    if (!address) return;
    const p = new URLSearchParams({ seed_address: address });
    if (zoneLabel) p.set("seed_zone_code", zoneLabel);
    if (zoneNameLabel) p.set("seed_zone_name", zoneNameLabel);
    if (zoneFAR !== null) p.set("seed_far", String(zoneFAR));
    if (zoneHeightFt !== null) p.set("seed_height_ft", String(zoneHeightFt));
    if (mapMarkers[0]) {
      p.set("seed_lat", String(mapMarkers[0].latitude));
      p.set("seed_lng", String(mapMarkers[0].longitude));
    }
    router.push(`/chat?${p.toString()}`);
  }, [selectedAddress, searchQuery, zoneLabel, zoneNameLabel, zoneFAR, zoneHeightFt, mapMarkers, router]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Search strip ──────────────────────────────────────────────────── */}
      <div className="shrink-0 relative px-6 pt-6 pb-4 border-b border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#0f0f0f]">
        <div className="flex items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <div className={cn(
              "flex items-center rounded-xl border transition-all duration-200",
              "border-black/[0.08] dark:border-white/[0.08] bg-gray-50 dark:bg-[#1a1a1a]",
              "focus-within:border-indigo-400/70 dark:focus-within:border-indigo-500/50 focus-within:bg-white dark:focus-within:bg-[#1f1f1f]",
              "focus-within:ring-2 focus-within:ring-indigo-500/10"
            )}>
              <div className="flex items-center pl-3.5 text-gray-400 dark:text-gray-600 shrink-0">
                {isSearching
                  ? <div className="size-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                  : <HugeSearchIcon className="size-4" />
                }
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Enter an address to analyze zoning…"
                className="flex-1 h-11 bg-transparent px-3 text-sm font-manrope text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none"
              />
              <button
                data-search-btn
                onClick={() => void handleSearch()}
                disabled={!searchQuery.trim() || isSearching}
                type="button"
                className={cn(
                  "mr-1.5 h-8 px-4 rounded-lg text-[13px] font-semibold font-manrope",
                  "border border-black/[0.1] dark:border-white/[0.1]",
                  "bg-white dark:bg-white/[0.06] text-gray-700 dark:text-gray-200",
                  "hover:bg-gray-50 dark:hover:bg-white/[0.1] hover:border-black/[0.15] dark:hover:border-white/[0.15]",
                  "transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                )}
              >
                {isSearching ? "Analyzing…" : "Analyze"}
              </button>
            </div>

            {/* Autocomplete dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-[calc(100%+4px)] inset-x-0 z-50 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1a1a1a] shadow-xl overflow-hidden">
                {suggestions.map((s, i) => (
                  <button
                    key={s.placeId}
                    onMouseDown={() => void selectSuggestion(s)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left",
                      "hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors duration-100",
                      i !== suggestions.length - 1 && "border-b border-black/[0.04] dark:border-white/[0.04]"
                    )}
                  >
                    <HugeLocationIcon className="size-4 text-indigo-500 shrink-0" />
                    <span className="text-sm font-manrope text-gray-700 dark:text-gray-300 leading-tight">{s.description}</span>
                    <HugeArrowRightIcon className="ml-auto size-3.5 text-gray-300 dark:text-gray-600 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Two-panel canvas ──────────────────────────────────────────────── */}
      <div className="flex-1 flex min-h-0">

        {/* Map */}
        <div className="relative flex-1 bg-gray-50 dark:bg-[#0f0f0f]">

          <MapboxMap
            token={process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ""}
            center={mapCenter}
            zoom={mapZoom}
            markers={mapMarkers}
            zonePolygon={zonePolygon}
            zoneLabel={zoneLabel}
            zoneHeightFt={zoneHeightFt}
            zoneFAR={zoneFAR}
            darkMode={isDark}
            className="absolute inset-0"
          />

          {/* Location pill */}
          {hasSearched && selectedAddress && (
            <div className="absolute bottom-4 left-4 z-20">
              <div className="flex items-center gap-2 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-white/90 dark:bg-black/70 backdrop-blur-md px-3 py-2 shadow-sm max-w-xs">
                <HugeLocationIcon className="size-3.5 text-indigo-500 shrink-0" />
                <span className="text-xs font-manrope text-gray-700 dark:text-gray-300 truncate">{selectedAddress}</span>
              </div>
            </div>
          )}
        </div>

        {/* Intelligence panel */}
        <div className="w-[320px] shrink-0 flex flex-col border-l border-black/[0.07] dark:border-white/[0.07] bg-white dark:bg-[#111]">

          {/* Panel header */}
          <div className="shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-black/[0.06] dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <HugeLayersIcon className="size-4 text-indigo-500" />
              <span className="text-sm font-semibold font-manrope text-gray-800 dark:text-gray-200">Intelligence</span>
            </div>
            {hasSearched && zoneLabel && (
              <span className="rounded-full border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold font-manrope text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {zoneLabel}
              </span>
            )}
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">

            {/* Empty — feature preview */}
            {!hasSearched && !isSearching && (
              <div className="px-5 py-6 space-y-4">
                <p className="text-xs font-manrope text-gray-400 dark:text-gray-600 leading-relaxed">
                  Search any US address to unlock:
                </p>
                {[
                  { Icon: HugeMapIcon, label: "Zone code & classification" },
                  { Icon: HugeBuildingIcon, label: "Max height & floor area ratio" },
                  { Icon: HugeRulerIcon, label: "Development controls" },
                  { Icon: HugeCheckCircleIcon, label: "Permitted land uses" },
                  { Icon: HugeSparklesIcon, label: "AI development brief" },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03] text-indigo-500">
                      <Icon className="size-4" />
                    </div>
                    <span className="text-sm font-manrope text-gray-600 dark:text-gray-400">{label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Loading */}
            {isSearching && (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-indigo-500/[0.08] blur-xl animate-pulse" />
                  <Image src="/petal-pulse.svg" alt="" width={32} height={32} className="relative dark:hidden animate-pulse" />
                  <Image src="/petal-pulse-white.svg" alt="" width={32} height={32} className="relative hidden dark:block animate-pulse" />
                </div>
                <p className="text-sm font-manrope text-gray-500 dark:text-gray-500">Fetching zoning data…</p>
              </div>
            )}

            {/* Results */}
            {hasSearched && !isSearching && (
              <div className="px-5 py-4 space-y-4">

                {/* Zone */}
                <div>
                  <Divider label="Zone" />
                  <div className="rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03] px-4 py-3.5">
                    <div className="font-canela text-3xl text-indigo-600 dark:text-indigo-400 leading-none">{zoneLabel || "—"}</div>
                    <div className="mt-1 text-xs font-manrope text-gray-500 dark:text-gray-500 leading-snug">{zoneNameLabel || "Zone classification"}</div>
                  </div>
                </div>

                {/* Building envelope */}
                {(zoneHeightFt || zoneFAR) && (
                  <div>
                    <Divider label="Building Envelope" />
                    <div className="grid grid-cols-2 gap-2">
                      {zoneHeightFt && (
                        <StatCard
                          label="Max Height"
                          value={`${zoneHeightFt} ft`}
                          sub={`~${Math.round(zoneHeightFt / 10)} stories`}
                        />
                      )}
                      {zoneFAR && (
                        <StatCard
                          label="FAR"
                          value={String(zoneFAR)}
                          sub={`${(zoneFAR * 43560).toLocaleString()} sf/ac`}
                        />
                      )}
                    </div>
                    <p className="mt-1.5 text-[10px] font-manrope text-gray-400 dark:text-gray-600 text-center">
                      Tap <strong>3D</strong> on the map to visualize the envelope
                    </p>
                  </div>
                )}

                {/* Permitted uses */}
                {zoningInfo?.plu && zoningInfo.plu.length > 0 && (
                  <div>
                    <Divider label="Permitted Uses" />
                    <div className="space-y-1">
                      {zoningInfo.plu.slice(0, 7).map((use, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 rounded-lg border border-black/[0.05] dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.02] px-3 py-2">
                          <HugeCheckCircleIcon className="size-3.5 text-indigo-500 shrink-0" />
                          <span className="text-xs font-manrope text-gray-600 dark:text-gray-400">{String(use.plu_name || use.use_name || "Permitted use")}</span>
                        </div>
                      ))}
                      {zoningInfo.plu.length > 7 && (
                        <p className="text-center text-[10px] font-manrope text-gray-400 dark:text-gray-600 pt-0.5">+{zoningInfo.plu.length - 7} more</p>
                      )}
                    </div>
                  </div>
                )}

                {/* AI Brief */}
                {(isGeneratingSummary || aiBrief) && (
                  <div>
                    <Divider label="Petal Analysis" />
                    {isGeneratingSummary && !aiBrief && (
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03] p-3.5 animate-pulse">
                            <div className="h-2.5 w-20 rounded bg-gray-200 dark:bg-white/[0.06] mb-2" />
                            <div className="h-2 w-full rounded bg-gray-100 dark:bg-white/[0.04]" />
                          </div>
                        ))}
                      </div>
                    )}
                    {aiBrief && (
                      <div className="space-y-2">
                        <div className="rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-gray-50/60 dark:bg-white/[0.02] p-3.5">
                          <div className="flex items-center gap-2 mb-1.5">
                            <HugeBuildingIcon className="size-3.5 text-indigo-500 shrink-0" />
                            <span className="text-[9px] font-bold font-manrope uppercase tracking-widest text-gray-400 dark:text-gray-600">Primary Use</span>
                          </div>
                          <p className="text-[13px] font-manrope text-gray-700 dark:text-gray-300 leading-snug">{aiBrief.use}</p>
                        </div>
                        <div className="rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-gray-50/60 dark:bg-white/[0.02] p-3.5">
                          <div className="flex items-center gap-2 mb-1.5">
                            <HugeRulerIcon className="size-3.5 text-indigo-500 shrink-0" />
                            <span className="text-[9px] font-bold font-manrope uppercase tracking-widest text-gray-400 dark:text-gray-600">Key Constraint</span>
                          </div>
                          <p className="text-[13px] font-manrope text-gray-700 dark:text-gray-300 leading-snug">{aiBrief.constraint}</p>
                        </div>
                        <div className="rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-gray-50/60 dark:bg-white/[0.02] p-3.5">
                          <div className="flex items-center gap-2 mb-1.5">
                            <HugeSparklesIcon className="size-3.5 text-indigo-500 shrink-0" />
                            <span className="text-[9px] font-bold font-manrope uppercase tracking-widest text-gray-400 dark:text-gray-600">Opportunity</span>
                          </div>
                          <p className="text-[13px] font-manrope text-gray-700 dark:text-gray-300 leading-snug">{aiBrief.opportunity}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>

          {/* CTA footer */}
          {hasSearched && (
            <div className="shrink-0 px-4 pb-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
              <button
                type="button"
                onClick={openInChat}
                disabled={isSearching}
                className={cn(
                  "group w-full flex items-center gap-2.5 rounded-xl px-4 py-3",
                  "bg-white/70 dark:bg-white/[0.08] backdrop-blur-md",
                  "border border-white/80 dark:border-white/[0.12]",
                  "shadow-[0_1px_3px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]",
                  "dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]",
                  "hover:bg-white/90 dark:hover:bg-white/[0.13]",
                  "text-[13px] font-semibold font-manrope tracking-[-0.01em] text-gray-800 dark:text-white/90",
                  "transition-all duration-150 active:scale-[0.99]",
                  "disabled:opacity-40 disabled:cursor-not-allowed"
                )}
              >
                <HugeChatIcon className="size-4 shrink-0 opacity-60" />
                Continue in Chat
                <HugeArrowRightIcon className="ml-auto size-3.5 opacity-30 transition-transform duration-150 group-hover:translate-x-0.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SiteSelectionPage() {
  return (
    <AppGate>
      <AppShell>
        <SiteSelectionContent />
      </AppShell>
    </AppGate>
  );
}
