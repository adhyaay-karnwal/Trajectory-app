export type ToolStepState = "running" | "completed" | "error" | "done";

export interface ToolCallSubstep {
  id: string;
  status: string;
  state?: ToolStepState;
  detail?: string;
}

/** Rich file/workspace link for vault tool rows (side panel + embed chip). */
export interface ToolWorkspaceRef {
  kind: string;
  resourceId: string;
  title: string;
  subtitle?: string;
  embedPath: string;
  peekLabel?: string;
  /** `tab` avoids embedding chat inside chat (opens full window). */
  openMode?: "panel" | "tab";
}

export interface ToolResultPreviewItem {
  title: string;
  subtitle?: string;
  href?: string;
  icon?: string;
  badge?: string;
}

export interface ToolCallStep {
  id: string;
  toolName: string;
  kind?: string;
  thoughtContent?: string;
  status: string;
  state?: ToolStepState;
  inputSummary?: string;
  resultSummary?: string;
  resultItems?: ToolResultPreviewItem[];
  workspace?: ToolWorkspaceRef;
  substeps?: ToolCallSubstep[];
}

export interface LocationMapCardData {
  kind: "location_map";
  title: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface StreetViewCardData {
  kind: "street_view";
  title: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface ZoningBoundaryCardData {
  kind: "zoning_boundary";
  title: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  polygon?: Record<string, unknown> | null;
  zoneCode?: string | null;
  zoneName?: string | null;
  far?: number | null;
  maxHeightFt?: number | null;
  isApproximate?: boolean;
}

/** Persisted agent summary of vault contents (legacy / optional tool output). */
export interface VaultSummaryCardData {
  kind: "vault";
  title: string;
  toolName?: string;
  vaultData?: Record<string, unknown>;
}

export interface ChartCardData {
  kind: "chart";
  chartType: "bar" | "line" | "pie" | "scatter" | "area";
  title: string;
  data: Record<string, unknown>;
  xAxis?: string;
  yAxis?: string;
  workspace?: ToolWorkspaceRef;
}

export interface TrajectoryMapCardData {
  kind: "trajectory_map";
  fromPlanet: string;
  toPlanet: string;
  transferType: "hohmann" | "gravity-assist" | "direct";
  waypoints: string[];
  showOrbits: boolean;
  workspace?: ToolWorkspaceRef;
}

export interface RocketDiagramCardData {
  kind: "rocket_diagram";
  spacecraft: string;
  showStages: boolean;
  showPayload: boolean;
  annotations: string[];
  workspace?: ToolWorkspaceRef;
}

export interface WireframeCardData {
  kind: "wireframe";
  type: "base" | "lander" | "rover" | "station" | "module";
  name: string;
  components: string[];
  dimensions?: Record<string, unknown>;
  annotations: string[];
  workspace?: ToolWorkspaceRef;
}

export type ChatStructuredCard =
  | LocationMapCardData
  | StreetViewCardData
  | ZoningBoundaryCardData
  | VaultSummaryCardData
  | ChartCardData
  | TrajectoryMapCardData
  | RocketDiagramCardData
  | WireframeCardData;

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function pickCoordinates(result: Record<string, unknown>) {
  const raw = typeof result.raw === "object" && result.raw !== null
    ? (result.raw as Record<string, unknown>)
    : null;
  const rawGeometry = raw && typeof raw.geometry === "object" && raw.geometry !== null
    ? (raw.geometry as Record<string, unknown>)
    : null;
  const rawLocation = rawGeometry && typeof rawGeometry.location === "object" && rawGeometry.location !== null
    ? (rawGeometry.location as Record<string, unknown>)
    : null;
  const latitude =
    asNumber(result.latitude) ??
    asNumber(result.lat) ??
    asNumber(result.centroid_lat) ??
    asNumber(result.center_lat) ??
    asNumber(raw?.latitude) ??
    asNumber(raw?.lat) ??
    asNumber(rawLocation?.lat);
  const longitude =
    asNumber(result.longitude) ??
    asNumber(result.lng) ??
    asNumber(result.lon) ??
    asNumber(result.centroid_lng) ??
    asNumber(result.center_lng) ??
    asNumber(raw?.longitude) ??
    asNumber(raw?.lng) ??
    asNumber(raw?.lon) ??
    asNumber(rawLocation?.lng);

  return { latitude, longitude };
}

function isGeoJsonLike(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.type === "string";
}

function extractPolygonFromResult(
  result: Record<string, unknown>,
  latitude: number | null,
  longitude: number | null,
  zoneCode?: string | null,
): { polygon: Record<string, unknown> | null; isApproximate: boolean } {
  const raw = typeof result.raw === "object" && result.raw !== null
    ? (result.raw as Record<string, unknown>)
    : null;
  const details = raw && typeof raw.zone_details === "object" && raw.zone_details !== null
    ? (raw.zone_details as Record<string, unknown>)
    : null;

  let geometry: Record<string, unknown> | null = null;

  const parcelGeometry = raw?.parcel_geometry;
  if (
    parcelGeometry &&
    typeof parcelGeometry === "object" &&
    Array.isArray((parcelGeometry as { features?: unknown[] }).features) &&
    ((parcelGeometry as { features?: unknown[] }).features?.length ?? 0) > 0
  ) {
    geometry = parcelGeometry as Record<string, unknown>;
  } else {
    const candidates = [
      result.polygon,
      raw?.geom,
      raw?.geometry,
      raw?.zone_geometry,
      raw?.zoning_geometry,
      details?.geom,
      details?.geometry,
      details?.boundary,
      raw?.data && typeof raw.data === "object" ? (raw.data as Record<string, unknown>).geom : null,
      raw?.data && typeof raw.data === "object" ? (raw.data as Record<string, unknown>).geometry : null,
    ];

    for (const candidate of candidates) {
      if (isGeoJsonLike(candidate)) {
        geometry = candidate;
        break;
      }
    }

    if (!geometry && Array.isArray(raw?.parcels)) {
      for (const parcel of raw.parcels as Record<string, unknown>[]) {
        const candidate = parcel.geom ?? parcel.geometry ?? parcel.zone_geom;
        if (isGeoJsonLike(candidate)) {
          geometry = candidate;
          break;
        }
      }
    }

    if (!geometry && Array.isArray(raw?.plu)) {
      for (const plu of raw.plu as Record<string, unknown>[]) {
        const candidate = plu.geom ?? plu.geometry ?? plu.zone_geom;
        if (isGeoJsonLike(candidate)) {
          geometry = candidate;
          break;
        }
      }
    }
  }

  if (geometry) {
    return { polygon: geometry, isApproximate: false };
  }

  if (latitude !== null && longitude !== null) {
    return {
      polygon: buildApproximatePolygon(latitude, longitude, zoneCode),
      isApproximate: true,
    };
  }

  return { polygon: null, isApproximate: false };
}

function buildApproximatePolygon(latitude: number, longitude: number, zoneCode?: string | null) {
  const latOffset = 0.00045;
  const lngOffset = 0.0006;

  return {
    type: "Feature",
    properties: {
      zoneCode: zoneCode ?? undefined,
      isApproximate: true,
      stroke: "#4f46e5",
      "stroke-width": 2,
      "stroke-opacity": 0.95,
      fill: "#818cf8",
      "fill-opacity": 0.24,
    },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [longitude - lngOffset, latitude - latOffset],
        [longitude + lngOffset, latitude - latOffset],
        [longitude + lngOffset, latitude + latOffset],
        [longitude - lngOffset, latitude + latOffset],
        [longitude - lngOffset, latitude - latOffset],
      ]],
    },
  };
}

