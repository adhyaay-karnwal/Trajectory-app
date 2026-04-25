/**
 * Petal — Claude streaming client with tool_use agentic loop.
 */

import Anthropic from "@anthropic-ai/sdk";
import {
  TOOL_DEFINITIONS,
  TOOL_STATUS_LABELS,
  executeTool,
  type ToolName,
  type ToolExecutionContext,
} from "./chat-tools";

// ─── Types ────────────────────────────────────────────────────────────────────

export type StreamChunk =
  | { type: "text_delta"; content: string }
  | { type: "tool_call"; toolCallId: string; toolName: string; status: string }
  | {
      type: "tool_result";
      toolCallId: string;
      toolName: string;
      input: Record<string, unknown>;
      result: Record<string, unknown>;
    }
  | { type: "done" }
  | { type: "error"; error: string };

export type MessageRole = "user" | "assistant";

export interface ChatAttachment {
  fileName: string;
  fileType: string;
  fileSize: number;
  storageId: string;
  url: string;
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
  attachments?: ChatAttachment[];
}

export interface ChatRequest {
  messages: ChatMessage[];
  webSearch?: boolean;
  convexAccessToken?: string;
}

// ─── Client ───────────────────────────────────────────────────────────────────

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Trajectory, an autonomous space mission planning AI agent. You work like a skilled mission analyst: plan, gather evidence from tools (often several steps), then answer with clear reasoning tied to data.

## Tools
- thought: Add a brief planning/progress note to the tool trace (use for non-trivial requests)
- get_planet_data: Planet facts — distance from Earth/Sun, gravity, atmosphere, temperature, moons, resources, habitability, travel time, delta-v requirements
- get_spacecraft_data: Spacecraft/rocket specifications — payload capacity, thrust, fuel, dimensions, capabilities, reusability
- calculate_hohmann_transfer: Orbital mechanics calculation — transfer orbit, travel time, delta-v, launch windows between planets
- estimate_mission_cost: Rough cost estimation based on destination, mission type, spacecraft, and crew requirements
- get_apod: NASA Astronomy Picture of the Day — stunning space imagery and descriptions
- get_neo_feed: Near Earth Objects data — asteroid tracking and close approaches
- get_mars_photos: Mars rover imagery from Curiosity, Opportunity, Spirit
- web_search: Time-sensitive research on space news, mission updates, launch schedules, space technology (only when web search is enabled)
- vault_search: Find items in the user's vault — mission plans, reports, saved analyses, chats, files. Use an empty query to skim recent items.
- vault_read_item: Load full detail for one vault item; set includeRaw true when you need JSON before editing
- vault_update_item: Persist edits to mission plans, reports, or conversation titles (read first, then patch)
- vault_create_report: Create a new report (PDF, TXT, or MD format) — use when user asks to save a mission analysis or document
- vault_create_memory: Save important information, learnings, or notes for future reference

## Agentic behavior
- Do not follow a single fixed pipeline. Choose tools based on the question: sometimes vault-only, sometimes data-only, sometimes many steps.
- For non-trivial tasks, call thought with a short note before major tool batches and when your plan changes.
- Prefer vault_search → vault_read_item when the user references "my", "saved", prior work, or anything that could live in their vault.
- For mission planning questions, usually start with get_planet_data for the destination, then add spacecraft data, orbital calculations, and cost estimates as needed.
- Use multiple tool rounds if needed: you may search, read planetary data, calculate transfers, estimate costs, then save to vault.
- Always consider launch windows, orbital mechanics, and practical constraints when planning missions.
- For crewed missions, factor in life support, radiation shielding, and return trip requirements.
- Take time to be accurate: calling extra tools is better than guessing. Space missions require precision.

## Mission feasibility assessment
When asked about mission feasibility, consider:
- Destination characteristics (gravity, atmosphere, temperature, radiation)
- Available spacecraft capabilities (payload, thrust, fuel)
- Orbital mechanics (transfer windows, travel time, delta-v requirements)
- Crew requirements (life support, radiation shielding, return mission)
- Budget constraints (cost estimates based on historical missions)
- Technology readiness (current vs. future capabilities)

