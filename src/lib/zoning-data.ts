const ZONEOMICS_FIELDS = ["zoning", "controls", "plu", "parcels"] as const;
const ZONEOMICS_BASE = "https://api.zoneomics.com/v2/zoneDetail";

async function geocodeAddress(address: string): Promise<{
  latitude: number | null;
  longitude: number | null;
  formattedAddress?: string | null;
}> {
  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return { latitude: null, longitude: null, formattedAddress: null };

  try {
    const params = new URLSearchParams({ address, key: apiKey });
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`, {
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return { latitude: null, longitude: null, formattedAddress: null };
    const data = await response.json() as Record<string, unknown>;
    const first = Array.isArray(data.results) ? data.results[0] as Record<string, unknown> | undefined : undefined;
    const location =
      first && typeof first.geometry === "object" && first.geometry !== null
        ? (first.geometry as { location?: { lat?: unknown; lng?: unknown } }).location
        : undefined;

    return {
      latitude: typeof location?.lat === "number" ? location.lat : null,
      longitude: typeof location?.lng === "number" ? location.lng : null,
      formattedAddress: typeof first?.formatted_address === "string" ? first.formatted_address : address,
    };
  } catch {
    return { latitude: null, longitude: null, formattedAddress: address };
  }
}

export interface RegridProperties {
  zoning?: string;
  zoning_description?: string;
  address?: string;
  city?: string;
  state?: string;
  [key: string]: unknown;
}

export function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const src = source[key];
    const tgt = result[key];
    if (
      src && typeof src === "object" && !Array.isArray(src) &&
      tgt && typeof tgt === "object" && !Array.isArray(tgt)
    ) {
      result[key] = deepMerge(
        tgt as Record<string, unknown>,
        src as Record<string, unknown>
      );
    } else if (src !== undefined && src !== null) {
      result[key] = src;
    }
  }
  return result;
}

export async function fetchZoneomicsField(
  field: string,
  params: { address?: string; lat?: number; lng?: number }
): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.ZONEOMICS_API_KEY;
  if (!apiKey) return null;

  const sp = new URLSearchParams({
    api_key: apiKey,
    output_fields: field,
    group_plu: "true",
    replace_STF: "true",
  });

  if (params.address) {
    sp.set("address", params.address);
  } else if (params.lat != null && params.lng != null) {
    sp.set("lat", String(params.lat));
    sp.set("lng", String(params.lng));
  } else {
    return null;
  }

  try {
    const res = await fetch(`${ZONEOMICS_BASE}?${sp}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;

    const json = (await res.json()) as Record<string, unknown>;
    if (!json.success || !json.data) return null;

    let data = json.data;
    if (Array.isArray(data) && data.length === 1 && data[0] && typeof data[0] === "object") {
      data = data[0];
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    if (Object.keys(data as Record<string, unknown>).length === 0) return null;

    return data as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function fetchZoneomics(params: {
  address?: string;
  lat?: number;
  lng?: number;
}): Promise<Record<string, unknown>> {
  const results = await Promise.all(
    ZONEOMICS_FIELDS.map((f) => fetchZoneomicsField(f, params))
  );

  let merged: Record<string, unknown> = {};
  let anySuccess = false;

  for (const data of results) {
    if (!data) continue;
    merged = deepMerge(merged, data);
    anySuccess = true;
  }

  if (!anySuccess) {
    const fallback = await fetchZoneomicsField("all", params);
    if (fallback) merged = fallback;
  }

  return merged;
}

export function normalizeRegridFeatures(raw: unknown): GeoJSON.FeatureCollection | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const features = (r.features as Array<Record<string, unknown>> | undefined) ?? [];
  if (!features.length) return null;

  const normalized = features.map((f) => {
    const rawProps = (f.properties ?? {}) as Record<string, unknown>;
    const fields = (rawProps.fields ?? {}) as Record<string, unknown>;

    const props: RegridProperties = {
      headline: rawProps.headline as string | undefined,
      path: rawProps.path as string | undefined,
      ll_uuid: rawProps.ll_uuid as string | undefined,
      parcelnumb: fields.parcelnumb as string | undefined,
      address: (fields.address as string | undefined) ?? (rawProps.headline as string | undefined),
      city: (fields.scity as string | undefined) ?? (fields.city as string | undefined),
      state: (fields.state2 as string | undefined) ?? (fields.state as string | undefined),
      zip: (fields.szip as string | undefined) ?? (fields.szip5 as string | undefined),
      county: fields.county as string | undefined,
      zoning: fields.zoning as string | undefined,
      zoning_description: fields.zoning_description as string | undefined,
      zoning_type: fields.zoning_type as string | undefined,
      zoning_subtype: fields.zoning_subtype as string | undefined,
      owner: fields.owner as string | undefined,
      ll_gisacre: fields.ll_gisacre as number | undefined,
      ll_gissqft: fields.ll_gissqft as number | undefined,
    };

    return {
      type: "Feature" as const,
      geometry: f.geometry as GeoJSON.Geometry,
      properties: props,
    };
  });

  return { type: "FeatureCollection", features: normalized };
}

export async function fetchRegrid(params: {
  lat?: number;
  lng?: number;
  address?: string;
}): Promise<GeoJSON.FeatureCollection | null> {
  const apiKey = process.env.REGRID_API_KEY;
  if (!apiKey) return null;

  try {
    let raw: unknown = null;

    if (params.lat != null && params.lng != null) {
      const url = `https://app.regrid.com/api/v2/parcels/point?lat=${params.lat}&lon=${params.lng}&token=${apiKey}&return_custom=true&radius=50&limit=5`;
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(12000),
      });
      if (res.ok) {
        const d = await res.json() as Record<string, unknown>;
        raw = d.parcels ?? d;
      }
    } else if (params.address) {
      const url = `https://app.regrid.com/api/v2/parcel.json?token=${apiKey}&query=${encodeURIComponent(params.address)}&return_geometry=true&limit=3`;
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(12000),
      });
      if (res.ok) {
        const d = await res.json() as Record<string, unknown>;
        raw = d.parcels ?? d;
      }
    }

    return normalizeRegridFeatures(raw);
  } catch {
    return null;
  }
}