export function buildStructuredCardsFromToolResult(
  toolName: string,
  result: Record<string, unknown>,
  existingCards: ChatStructuredCard[] = []
): ChatStructuredCard[] {
  const cards: ChatStructuredCard[] = [];
  const locationCard = existingCards.find((card) => card.kind === "location_map");
  const existingAddress =
    locationCard?.address ??
    existingCards
      .filter(
        (card): card is LocationMapCardData | StreetViewCardData | ZoningBoundaryCardData =>
          card.kind === "location_map" ||
          card.kind === "street_view" ||
          card.kind === "zoning_boundary",
      )
      .find((card) => card.address)?.address ??
    null;
  const existingLatitude = locationCard?.kind === "location_map" ? (locationCard.latitude ?? null) : null;
  const existingLongitude = locationCard?.kind === "location_map" ? (locationCard.longitude ?? null) : null;

  if (toolName === "get_property_data") {
    const address = typeof result.address === "string" ? result.address : null;
    const { latitude, longitude } = pickCoordinates(result);

    if (latitude !== null && longitude !== null) {
      cards.push({
        kind: "location_map",
        title: "Location",
        address,
        latitude,
        longitude,
      });
    }

    if (address || (latitude !== null && longitude !== null)) {
      cards.push({
        kind: "street_view",
        title: "Street View",
        address,
        latitude,
        longitude,
      });
    }
  }

  if (toolName === "get_zoning_data") {
    const address = (typeof result.address === "string" ? result.address : null) ?? existingAddress;
    const zoneCode = typeof result.zoning_code === "string" ? result.zoning_code : null;
    const zoneName = typeof result.zoning_name === "string" ? result.zoning_name : null;
    const far = asNumber(result.max_far);
    const maxHeightFt = asNumber(result.max_height_ft);
    const { latitude, longitude } = pickCoordinates(result);
    const nextLatitude = latitude ?? existingLatitude;
    const nextLongitude = longitude ?? existingLongitude;
    const { polygon, isApproximate } = extractPolygonFromResult(
      result,
      nextLatitude,
      nextLongitude,
      zoneCode,
    );

    if (
      !existingCards.some((card) => card.kind === "location_map") &&
      ((nextLatitude !== null && nextLongitude !== null) || address)
    ) {
      cards.push({
        kind: "location_map",
        title: "Location",
        address,
        latitude: nextLatitude,
        longitude: nextLongitude,
      });
    }

    if (!existingCards.some((card) => card.kind === "street_view") && address) {
      cards.push({
        kind: "street_view",
        title: "Street View",
        address,
        latitude: nextLatitude,
        longitude: nextLongitude,
      });
    }

    cards.push({
      kind: "zoning_boundary",
      title: "Zoning Boundary",
      address,
      latitude: nextLatitude,
      longitude: nextLongitude,
      polygon,
      zoneCode,
      zoneName,
      far,
      maxHeightFt,
      isApproximate,
    });
  }

  // Handle visualization tools
  if (toolName === "display_chart" && result.visualization === "chart") {
    cards.push({
      kind: "chart",
      chartType: result.chartType as "bar" | "line" | "pie" | "scatter" | "area",
      title: result.title as string,
      data: result.data as Record<string, unknown>,
      xAxis: result.xAxis as string | undefined,
      yAxis: result.yAxis as string | undefined,
    });
  }

  if (toolName === "display_trajectory_map" && result.visualization === "trajectory_map") {
    cards.push({
      kind: "trajectory_map",
      fromPlanet: result.fromPlanet as string,
      toPlanet: result.toPlanet as string,
      transferType: result.transferType as "hohmann" | "gravity-assist" | "direct",
      waypoints: result.waypoints as string[],
      showOrbits: result.showOrbits as boolean,
    });
  }

  if (toolName === "display_rocket_diagram" && result.visualization === "rocket_diagram") {
    cards.push({
      kind: "rocket_diagram",
      spacecraft: result.spacecraft as string,
      showStages: result.showStages as boolean,
      showPayload: result.showPayload as boolean,
      annotations: result.annotations as string[],
    });
  }

  if (toolName === "display_wireframe" && result.visualization === "wireframe") {
    cards.push({
      kind: "wireframe",
      type: result.type as "base" | "lander" | "rover" | "station" | "module",
      name: result.name as string,
      components: result.components as string[],
      dimensions: result.dimensions as Record<string, unknown> | undefined,
      annotations: result.annotations as string[],
    });
  }

  return cards;
}

