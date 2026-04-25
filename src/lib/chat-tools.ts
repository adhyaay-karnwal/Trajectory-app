/**
 * Trajectory chat tool definitions + executors.
 * Each tool maps 1:1 to a Claude tool_use call.
 */

import Anthropic from "@anthropic-ai/sdk";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";

// ─── Tool definitions (passed to Claude) ──────────────────────────────────────

export const TOOL_DEFINITIONS = [
  {
    name: "thought",
    description:
      "Log a brief internal working note for the user-visible trace before or between major tool calls.",
    input_schema: {
      type: "object" as const,
      properties: {
        content: {
          type: "string",
          description: "Short note about current plan/progress (1-2 sentences).",
        },
        stage: {
          type: "string",
          description: "Optional stage label, e.g. planning, validation, finalization.",
        },
      },
      required: ["content"],
    },
  },
  {
    name: "get_planet_data",
    description:
      "Get detailed planetary data for any planet in our solar system: distance from Earth/Sun, gravity, atmosphere, temperature, moons, resources, habitability, travel time, delta-v requirements. Call this first for any destination-specific question.",
    input_schema: {
      type: "object" as const,
      properties: {
        planet: { type: "string", description: "Planet name (e.g., 'mars', 'jupiter', 'venus')" },
      },
      required: [],
    },
  },
  {
    name: "get_spacecraft_data",
    description:
      "Get spacecraft/rocket specifications: payload capacity, thrust, fuel, dimensions, capabilities, reusability. Use to determine if a spacecraft can handle a specific mission.",
    input_schema: {
      type: "object" as const,
      properties: {
        spacecraft: { type: "string", description: "Spacecraft name (e.g., 'starship', 'falcon-heavy', 'sls')" },
      },
      required: [],
    },
  },
  {
    name: "calculate_hohmann_transfer",
    description:
      "Calculate orbital mechanics for transfer between two planets: transfer orbit, travel time, delta-v requirements, launch windows. Use for mission planning and feasibility assessment.",
    input_schema: {
      type: "object" as const,
      properties: {
        fromPlanet: { type: "string", description: "Starting planet (e.g., 'earth')" },
        toPlanet: { type: "string", description: "Destination planet (e.g., 'mars')" },
      },
      required: ["fromPlanet", "toPlanet"],
    },
  },
  {
    name: "estimate_mission_cost",
    description:
      "Estimate rough mission costs based on destination, mission type, spacecraft, and crew requirements. Provides order-of-magnitude estimates for planning.",
    input_schema: {
      type: "object" as const,
      properties: {
        destination: { type: "string", description: "Destination planet" },
        missionType: { type: "string", enum: ["flyby", "orbit", "land", "sample-return"], description: "Type of mission" },
        spacecraft: { type: "string", description: "Spacecraft to use" },
        crewSize: { type: "number", description: "Number of crew members (0 for uncrewed)" },
      },
      required: ["destination", "missionType", "spacecraft"],
    },
  },
  {
    name: "get_apod",
    description:
      "Get NASA's Astronomy Picture of the Day with stunning space imagery and descriptions. Use for visual context or inspiration.",
    input_schema: {
      type: "object" as const,
      properties: {
        date: { type: "string", description: "Optional date in YYYY-MM-DD format" },
      },
      required: [],
    },
  },
  {
    name: "get_neo_feed",
    description:
      "Get Near Earth Objects (asteroids) data including tracking and close approach information. Use for asteroid mission planning or hazard assessment.",
    input_schema: {
      type: "object" as const,
      properties: {
        startDate: { type: "string", description: "Start date in YYYY-MM-DD format" },
        endDate: { type: "string", description: "Optional end date in YYYY-MM-DD format" },
      },
      required: ["startDate"],
    },
  },
  {
    name: "get_mars_photos",
    description:
      "Get Mars rover imagery from Curiosity, Opportunity, or Spirit rovers. Use for visual context of Mars surface conditions.",
    input_schema: {
      type: "object" as const,
      properties: {
        rover: { type: "string", enum: ["curiosity", "opportunity", "spirit"], description: "Mars rover name" },
        sol: { type: "number", description: "Optional Martian sol (day)" },
        earthDate: { type: "string", description: "Optional Earth date in YYYY-MM-DD format" },
      },
      required: ["rover"],
    },
  },
  {
    name: "display_chart",
    description:
      "Display a data visualization chart (bar, line, pie, scatter) to help users understand mission data, costs, or comparisons. Use when presenting numerical data that would benefit from visual representation.",
    input_schema: {
      type: "object" as const,
      properties: {
        chartType: { type: "string", enum: ["bar", "line", "pie", "scatter", "area"], description: "Type of chart" },
        title: { type: "string", description: "Chart title" },
        data: { type: "string", description: "JSON string with chart data (labels, datasets, values)" },
        xAxis: { type: "string", description: "X-axis label" },
        yAxis: { type: "string", description: "Y-axis label" },
      },
      required: ["chartType", "title", "data"],
    },
  },
  {
    name: "display_trajectory_map",
    description:
      "Display an orbital trajectory visualization showing spacecraft path between planets. Use for mission planning to visualize transfer orbits, launch windows, and planetary alignments.",
    input_schema: {
      type: "object" as const,
      properties: {
        fromPlanet: { type: "string", description: "Starting planet" },
        toPlanet: { type: "string", description: "Destination planet" },
        transferType: { type: "string", enum: ["hohmann", "gravity-assist", "direct"], description: "Type of transfer" },
        waypoints: { type: "array", items: { type: "string" }, description: "Optional waypoints (planet names)" },
        showOrbits: { type: "boolean", description: "Show planetary orbits" },
      },
      required: ["fromPlanet", "toPlanet", "transferType"],
    },
  },
  {
    name: "display_rocket_diagram",
    description:
      "Display a spacecraft/rocket design diagram showing components, stages, and specifications. Use when explaining spacecraft architecture or mission vehicle design.",
    input_schema: {
      type: "object" as const,
      properties: {
        spacecraft: { type: "string", description: "Spacecraft name (e.g., 'starship', 'falcon-heavy')" },
        showStages: { type: "boolean", description: "Show rocket stages" },
        showPayload: { type: "boolean", description: "Show payload section" },
        annotations: { type: "array", items: { type: "string" }, description: "Optional annotations for components" },
      },
      required: ["spacecraft"],
    },
  },
  {
    name: "display_wireframe",
    description:
      "Display a 3D wireframe or schematic for mission architecture, base layouts, or equipment configurations. Use for structural planning and spatial visualization.",
    input_schema: {
      type: "object" as const,
      properties: {
        type: { type: "string", enum: ["base", "lander", "rover", "station", "module"], description: "Type of structure" },
        name: { type: "string", description: "Name of the structure" },
        components: { type: "array", items: { type: "string" }, description: "List of components to show" },
        dimensions: { type: "string", description: "Optional dimensions as JSON string" },
        annotations: { type: "array", items: { type: "string" }, description: "Optional annotations" },
      },
      required: ["type", "name"],
    },
  },
  {
    name: "web_search",
    description:
      "Search the web for current information: space news, mission updates, launch schedules, space technology, or recent discoveries. Use for anything time-sensitive.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Search query" },
        topic: { type: "string", description: "Topic hint: 'space' | 'mission' | 'news' | 'general'" },
      },
      required: ["query"],
    },
  },
  {
    name: "vault_search",
    description:
      "Search the authenticated user's vault across mission plans, reports, saved analyses, chats, uploaded files, and folder names. Use before reading or editing vault content. Call with an empty query to list recent items across the vault.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Keywords to match titles, paths, types, and folder names (empty = browse recent)" },
        limit: { type: "number", description: "Max results to return (default 10, max 25)" },
        types: {
          type: "array",
          items: {
            type: "string",
            enum: ["conversation", "attachment", "report", "memory"],
          },
          description: "Optional: only include these vault kinds",
        },
      },
      required: [],
    },
  },
  {
    name: "vault_read_item",
    description:
      "Read one vault item in detail using its itemType and id from vault_search. Supports conversation, attachment, report, and memory.",
    input_schema: {
      type: "object" as const,
      properties: {
        itemType: {
          type: "string",
          enum: ["conversation", "attachment", "report", "memory"],
          description: "Vault item type",
        },
        id: { type: "string", description: "The vault item id" },
        includeRaw: { type: "boolean", description: "Include full raw JSON/content when available" },
      },
      required: ["itemType", "id"],
    },
  },
  {
    name: "vault_update_item",
    description:
      "Update an existing vault item. Use after vault_read_item. Supports updating conversation titles, reports, and memories.",
    input_schema: {
      type: "object" as const,
      properties: {
        itemType: {
          type: "string",
          enum: ["conversation", "report", "memory"],
          description: "Vault item type",
        },
        id: { type: "string", description: "The vault item id" },
        title: { type: "string", description: "For conversations" },
        content: { type: "string", description: "For reports - updated report content" },
        tags: { type: "array", items: { type: "string" }, description: "For memories - updated tags" },
      },
      required: ["itemType", "id"],
    },
  },
  {
    name: "vault_create_report",
    description:
      "Create a new report (PDF, TXT, or MD format) in the user's vault. Use when user asks to save a mission analysis or document. Supports markdown content which can be converted to PDF.",
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Report name/title" },
        content: { type: "string", description: "The report content (markdown, text, or HTML for PDF)" },
        format: { type: "string", enum: ["pdf", "txt", "md"], description: "Output format: pdf, txt, or md" },
      },
      required: ["name", "content", "format"],
    },
  },
  {
    name: "vault_create_memory",
    description:
      "Create a new memory in the user's vault. Use to save important information, learnings, notes, or thoughts that should be remembered for future reference. The agent should use this proactively when it learns something important or wants to remember something for later.",
    input_schema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "Memory title/name" },
        content: { type: "string", description: "The memory content (notes, learnings, important info)" },
        tags: { type: "array", items: { type: "string" }, description: "Optional tags to help organize the memory (e.g., ['mars', 'mission', 'important'])" },
      },
      required: ["title", "content"],
    },
  },
] as const;