export async function getUnifiedZoningData(params: {
  address?: string;
  lat?: number;
  lng?: number;
}): Promise<Record<string, unknown>> {
  let resolvedLat = params.lat ?? null;
  let resolvedLng = params.lng ?? null;
  let formattedAddress = params.address ?? null;

  if ((resolvedLat == null || resolvedLng == null) && params.address) {
    const geocoded = await geocodeAddress(params.address);
    resolvedLat = resolvedLat ?? geocoded.latitude;
    resolvedLng = resolvedLng ?? geocoded.longitude;
    formattedAddress = geocoded.formattedAddress ?? formattedAddress;
  }

  const lookupParams = {
    address: formattedAddress ?? params.address,
    lat: resolvedLat ?? undefined,
    lng: resolvedLng ?? undefined,
  };

  const [zoningData, regridData] = await Promise.all([
    fetchZoneomics(lookupParams).catch(() => ({} as Record<string, unknown>)),
    fetchRegrid(lookupParams).catch(() => null),
  ]);

  const zoneDetails = (zoningData.zone_details ?? {}) as Record<string, unknown>;
  const pluArray = zoningData.plu as unknown[] | undefined;
  const hasZoneCode =
    zoneDetails.zone_code || zoningData.zone_code ||
    (pluArray && pluArray.length > 0);

  let supplementZoneCode: string | null = null;
  let supplementZoneName: string | null = null;
  if (!hasZoneCode && regridData?.features?.[0]?.properties) {
    const rProps = regridData.features[0].properties as RegridProperties;
    supplementZoneCode = rProps.zoning ?? null;
    supplementZoneName = rProps.zoning_description ?? null;
  }

  return {
    ...zoningData,
    ...(formattedAddress ? { formatted_address: formattedAddress } : {}),
    ...(resolvedLat != null ? { lat: resolvedLat, latitude: resolvedLat } : {}),
    ...(resolvedLng != null ? { lng: resolvedLng, longitude: resolvedLng } : {}),
    ...(supplementZoneCode ? { zone_code: supplementZoneCode } : {}),
    ...(supplementZoneName ? { zone_name: supplementZoneName } : {}),
    parcel_geometry: regridData,
  };
}