function extractAddressFromText(text: string): string | null {
  const match = text.match(/\b\d{1,6}\s+[A-Za-z0-9.'-]+(?:\s+[A-Za-z0-9.'-]+)*,\s*[A-Za-z .'-]+,\s*[A-Z]{2}\s+\d{5}\b/);
  return match ? match[0] : null;
}

export function withDerivedStructuredCards(cards: ChatStructuredCard[] = [], content = ""): ChatStructuredCard[] {
  const nextCards = [...cards];
  const zoningCard = nextCards.find((card) => card.kind === "zoning_boundary");
  const locationCard = nextCards.find((card) => card.kind === "location_map");
  const streetViewCard = nextCards.find((card) => card.kind === "street_view");
  const fallbackAddress =
    zoningCard?.address ??
    locationCard?.address ??
    streetViewCard?.address ??
    extractAddressFromText(content);
  const fallbackLatitude =
    zoningCard?.latitude ??
    (locationCard?.kind === "location_map" ? locationCard.latitude : null) ??
    streetViewCard?.latitude ??
    null;
  const fallbackLongitude =
    zoningCard?.longitude ??
    (locationCard?.kind === "location_map" ? locationCard.longitude : null) ??
    streetViewCard?.longitude ??
    null;

  if (zoningCard && !zoningCard.address && fallbackAddress) {
    zoningCard.address = fallbackAddress;
  }

  if (!locationCard && fallbackAddress) {
    nextCards.unshift({
      kind: "location_map",
      title: "Location",
      address: fallbackAddress,
      latitude: fallbackLatitude,
      longitude: fallbackLongitude,
    });
  }

  if (!streetViewCard && fallbackAddress) {
    nextCards.push({
      kind: "street_view",
      title: "Street View",
      address: fallbackAddress,
      latitude: fallbackLatitude ?? null,
      longitude: fallbackLongitude ?? null,
    });
  }

  return nextCards.sort((a, b) => {
    const order: Record<string, number> = {
      location_map: 0,
      zoning_boundary: 1,
      street_view: 2,
      vault: 3,
    };
    return (order[a.kind] ?? 99) - (order[b.kind] ?? 99);
  });
}

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) return value;
  return null;
}