Provide a clear verdict: Feasible, Risky but possible, or Not possible with current technology. Explain why and suggest alternatives if needed.

## Answers
- Lead with conclusions, then support with numbers and citations from tool output.
- Use markdown sections and bullets. No emojis.
- If data is missing, say so and say what you tried.
- Be grounded in physics and engineering principles — don't speculate beyond available data.
- Reference actual NASA data and historical missions when making comparisons.

Stay focused on space mission planning, orbital mechanics, spacecraft capabilities, planetary science, and the user's saved Trajectory data.`;

// ─── Streaming generator ──────────────────────────────────────────────────────

const MAX_ITERATIONS = 35;

async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        "",
      ),
    );
    return base64;
  } catch (err) {
    console.error("Failed to fetch image:", err);
    throw err;
  }
}

function toAnthropicImageMediaType(
  fileType: string,
): Anthropic.Messages.Base64ImageSource["media_type"] | null {
  if (fileType === "image/jpeg" || fileType === "image/jpg") return "image/jpeg";
  if (fileType === "image/png") return "image/png";
  if (fileType === "image/gif") return "image/gif";
  if (fileType === "image/webp") return "image/webp";
  return null;
}

export async function* chatWithClaudeStreaming(
  request: ChatRequest,
): AsyncGenerator<StreamChunk> {
  const executionContext: ToolExecutionContext = {
    convexAccessToken: request.convexAccessToken,
    webSearchEnabled: request.webSearch ?? false,
  };

  const conversationMessages: Anthropic.Messages.MessageParam[] = [];
  const availableTools = request.webSearch
    ? TOOL_DEFINITIONS
    : TOOL_DEFINITIONS.filter((tool) => tool.name !== "web_search");

  for (const m of request.messages) {
    const contentParts: Anthropic.Messages.ContentBlockParam[] = [];

    if (m.content) {
      contentParts.push({ type: "text", text: m.content });
    }

    if (m.attachments && m.attachments.length > 0) {
      for (const att of m.attachments) {
        if (att.fileType.startsWith("image/")) {
          try {
            const mediaType = toAnthropicImageMediaType(att.fileType);
            if (!mediaType) throw new Error(`Unsupported image type: ${att.fileType}`);
            const base64Data = await fetchImageAsBase64(att.url);
            contentParts.push({
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Data,
              },
            });
          } catch {
            contentParts.push({
              type: "text",
              text: `[Attached image: ${att.fileName} (could not process)]`,
            });
          }
        } else {
          const ext = att.fileName.split(".").pop()?.toLowerCase() || "";
          let fileDescription = "";

          if (
            ["pdf", "doc", "docx", "txt", "csv", "xlsx", "xls"].includes(ext)
          ) {
            fileDescription = `[Attached document: ${att.fileName} (${att.fileType}, ${att.fileSize} bytes) - Content summary requested]`;
          } else {
            fileDescription = `[Attached file: ${att.fileName} (${att.fileType}, ${att.fileSize} bytes)]`;
          }

          contentParts.push({
            type: "text",
            text: fileDescription,
          });
        }
      }
    }

    conversationMessages.push({
      role: m.role,
      content: contentParts.length > 0 ? contentParts : m.content,
    });
  }

  let shouldContinue = true;
  let iteration = 0;

  while (shouldContinue && iteration < MAX_ITERATIONS) {
    iteration++;

    // ── Call Claude ──────────────────────────────────────────────────────────
    let stream: AsyncIterable<Anthropic.Messages.RawMessageStreamEvent>;
    try {
      stream = await anthropic.messages.create({
        model: "claude-opus-4-6",
        system: request.webSearch
          ? SYSTEM_PROMPT
          : `${SYSTEM_PROMPT}\n\nWeb search is disabled for this request. Do not call web_search.`,
        messages: conversationMessages,
        max_tokens: 8192,
        tools: availableTools as unknown as Anthropic.Messages.Tool[],
        stream: true,
      });
    } catch (err) {
      yield {
        type: "error",
        error: err instanceof Error ? err.message : "Claude API error",
      };
      return;
    }

    // ── Process stream events ────────────────────────────────────────────────
    let passText = "";
    let passStopReason = "";
    const passToolUses: Anthropic.Messages.ToolUseBlock[] = [];
    let toolBuffer: { id: string; name: string; inputJson: string } | null =
      null;

    for await (const event of stream) {
      const e = event as unknown as Record<string, unknown>;
      const eventType = e.type as string;

      if (eventType === "content_block_start") {
        const block = e.content_block as Record<string, unknown> | undefined;
        if (block?.type === "tool_use") {
          toolBuffer = {
            id: String(block.id ?? ""),
            name: String(block.name ?? ""),
            inputJson: "",
          };
          // Yield tool status so the UI can show a progress indicator
          const name = toolBuffer.name as ToolName;
          const status = TOOL_STATUS_LABELS[name] ?? `Running ${name}…`;
          yield {
            type: "tool_call",
            toolCallId: toolBuffer.id,
            toolName: name,
            status,
          };
        }
      }

      if (eventType === "content_block_delta") {
        const delta = e.delta as Record<string, unknown> | undefined;
        if (delta?.type === "text_delta") {
          const text = String(delta.text ?? "");
          passText += text;
          // Stream text immediately — only if this isn't a tool-use pass
          // We'll decide below after seeing stop_reason
        } else if (delta?.type === "input_json_delta" && toolBuffer) {
          toolBuffer.inputJson += String(delta.partial_json ?? "");
        }
      }

      if (eventType === "content_block_stop") {
        if (toolBuffer) {
          try {
            const parsedInput = JSON.parse(toolBuffer.inputJson || "{}");
            passToolUses.push({
              type: "tool_use",
              id: toolBuffer.id,
              name: toolBuffer.name,
              input: parsedInput,
            } as unknown as Anthropic.Messages.ToolUseBlock);
          } catch {
            // Malformed JSON from Claude — skip tool
          }
          toolBuffer = null;
        }
      }

      if (eventType === "message_delta") {
        const delta = e.delta as Record<string, unknown> | undefined;
        if (delta?.stop_reason) {
          passStopReason = String(delta.stop_reason);
        }
      }
    }

    const isToolPass = passStopReason === "tool_use" && passToolUses.length > 0;

    // Yield text if this wasn't a pure tool-use pass
    if (passText && !isToolPass) {
      yield { type: "text_delta", content: passText };
    }

    // No tools requested — we're done
    if (!isToolPass) {
      shouldContinue = false;
      break;
    }

    // ── Execute tools in parallel ────────────────────────────────────────────
    const executedToolResults = await Promise.all(
      passToolUses.map(async (toolUse) => {
        try {
          const input = toolUse.input as Record<string, unknown>;
          const result = await executeTool(
            toolUse.name as ToolName,
            input,
            executionContext,
          );
          return {
            toolCallId: toolUse.id,
            toolName: toolUse.name as ToolName,
            input,
            result,
            toolResultBlock: {
              type: "tool_result" as const,
              tool_use_id: toolUse.id,
              content: JSON.stringify(result),
            },
          };
        } catch (err) {
          const errorResult = { error: String(err) };
          return {
            toolCallId: toolUse.id,
            toolName: toolUse.name as ToolName,
            input: toolUse.input as Record<string, unknown>,
            result: errorResult,
            toolResultBlock: {
              type: "tool_result" as const,
              tool_use_id: toolUse.id,
              content: JSON.stringify(errorResult),
            },
          };
        }
      }),
    );

    for (const executed of executedToolResults) {
      yield {
        type: "tool_result",
        toolCallId: executed.toolCallId,
        toolName: executed.toolName,
        input: executed.input,
        result: executed.result as Record<string, unknown>,
      };
    }

    const toolResults: Anthropic.Messages.ToolResultBlockParam[] =
      executedToolResults.map((executed) => executed.toolResultBlock);

    // ── Append assistant + tool results to conversation ──────────────────────
    conversationMessages.push({
      role: "assistant",
      content: [
        ...(passText ? [{ type: "text" as const, text: passText }] : []),
        ...passToolUses,
      ],
    });

    conversationMessages.push({
      role: "user",
      content: toolResults,
    });
  }

  yield { type: "done" };
}