export type ToolName = (typeof TOOL_DEFINITIONS)[number]["name"];

export interface ToolExecutionContext {
  convexAccessToken?: string;
  webSearchEnabled?: boolean;
}

export const TOOL_STATUS_LABELS: Record<ToolName, string> = {
  thought: "Thinking…",
  get_planet_data: "Retrieving planetary data…",
  get_spacecraft_data: "Fetching spacecraft specs…",
  calculate_hohmann_transfer: "Calculating orbital mechanics…",
  estimate_mission_cost: "Estimating mission costs…",
  get_apod: "Loading space imagery…",
  get_neo_feed: "Retrieving asteroid data…",
  get_mars_photos: "Fetching Mars imagery…",
  display_chart: "Generating chart…",
  display_trajectory_map: "Visualizing trajectory…",
  display_rocket_diagram: "Rendering rocket diagram…",
  display_wireframe: "Creating wireframe…",
  web_search: "Searching the web…",
  vault_search: "Searching your vault…",
  vault_read_item: "Reading vault item…",
  vault_update_item: "Updating vault item…",
  vault_create_report: "Creating report…",
  vault_create_memory: "Saving memory…",
};

// ─── Tool executors ───────────────────────────────────────────────────────────

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

async function fetchJson(url: string, options?: RequestInit) {
  const res = await fetch(url, { ...options, signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

async function geocodeAddress(address: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return { latitude: null, longitude: null };

  try {
    const params = new URLSearchParams({ address, key: apiKey });
    const data = await fetchJson(`https://maps.googleapis.com/maps/api/geocode/json?${params}`);
    const location = data?.results?.[0]?.geometry?.location;
    return {
      latitude: typeof location?.lat === "number" ? location.lat : null,
      longitude: typeof location?.lng === "number" ? location.lng : null,
    };
  } catch {
    return { latitude: null, longitude: null };
  }
}

function extractCoordinates(result: Record<string, unknown>, input: { lat?: number; lng?: number }) {
  const properties = (result.properties as Record<string, unknown> | undefined) ?? {};
  const fields = (properties.fields as Record<string, unknown> | undefined) ?? {};
  const centroid = (properties.centroid as Record<string, unknown> | undefined) ?? {};

  const pick = (...values: unknown[]) =>
    values.find((value) => typeof value === "number" && Number.isFinite(value)) as number | undefined;

  return {
    latitude: pick(
      input.lat,
      centroid.lat,
      centroid.latitude,
      fields.lat,
      fields.latitude,
      fields.centroid_lat
    ) ?? null,
    longitude: pick(
      input.lng,
      centroid.lon,
      centroid.lng,
      centroid.longitude,
      fields.lng,
      fields.lon,
      fields.longitude,
      fields.centroid_lng
    ) ?? null,
  };
}

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) return value;
  return null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function buildConvexClient(accessToken?: string): ConvexHttpClient | null {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) return null;
  // Allow unauthenticated client for read-only operations
  if (accessToken) {
    return new ConvexHttpClient(convexUrl, { auth: accessToken });
  }
  return new ConvexHttpClient(convexUrl);
}

async function requireConvexClient(context?: ToolExecutionContext): Promise<ConvexHttpClient> {
  const client = buildConvexClient(context?.convexAccessToken);
  if (!client) {
    throw new Error("Vault tools require an authenticated session. Please sign in and try again.");
  }
  return client;
}

type VaultFlatItem = {
  id: string;
  itemType: "conversation" | "attachment" | "report" | "memory";
  title: string;
  subtitle: string;
  updatedAt: number;
  path: string;
  folderName?: string;
};

function formatDateTs(ts: number): string {
  if (!Number.isFinite(ts)) return "";
  try {
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function folderNameMap(vaultData: Record<string, unknown>): Map<string, string> {
  const folders = Array.isArray(vaultData.folders)
    ? (vaultData.folders as Record<string, unknown>[])
    : [];
  const map = new Map<string, string>();
  for (const f of folders) {
    const id = asString(f._id);
    const name = asString(f.name);
    if (id && name) map.set(id, name);
  }
  return map;
}

function resolveFolderName(
  folderId: unknown,
  map: Map<string, string>,
): string | undefined {
  const id = asString(folderId);
  if (!id) return undefined;
  return map.get(id);
}

function flattenVaultData(vaultData: Record<string, unknown>): VaultFlatItem[] {
  const out: VaultFlatItem[] = [];
  const fmap = folderNameMap(vaultData);
  const conversations = Array.isArray(vaultData.conversations)
    ? (vaultData.conversations as Record<string, unknown>[])
    : [];
  const attachments = Array.isArray(vaultData.attachments)
    ? (vaultData.attachments as Record<string, unknown>[])
    : [];
  const reports = Array.isArray(vaultData.vaultReports)
    ? (vaultData.vaultReports as Record<string, unknown>[])
    : [];
  const memories = Array.isArray(vaultData.vaultMemories)
    ? (vaultData.vaultMemories as Record<string, unknown>[])
    : [];

  for (const convo of conversations) {
    const id = asString(convo._id) ?? "";
    if (!id) continue;
    const folderName = resolveFolderName(convo.folderId, fmap);
    out.push({
      id,
      itemType: "conversation",
      title: asString(convo.title) ?? "Conversation",
      subtitle: [folderName ? `Folder: ${folderName}` : null, `${asNumber(convo.messageCount) ?? 0} messages`]
        .filter(Boolean)
        .join(" · "),
      updatedAt: asNumber(convo.lastMessageAt) ?? asNumber(convo._creationTime) ?? 0,
      path: `/chat?id=${id}`,
      folderName,
    });
  }

  for (const att of attachments) {
    const id = asString(att._id) ?? "";
    if (!id) continue;
    const fileType = asString(att.fileType);
    const folderName = resolveFolderName(att.folderId, fmap);
    out.push({
      id,
      itemType: "attachment",
      title: asString(att.fileName) ?? "Attachment",
      subtitle: [fileType ?? "File", folderName ? `Folder: ${folderName}` : null].filter(Boolean).join(" · "),
      updatedAt: asNumber(att.createdAt) ?? asNumber(att._creationTime) ?? 0,
      path: "/vault?type=attachment",
      folderName,
    });
  }

  for (const report of reports) {
    const id = asString(report._id) ?? "";
    if (!id) continue;
    const format = asString(report.format)?.toUpperCase() ?? "FILE";
    const folderName = resolveFolderName(report.folderId, fmap);
    const updated = formatDateTs(asNumber(report.updatedAt) ?? asNumber(report._creationTime) ?? Date.now());
    out.push({
      id,
      itemType: "report",
      title: asString(report.name) ?? "Untitled report",
      subtitle: [format, folderName ? `Folder: ${folderName}` : null, `Updated ${updated}`].filter(Boolean).join(" · "),
      updatedAt: asNumber(report.updatedAt) ?? asNumber(report._creationTime) ?? 0,
      path: `/vault?type=report&id=${id}`,
      folderName,
    });
  }

  for (const memory of memories) {
    const id = asString(memory._id) ?? "";
    if (!id) continue;
    const tags = Array.isArray(memory.tags) ? (memory.tags as string[]).join(", ") : null;
    const folderName = resolveFolderName(memory.folderId, fmap);
    const updated = formatDateTs(asNumber(memory.updatedAt) ?? asNumber(memory._creationTime) ?? Date.now());
    out.push({
      id,
      itemType: "memory",
      title: asString(memory.title) ?? "Untitled memory",
      subtitle: [tags, folderName ? `Folder: ${folderName}` : null, `Updated ${updated}`].filter(Boolean).join(" · ") || "Memory",
      updatedAt: asNumber(memory.updatedAt) ?? asNumber(memory._creationTime) ?? 0,
      path: `/vault?type=memory&id=${id}`,
      folderName,
    });
  }

  return out.sort((a, b) => b.updatedAt - a.updatedAt);
}

function queryTokens(query: string): string[] {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

function itemMatchesVaultQuery(item: VaultFlatItem, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const haystack = `${item.title} ${item.subtitle} ${item.itemType} ${item.folderName ?? ""}`.toLowerCase();
  return tokens.every((t) => haystack.includes(t));
}

function parseJsonFromText(text: string): Record<string, unknown> | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function safeObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

async function readAttachmentTextPreview(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const text = await res.text();
    if (text.length > 5000) return text.slice(0, 5000) + "\n... (truncated)";
    return text;
  } catch {
    return null;
  }
}

function defaultFlowData(name: string, description?: string) {
  const baseY = 100;
  const triggerId = `trigger-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const actionId = `action-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const outputId = `output-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return {
    nodes: [
      {
        id: triggerId,
        type: "trigger",
        position: { x: 120, y: baseY },
        data: {
          nodeType: "trigger",
          label: "Manual Trigger",
          desc: "Starts when run from chat",
        },
      },
      {
        id: actionId,
        type: "action",
        position: { x: 120, y: baseY + 150 },
        data: {
          nodeType: "action",
          label: name,
          desc: description ?? "Generated by Trajectory agent",
        },
      },
      {
        id: outputId,
        type: "output",
        position: { x: 120, y: baseY + 300 },
        data: {
          nodeType: "output",
          label: "Save to Vault",
          desc: "Persist results",
        },
      },
    ],
    edges: [
      {
        id: `edge-1-${Date.now()}`,
        source: triggerId,
        target: actionId,
        style: { strokeWidth: 1.5 },
      },
      {
        id: `edge-2-${Date.now()}`,
        source: actionId,
        target: outputId,
        style: { strokeWidth: 1.5 },
      },
    ],
  };
}

// ─── Flow Agent System Prompt ─────────────────────────────────────────────────

const FLOW_AGENT_SYSTEM_PROMPT = `You are Trajectory's dedicated flow generation agent.
Return ONLY valid JSON (no markdown) with exactly:
{
  "name": string,
  "description": string,
  "nodes": [
    {
      "id": string,
      "type": "trigger" | "action" | "condition" | "output",
      "position": {"x": number, "y": number},
      "operation": string,
      "label": string,
      "desc": string,
      "request": string
    }
  ],
  "edges": [
    {
      "id": string,
      "source": string,
      "target": string,
      "sourceHandle": string | null
    }
  ]
}

Available node operations by type:
TRIGGERS:
- manualAddress: "Enter an address to start the workflow"
- listingAlert: "Start when a listing hits your feed"
- webhook: "Receive upstream data from another system"
- schedule: "Run the workflow on a cadence"

ACTIONS:
- fetchSiteData: "Pull zoning and land-use context"
- fetchMarketData: "Generate a quick market snapshot"
- aiAnalysis: "Use AI to underwrite the site"
- generateReport: "Format the workflow output into markdown"
- sendNotification: "Prepare an execution update"

CONDITIONS:
- ifZoningAvailable: "Branch when zoning data is present"
- ifAnalysisReady: "Branch when AI output is ready"
- filterByPrompt: "Use keywords to gate the flow"

OUTPUTS:
- saveToVault: "Store the report in Trajectory"
- notifyTeam: "Prepare a message for the team"
- exportCsv: "Package the structured output"

Rules:
1. Start with a TRIGGER node
2. Add ACTIONS for data fetching, analysis, or report generation
3. Use CONDITIONS when branching is needed
4. End with an OUTPUT node (saveToVault recommended)
5. Connect nodes sequentially with edges
6. For AI nodes (aiAnalysis, fetchMarketData, generateReport), write a detailed request that describes:
   - What the node should do
   - What inputs it needs from upstream
   - What output format is expected
7. Position nodes vertically with 100-150px spacing between them
8. Use condition nodes with "yes" and "no" source handles
9. If user specifies specific workflow steps, use those; otherwise infer appropriate steps
10. Always include saveToVault as the final output unless user specifies otherwise`;

interface FlowNodeData {
  nodeType: "trigger" | "action" | "condition" | "output";
  operation: string;
  label: string;
  desc: string;
  request?: string;
}

function generateFlowFromRequest(
  userRequest: string,
  userName?: string,
): { name: string; flowData: string } {
  const requestLower = userRequest.toLowerCase();
  
  // Parse intent from user request
  const intents: string[] = [];
  if (requestLower.includes("underwrite") || requestLower.includes("analysis") || requestLower.includes("feasibility")) {
    intents.push("analysis");
  }
  if (requestLower.includes("report") || requestLower.includes("generate")) {
    intents.push("report");
  }
  if (requestLower.includes("market") || requestLower.includes("comps") || requestLower.includes("comparable")) {
    intents.push("market");
  }
  if (requestLower.includes("site") || requestLower.includes("zoning") || requestLower.includes("parcel")) {
    intents.push("site");
  }
  if (requestLower.includes("notify") || requestLower.includes("alert") || requestLower.includes("notification")) {
    intents.push("notify");
  }
  if (requestLower.includes("save") || requestLower.includes("vault")) {
    intents.push("save");
  }

  // Build flow based on intents - matching the format expected by the flow canvas
  const nodes: Array<{
    id: string;
    type: "trigger" | "action" | "condition" | "output";
    position: { x: number; y: number };
    data: FlowNodeData;
  }> = [];
  const edges: Array<{
    id: string;
    source: string;
    target: string;
    style?: { strokeWidth: number };
  }> = [];

  let yOffset = 80;
  let nodeId = 0;
  let prevNodeId: string | null = null;

  // Start with trigger
  const triggerId = `node-${nodeId++}`;
  nodes.push({
    id: triggerId,
    type: "trigger",
    position: { x: 280, y: yOffset },
    data: {
      nodeType: "trigger",
      operation: "manualAddress",
      label: "Manual Trigger",
      desc: "Enter an address to start the workflow",
      request: "Ask for a single property address and pass it downstream as the workflow input.",
    },
  });
  prevNodeId = triggerId;
  yOffset += 150;

  // Add nodes based on intents
  if (intents.includes("site")) {
    const siteId = `node-${nodeId++}`;
    nodes.push({
      id: siteId,
      type: "action",
      position: { x: 280, y: yOffset },
      data: {
        nodeType: "action",
        operation: "fetchSiteData",
        label: "Fetch Site Data",
        desc: "Pull zoning and land-use context",
        request: "Fetch zoning and site intelligence for the property address. Preserve the address and attach the zoning payload including permitted uses, FAR, height limits, and setbacks.",
      },
    });
    edges.push({ id: `edge-${edges.length + 1}`, source: prevNodeId!, target: siteId, style: { strokeWidth: 1.5 } });
    prevNodeId = siteId;
    yOffset += 150;
  }

  if (intents.includes("market")) {
    const marketId = `node-${nodeId++}`;
    nodes.push({
      id: marketId,
      type: "action",
      position: { x: 280, y: yOffset },
      data: {
        nodeType: "action",
        operation: "fetchMarketData",
        label: "Fetch Market Data",
        desc: "Generate a quick market snapshot",
        request: "Create a concise market snapshot for the property area using Trajectory's real estate tools. Include demand signals, comparable rents, household income, vacancy rates, and notable market constraints.",
      },
    });
    edges.push({ id: `edge-${edges.length + 1}`, source: prevNodeId!, target: marketId, style: { strokeWidth: 1.5 } });
    prevNodeId = marketId;
    yOffset += 150;
  }

  if (intents.includes("analysis") || intents.includes("report")) {
    const analysisId = `node-${nodeId++}`;
    nodes.push({
      id: analysisId,
      type: "action",
      position: { x: 280, y: yOffset },
      data: {
        nodeType: "action",
        operation: "aiAnalysis",
        label: "AI Analysis",
        desc: "Use AI to underwrite the site",
        request: "Act as a senior real estate development analyst. Using the upstream workflow context (address, zoning data, market data if available), produce a concise feasibility brief with: 1. What can likely be built given zoning constraints, 2. Key development constraints and opportunities, 3. Highest-value use case, 4. Recommended next diligence steps. Return a clear structured analysis.",
      },
    });
    edges.push({ id: `edge-${edges.length + 1}`, source: prevNodeId!, target: analysisId, style: { strokeWidth: 1.5 } });
    prevNodeId = analysisId;
    yOffset += 150;
  }

  if (intents.includes("report")) {
    const reportId = `node-${nodeId++}`;
    nodes.push({
      id: reportId,
      type: "action",
      position: { x: 280, y: yOffset },
      data: {
        nodeType: "action",
        operation: "generateReport",
        label: "Generate Report",
        desc: "Format the workflow output into markdown",
        request: "Generate a polished markdown report using the upstream address, analysis results, site facts, and market context. Include sections for Executive Summary, Site Analysis, Market Overview, and Recommendations.",
      },
    });
    edges.push({ id: `edge-${edges.length + 1}`, source: prevNodeId!, target: reportId, style: { strokeWidth: 1.5 } });
    prevNodeId = reportId;
    yOffset += 150;
  }

  if (intents.includes("notify")) {
    const notifyId = `node-${nodeId++}`;
    nodes.push({
      id: notifyId,
      type: "action",
      position: { x: 280, y: yOffset },
      data: {
        nodeType: "action",
        operation: "sendNotification",
        label: "Send Notification",
        desc: "Prepare an execution update",
        request: "Summarize the workflow result in a short update suitable for an acquisitions or development team. Include the property address, key findings, and recommended next steps.",
      },
    });
    edges.push({ id: `edge-${edges.length + 1}`, source: prevNodeId!, target: notifyId, style: { strokeWidth: 1.5 } });
    prevNodeId = notifyId;
    yOffset += 150;
  }

  // Always end with saveToVault if not already included
  if (!intents.includes("save") || (intents.length === 0)) {
    const vaultId = `node-${nodeId++}`;
    nodes.push({
      id: vaultId,
      type: "output",
      position: { x: 280, y: yOffset },
      data: {
        nodeType: "output",
        operation: "saveToVault",
        label: "Save to Vault",
        desc: "Store the report in Trajectory",
        request: "Save the latest markdown report or AI analysis to the vault using the property address in the title. Include all relevant workflow context in the saved document.",
      },
    });
    edges.push({ id: `edge-${edges.length + 1}`, source: prevNodeId!, target: vaultId, style: { strokeWidth: 1.5 } });
  }

  // Use user's name if provided, otherwise infer from request
  let flowName = userName || "Workflow";
  if (!userName) {
    if (requestLower.includes("underwrite") || requestLower.includes("analysis")) {
      flowName = "Underwriting Flow";
    } else if (requestLower.includes("market")) {
      flowName = "Market Analysis Flow";
    } else if (requestLower.includes("site") || requestLower.includes("zoning")) {
      flowName = "Site Analysis Flow";
    } else if (requestLower.includes("report")) {
      flowName = "Report Generation Flow";
    }
  }

  // If no intents detected, create a basic analysis flow
  if (nodes.length <= 2) {
    const analysisId = `node-${nodeId++}`;
    nodes.push({
      id: analysisId,
      type: "action",
      position: { x: 280, y: yOffset },
      data: {
        nodeType: "action",
        operation: "aiAnalysis",
        label: "AI Analysis",
        desc: "Use AI to underwrite the site",
        request: "Act as a senior real estate development analyst. Using the upstream property address, produce a concise feasibility brief with development potential, key constraints, and recommended next steps.",
      },
    });
    edges.push({ id: `edge-${edges.length + 1}`, source: prevNodeId!, target: analysisId, style: { strokeWidth: 1.5 } });
    
    const vaultId = `node-${nodeId++}`;
    nodes.push({
      id: vaultId,
      type: "output",
      position: { x: 280, y: yOffset + 150 },
      data: {
        nodeType: "output",
        operation: "saveToVault",
        label: "Save to Vault",
        desc: "Store the report in Trajectory",
        request: "Save the analysis to the vault using the property address in the title.",
      },
    });
    edges.push({ id: `edge-${edges.length + 1}`, source: analysisId, target: vaultId, style: { strokeWidth: 1.5 } });
  }

  return {
    name: flowName,
    flowData: JSON.stringify({ nodes, edges }),
  };
}

// ─── Legacy Real Estate Tool Executors (deprecated, no longer used) ─────────────

export async function executeGetPropertyData(input: { address?: string; lat?: number; lng?: number }) {
  try {
    const params = new URLSearchParams({ token: process.env.REGRID_API_KEY! });
    if (input.address) {
      params.set("query", input.address);
      const data = await fetchJson(`https://app.regrid.com/api/v2/parcels/search?${params}`);
      const firstResult = data?.results?.[0] ?? {};
      const parcel = firstResult?.properties?.fields ?? {};
      let { latitude, longitude } = extractCoordinates(firstResult, input);
      if ((latitude === null || longitude === null) && (parcel.address ?? input.address)) {
        const geocoded = await geocodeAddress(parcel.address ?? input.address);
        latitude = latitude ?? geocoded.latitude;
        longitude = longitude ?? geocoded.longitude;
      }
      return {
        address: parcel.address ?? input.address,
        owner: parcel.owner ?? null,
        zoning: parcel.zoning ?? null,
        zoning_description: parcel.zoning_description ?? null,
        use_code: parcel.usedesc ?? null,
        acreage: parcel.ll_gisacre ?? null,
        sqft: parcel.ll_gissqft ?? null,
        year_built: parcel.year_built ?? null,
        county: parcel.county ?? null,
        apn: parcel.parcelnumb ?? null,
        latitude,
        longitude,
      };
    } else if (input.lat !== undefined && input.lng !== undefined) {
      params.set("lat", String(input.lat));
      params.set("lon", String(input.lng));
      params.set("radius", "50");
      const data = await fetchJson(`https://app.regrid.com/api/v2/parcels/point?${params}`);
      const firstResult = data?.results?.[0] ?? {};
      const parcel = firstResult?.properties?.fields ?? {};
      let { latitude, longitude } = extractCoordinates(firstResult, input);
      if ((latitude === null || longitude === null) && parcel.address) {
        const geocoded = await geocodeAddress(parcel.address);
        latitude = latitude ?? geocoded.latitude;
        longitude = longitude ?? geocoded.longitude;
      }
      return {
        address: parcel.address ?? null,
        owner: parcel.owner ?? null,
        zoning: parcel.zoning ?? null,
        zoning_description: parcel.zoning_description ?? null,
        use_code: parcel.usedesc ?? null,
        acreage: parcel.ll_gisacre ?? null,
        sqft: parcel.ll_gissqft ?? null,
        year_built: parcel.year_built ?? null,
        county: parcel.county ?? null,
        apn: parcel.parcelnumb ?? null,
        latitude,
        longitude,
      };
    }
    return { error: "address or lat/lng required" };
  } catch (e) {
    return { error: String(e) };
  }
}

async function executeThought(input: { content: string; stage?: string }) {
  return { thought: input.content, stage: input.stage };
}

// ─── Space Mission Tool Executors ─────────────────────────────────────────────

async function executeGetPlanetData(input: { planet?: string }, context?: ToolExecutionContext) {
  const client = buildConvexClient(context?.convexAccessToken);
  if (!client) {
    return { error: "Convex client not available" };
  }
  
  try {
    const result = await client.action(api.nasa.getPlanetData, input);
    return { success: true, data: result };
  } catch (error) {
    return { error: String(error) };
  }
}

async function executeGetSpacecraftData(input: { spacecraft?: string }, context?: ToolExecutionContext) {
  const client = buildConvexClient(context?.convexAccessToken);
  if (!client) {
    return { error: "Convex client not available" };
  }
  
  try {
    const result = await client.action(api.nasa.getSpacecraftData, input);
    return { success: true, data: result };
  } catch (error) {
    return { error: String(error) };
  }
}

async function executeCalculateHohmannTransfer(input: { fromPlanet: string; toPlanet: string }, context?: ToolExecutionContext) {
  const client = buildConvexClient(context?.convexAccessToken);
  if (!client) {
    return { error: "Convex client not available" };
  }
  
  try {
    const result = await client.action(api.nasa.calculateHohmannTransfer, input);
    return { success: true, data: result };
  } catch (error) {
    return { error: String(error) };
  }
}

async function executeEstimateMissionCost(input: { 
  destination: string; 
  missionType: "flyby" | "orbit" | "land" | "sample-return";
  spacecraft: string;
  crewSize?: number;
}, context?: ToolExecutionContext) {
  const client = buildConvexClient(context?.convexAccessToken);
  if (!client) {
    return { error: "Convex client not available" };
  }
  
  try {
    const result = await client.action(api.nasa.estimateMissionCost, input);
    return { success: true, data: result };
  } catch (error) {
    return { error: String(error) };
  }
}

async function executeGetAPOD(input: { date?: string }, context?: ToolExecutionContext) {
  const client = buildConvexClient(context?.convexAccessToken);
  if (!client) {
    return { error: "Convex client not available" };
  }
  
  try {
    const result = await client.action(api.nasa.getAPOD, input);
    return { success: true, data: result };
  } catch (error) {
    return { error: String(error) };
  }
}

async function executeGetNEOFeed(input: { startDate: string; endDate?: string }, context?: ToolExecutionContext) {
  const client = buildConvexClient(context?.convexAccessToken);
  if (!client) {
    return { error: "Convex client not available" };
  }
  
  try {
    const result = await client.action(api.nasa.getNEOFeed, input);
    return { success: true, data: result };
  } catch (error) {
    return { error: String(error) };
  }
}

async function executeGetMarsPhotos(input: { 
  rover: "curiosity" | "opportunity" | "spirit";
  sol?: number;
  earthDate?: string;
}, context?: ToolExecutionContext) {
  const client = buildConvexClient(context?.convexAccessToken);
  if (!client) {
    return { error: "Convex client not available" };
  }
  
  try {
    const result = await client.action(api.nasa.getMarsPhotos, input);
    return { success: true, data: result };
  } catch (error) {
    return { error: String(error) };
  }
}

// ─── Visual Display Tool Executors ─────────────────────────────────────────────

async function executeDisplayChart(input: {
  chartType: "bar" | "line" | "pie" | "scatter" | "area";
  title: string;
  data: string;
  xAxis?: string;
  yAxis?: string;
}) {
  try {
    const parsedData = JSON.parse(input.data);
    return {
      chartType: input.chartType,
      title: input.title,
      data: parsedData,
      xAxis: input.xAxis,
      yAxis: input.yAxis,
      visualization: "chart",
    };
  } catch (error) {
    return { error: `Invalid chart data: ${String(error)}` };
  }
}

async function executeDisplayTrajectoryMap(input: {
  fromPlanet: string;
  toPlanet: string;
  transferType: "hohmann" | "gravity-assist" | "direct";
  waypoints?: string[];
  showOrbits?: boolean;
}) {
  return {
    fromPlanet: input.fromPlanet,
    toPlanet: input.toPlanet,
    transferType: input.transferType,
    waypoints: input.waypoints || [],
    showOrbits: input.showOrbits ?? true,
    visualization: "trajectory_map",
  };
}

async function executeDisplayRocketDiagram(input: {
  spacecraft: string;
  showStages?: boolean;
  showPayload?: boolean;
  annotations?: string[];
}) {
  return {
    spacecraft: input.spacecraft,
    showStages: input.showStages ?? true,
    showPayload: input.showPayload ?? true,
    annotations: input.annotations || [],
    visualization: "rocket_diagram",
  };
}

async function executeDisplayWireframe(input: {
  type: "base" | "lander" | "rover" | "station" | "module";
  name: string;
  components?: string[];
  dimensions?: string;
  annotations?: string[];
}) {
  try {
    const parsedDimensions = input.dimensions ? JSON.parse(input.dimensions) : undefined;
    return {
      type: input.type,
      name: input.name,
      components: input.components || [],
      dimensions: parsedDimensions,
      annotations: input.annotations || [],
      visualization: "wireframe",
    };
  } catch (error) {
    return { error: `Invalid dimensions data: ${String(error)}` };
  }
}

// ─── Legacy Real Estate Tool Executors (deprecated) ─────────────────────────────

// Legacy real estate tool - deprecated, no longer used
// export async function executeGetZoningData(input: { address: string; zoning_code?: string }) {
//   try {
//     const data = await getUnifiedZoningData({ address: input.address });
//     const geocoded = await geocodeAddress(input.address);
//     const normalizedAddress =
//       (typeof data.formatted_address === "string" ? data.formatted_address : null) ??
//       input.address;
//     return {
//       address: normalizedAddress,
//       zoning_code:
//         (typeof data.zone_code === "string" ? data.zone_code : null) ??
//         (typeof data.zone === "string" ? data.zone : null) ??
//         input.zoning_code ??
//         null,
//       zoning_name:
//         (typeof data.zone_name === "string" ? data.zone_name : null) ??
//         null,
//       latitude:
//         (typeof data.lat === "number" ? data.lat : null) ??
//         (typeof data.latitude === "number" ? data.latitude : null) ??
//         geocoded.latitude,
//       longitude:
//         (typeof data.lng === "number" ? data.lng : null) ??
//         (typeof data.longitude === "number" ? data.longitude : null) ??
//         geocoded.longitude,
//       polygon:
//         (data.parcel_geometry as Record<string, unknown> | null | undefined) ??
//         (data.geom as Record<string, unknown> | null | undefined) ??
//         (data.geometry as Record<string, unknown> | null | undefined) ??
//         null,
//       permitted_uses: Array.isArray(data.permitted_uses) ? data.permitted_uses : [],
//       conditional_uses: Array.isArray(data.conditional_uses) ? data.conditional_uses : [],
//       max_height_ft:
//         (typeof data.max_height_ft === "number" ? data.max_height_ft : null) ??
//         (typeof (data.controls as Record<string, unknown> | undefined)?.height_max_ft === "number"
//           ? ((data.controls as Record<string, unknown>).height_max_ft as number)
//           : null),
//       max_far:
//         (typeof data.max_far === "number" ? data.max_far : null) ??
//         (typeof (data.controls as Record<string, unknown> | undefined)?.far_max === "number"
//           ? ((data.controls as Record<string, unknown>).far_max as number)
//           : null),
//       min_lot_sqft: typeof data.min_lot_sqft === "number" ? data.min_lot_sqft : null,
//       max_density: typeof data.max_units_per_acre === "number" ? data.max_units_per_acre : null,
//       front_setback_ft: typeof data.front_setback_ft === "number" ? data.front_setback_ft : null,
//       rear_setback_ft: typeof data.rear_setback_ft === "number" ? data.rear_setback_ft : null,
//       side_setback_ft: typeof data.side_setback_ft === "number" ? data.side_setback_ft : null,
//       parking_ratio: typeof data.parking_ratio === "number" ? data.parking_ratio : null,
//       overlay_districts: Array.isArray(data.overlays) ? data.overlays : [],
//       raw: data,
//     };
//   } catch (e) {
//     return { error: String(e) };
//   }
// }

export async function executeGetMarketData(input: { address: string }) {
  try {
    // Use Census Geocoder to get tract FIPS, then ACS for demographics
    const geoParams = new URLSearchParams({
      address: input.address,
      benchmark: "Public_AR_Current",
      vintage: "Current_Current",
      format: "json",
    });
    const geo = await fetchJson(`https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?${geoParams}`);
    const tract = geo?.result?.addressMatches?.[0]?.geographies?.["Census Tracts"]?.[0];
    if (!tract) return { error: "Could not geocode address to census tract" };

    const state = tract.STATE;
    const county = tract.COUNTY;
    const tractId = tract.TRACT;

    const variables = [
      "B01001_001E", // Total population
      "B19013_001E", // Median household income
      "B25003_002E", // Owner-occupied
      "B25003_003E", // Renter-occupied
      "B25002_003E", // Vacant units
      "B25002_001E", // Total housing units
      "B23025_005E", // Unemployed
      "B23025_002E", // In labor force
    ].join(",");

    const acsParams = new URLSearchParams({
      get: `NAME,${variables}`,
      "for": `tract:${tractId}`,
      "in": `state:${state} county:${county}`,
      key: process.env.CENSUS_API_KEY!,
    });
    const acs = await fetchJson(`https://api.census.gov/data/2022/acs/acs5?${acsParams}`);
    if (!acs || acs.length < 2) return { error: "No ACS data returned" };

    const headers: string[] = acs[0];
    const values: string[] = acs[1];
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i]; });

    const totalHousing = parseInt(row["B25002_001E"] ?? "0");
    const vacant = parseInt(row["B25002_003E"] ?? "0");
    const renter = parseInt(row["B25003_003E"] ?? "0");
    const owner = parseInt(row["B25003_002E"] ?? "0");
    const laborForce = parseInt(row["B23025_002E"] ?? "1");
    const unemployed = parseInt(row["B23025_005E"] ?? "0");

    return {
      tract: `${state}-${county}-${tractId}`,
      population: parseInt(row["B01001_001E"] ?? "0"),
      median_household_income: parseInt(row["B19013_001E"] ?? "0"),
      vacancy_rate_pct: totalHousing > 0 ? +((vacant / totalHousing) * 100).toFixed(1) : null,
      renter_pct: (renter + owner) > 0 ? +((renter / (renter + owner)) * 100).toFixed(1) : null,
      unemployment_rate_pct: laborForce > 0 ? +((unemployed / laborForce) * 100).toFixed(1) : null,
    };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function executeGetPropertyHistory(input: { address: string }) {
  try {
    const parts = input.address.split(",").map((s) => s.trim());
    const street = parts[0] ?? input.address;
    const params = new URLSearchParams({
      address1: street,
      address2: parts.slice(1).join(", "),
    });
    const data = await fetchJson(`https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/detail?${params}`, {
      headers: { apikey: process.env.ATTOM_API_KEY!, accept: "application/json" },
    });
    const prop = data?.property?.[0];
    if (!prop) return { error: "No property found" };
    const sale = prop?.sale?.[0];
    return {
      address: prop?.identifier?.obPropId ? input.address : null,
      last_sale_price: sale?.saleamt ?? null,
      last_sale_date: sale?.salesearchdate ?? null,
      avm_value: prop?.avm?.amount?.value ?? null,
      year_built: prop?.summary?.yearbuilt ?? null,
      bedrooms: prop?.building?.rooms?.beds ?? null,
      bathrooms: prop?.building?.rooms?.bathstotal ?? null,
      building_sqft: prop?.building?.size?.bldgsize ?? null,
      lot_sqft: prop?.lot?.lotsize2 ?? null,
    };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function executeWebSearch(input: { query: string; topic?: string }, context?: ToolExecutionContext) {
  try {
    if (!context?.webSearchEnabled) {
      return { error: "Web search is disabled in this chat. Enable Web in the composer to allow web research." };
    }

    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: input.query,
        search_depth: "advanced",
        max_results: 8,
        include_answer: true,
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) throw new Error(`Tavily HTTP ${res.status}`);
    const data = await res.json();
    return {
      success: true,
      query: input.query,
      answer: data?.answer ?? null,
      results: (data?.results ?? []).slice(0, 8).map((r: Record<string, string>) => ({
        title: r.title,
        url: r.url,
        snippet: r.content?.slice(0, 400),
        published_date: r.published_date ?? null,
      })),
    };
  } catch (e) {
    return { error: String(e) };
  }
}

async function executeVaultSearch(
  input: { query?: string; limit?: number; types?: string[] },
  context?: ToolExecutionContext,
) {
  try {
    const client = await requireConvexClient(context);
    const vaultData = await client.query(api.vault.getVaultData, {});
    if (!vaultData || typeof vaultData !== "object") {
      return { query: input.query ?? "", matchCount: 0, results: [] };
    }

    const allItems = flattenVaultData(vaultData as Record<string, unknown>);
    const allowedTypes = Array.isArray(input.types) && input.types.length > 0
      ? new Set(
          input.types.filter((t): t is VaultFlatItem["itemType"] =>
            ["proforma", "flow", "site", "conversation", "attachment", "report", "memory"].includes(t),
          ),
        )
      : null;

    const typed = allowedTypes
      ? allItems.filter((item) => allowedTypes.has(item.itemType))
      : allItems;

    const tokens = queryTokens(typeof input.query === "string" ? input.query : "");
    const filtered = typed.filter((item) => itemMatchesVaultQuery(item, tokens));

    const limit = Math.max(1, Math.min(25, Math.floor(input.limit ?? 10)));
    const results = filtered.slice(0, limit).map((item) => ({
      id: item.id,
      itemType: item.itemType,
      title: item.title,
      subtitle: item.subtitle,
      updatedAt: item.updatedAt,
      path: item.path,
      folderName: item.folderName,
    }));

    return {
      query: input.query ?? "",
      matchCount: filtered.length,
      results,
    };
  } catch (error) {
    return { error: String(error) };
  }
}

async function executeVaultReadItem(
  input: {
    itemType: "conversation" | "attachment" | "report" | "memory";
    id: string;
    includeRaw?: boolean;
  },
  context?: ToolExecutionContext,
) {
  try {
    const client = await requireConvexClient(context);

    if (input.itemType === "conversation") {
      const messages = await client.query(api.conversations.getMessages, {
        conversationId: input.id as Id<"conversations">,
      });
      const vaultData = await client.query(api.vault.getVaultData, {});
      const conversations = Array.isArray((vaultData as Record<string, unknown>)?.conversations)
        ? ((vaultData as Record<string, unknown>).conversations as Record<string, unknown>[])
        : [];
      const convoMeta = conversations.find((c) => asString(c._id) === input.id) ?? null;
      const messageList = Array.isArray(messages) ? (messages as Record<string, unknown>[]) : [];
      const previewMessages = messageList.slice(Math.max(0, messageList.length - 8)).map((m) => ({
        role: asString(m.role) ?? "assistant",
        content: asString(m.content) ?? "",
      }));

      return {
        itemType: "conversation",
        id: input.id,
        title: asString(convoMeta?.title) ?? "Conversation",
        messageCount: messageList.length,
        path: `/chat?id=${input.id}`,
        messages: input.includeRaw ? messageList : previewMessages,
      };
    }

    if (input.itemType === "attachment") {
      const vaultData = await client.query(api.vault.getVaultData, {});
      const records = Array.isArray((vaultData as Record<string, unknown>)?.attachments)
        ? ((vaultData as Record<string, unknown>).attachments as Record<string, unknown>[])
        : [];
      const item = records.find((record) => asString(record._id) === input.id);
      if (!item) return { error: "Attachment not found" };

      const storageId = asString(item.storageId);
      const fileName = asString(item.fileName);
      const fileType = asString(item.fileType);
      let url: string | null = null;
      let textPreview: string | null = null;

      if (storageId) {
        url = await client.query(api.vault.getAttachmentUrl, { storageId });
      }

      const isTextLike =
        (fileType?.startsWith("text/") ?? false) ||
        fileName?.toLowerCase().endsWith(".txt") ||
        fileName?.toLowerCase().endsWith(".md") ||
        fileName?.toLowerCase().endsWith(".csv") ||
        fileName?.toLowerCase().endsWith(".json");

      if (url && isTextLike) {
        textPreview = await readAttachmentTextPreview(url);
      }

      return {
        itemType: "attachment",
        id: input.id,
        title: fileName ?? "Attachment",
        fileType,
        size: asNumber(item.fileSize),
        url,
        textPreview,
        path: "/vault?type=attachment",
        data: input.includeRaw ? item : undefined,
      };
    }

    if (input.itemType === "report") {
      const report = await client.query(api.vault.getReport, {
        id: input.id as Id<"vaultReports">,
      });
      if (!report) return { error: "Report not found" };
      const reportRecord = report as Record<string, unknown>;
      
      return {
        itemType: "report",
        id: input.id,
        title: asString(reportRecord.name) ?? "Report",
        format: asString(reportRecord.format) ?? "txt",
        content: input.includeRaw ? asString(reportRecord.content) : undefined,
        path: `/vault?type=report&id=${input.id}`,
        data: input.includeRaw ? reportRecord : undefined,
      };
    }

    if (input.itemType === "memory") {
      const memory = await client.query(api.vault.getMemory, {
        id: input.id as Id<"vaultMemories">,
      });
      if (!memory) return { error: "Memory not found" };
      const memoryRecord = memory as Record<string, unknown>;
      
      return {
        itemType: "memory",
        id: input.id,
        title: asString(memoryRecord.title) ?? "Memory",
        content: input.includeRaw ? asString(memoryRecord.content) : undefined,
        tags: Array.isArray(memoryRecord.tags) ? memoryRecord.tags : undefined,
        path: `/vault?type=memory&id=${input.id}`,
        data: input.includeRaw ? memoryRecord : undefined,
      };
    }

    return { error: `Unsupported itemType: ${input.itemType}` };
  } catch (error) {
    return { error: String(error) };
  }
}

async function executeVaultUpdateItem(
  input: {
    itemType: "proforma" | "flow" | "site" | "conversation" | "report" | "memory";
    id: string;
    projectName?: string;
    address?: string;
    assetType?: string;
    proformaData?: unknown;
    name?: string;
    flowData?: unknown;
    notes?: string;
    zoneCode?: string;
    zoneName?: string;
    title?: string;
    content?: string;
    tags?: string[];
  },
  context?: ToolExecutionContext,
) {
  try {
    const client = await requireConvexClient(context);

    // Deprecated real estate item types - commented out for Trajectory
    /*
    if (input.itemType === "proforma") {
      const hasMetadataUpdate =
        input.projectName !== undefined ||
        input.address !== undefined ||
        input.assetType !== undefined;

      if (hasMetadataUpdate) {
        await client.mutation(api.vault.updateProforma, {
          id: input.id as Id<"vaultProformas">,
          projectName: input.projectName,
          address: input.address,
          assetType: input.assetType,
        });
      }

      if (input.proformaData !== undefined) {
        const payload =
          typeof input.proformaData === "string"
            ? input.proformaData
            : JSON.stringify(input.proformaData);
        await client.mutation(api.vault.updateProformaData, {
          id: input.id as Id<"vaultProformas">,
          proformaData: payload,
        });
      }

      if (!hasMetadataUpdate && input.proformaData === undefined) {
        return {
          error:
            "No proforma changes provided. Include projectName/address/assetType and/or proformaData.",
        };
      }

      return {
        itemType: "proforma",
        id: input.id,
        summary: `Updated pro forma${input.projectName ? `: ${input.projectName}` : ""}`,
      };
    }

    if (input.itemType === "flow") {
      const hasName = input.name !== undefined;
      const hasFlowData = input.flowData !== undefined;

      if (!hasName && !hasFlowData) {
        return { error: "No flow updates provided. Include name and/or flowData." };
      }

      await client.mutation(api.vault.updateFlow, {
        id: input.id as Id<"vaultFlows">,
        name: input.name,
        flowData:
          input.flowData === undefined
            ? undefined
            : typeof input.flowData === "string"
              ? input.flowData
              : JSON.stringify(input.flowData),
      });

      return {
        itemType: "flow",
        id: input.id,
        summary: `Updated flow${input.name ? `: ${input.name}` : ""}`,
      };
    }

    if (input.itemType === "site") {
      const hasSiteUpdate =
        input.address !== undefined ||
        input.notes !== undefined ||
        input.zoneCode !== undefined ||
        input.zoneName !== undefined;

      if (!hasSiteUpdate) {
        return { error: "No site updates provided. Include address, notes, zoneCode, or zoneName." };
      }

      await client.mutation(api.vault.updateVaultSiteForAgent, {
        id: input.id as Id<"vaultSites">,
        address: input.address,
        notes: input.notes,
        zoneCode: input.zoneCode,
        zoneName: input.zoneName,
      });

      return {
        itemType: "site",
        id: input.id,
        summary: "Updated saved site",
      };
    }
    */

    if (input.itemType === "conversation") {
      if (!input.title) {
        return { error: "Conversation update requires title." };
      }

      await client.mutation(api.conversations.updateTitleForAgent, {
        conversationId: input.id as Id<"conversations">,
        title: input.title,
      });

      return {
        itemType: "conversation",
        id: input.id,
        summary: `Updated conversation title: ${input.title}`,
      };
    }

    if (input.itemType === "report") {
      const hasName = input.name !== undefined;
      const hasContent = input.content !== undefined;

      if (!hasName && !hasContent) {
        return { error: "No report updates provided. Include name and/or content." };
      }

      await client.mutation(api.vault.updateReport, {
        id: input.id as Id<"vaultReports">,
        name: input.name,
        content: input.content,
      });

      return {
        itemType: "report",
        id: input.id,
        summary: `Updated report${input.name ? `: ${input.name}` : ""}`,
      };
    }

    if (input.itemType === "memory") {
      const hasTitle = input.title !== undefined;
      const hasContent = input.content !== undefined;
      const hasTags = input.tags !== undefined;

      if (!hasTitle && !hasContent && !hasTags) {
        return { error: "No memory updates provided. Include title, content, and/or tags." };
      }

      await client.mutation(api.vault.updateMemory, {
        id: input.id as Id<"vaultMemories">,
        title: input.title,
        content: input.content,
        tags: input.tags,
      });

      return {
        itemType: "memory",
        id: input.id,
        summary: `Updated memory${input.title ? `: ${input.title}` : ""}`,
      };
    }

    return { error: `Unsupported itemType: ${input.itemType}` };
  } catch (error) {
    return { error: String(error) };
  }
}

// Deprecated flow creation - commented out for Trajectory
/*
async function executeVaultCreateFlow(
  input: { name: string; description?: string; flowData?: unknown },
  context?: ToolExecutionContext,
) {
  const processingSteps: Array<{
    id: string;
    status: string;
    state: "running" | "completed" | "error" | "done";
    detail?: string;
  }> = [
    {
      id: "stage-prepare",
      status: "Prepared workflow request",
      state: "completed",
    },
    {
      id: "stage-generate",
      status: "Ran dedicated flow generation agent",
      state: "running",
    },
    {
      id: "stage-normalize",
      status: "Validated node structure and edges",
      state: "done",
    },
    {
      id: "stage-save",
      status: "Saved workflow to vault",
      state: "done",
    },
  ];

  try {
    const client = await requireConvexClient(context);

    let flowData: string;
    let generatedName: string = input.name;

    // If no flowData provided, use the flows agent to generate one
    if (input.flowData === undefined) {
      const request = input.description ?? `Create a workflow: ${input.name}`;
      const generated = generateFlowFromRequest(request, input.name);
      generatedName = generated.name;
      flowData = generated.flowData;

      processingSteps[1] = {
        ...processingSteps[1],
        state: "completed",
        detail: `Generated ${JSON.parse(flowData).nodes.length} nodes`,
      };
      processingSteps[2] = {
        ...processingSteps[2],
        state: "completed",
        detail: `${JSON.parse(flowData).edges.length} edges`,
      };
    } else {
      // Use provided flowData
      flowData =
        typeof input.flowData === "string"
          ? input.flowData
          : JSON.stringify(input.flowData);

      processingSteps[1] = {
        ...processingSteps[1],
        state: "completed",
        detail: "Used provided flow structure",
      };
      processingSteps[2] = {
        ...processingSteps[2],
        state: "completed",
        detail: "Custom flow structure",
      };
    }

    const flowId = await client.mutation(api.vault.createFlow, {
      name: generatedName,
      flowData,
    });

    return {
      flowId,
      name: generatedName,
      path: `/flows?id=${String(flowId)}`,
      summary: `Created flow "${generatedName}"`,
      processingSteps: [
        ...processingSteps.slice(0, 3),
        {
          id: "stage-save",
          status: "Saved workflow to vault",
          state: "completed" as const,
          detail: String(flowId),
        },
      ],
      generator: "flow_agent_v1",
    };
  } catch (error) {
    return {
      error: String(error),
      processingSteps: [
        ...processingSteps.slice(0, 2),
        {
          id: "stage-save",
          status: "Failed to save generated workflow",
          state: "error" as const,
          detail: String(error),
        },
      ],
    };
  }
}
*/

async function executeVaultCreateReport(
  input: { name: string; content: string; format: "pdf" | "txt" | "md" },
  context?: ToolExecutionContext,
) {
  try {
    const client = await requireConvexClient(context);

    // For PDF format, we'd typically convert content to PDF
    // For now, store the content as-is (could be markdown or HTML that gets converted)
    const pdfData = input.format === "pdf" ? input.content : undefined;

    const reportId = await client.mutation(api.vault.createReport, {
      name: input.name,
      format: input.format,
      content: input.content,
      pdfData,
    });

    return {
      reportId,
      name: input.name,
      format: input.format,
      path: `/vault?type=report&id=${String(reportId)}`,
      summary: `Created ${input.format.toUpperCase()} report "${input.name}"`,
    };
  } catch (error) {
    return { error: String(error) };
  }
}

async function executeVaultCreateMemory(
  input: { title: string; content: string; tags?: string[] },
  context?: ToolExecutionContext,
) {
  try {
    const client = await requireConvexClient(context);

    const memoryId = await client.mutation(api.vault.createMemory, {
      title: input.title,
      content: input.content,
      tags: input.tags,
    });

    return {
      memoryId,
      title: input.title,
      path: `/vault?type=memory&id=${String(memoryId)}`,
      summary: `Saved memory "${input.title}"`,
    };
  } catch (error) {
    return { error: String(error) };
  }
}

// Legacy real estate tool - deprecated, no longer used
// async function executeVaultCreateProforma(
//   input: { brief: string; projectName?: string; address?: string; assetType?: string },
//   context?: ToolExecutionContext,
// ) {
//   const processingSteps: Array<{
//     id: string;
//     status: string;
//     state: "running" | "completed" | "error" | "done";
//     detail?: string;
//   }> = [
//     {
//       id: "stage-brief",
//       status: "Prepared underwriting brief",
//       state: "completed",
//     },
//     {
//       id: "stage-generate",
//       status: "Ran dedicated pro forma generation agent",
//       state: "running",
//     },
//     {
//       id: "stage-normalize",
//       status: "Validated and normalized 5-year model rows",
//       state: "done",
//     },
//     {
//       id: "stage-save",
//       status: "Saved model to vault",
//       state: "done",
//     },
//   ];

//   try {
//     const client = await requireConvexClient(context);
//     const proforma = await generateProformaFromBrief(input.brief, {
//       projectName: input.projectName,
//       address: input.address,
//       assetType: input.assetType,
//     });
//     processingSteps[1] = {
//       ...processingSteps[1],
//       state: "completed",
//       detail: `Generated ${proforma.rows.length} rows`,
//     };
//     processingSteps[2] = {
//       ...processingSteps[2],
//       state: "completed",
//       detail: `${proforma.years.length} years`,
//     };

//     const proformaId = await client.mutation(api.vault.createProforma, {
//       projectName: proforma.metadata.projectName,
//       address: proforma.metadata.address,
//       assetType: proforma.metadata.assetType,
//       units: proforma.metadata.units ?? undefined,
//       buildingSF: proforma.metadata.buildingSF ?? undefined,
//       proformaData: JSON.stringify(proforma),
//     });

//     return {
//       proformaId,
//       projectName: proforma.metadata.projectName,
//       address: proforma.metadata.address,
//       assetType: proforma.metadata.assetType,
//       years: proforma.years,
//       rowCount: proforma.rows.length,
//       summary: `Created pro forma "${proforma.metadata.projectName}"`,
//       path: `/proforma?id=${String(proformaId)}`,
//       processingSteps: [
//         ...processingSteps.slice(0, 3),
//         {
//           id: "stage-save",
//           status: "Saved model to vault",
//           state: "completed" as const,
//           detail: String(proformaId),
//         },
//       ],
//       generator: "proforma_agent_v1",
//     };
//   } catch (error) {
//     return {
//       error: String(error),
//       processingSteps: [
//         ...processingSteps.slice(0, 2),
//         {
//           id: "stage-save",
//           status: "Failed to save generated pro forma",
//           state: "error" as const,
//           detail: String(error),
//         },
//       ],
//     };
//   }
// }

export async function executeTool(
  name: ToolName,
  input: Record<string, unknown>,
  context?: ToolExecutionContext,
) {
  switch (name) {
    case "thought":
      return executeThought(input as { content: string; stage?: string });
    case "get_planet_data":
      return executeGetPlanetData(input as { planet?: string }, context);
    case "get_spacecraft_data":
      return executeGetSpacecraftData(input as { spacecraft?: string }, context);
    case "calculate_hohmann_transfer":
      return executeCalculateHohmannTransfer(input as { fromPlanet: string; toPlanet: string }, context);
    case "estimate_mission_cost":
      return executeEstimateMissionCost(input as { 
        destination: string; 
        missionType: "flyby" | "orbit" | "land" | "sample-return";
        spacecraft: string;
        crewSize?: number;
      }, context);
    case "get_apod":
      return executeGetAPOD(input as { date?: string }, context);
    case "get_neo_feed":
      return executeGetNEOFeed(input as { startDate: string; endDate?: string }, context);
    case "get_mars_photos":
      return executeGetMarsPhotos(input as { 
        rover: "curiosity" | "opportunity" | "spirit";
        sol?: number;
        earthDate?: string;
      }, context);
    case "display_chart":
      return executeDisplayChart(input as {
        chartType: "bar" | "line" | "pie" | "scatter" | "area";
        title: string;
        data: string;
        xAxis?: string;
        yAxis?: string;
      });
    case "display_trajectory_map":
      return executeDisplayTrajectoryMap(input as {
        fromPlanet: string;
        toPlanet: string;
        transferType: "hohmann" | "gravity-assist" | "direct";
        waypoints?: string[];
        showOrbits?: boolean;
      });
    case "display_rocket_diagram":
      return executeDisplayRocketDiagram(input as {
        spacecraft: string;
        showStages?: boolean;
        showPayload?: boolean;
        annotations?: string[];
      });
    case "display_wireframe":
      return executeDisplayWireframe(input as {
        type: "base" | "lander" | "rover" | "station" | "module";
        name: string;
        components?: string[];
        dimensions?: string;
        annotations?: string[];
      });
    case "web_search":
      return executeWebSearch(input as { query: string; topic?: string }, context);
    case "vault_search":
      return executeVaultSearch(
        input as { query?: string; limit?: number; types?: string[] },
        context,
      );
    case "vault_read_item":
      return executeVaultReadItem(
        input as {
          itemType: "conversation" | "attachment" | "report" | "memory";
          id: string;
          includeRaw?: boolean;
        },
        context,
      );
    case "vault_update_item":
      return executeVaultUpdateItem(
        input as {
          itemType: "conversation" | "report" | "memory";
          id: string;
          title?: string;
          content?: string;
          tags?: string[];
        },
        context,
      );
    case "vault_create_report":
      return executeVaultCreateReport(
        input as { name: string; content: string; format: "pdf" | "txt" | "md" },
        context,
      );
    case "vault_create_memory":
      return executeVaultCreateMemory(
        input as { title: string; content: string; tags?: string[] },
        context,
      );
    default:
      return { error: `Unknown tool: ${name}` };
  }
}