function hostnameFromUrl(value?: string): string | null {
  if (!value) return null;
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function summarizeInput(toolName: string, input: Record<string, unknown>): string | undefined {
  if (toolName === "thought") {
    return asString(input.content) ?? "Thinking";
  }
  if (toolName === "web_search") {
    return asString(input.query) ?? undefined;
  }
  if (toolName === "vault_search") {
    const q = asString(input.query);
    if (q && q.trim().length > 0) return q;
    return "Recent vault items";
  }
  if (toolName === "vault_read_item") {
    const itemType = asString(input.itemType) ?? "item";
    const id = asString(input.id);
    return id ? `${itemType} · ${id.slice(0, 8)}…` : itemType;
  }
  if (toolName === "vault_update_item") {
    const itemType = asString(input.itemType) ?? "item";
    return `Updating ${itemType}`;
  }
  if (toolName === "vault_create_flow") {
    return asString(input.name) ?? "Creating flow";
  }
  if (toolName === "vault_create_proforma") {
    return asString(input.projectName) ?? "Generating pro forma";
  }
  if (toolName === "vault_create_report") {
    return asString(input.name) ?? "Creating report";
  }
  if (toolName === "vault_create_memory") {
    return asString(input.title) ?? "Saving memory";
  }
  if (toolName === "get_property_data") {
    return asString(input.address) ?? "Resolving property";
  }
  if (toolName === "get_zoning_data") {
    return asString(input.address) ?? "Analyzing zoning";
  }
  if (toolName === "get_market_data") {
    return asString(input.address) ?? "Analyzing market";
  }
  if (toolName === "get_property_history") {
    return asString(input.address) ?? "Loading history";
  }
  if (toolName === "get_planet_data") {
    const planet = asString(input.planet);
    return planet ? `Searching ${planet} data` : "Searching planet data";
  }
  if (toolName === "get_spacecraft_data") {
    const spacecraft = asString(input.spacecraft);
    return spacecraft ? `Searching ${spacecraft} specifications` : "Searching spacecraft data";
  }
  if (toolName === "calculate_hohmann_transfer") {
    const from = asString(input.fromPlanet);
    const to = asString(input.toPlanet);
    return from && to ? `Calculating transfer: ${from} → ${to}` : "Calculating transfer orbit";
  }
  if (toolName === "estimate_mission_cost") {
    const destination = asString(input.destination);
    const missionType = asString(input.missionType);
    return destination && missionType ? `Estimating ${missionType} cost to ${destination}` : "Estimating mission cost";
  }
  if (toolName === "get_apod") {
    return "Loading Astronomy Picture of the Day";
  }
  if (toolName === "get_neo_feed") {
    return "Loading Near Earth Objects data";
  }
  if (toolName === "display_chart") {
    const title = asString(input.title);
    return title ? `Creating chart: ${title}` : "Creating chart";
  }
  if (toolName === "display_trajectory_map") {
    const from = asString(input.fromPlanet);
    const to = asString(input.toPlanet);
    return from && to ? `Creating trajectory map: ${from} → ${to}` : "Creating trajectory map";
  }
  if (toolName === "display_rocket_diagram") {
    const spacecraft = asString(input.spacecraft);
    return spacecraft ? `Creating rocket diagram: ${spacecraft}` : "Creating rocket diagram";
  }
  if (toolName === "display_wireframe") {
    const name = asString(input.name);
    const type = asString(input.type);
    return name ? `Creating ${type} wireframe: ${name}` : `Creating ${type} wireframe`;
  }
  return undefined;
}

function buildSubstepsFromResult(
  result: Record<string, unknown>,
): ToolCallSubstep[] | undefined {
  if (!Array.isArray(result.processingSteps)) return undefined;
  const out: ToolCallSubstep[] = [];
  for (const [index, raw] of (result.processingSteps as unknown[]).entries()) {
    if (!raw || typeof raw !== "object") continue;
    const row = raw as Record<string, unknown>;
    const status = asString(row.status);
    if (!status) continue;
    const stateRaw = asString(row.state);
    const state =
      stateRaw === "running" ||
      stateRaw === "completed" ||
      stateRaw === "error" ||
      stateRaw === "done"
        ? stateRaw
        : undefined;
    out.push({
      id: asString(row.id) ?? `step-${index + 1}`,
      status,
      state,
      detail: asString(row.detail) ?? undefined,
    });
  }
  return out.length > 0 ? out : undefined;
}

function vaultKindBadge(itemType: string | null): string | undefined {
  if (!itemType) return undefined;
  const map: Record<string, string> = {
    proforma: "Pro forma",
    flow: "Flow",
    site: "Site",
    conversation: "Chat",
    attachment: "File",
    report: "Report",
    memory: "Memory",
  };
  return map[itemType] ?? itemType;
}

function withEmbedPanel(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (p.includes("embedPanel=")) return p;
  return p.includes("?") ? `${p}&embedPanel=1` : `${p}?embedPanel=1`;
}

/** Side panel / embed target for vault-related tool results. */
export function buildToolWorkspaceRef(
  toolName: string,
  input: Record<string, unknown>,
  result: Record<string, unknown>,
): ToolWorkspaceRef | undefined {
  if (typeof result.error === "string" && result.error.length > 0) return undefined;

  if (toolName === "vault_create_proforma") {
    const id = asString(result.proformaId);
    if (!id) return undefined;
    const rows = typeof result.rowCount === "number" ? result.rowCount : null;
    return {
      kind: "proforma",
      resourceId: id,
      title: asString(result.projectName) ?? "Pro forma",
      subtitle: asString(result.address) ?? asString(result.assetType) ?? undefined,
      embedPath: withEmbedPanel(`/proforma?id=${id}`),
      peekLabel: rows !== null ? `${rows} rows · model` : undefined,
    };
  }

  if (toolName === "vault_create_flow") {
    const id = asString(result.flowId);
    if (!id) return undefined;
    return {
      kind: "flow",
      resourceId: id,
      title: asString(result.name) ?? "Flow",
      subtitle: "Workflow",
      embedPath: withEmbedPanel(`/flows?id=${id}`),
      peekLabel: "Flow canvas",
    };
  }

  if (toolName === "vault_create_report") {
    const id = asString(result.reportId);
    if (!id) return undefined;
    const format = asString(result.format)?.toUpperCase() ?? "FILE";
    return {
      kind: "report",
      resourceId: id,
      title: asString(result.name) ?? "Report",
      subtitle: `${format} Report`,
      embedPath: withEmbedPanel(`/vault/report-preview?id=${id}`),
      peekLabel: "Preview & download",
    };
  }

  // Note: vault_create_memory intentionally does NOT return a workspace ref
  // The user requested no preview card in the chat when the agent creates a memory

  if (toolName === "vault_read_item") {
    const itemType = asString(result.itemType);
    const id = asString(result.id);
    if (!itemType || !id) return undefined;
    const title = asString(result.title) ?? itemType;

    if (itemType === "proforma") {
      const rows = typeof result.rowCount === "number" ? result.rowCount : null;
      return {
        kind: "proforma",
        resourceId: id,
        title,
        subtitle: asString(result.address) ?? asString(result.assetType) ?? undefined,
        embedPath: withEmbedPanel(`/proforma?id=${id}`),
        peekLabel: rows !== null ? `${rows} rows` : undefined,
      };
    }
    if (itemType === "flow") {
      const nc = typeof result.nodeCount === "number" ? result.nodeCount : null;
      const ec = typeof result.edgeCount === "number" ? result.edgeCount : null;
      const peek =
        nc !== null && ec !== null ? `${nc} nodes · ${ec} edges` : undefined;
      return {
        kind: "flow",
        resourceId: id,
        title,
        embedPath: withEmbedPanel(`/flows?id=${id}`),
        peekLabel: peek,
      };
    }
    if (itemType === "site") {
      return {
        kind: "site",
        resourceId: id,
        title,
        subtitle: asString(result.zoneCode) ?? undefined,
        embedPath: withEmbedPanel("/vault?type=site"),
        peekLabel: asString(result.address) ?? undefined,
      };
    }
    if (itemType === "conversation") {
      return {
        kind: "conversation",
        resourceId: id,
        title,
        subtitle:
          typeof result.messageCount === "number"
            ? `${result.messageCount} messages`
            : undefined,
        embedPath: `/chat?id=${id}`,
        openMode: "tab",
        peekLabel: "Opens full chat",
      };
    }
    if (itemType === "attachment") {
      return {
        kind: "attachment",
        resourceId: id,
        title,
        subtitle: asString(result.fileType) ?? undefined,
        embedPath: withEmbedPanel("/vault?type=attachment"),
      };
    }
    if (itemType === "report") {
      const format = asString(result.format)?.toUpperCase() ?? "FILE";
      return {
        kind: "report",
        resourceId: id,
        title,
        subtitle: `${format} Report`,
        embedPath: withEmbedPanel(`/vault/report-preview?id=${id}`),
        peekLabel: asString(result.content)?.slice(0, 100) ?? "Preview & download",
      };
    }
    if (itemType === "memory") {
      const tags = Array.isArray(result.tags) ? (result.tags as string[]).join(", ") : null;
      return {
        kind: "memory",
        resourceId: id,
        title,
        subtitle: tags ? `Tags: ${tags}` : "Memory",
        embedPath: withEmbedPanel(`/vault/memory-preview?id=${id}`),
        peekLabel: asString(result.content)?.slice(0, 100) ?? "View memory",
      };
    }
    return undefined;
  }

  if (toolName === "vault_update_item") {
    const itemType = asString(input.itemType);
    const id = asString(input.id);
    if (!itemType || !id) return undefined;

    if (itemType === "proforma") {
      return {
        kind: "proforma",
        resourceId: id,
        title: asString(input.projectName) ?? "Pro forma",
        subtitle: asString(input.address) ?? asString(input.assetType) ?? undefined,
        embedPath: withEmbedPanel(`/proforma?id=${id}`),
        peekLabel: "Saved",
      };
    }
    if (itemType === "flow") {
      return {
        kind: "flow",
        resourceId: id,
        title: asString(input.name) ?? "Flow",
        embedPath: withEmbedPanel(`/flows?id=${id}`),
        peekLabel: "Saved",
      };
    }
    if (itemType === "site") {
      return {
        kind: "site",
        resourceId: id,
        title: asString(input.address) ?? "Site",
        embedPath: withEmbedPanel("/vault?type=site"),
        peekLabel: "Saved",
      };
    }
    if (itemType === "conversation") {
      return {
        kind: "conversation",
        resourceId: id,
        title: asString(input.title) ?? "Chat",
        embedPath: `/chat?id=${id}`,
        openMode: "tab",
      };
    }
    if (itemType === "report") {
      return {
        kind: "report",
        resourceId: id,
        title: asString(input.name) ?? "Report",
        embedPath: withEmbedPanel(`/vault/report-preview?id=${id}`),
        peekLabel: "Saved",
      };
    }
    if (itemType === "memory") {
      return {
        kind: "memory",
        resourceId: id,
        title: asString(input.title) ?? "Memory",
        embedPath: withEmbedPanel(`/vault/memory-preview?id=${id}`),
        peekLabel: "Saved",
      };
    }
    return undefined;
  }

  return undefined;
}

function buildPreviewItems(
  toolName: string,
  result: Record<string, unknown>,
): ToolResultPreviewItem[] {
  if (toolName === "web_search" && Array.isArray(result.results)) {
    return (result.results as Record<string, unknown>[])
      .slice(0, 6)
      .map((r) => ({
        title: asString(r.title) ?? "Untitled result",
        subtitle: hostnameFromUrl(asString(r.url) ?? undefined) ?? asString(r.snippet) ?? undefined,
        href: asString(r.url) ?? undefined,
        icon: "web",
      }));
  }

  if (toolName === "vault_search" && Array.isArray(result.results)) {
    return (result.results as Record<string, unknown>[])
      .slice(0, 10)
      .map((r) => {
        const itemType = asString(r.itemType);
        const folder = asString(r.folderName);
        const baseSub = asString(r.subtitle) ?? itemType ?? undefined;
        const subtitle = folder ? `${baseSub ?? ""}${baseSub ? " · " : ""}Folder: ${folder}` : baseSub;
        return {
          title: asString(r.title) ?? "Untitled item",
          subtitle,
          href: asString(r.path) ?? undefined,
          icon: itemType ?? "vault",
          badge: vaultKindBadge(itemType),
        };
      });
  }

  if (toolName === "vault_read_item") {
    const title = asString(result.title) ?? "Vault item";
    const itemType = asString(result.itemType);
    const path = asString(result.path);
    const subParts = [
      vaultKindBadge(itemType),
      asString(result.address),
      asString(result.assetType),
      typeof result.messageCount === "number" ? `${result.messageCount} messages` : null,
      typeof result.nodeCount === "number" && typeof result.edgeCount === "number"
        ? `${result.nodeCount} nodes · ${result.edgeCount} edges`
        : null,
    ].filter(Boolean);
    return [
      {
        title,
        subtitle: subParts.length > 0 ? subParts.join(" · ") : "Open in Trajectory",
        href: path ?? undefined,
        icon: itemType ?? "vault",
        badge: vaultKindBadge(itemType),
      },
    ];
  }

  if (toolName === "vault_create_flow") {
    const name = asString(result.name) ?? "New flow";
    const flowId = asString(result.flowId);
    return [
      {
        title: name,
        subtitle: flowId ? `Saved to vault` : "Flow created",
        href: flowId ? `/flows?id=${flowId}` : "/flows",
        icon: "flow",
        badge: "Flow",
      },
    ];
  }

  if (toolName === "vault_create_proforma") {
    const name = asString(result.projectName) ?? "New pro forma";
    const proformaId = asString(result.proformaId);
    return [
      {
        title: name,
        subtitle: proformaId ? `Saved to vault` : "Pro forma created",
        href: proformaId ? `/proforma?id=${proformaId}` : "/proforma",
        icon: "proforma",
        badge: "Pro forma",
      },
    ];
  }

  if (toolName === "vault_create_report") {
    const name = asString(result.name) ?? "New report";
    const reportId = asString(result.reportId);
    const format = asString(result.format)?.toUpperCase() ?? "FILE";
    return [
      {
        title: name,
        subtitle: reportId ? `Saved to vault` : "Report created",
        href: reportId ? `/vault/report-preview?id=${reportId}` : "/vault",
        icon: "report",
        badge: `${format} Report`,
      },
    ];
  }

  if (toolName === "vault_create_memory") {
    const title = asString(result.title) ?? "New memory";
    const memoryId = asString(result.memoryId);
    return [
      {
        title,
        subtitle: memoryId ? `Saved to vault` : "Memory created",
        href: memoryId ? `/vault?type=memory&id=${memoryId}` : "/vault",
        icon: "memory",
        badge: "Memory",
      },
    ];
  }

  return [];
}

export function buildToolStepFromResult(
  toolName: string,
  input: Record<string, unknown>,
  result: Record<string, unknown>,
): Pick<
  ToolCallStep,
  "status" | "state" | "inputSummary" | "resultSummary" | "resultItems" | "workspace" | "substeps"
> {
  const hasError = typeof result.error === "string" && result.error.length > 0;
  const inputSummary = summarizeInput(toolName, input);
  const resultItems = buildPreviewItems(toolName, result);
  const workspace = buildToolWorkspaceRef(toolName, input, result);
  const substeps = buildSubstepsFromResult(result);

  if (hasError) {
    return {
      status: `Failed: ${String(result.error)}`,
      state: "error",
      inputSummary,
      resultSummary: String(result.error),
      resultItems: [],
      substeps,
    };
  }

  if (toolName === "web_search") {
    const count = Array.isArray(result.results) ? result.results.length : 0;
    return {
      status: `Searched web (${count} result${count === 1 ? "" : "s"})`,
      state: "completed",
      inputSummary,
      resultSummary: asString(result.answer) ?? undefined,
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "thought") {
    const content = asString(result.content) ?? inputSummary ?? "Thinking";
    return {
      status: "Thought",
      state: "completed",
      inputSummary,
      resultSummary: content,
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "vault_search") {
    const count = typeof result.matchCount === "number" ? result.matchCount : Array.isArray(result.results) ? result.results.length : 0;
    const byType: Record<string, number> = {};
    if (Array.isArray(result.results)) {
      for (const row of result.results as Record<string, unknown>[]) {
        const t = asString(row.itemType) ?? "item";
        byType[t] = (byType[t] ?? 0) + 1;
      }
    }
    const chipParts = Object.entries(byType)
      .map(([k, n]) => `${vaultKindBadge(k) ?? k} ${n}`)
      .slice(0, 5);
    const chipText = chipParts.length > 0 ? chipParts.join(" · ") : undefined;
    return {
      status: count === 0 ? "No vault matches" : `${count} vault result${count === 1 ? "" : "s"}`,
      state: "completed",
      inputSummary,
      resultSummary: count > 0 ? (chipText ?? "Vault context loaded") : "No matching vault items",
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "vault_read_item") {
    const label = asString(result.title) ?? asString(result.itemType) ?? "Vault item";
    return {
      status: `Opened ${label}`,
      state: "completed",
      inputSummary,
      resultSummary:
        asString(result.notes) ??
        (typeof result.textPreview === "string" ? result.textPreview.slice(0, 280) : undefined) ??
        (typeof result.messageCount === "number" ? `${result.messageCount} messages in thread` : undefined) ??
        "Details loaded",
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "vault_update_item") {
    return {
      status: "Updated vault item",
      state: "completed",
      inputSummary,
      resultSummary: asString(result.summary) ?? "Changes saved",
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "vault_create_flow") {
    return {
      status: "Created flow",
      state: "completed",
      inputSummary,
      resultSummary: asString(result.name) ?? "Flow saved to vault",
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "vault_create_proforma") {
    return {
      status: "Created pro forma",
      state: "completed",
      inputSummary,
      resultSummary: asString(result.projectName) ?? "Pro forma saved to vault",
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "vault_create_report") {
    const format = asString(result.format)?.toUpperCase() ?? "FILE";
    return {
      status: `Created ${format} report`,
      state: "completed",
      inputSummary,
      resultSummary: asString(result.name) ?? "Report saved to vault",
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "vault_create_memory") {
    return {
      status: "Saved memory",
      state: "completed",
      inputSummary,
      resultSummary: asString(result.title) ?? "Memory saved to vault",
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "get_property_data" && !hasError) {
    const addr = asString(result.address) ?? inputSummary;
    return {
      status: addr ? `Parcel data for ${addr}` : "Parcel data loaded",
      state: "completed",
      inputSummary,
      resultSummary: undefined,
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "get_zoning_data" && !hasError) {
    const addr = asString(result.address) ?? inputSummary;
    const z = asString(result.zoning_code) ?? asString(result.zoning_name);
    return {
      status: z ? `Zoning (${z})` : addr ? `Zoning for ${addr}` : "Zoning loaded",
      state: "completed",
      inputSummary,
      resultSummary: undefined,
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "get_market_data" && !hasError) {
    return {
      status: "Market demographics loaded",
      state: "completed",
      inputSummary,
      resultSummary: undefined,
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "get_property_history" && !hasError) {
    return {
      status: "Sales history loaded",
      state: "completed",
      inputSummary,
      resultSummary: undefined,
      resultItems,
      workspace,
      substeps,
    };
  }

  // NASA API tools
  if (toolName === "get_planet_data" && !hasError) {
    const planet = asString(input.planet) ?? asString(result.planet);
    return {
      status: planet ? `Found ${planet} information` : "Planet data loaded",
      state: "completed",
      inputSummary,
      resultSummary: asString(result.summary) ?? undefined,
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "get_spacecraft_data" && !hasError) {
    const spacecraft = asString(input.spacecraft) ?? asString(result.spacecraft);
    return {
      status: spacecraft ? `Found ${spacecraft} specifications` : "Spacecraft data loaded",
      state: "completed",
      inputSummary,
      resultSummary: asString(result.summary) ?? undefined,
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "calculate_hohmann_transfer" && !hasError) {
    const from = asString(input.fromPlanet) ?? asString(result.fromPlanet);
    const to = asString(input.toPlanet) ?? asString(result.toPlanet);
    return {
      status: from && to ? `Calculated transfer from ${from} to ${to}` : "Transfer orbit calculated",
      state: "completed",
      inputSummary,
      resultSummary: asString(result.summary) ?? undefined,
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "estimate_mission_cost" && !hasError) {
    const destination = asString(input.destination) ?? asString(result.destination);
    const missionType = asString(input.missionType) ?? asString(result.missionType);
    return {
      status: destination && missionType ? `Estimated cost for ${missionType} to ${destination}` : "Mission cost estimated",
      state: "completed",
      inputSummary,
      resultSummary: asString(result.summary) ?? undefined,
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "get_apod" && !hasError) {
    return {
      status: "Astronomy Picture of the Day loaded",
      state: "completed",
      inputSummary,
      resultSummary: asString(result.title) ?? undefined,
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "get_neo_feed" && !hasError) {
    return {
      status: "Near Earth Objects data loaded",
      state: "completed",
      inputSummary,
      resultSummary: asString(result.summary) ?? undefined,
      resultItems,
      workspace,
      substeps,
    };
  }

  // Visualization tools
  if (toolName === "display_chart" && !hasError) {
    const chartType = asString(result.chartType) ?? "chart";
    const title = asString(result.title);
    return {
      status: title ? `Created ${chartType} chart: ${title}` : `Created ${chartType} chart`,
      state: "completed",
      inputSummary,
      resultSummary: undefined,
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "display_trajectory_map" && !hasError) {
    const from = asString(result.fromPlanet);
    const to = asString(result.toPlanet);
    return {
      status: from && to ? `Created trajectory map: ${from} to ${to}` : "Created trajectory map",
      state: "completed",
      inputSummary,
      resultSummary: undefined,
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "display_rocket_diagram" && !hasError) {
    const spacecraft = asString(result.spacecraft);
    return {
      status: spacecraft ? `Created rocket diagram: ${spacecraft}` : "Created rocket diagram",
      state: "completed",
      inputSummary,
      resultSummary: undefined,
      resultItems,
      workspace,
      substeps,
    };
  }

  if (toolName === "display_wireframe" && !hasError) {
    const name = asString(result.name);
    const type = asString(result.type);
    return {
      status: name ? `Created ${type} wireframe: ${name}` : `Created ${type} wireframe`,
      state: "completed",
      inputSummary,
      resultSummary: undefined,
      resultItems,
      workspace,
      substeps,
    };
  }

  return {
    status: "Completed",
    state: "completed",
    inputSummary,
    resultSummary: undefined,
    resultItems,
    workspace,
    substeps,
  };
}
