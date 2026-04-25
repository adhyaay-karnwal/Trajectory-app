"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { AppGate } from "@/components/app-gate";
import { AppShell } from "@/components/app-shell";
import { DataEngineNodes } from "@/components/chat/data-engine-nodes";
import { MarkdownRenderer } from "@/components/chat/markdown-renderer";
import { LocationMapCard } from "@/components/chat/location-map-card";
import { StreetViewCard } from "@/components/chat/street-view-card";
import { ZoningBoundaryCard } from "@/components/chat/zoning-boundary-card";
import { VaultStructuredSummary } from "@/components/chat/vault-structured-summary";
import { ChatWorkspacePanel } from "@/components/chat/chat-workspace-panel";
import { ChartCard } from "@/components/chat/chart-card";
import { TrajectoryMapCard } from "@/components/chat/trajectory-map-card";
import { RocketDiagramCard } from "@/components/chat/rocket-diagram-card";
import { WireframeCard } from "@/components/chat/wireframe-card";
import { VisualizationExpansionPanel } from "@/components/chat/visualization-expansion-panel";
import { MissionPlanner } from "@/components/chat/mission-planner";
import { HugeLayersIcon, HugeFolderIcon } from "@/components/huge-icons";
import { PopButton } from "@/components/ui/pop-button";
import { useTheme } from "@/components/theme-provider";
import {
  buildToolStepFromResult,
  buildStructuredCardsFromToolResult,
  type ChatStructuredCard,
  type ToolCallStep,
  type ToolCallSubstep,
  type VaultSummaryCardData,
  type ToolWorkspaceRef,
  withDerivedStructuredCards,
  type ChartCardData,
  type TrajectoryMapCardData,
  type RocketDiagramCardData,
  type WireframeCardData,
} from "@/lib/chat-ui";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/use-sound";

// ─── Icon components ───────────────────────────────────────────────────────────

function AttachIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        opacity="0.4"
        d="M14 3C14 3 18.5 3 18.5 7.5V16.5C18.5 19.5376 16.0376 22 13 22C9.96243 22 7.5 19.5376 7.5 16.5V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7.5 8V16.5C7.5 18.433 9.067 20 11 20C12.933 20 14.5 18.433 14.5 16.5V7.5C14.5 5.567 12.933 4 11 4C9.067 4 7.5 5.567 7.5 7.5V16.5C7.5 19.5376 9.96243 22 13 22C16.0376 22 18.5 19.5376 18.5 16.5V7.5C18.5 3 14 3 14 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        opacity="0.4"
        d="M12 2C10.3431 2 9 3.34315 9 5V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V5C15 3.34315 13.6569 2 12 2Z"
        fill="currentColor"
      />
      <path
        d="M6 11C6 11 6 16 12 16C18 16 18 11 18 11M12 16V20M9 20H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        opacity="0.4"
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
        fill="currentColor"
      />
      <path
        d="M12 2C9.5 2 8 6.47715 8 12C8 17.5228 9.5 22 12 22C14.5 22 16 17.5228 16 12C16 6.47715 14.5 2 12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M2.5 9H21.5M2.5 15H21.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 19V5M12 5L6 11M12 5L18 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SlashCommandIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        opacity="0.4"
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
        fill="currentColor"
      />
      <path
        d="M14.5 7.5L9.5 16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
    </svg>
  );
}

// ─── Background ───────────────────────────────────────────────────────────────

function Background() {
  const { theme } = useTheme();
  return (
    <div
      className="absolute inset-0 -z-10"
      style={{ backgroundColor: theme === "dark" ? "#0f0f0f" : "#f5f5f5" }}
    />
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Attachment {
  fileName: string;
  fileType: string;
  fileSize: number;
  storageId: string;
  url: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCallStep[];
  structuredCards?: ChatStructuredCard[];
  streaming?: boolean;
  attachments?: Attachment[];
}

function normalizeToolCallStep(step: ToolCallStep): ToolCallStep {
  if (step.state === "done") {
    return { ...step, state: "completed" };
  }
  return step;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function normalizeToolState(value: unknown): ToolCallStep["state"] {
  if (
    value === "running" ||
    value === "completed" ||
    value === "error" ||
    value === "done"
  ) {
    return value;
  }
  return undefined;
}

function normalizeSubsteps(value: unknown): ToolCallSubstep[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const out: ToolCallSubstep[] = [];
  for (const [index, item] of value.entries()) {
    const row = asRecord(item);
    if (!row) continue;
    const status =
      typeof row.status === "string" && row.status.trim().length > 0
        ? row.status
        : null;
    if (!status) continue;
    out.push({
      id:
        typeof row.id === "string" && row.id.trim().length > 0
          ? row.id
          : `sub-${index + 1}`,
      status,
      state: normalizeToolState(row.state),
      detail:
        typeof row.detail === "string" && row.detail.trim().length > 0
          ? row.detail
          : undefined,
    });
  }
  return out.length > 0 ? out : undefined;
}

function initialSubstepsForTool(
  toolName: string,
): ToolCallSubstep[] | undefined {
  if (toolName === "vault_create_proforma") {
    return [
      {
        id: "stage-brief",
        status: "Prepare underwriting brief",
        state: "completed",
      },
      {
        id: "stage-generate",
        status: "Run pro forma generation model",
        state: "running",
      },
      {
        id: "stage-normalize",
        status: "Validate and normalize rows",
      },
      {
        id: "stage-save",
        status: "Save model to vault",
      },
    ];
  }
  if (toolName === "vault_create_flow") {
    return [
      {
        id: "stage-prepare",
        status: "Prepare workflow request",
        state: "completed",
      },
      {
        id: "stage-generate",
        status: "Run flow generation agent",
        state: "running",
      },
      {
        id: "stage-normalize",
        status: "Validate node structure and edges",
      },
      {
        id: "stage-save",
        status: "Save workflow to vault",
      },
    ];
  }
  return undefined;
}

function parsePersistedToolCallStep(
  raw: unknown,
  index: number,
): ToolCallStep | null {
  const step = asRecord(raw);
  if (!step) return null;

  const toolName =
    typeof step.toolName === "string" && step.toolName.trim().length > 0
      ? step.toolName
      : "tool";
  const id =
    typeof step.id === "string" && step.id.trim().length > 0
      ? step.id
      : `${toolName}-${index}`;
  const status =
    typeof step.status === "string" && step.status.trim().length > 0
      ? step.status
      : "Completed";

  return normalizeToolCallStep({
    id,
    toolName,
    kind: typeof step.kind === "string" ? step.kind : undefined,
    thoughtContent:
      typeof step.thoughtContent === "string" ? step.thoughtContent : undefined,
    status,
    state: normalizeToolState(step.state),
    inputSummary:
      typeof step.inputSummary === "string" ? step.inputSummary : undefined,
    resultSummary:
      typeof step.resultSummary === "string" ? step.resultSummary : undefined,
    resultItems: Array.isArray(step.resultItems)
      ? (step.resultItems as ToolCallStep["resultItems"])
      : undefined,
    workspace: asRecord(step.workspace)
      ? (step.workspace as ToolCallStep["workspace"])
      : undefined,
    substeps: normalizeSubsteps(step.substeps),
  });
}

// ─── Greeting helper ──────────────────────────────────────────────────────────

function getGreeting(
  user: { firstName?: string | null; email?: string | null } | null,
) {
  const hour = new Date().getHours();
  const name = user?.firstName?.trim() || user?.email?.split("@")[0] || "astronaut";
  const prefix =
    hour < 12
      ? "Good morning, "
      : hour < 17
        ? "Good afternoon, "
        : "Good evening, ";
  return { prefix, name };
}

// ─── Background images ────────────────────────────────────────────────────────

function BackgroundImages() {
  const { theme } = useTheme();
  const filter =
    theme === "dark"
      ? "brightness(0.3) saturate(0.7)"
      : "brightness(0.85) saturate(0.9)";
  const opacities =
    theme === "dark" ? [0.28, 0.25, 0.28, 0.25] : [0.45, 0.4, 0.45, 0.4];
  return (
    <div className="pointer-events-none absolute inset-0">
      <img
        src="/1.jpeg"
        alt=""
        className="absolute w-72 h-52 object-cover rounded-2xl"
        style={{
          opacity: opacities[0],
          top: "22%",
          left: "6%",
          rotate: "-6deg",
          filter,
        }}
      />
      <img
        src="/2.jpeg"
        alt=""
        className="absolute w-64 h-48 object-cover rounded-2xl"
        style={{
          opacity: opacities[1],
          top: "18%",
          right: "7%",
          rotate: "5deg",
          filter,
        }}
      />
      <img
        src="/3.jpeg"
        alt=""
        className="absolute w-68 h-48 object-cover rounded-2xl"
        style={{
          opacity: opacities[2],
          bottom: "20%",
          left: "8%",
          rotate: "5deg",
          filter,
        }}
      />
      <img
        src="/4.jpeg"
        alt=""
        className="absolute w-64 h-52 object-cover rounded-2xl"
        style={{
          opacity: opacities[3],
          bottom: "18%",
          right: "6%",
          rotate: "-5deg",
          filter,
        }}
      />
    </div>
  );
}

// ─── Petal pulse loading indicator ───────────────────────────────────────────

function TrajectoryPulse() {
  return (
    <img
      src="/trajectory-rocket-pulse.svg"
      alt="Thinking…"
      className="h-14 w-14"
    />
  );
}

// ─── Copy button ───────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-manrope transition-all",
        "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
        "hover:bg-gray-100 dark:hover:bg-white/[0.08]",
      )}
      title={copied ? "Copied!" : "Copy"}
    >
      {copied ? (
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M20 6L9 17l-5-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
      {copied && <span>Copied</span>}
    </button>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function UserBubble({
  content,
  attachments,
}: {
  content: string;
  attachments?: Attachment[];
}) {
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(
    null,
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (fileType: string) => fileType.startsWith("image/");

  return (
    <div className="flex justify-end">
      <div className="flex w-full max-w-[min(92%,720px)] flex-col items-end gap-2">
        {attachments && attachments.length > 0 && (
          <div className="flex flex-wrap justify-end gap-2">
            {attachments.map((att, idx) => (
              <div
                key={idx}
                onClick={() =>
                  isImage(att.fileType) && setPreviewAttachment(att)
                }
                className={cn(
                  "flex items-center gap-2 rounded-2xl border border-black/[0.06] bg-white/90 px-2.5 py-1.5 dark:border-white/[0.08] dark:bg-white/[0.06]",
                  isImage(att.fileType) && att.url
                    ? "cursor-pointer hover:bg-white dark:hover:bg-white/[0.09]"
                    : "",
                )}
              >
                {isImage(att.fileType) && att.url ? (
                  <img
                    src={att.url}
                    alt={att.fileName}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                ) : (
                  <HugeFolderIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                )}
                <div className="flex flex-col text-left">
                  <span className="max-w-[160px] truncate font-manrope text-xs font-medium text-gray-800 dark:text-gray-100">
                    {att.fileName}
                  </span>
                  <span className="font-manrope text-[10px] text-gray-500 dark:text-gray-400">
                    {formatFileSize(att.fileSize)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-full border border-black/[0.06] bg-neutral-100/95 px-5 py-2.5 dark:border-white/[0.08] dark:bg-white/[0.08]">
          <p className="text-left font-manrope text-[14px] leading-relaxed text-neutral-900 dark:text-neutral-100">
            {content}
          </p>
        </div>

        <CopyButton text={content} />

        {/* Preview modal */}
        {previewAttachment && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setPreviewAttachment(null)}
          >
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <img
                src={previewAttachment.url}
                alt={previewAttachment.fileName}
                className="max-w-full max-h-[90vh] rounded-lg"
              />
              <button
                onClick={() => setPreviewAttachment(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300"
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="absolute -bottom-12 left-0 text-white text-sm">
                {previewAttachment.fileName} (
                {formatFileSize(previewAttachment.fileSize)})
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AssistantBubble({
  message,
  onOpenWorkspace,
  onOpenVisualization,
}: {
  message: Message;
  onOpenWorkspace?: (ref: ToolWorkspaceRef) => void;
  onOpenVisualization?: (data: ChartCardData | TrajectoryMapCardData | RocketDiagramCardData | WireframeCardData) => void;
}) {
  const isStreaming = message.streaming;
  const hasContent = message.content.length > 0;
  const hasSteps = (message.toolCalls?.length ?? 0) > 0;
  const displayCards = withDerivedStructuredCards(
    message.structuredCards ?? [],
    message.content,
  );
  const vaultCards = displayCards.filter(
    (c): c is VaultSummaryCardData => c.kind === "vault",
  );
  const geoCards = displayCards.filter((c) => 
    c.kind === "location_map" || c.kind === "street_view" || c.kind === "zoning_boundary"
  ) as Exclude<
    ChatStructuredCard,
    VaultSummaryCardData | ChartCardData | TrajectoryMapCardData | RocketDiagramCardData | WireframeCardData
  >[];
  const visualizationCards = displayCards.filter((c) =>
    c.kind === "chart" || c.kind === "trajectory_map" || c.kind === "rocket_diagram" || c.kind === "wireframe"
  ) as (ChartCardData | TrajectoryMapCardData | RocketDiagramCardData | WireframeCardData)[];

  return (
    <div className="flex w-full max-w-[min(100%,820px)] flex-col gap-8">
      {hasSteps && (
        <DataEngineNodes
          steps={message.toolCalls ?? []}
          streaming={isStreaming}
          onOpenWorkspace={onOpenWorkspace}
        />
      )}

      {vaultCards.length > 0 && (
        <div className="space-y-2">
          {vaultCards.map((card, index) => (
            <VaultStructuredSummary key={`vault-${index}`} data={card} />
          ))}
        </div>
      )}

      {geoCards.length > 0 && (
        <div className="space-y-3">
          <p className="font-manrope text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">
            Maps &amp; site context
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {geoCards.map((card, index) =>
              card.kind === "location_map" ? (
                <LocationMapCard key={`${card.kind}-${index}`} data={card} />
              ) : card.kind === "zoning_boundary" ? (
                <ZoningBoundaryCard key={`${card.kind}-${index}`} data={card} />
              ) : (
                <StreetViewCard key={`${card.kind}-${index}`} data={card} />
              ),
            )}
          </div>
        </div>
      )}

      {visualizationCards.length > 0 && (
        <div className="space-y-3">
          <p className="font-manrope text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">
            Visualizations
          </p>
          <div className="grid grid-cols-1 gap-4">
            {visualizationCards.map((card, index) =>
              card.kind === "chart" ? (
                <ChartCard key={`${card.kind}-${index}`} data={card} onOpenVisualization={onOpenVisualization} />
              ) : card.kind === "trajectory_map" ? (
                <TrajectoryMapCard key={`${card.kind}-${index}`} data={card} onOpenVisualization={onOpenVisualization} />
              ) : card.kind === "rocket_diagram" ? (
                <RocketDiagramCard key={`${card.kind}-${index}`} data={card} onOpenVisualization={onOpenVisualization} />
              ) : card.kind === "wireframe" ? (
                <WireframeCard key={`${card.kind}-${index}`} data={card} onOpenVisualization={onOpenVisualization} />
              ) : null,
            )}
          </div>
        </div>
      )}

      {!hasContent && isStreaming ? (
        <div className="flex items-center gap-3 py-1">
          <TrajectoryPulse />
          <span className="font-manrope text-sm font-medium text-shine-container">
            Working on your request…
          </span>
        </div>
      ) : hasContent ? (
        <div className="space-y-2">
          <div className="font-manrope text-[15px] leading-relaxed text-gray-800 dark:text-gray-100">
            <MarkdownRenderer content={message.content} />
            {isStreaming && (
              <span className="ml-0.5 inline-block h-[14px] w-[2px] animate-pulse rounded-sm bg-sky-400" />
            )}
          </div>
        </div>
      ) : null}

      {hasContent && <CopyButton text={message.content} />}
    </div>
  );
}

// ─── Composer (post-query input bar) ─────────────────────────────────────────

interface ComposerProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  isLoading: boolean;
  webSearch: boolean;
  onToggleWebSearch: () => void;
  disabled?: boolean;
  attachments: Attachment[];
  onAttach: (files: File[]) => void;
  onRemoveAttachment: (index: number) => void;
}

function Composer({
  value,
  onChange,
  onSubmit,
  onStop,
  isLoading,
  webSearch,
  onToggleWebSearch,
  attachments,
  onAttach,
  onRemoveAttachment,
}: ComposerProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 180)}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAttach(files);
      e.target.value = "";
    }
  };

  const hasValue = value.trim().length > 0;
  const hasAttachments = attachments.length > 0;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (fileType: string) => fileType.startsWith("image/");

  return (
    /* Outer double-border shell */
    <div
      className={cn(
        "rounded-[13px] p-[2px] transition-all duration-200",
        "border",
        isFocused
          ? "border-black/[0.14] dark:border-white/[0.18] shadow-[0_0_0_3px_rgba(0,0,0,0.05)] dark:shadow-[0_0_0_3px_rgba(255,255,255,0.05)]"
          : "border-black/[0.07] dark:border-white/[0.08]",
      )}
    >
      {/* Inner border layer */}
      <div
        className={cn(
          "rounded-[11px] border overflow-hidden",
          "bg-white dark:bg-[#1a1a1e]",
          isFocused
            ? "border-black/[0.10] dark:border-white/[0.13]"
            : "border-black/[0.05] dark:border-white/[0.07]",
        )}
      >
        {/* Textarea row */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask Trajectory anything…"
          rows={1}
          className={cn(
            "block w-full resize-none bg-transparent px-4 py-3",
            "font-manrope text-sm text-gray-900 dark:text-white",
            "placeholder-gray-400 dark:placeholder-gray-600 outline-none",
            "transition-[height] duration-100",
          )}
        />

        {/* Attachments preview */}
        {hasAttachments && (
          <div className="flex flex-wrap gap-2 px-4 pb-2">
            {attachments.map((att, idx) => (
              <div
                key={idx}
                className={cn(
                  "group relative flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700",
                  "bg-gray-50 dark:bg-gray-800/50 px-2 py-1.5 pr-8",
                )}
              >
                {isImage(att.fileType) && att.url ? (
                  <img
                    src={att.url}
                    alt={att.fileName}
                    className="h-8 w-8 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-200 dark:bg-gray-700">
                    <svg
                      className="h-4 w-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="max-w-[120px] truncate text-xs font-medium text-gray-700 dark:text-gray-300">
                    {att.fileName}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {formatFileSize(att.fileSize)}
                  </span>
                </div>
                <button
                  onClick={() => onRemoveAttachment(idx)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200/80 dark:bg-gray-700/80 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-200 dark:hover:bg-red-900/50"
                >
                  <svg
                    className="h-3 w-3 text-gray-600 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-2 pb-2 pt-1">
          {/* Left actions */}
          <div className="flex items-center gap-0.5">
            <button
              title="Attach file"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-black/[0.05] dark:hover:bg-white/[0.07] hover:text-gray-600 dark:hover:text-gray-300"
            >
              <AttachIcon className="h-[16px] w-[16px]" />
            </button>
            <button
              title="Slash commands"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-black/[0.05] dark:hover:bg-white/[0.07] hover:text-gray-600 dark:hover:text-gray-300"
            >
              <SlashCommandIcon className="h-[16px] w-[16px]" />
            </button>
            <button
              title="Add files"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-8 items-center gap-1 rounded-lg px-2 text-[12px] font-medium font-manrope text-gray-400 transition-all hover:bg-black/[0.05] dark:hover:bg-white/[0.07] hover:text-gray-600 dark:hover:text-gray-300"
            >
              <PlusIcon className="h-[15px] w-[15px]" />
              <span>Add files</span>
            </button>
            <button
              onClick={onToggleWebSearch}
              title={webSearch ? "Disable web search" : "Enable web search"}
              className={cn(
                "flex h-8 items-center gap-1 rounded-lg px-2 text-[12px] font-medium font-manrope transition-all",
                webSearch
                  ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-300/40 dark:border-sky-500/30"
                  : "text-gray-400 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] hover:text-gray-600 dark:hover:text-gray-300",
              )}
            >
              <GlobeIcon className="h-[15px] w-[15px]" />
              {webSearch && <span>Web</span>}
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {/* Mic */}
            <button
              title="Voice input"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                "border border-black/[0.07] dark:border-white/[0.09]",
                "bg-white/60 dark:bg-white/[0.04] backdrop-blur-sm",
                "text-gray-500 dark:text-gray-400",
                "hover:border-sky-300/60 dark:hover:border-sky-500/40 hover:text-sky-500 dark:hover:text-sky-400",
                "hover:shadow-[0_0_10px_rgba(99,102,241,0.15)]",
              )}
            >
              <MicIcon className="h-[15px] w-[15px]" />
            </button>

            {/* Send / Stop */}
            {isLoading ? (
              <button
                onClick={onStop}
                title="Stop generation"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-400/30 text-red-500 transition-all hover:bg-red-500/20"
              >
                <StopIcon className="h-3.5 w-3.5" />
              </button>
            ) : (
              <PopButton
                color="default"
                size="sm"
                keybind="enter"
                disabled={!hasValue}
                onClick={onSubmit}
              >
                Go
              </PopButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

const SUGGESTIONS: string[] = [];

const ALL_PROMPTS = [
  "Plan a crewed mission to Mars with Starship",
  "Calculate the delta-v required for a Hohmann transfer to Jupiter",
  "Compare spacecraft options for a lunar sample return mission",
  "Analyze the feasibility of a Europa lander mission",
  "Estimate the cost of a Mars colonization program",
  "Find the best launch window for a Venus flyby",
  "Design a mission architecture for asteroid mining",
  "Compare Starship vs SLS for deep space missions",
  "Analyze radiation shielding requirements for Mars transit",
  "Plan a mission to Saturn's moon Titan",
  "Calculate orbital mechanics for a gravity assist trajectory",
  "Assess the habitability of exoplanet candidates",
  "Design a lunar base for long-term habitation",
  "Compare propulsion systems for interplanetary travel",
  "Analyze the challenges of a crewed mission to Europa",
  "Plan a mission to explore Neptune's moons",
  "Estimate fuel requirements for a Mars round trip",
  "Design a mission to deflect a near-Earth asteroid",
  "Compare launch sites for interplanetary missions",
  "Analyze the potential for in-situ resource utilization on Mars",
  "Plan a mission to search for life on Enceladus",
  "Calculate the transfer orbit to Mercury",
  "Design a mission architecture for a Mars sample return",
  "Compare different spacecraft for lunar missions",
  "Analyze the challenges of long-duration spaceflight",
  "Plan a mission to explore the asteroid belt",
  "Estimate the cost of a lunar gateway station",
  "Design a mission to study the Sun's corona",
  "Compare different Mars landing site options",
  "Analyze the feasibility of interstellar probes",
];

function EmptyState({
  user,
  query,
  onQueryChange,
  onSubmit,
  isLoading,
  webSearch,
  onToggleWebSearch,
  onSuggestion,
  attachments,
  onAttach,
  onRemoveAttachment,
}: {
  user: { firstName?: string | null; email?: string | null } | null;
  query: string;
  onQueryChange: (v: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  webSearch: boolean;
  onToggleWebSearch: () => void;
  onSuggestion: (s: string) => void;
  attachments: Attachment[];
  onAttach: (files: File[]) => void;
  onRemoveAttachment: (index: number) => void;
}) {
  const { prefix, name } = getGreeting(user);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [query]);
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Randomly select 3 prompts - starts with first 3 for SSR, then re-randomizes on client
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(
    ALL_PROMPTS.slice(0, 3),
  );
  useEffect(() => {
    const shuffled = [...ALL_PROMPTS].sort(() => Math.random() - 0.5);
    setSuggestedPrompts(shuffled.slice(0, 3));
  }, []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(
    null,
  );

  const hasAttachments = attachments.length > 0;
  const canSubmit = query.trim().length > 0 || hasAttachments;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (fileType: string) => fileType.startsWith("image/");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAttach(files);
      e.target.value = "";
    }
  };

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6 pb-20 overflow-hidden">
      <Background />

      <div className="relative z-10 w-full max-w-[640px]">
        {/* Date */}
        <p className="mb-1 font-manrope text-sm text-gray-500 dark:text-gray-400">
          {dateStr}
        </p>

        {/* Greeting */}
        <div className="mb-4 text-left">
          <h1 className="font-canela text-[2.75rem] leading-tight flex flex-wrap gap-2">
            <span className="text-gray-600 dark:text-neutral-500">
              {prefix}
            </span>
            <span className="text-gray-900 dark:text-white">{name}</span>
          </h1>
        </div>

        {/* Rectangles */}
        <div
          className="mt-6 w-full rounded-xl overflow-hidden bg-white dark:bg-[#1c1c1c] relative border-[3px] border-double border-neutral-300 dark:border-neutral-600"
          style={{
            height: `${56 + suggestedPrompts.length * 52 + (suggestedPrompts.length - 1) * 4 + 8}px`,
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-14 flex items-center px-4">
            <HugeLayersIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
            <span className="font-manrope font-semibold text-sm text-gray-700 dark:text-gray-300">
              Suggested Tasks
            </span>
          </div>
          <div
            className="absolute bottom-1 left-1 right-1 bg-[#f0f0f0] dark:bg-[#282828] rounded-lg flex flex-col overflow-hidden"
            style={{
              height: `${suggestedPrompts.length * 52 + (suggestedPrompts.length - 1) * 4}px`,
            }}
          >
            {suggestedPrompts.map((prompt: string, index: number) => (
              <button
                key={index}
                onClick={() => onSuggestion(prompt)}
                className={cn(
                  "flex-1 flex items-center px-4 py-3 font-manrope text-sm font-semibold text-gray-700 dark:text-gray-300",
                  "hover:bg-gray-200 dark:hover:bg-white/[0.1]",
                  "transition-colors duration-150",
                  index === 0 && "rounded-t-lg",
                  index === suggestedPrompts.length - 1 && "rounded-b-lg",
                )}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Box */}
        <div className="mt-6 w-full rounded-xl overflow-hidden bg-white dark:bg-[#1c1c1c] relative flex flex-col border-[3px] border-double border-neutral-300 dark:border-neutral-600">
          <div className="flex-1 m-1 bg-[#f0f0f0] dark:bg-[#282828] rounded-lg flex items-center px-3">
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              placeholder="Ask Trajectory anything..."
              rows={1}
              className={cn(
                "block w-full resize-none bg-transparent font-manrope text-sm text-gray-900 dark:text-white outline-none py-3",
                !query && "placeholder-shine-animation",
                "transition-[height] duration-100",
              )}
            />
          </div>
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <div className="h-10 flex items-center justify-between px-3 pb-1">
            <div className="flex items-center gap-1">
              <button
                title="Add files"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium font-manrope text-gray-500 dark:text-gray-400 transition-all hover:bg-gray-100 dark:hover:bg-white/[0.08]"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>Add files</span>
              </button>
              <button
                onClick={() => onToggleWebSearch()}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium font-manrope transition-all",
                  webSearch
                    ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-300/40 dark:border-sky-500/30"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08]",
                )}
              >
                <GlobeIcon className="w-3.5 h-3.5" />
                {webSearch && <span>Web</span>}
              </button>
            </div>
            <PopButton
              color="default"
              size="sm"
              keybind="enter"
              disabled={!canSubmit || isLoading}
              onClick={onSubmit}
            >
              Go
            </PopButton>
          </div>
          {/* Attachments preview - below prompt box */}
          {hasAttachments && (
            <div className="flex flex-wrap gap-2 px-3 pb-2">
              {attachments.map((att, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "group relative flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700",
                    "bg-[#f0f0f0] dark:bg-[#282828] px-2 py-1.5 pr-8",
                  )}
                >
                  {isImage(att.fileType) && att.url ? (
                    <img
                      src={att.url}
                      alt={att.fileName}
                      className="h-12 w-12 rounded object-cover cursor-pointer"
                      onClick={() => setPreviewAttachment(att)}
                    />
                  ) : (
                    <HugeFolderIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                  <div className="flex flex-col">
                    <span className="max-w-[120px] truncate text-xs font-medium text-gray-700 dark:text-gray-300">
                      {att.fileName}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {formatFileSize(att.fileSize)}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveAttachment(idx)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200/80 dark:bg-gray-700/80 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-200 dark:hover:bg-red-900/50"
                  >
                    <svg
                      className="h-3 w-3 text-gray-600 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Preview modal */}
          {previewAttachment && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
              onClick={() => setPreviewAttachment(null)}
            >
              <div className="relative max-w-[90vw] max-h-[90vh]">
                <img
                  src={previewAttachment.url}
                  alt={previewAttachment.fileName}
                  className="max-w-full max-h-[90vh] rounded-lg"
                />
                <button
                  onClick={() => setPreviewAttachment(null)}
                  className="absolute -top-10 right-0 text-white hover:text-gray-300"
                >
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="absolute -bottom-12 left-0 text-white text-sm">
                  {previewAttachment.fileName} (
                  {formatFileSize(previewAttachment.fileSize)})
                </div>
              </div>
            </div>
          )}
        </div>

        <NewChatShortcutHint className="mt-6" />
      </div>
    </div>
  );
}

// ─── Conversation view ────────────────────────────────────────────────────────

function ConversationView({
  messages,
  query,
  onQueryChange,
  onSubmit,
  onStop,
  isLoading,
  webSearch,
  onToggleWebSearch,
  attachments,
  onAttach,
  onRemoveAttachment,
  onOpenWorkspace,
  onOpenVisualization,
}: {
  messages: Message[];
  query: string;
  onQueryChange: (v: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  isLoading: boolean;
  webSearch: boolean;
  onToggleWebSearch: () => void;
  attachments: Attachment[];
  onAttach: (files: File[]) => void;
  onRemoveAttachment: (index: number) => void;
  onOpenWorkspace?: (ref: ToolWorkspaceRef) => void;
  onOpenVisualization?: (data: ChartCardData | TrajectoryMapCardData | RocketDiagramCardData | WireframeCardData) => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasAttachments = attachments.length > 0;
  const canSubmit = query.trim().length > 0 || hasAttachments;
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(
    null,
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (fileType: string) => fileType.startsWith("image/");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAttach(files);
      e.target.value = "";
    }
  };

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [query]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {/* Transcript */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-32 relative">
        <div className="mx-auto flex max-w-[820px] flex-col gap-10">
          {messages.map((msg) =>
            msg.role === "user" ? (
              <UserBubble
                key={msg.id}
                content={msg.content}
                attachments={msg.attachments}
              />
            ) : (
              <AssistantBubble
                key={msg.id}
                message={msg}
                onOpenWorkspace={onOpenWorkspace}
                onOpenVisualization={onOpenVisualization}
              />
            ),
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Fade overlay - appears as transcript scrolls up */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f5f5f5] to-transparent dark:from-[#0f0f0f] pointer-events-none" />

      {/* Floating prompt box */}
      <div className="absolute bottom-8 left-0 right-0 px-6 pb-0 pointer-events-none">
        <div className="mx-auto max-w-[760px] pointer-events-auto">
          <div className="w-full rounded-xl overflow-hidden bg-white/95 dark:bg-[#1c1c1c]/95 backdrop-blur-xl relative flex flex-col border-[3px] border-double border-neutral-300 dark:border-neutral-600 shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <div className="flex-1 m-1 bg-[#f0f0f0] dark:bg-[#282828] rounded-lg flex items-center px-3">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit();
                  }
                }}
                placeholder="Ask Trajectory anything..."
                rows={1}
                className={cn(
                  "block w-full resize-none bg-transparent font-manrope text-sm text-gray-900 dark:text-white outline-none py-3",
                  !query && "placeholder-shine-animation",
                  "transition-[height] duration-100",
                )}
              />
            </div>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <div className="h-10 flex items-center justify-between px-3 pb-1">
              <div className="flex items-center gap-1">
                <button
                  title="Add files"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium font-manrope text-gray-500 dark:text-gray-400 transition-all hover:bg-gray-100 dark:hover:bg-white/[0.08]"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  <span>Add files</span>
                </button>
                <button
                  onClick={() => onToggleWebSearch()}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium font-manrope transition-all",
                    webSearch
                      ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-300/40 dark:border-sky-500/30"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.08]",
                  )}
                >
                  <GlobeIcon className="w-3.5 h-3.5" />
                  {webSearch && <span>Web</span>}
                </button>
              </div>
              {isLoading && onStop ? (
                <button
                  onClick={onStop}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 border border-red-400/30 text-red-500 transition-all hover:bg-red-500/20"
                >
                  <StopIcon className="h-3.5 w-3.5" />
                </button>
              ) : (
                <PopButton
                  color="default"
                  size="sm"
                  keybind="enter"
                  disabled={!canSubmit || isLoading}
                  onClick={onSubmit}
                >
                  Go
                </PopButton>
              )}
            </div>
            {/* Attachments preview - below prompt box */}
            {hasAttachments && (
              <div className="flex flex-wrap gap-2 px-3 pb-2">
                {attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "group relative flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700",
                      "bg-[#f0f0f0] dark:bg-[#282828] px-2 py-1.5 pr-8",
                    )}
                  >
                    {isImage(att.fileType) && att.url ? (
                      <img
                        src={att.url}
                        alt={att.fileName}
                        className="h-12 w-12 rounded object-cover cursor-pointer"
                        onClick={() => setPreviewAttachment(att)}
                      />
                    ) : (
                      <HugeFolderIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    )}
                    <div className="flex flex-col">
                      <span className="max-w-[120px] truncate text-xs font-medium text-gray-700 dark:text-gray-300">
                        {att.fileName}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {formatFileSize(att.fileSize)}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveAttachment(idx)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200/80 dark:bg-gray-700/80 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-200 dark:hover:bg-red-900/50"
                    >
                      <svg
                        className="h-3 w-3 text-gray-600 dark:text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Preview modal */}
            {previewAttachment && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                onClick={() => setPreviewAttachment(null)}
              >
                <div className="relative max-w-[90vw] max-h-[90vh]">
                  <img
                    src={previewAttachment.url}
                    alt={previewAttachment.fileName}
                    className="max-w-full max-h-[90vh] rounded-lg"
                  />
                  <button
                    onClick={() => setPreviewAttachment(null)}
                    className="absolute -top-10 right-0 text-white hover:text-gray-300"
                  >
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="absolute -bottom-12 left-0 text-white text-sm">
                    {previewAttachment.fileName} (
                    {formatFileSize(previewAttachment.fileSize)})
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewChatShortcutHint({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto flex w-fit items-center justify-center gap-2",
        className,
      )}
    >
      <span className="font-manrope text-[11px] text-[#8fa0bc] dark:text-[#7f8ca3]">
        Press
      </span>
      <kbd
        className={cn(
          "inline-flex h-6 min-w-6 items-center justify-center rounded-[7px] border px-1.5",
          "border-[#c7d2e5] bg-[#dfe6f0] text-[11px] font-medium text-[#60728f]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(132,149,178,0.18)]",
          "dark:border-white/[0.10] dark:bg-white/[0.08] dark:text-[#b6c2d7] dark:shadow-none",
        )}
      >
        ⌘
      </kbd>
      <span className="font-manrope text-[15px] leading-none text-[#8fa0bc] dark:text-[#7f8ca3]">
        +
      </span>
      <kbd
        className={cn(
          "inline-flex h-6 min-w-6 items-center justify-center rounded-[7px] border px-1.5",
          "border-[#c7d2e5] bg-[#dfe6f0] text-[11px] font-medium text-[#60728f]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(132,149,178,0.18)]",
          "dark:border-white/[0.10] dark:bg-white/[0.08] dark:text-[#b6c2d7] dark:shadow-none",
        )}
      >
        K
      </kbd>
      <span className="font-manrope text-[11px] text-[#8fa0bc] dark:text-[#7f8ca3]">
        for a New Chat
      </span>
    </div>
  );
}

// ─── Main chat content ────────────────────────────────────────────────────────

function ChatContent() {
  const { user } = { user: null }; // No auth
  const { getAccessToken } = { getAccessToken: async () => null }; // No auth
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id") as Id<"conversations"> | null;
  const urlPrompt = searchParams.get("prompt");
  const { playBells } = useSound();

  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState(urlPrompt || "");
  const [isLoading, setIsLoading] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [workspacePanel, setWorkspacePanel] = useState<ToolWorkspaceRef | null>(
    null,
  );
  const [visualizationPanel, setVisualizationPanel] = useState<ChartCardData | TrajectoryMapCardData | RocketDiagramCardData | WireframeCardData | null>(
    null,
  );
  const [isMissionPlanning, setIsMissionPlanning] = useState(true);
  const [missionConfig, setMissionConfig] = useState<{
    planet: string;
    launchDate: string;
    rocket: string;
    crewSize: number;
    missionType: string;
    budget: string;
  } | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const convexIdRef = useRef<Id<"conversations"> | null>(null);
  const hydratedConversationRef = useRef<Id<"conversations"> | null>(null);
  const isSubmittingRef = useRef(false);
  const synthesisTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const synthesisStepIdRef = useRef<string | null>(null);

  const openWorkspace = useCallback((ref: ToolWorkspaceRef) => {
    setWorkspacePanel(ref);
  }, []);

  const openVisualization = useCallback((data: ChartCardData | TrajectoryMapCardData | RocketDiagramCardData | WireframeCardData) => {
    setVisualizationPanel(data);
  }, []);

  const handleMissionComplete = useCallback((config: {
    planet: string;
    launchDate: string;
    rocket: string;
    crewSize: number;
    missionType: string;
    budget: string;
  }) => {
    playBells();
    setMissionConfig(config);
    setIsMissionPlanning(false);

    // Generate comprehensive analysis prompt for AI
    const planetNames: Record<string, string> = {
      mars: "Mars",
      moon: "Moon",
      venus: "Venus",
      jupiter: "Jupiter",
      saturn: "Saturn",
      europa: "Europa",
      titan: "Titan",
    };
    const rocketNames: Record<string, string> = {
      starship: "Starship",
      "falcon-heavy": "Falcon Heavy",
      sls: "SLS",
      "new-glenn": "New Glenn",
    };
    const typeNames: Record<string, string> = {
      flyby: "flyby",
      orbit: "orbit",
      land: "landing",
      colonize: "colonization",
    };

    const planetName = planetNames[config.planet] || config.planet;
    const rocketName = rocketNames[config.rocket] || config.rocket;
    const typeName = typeNames[config.missionType] || config.missionType;
    const launchDate = new Date(config.launchDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const analysisPrompt = `Analyze this space mission:

**Mission Configuration:**
- Destination: ${planetName}
- Launch Date: ${launchDate}
- Spacecraft: ${rocketName}
- Crew Size: ${config.crewSize === 0 ? "Uncrewed" : `${config.crewSize} astronauts`}
- Mission Type: ${typeName}
- Budget: ${config.budget}

Please provide a comprehensive mission analysis including:
1. **Feasibility Assessment**: Is this mission possible? What are the main challenges?
2. **Best Route**: What's the optimal trajectory (Hohmann transfer, gravity assist, etc.)?
3. **Travel Time**: Estimated duration and launch windows
4. **Fuel/Delta-V Requirements**: Propellant needs and orbital mechanics
5. **Rocket Recommendation**: Is the chosen rocket suitable? Any alternatives?
6. **Cost Estimate**: Rough mission cost breakdown
7. **Resources Needed**: Life support, radiation shielding, habitat, power systems
8. **Crew Survival Plan**: How will astronauts survive the journey and stay?
9. **Habitat/Terraforming Plan**: What infrastructure is needed for long-term stay?
10. **Risks and Problems**: What could go wrong and how to mitigate?

Use the NASA API tools to get accurate data about the destination planet, spacecraft specifications, and orbital mechanics calculations. Create visualizations for the trajectory route and spacecraft diagram if relevant.`;

    // Set display-friendly summary for UI
    const displaySummary = `🚀 Mission Analysis: ${planetName} ${typeName} mission with ${rocketName}`;
    setQuery(displaySummary);
    
    // Store the full prompt for AI use
    (window as any).__missionAnalysisPrompt = analysisPrompt;
  }, []);

  const createConversation = useMutation(api.conversations.create);
  const addMessage = useMutation(api.conversations.addMessage);
  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
  const saveAttachment = useMutation(api.conversations.saveAttachment);
  const setStatus = useMutation(api.conversations.setStatus);
  const trackFeatureVisit = useMutation(api.dashboard.trackFeatureVisit);

  // Track chat visit on mount (only once per session)
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("petal_visited_chat");
    if (!hasVisited) {
      sessionStorage.setItem("petal_visited_chat", "true");
      void trackFeatureVisit({ feature: "chat" });
    }
  }, [trackFeatureVisit]);

  // Load existing conversation from URL param
  const savedMessages = useQuery(
    api.conversations.getMessages,
    urlId ? { conversationId: urlId } : "skip",
  );

  // Hydrate from Convex and keep in sync when safe (not during active stream).
  useEffect(() => {
    if (!urlId || !savedMessages) return;

    convexIdRef.current = urlId;
    const nextFromDb = savedMessages.map((m) => ({
      id: m._id,
      role: m.role,
      content: m.content,
      toolCalls: Array.isArray(m.toolCalls)
        ? m.toolCalls
            .map((step, index) => parsePersistedToolCallStep(step, index))
            .filter((step): step is ToolCallStep => step !== null)
        : [],
      structuredCards: (m.structuredCards ?? []) as Message["structuredCards"],
      attachments: (m.attachments ?? []) as Message["attachments"],
    }));

    setMessages((prev) => {
      const switchingConversation = hydratedConversationRef.current !== urlId;
      if (switchingConversation) {
        hydratedConversationRef.current = urlId;
        return nextFromDb;
      }
      if (isLoading || prev.some((m) => m.streaming)) return prev;

      if (nextFromDb.length < prev.length) return prev;

      const nextLooksStale = nextFromDb.some((nextMsg, i) => {
        const prevMsg = prev[i];
        if (!prevMsg || prevMsg.role !== nextMsg.role) return false;
        if (nextMsg.content.length < prevMsg.content.length) return true;
        if (
          (nextMsg.toolCalls?.length ?? 0) < (prevMsg.toolCalls?.length ?? 0)
        ) {
          return true;
        }
        if (
          (nextMsg.structuredCards?.length ?? 0) <
          (prevMsg.structuredCards?.length ?? 0)
        ) {
          return true;
        }
        return false;
      });
      if (nextLooksStale) return prev;

      const sameShape =
        prev.length === nextFromDb.length &&
        prev.every(
          (msg, i) =>
            msg.content === nextFromDb[i]?.content &&
            msg.role === nextFromDb[i]?.role &&
            (msg.toolCalls?.length ?? 0) ===
              (nextFromDb[i]?.toolCalls?.length ?? 0) &&
            (msg.structuredCards?.length ?? 0) ===
              (nextFromDb[i]?.structuredCards?.length ?? 0),
        );

      return sameShape ? prev : nextFromDb;
    });
  }, [urlId, savedMessages, isLoading]);

  // Reset when navigating to /chat with no id (new chat)
  useEffect(() => {
    if (!urlId) {
      setMessages([]);
      hydratedConversationRef.current = null;
      convexIdRef.current = null;
      setAttachments([]);
    }
  }, [urlId]);

  // Handle URL prompt parameter - pre-fill query box for new conversations
  useEffect(() => {
    if (urlPrompt && messages.length === 0) {
      // Just pre-fill the prompt for user to edit and submit themselves
      setQuery(urlPrompt);
    }
  }, [urlPrompt, messages.length]);

  const hasConversation = messages.length > 0;

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    isSubmittingRef.current = false;
    if (synthesisTimerRef.current) {
      clearTimeout(synthesisTimerRef.current);
      synthesisTimerRef.current = null;
    }
    synthesisStepIdRef.current = null;
    setIsLoading(false);
    setMessages((prev) =>
      prev.map((m, i) =>
        i === prev.length - 1 && m.streaming ? { ...m, streaming: false } : m,
      ),
    );
  }, []);

  const handleAttach = useCallback(
    async (files: File[]) => {
      const currentCount = attachments.length;
      const maxAllowed = 5 - currentCount;
      if (maxAllowed <= 0) return;

      const filesToUpload = files.slice(0, maxAllowed);

      let convoId = convexIdRef.current;
      if (!convoId) {
        try {
          convoId = await createConversation({ title: "New conversation" });
          hydratedConversationRef.current = convoId;
          convexIdRef.current = convoId;
          router.replace(`/chat?id=${convoId}`, { scroll: false });
        } catch {
          return;
        }
      }

      const newAttachments: Attachment[] = [];
      for (const file of filesToUpload) {
        try {
          const uploadUrl = await generateUploadUrl();
          const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });
          const { storageId } = await result.json();

          const saved = await saveAttachment({
            conversationId: convoId,
            storageId: storageId as Id<"_storage">,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          });

          newAttachments.push(saved);
        } catch (err) {
          console.error("Failed to upload file:", err);
        }
      }

      setAttachments((prev) => [...prev, ...newAttachments]);
    },
    [
      attachments.length,
      generateUploadUrl,
      saveAttachment,
      createConversation,
      router,
    ],
  );

  const handleRemoveAttachment = useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    // Use stored mission analysis prompt if available, otherwise use query
    const text = ((window as any).__missionAnalysisPrompt || query).trim();
    const displayText = query.trim(); // Keep display text for UI
    
    if (
      (!text && attachments.length === 0) ||
      isLoading ||
      isSubmittingRef.current
    )
      return;
    isSubmittingRef.current = true;

    setQuery("");
    setIsLoading(true);

    // Clear stored prompt after use
    delete (window as any).__missionAnalysisPrompt;

    const currentAttachments = [...attachments];
    setAttachments([]);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: displayText || text, // Use display text for UI, full text for AI
      attachments: currentAttachments,
    };

    const assistantId = `assistant-${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      toolCalls: [],
      structuredCards: [],
      streaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    // Create Convex conversation on first message
    let convoId = convexIdRef.current;
    if (!convoId) {
      try {
        const title = text.slice(0, 60) || "New conversation";
        convoId = await createConversation({ title });
        hydratedConversationRef.current = convoId;
        convexIdRef.current = convoId;
        router.replace(`/chat?id=${convoId}`, { scroll: false });
      } catch {
        // Non-fatal — continue without persistence
      }
    }

    // Set conversation status to generating
    if (convoId) {
      void setStatus({
        conversationId: convoId,
        status: "generating",
      });
    }

    if (!convoId) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "Unable to create this chat right now. Please try again.",
                streaming: false,
              }
            : m,
        ),
      );
      setIsLoading(false);
      isSubmittingRef.current = false;
      if (convoId) {
        void setStatus({
          conversationId: convoId,
          status: "idle",
        });
      }
      return;
    }

    // Persist user message with attachments
    const activeConversationId = convoId;
    let assistantDraftContent = "";
    let assistantDraftToolCalls: ToolCallStep[] = [];
    let assistantDraftStructuredCards: ChatStructuredCard[] = [];
    let initialAssistantPersistQueued = false;

    const persistAssistantDraft = async () => {
      const normalizedToolCalls = assistantDraftToolCalls.map(
        normalizeToolCallStep,
      );
      const hasAssistantPayload =
        assistantDraftContent.trim().length > 0 ||
        normalizedToolCalls.length > 0 ||
        assistantDraftStructuredCards.length > 0;
      if (!hasAssistantPayload) return;
      try {
        await addMessage({
          conversationId: activeConversationId,
          clientMessageId: assistantId,
          role: "assistant",
          content: assistantDraftContent,
          toolCalls: normalizedToolCalls,
          structuredCards: assistantDraftStructuredCards,
        });
      } catch (error) {
        console.error("Failed to persist assistant message:", error);
      }
    };

    const queueInitialAssistantPersist = () => {
      if (initialAssistantPersistQueued) return;
      const hasAssistantPayload =
        assistantDraftContent.trim().length > 0 ||
        assistantDraftToolCalls.length > 0 ||
        assistantDraftStructuredCards.length > 0;
      if (!hasAssistantPayload) return;
      initialAssistantPersistQueued = true;
      void persistAssistantDraft();
    };

    try {
      await addMessage({
        conversationId: activeConversationId,
        clientMessageId: userMessage.id,
        role: "user",
        content: text, // Store full prompt in database
        attachments: currentAttachments,
      });
    } catch {
      /* non-fatal */
    }

    // Build history for API
    const history = messages.map((m) => ({
      role: m.role,
      content: m.content,
      attachments: m.attachments,
    }));
    history.push({
      role: "user",
      content: text, // Send full prompt to AI
      attachments: currentAttachments,
    });

    const controller = new AbortController();
    abortRef.current = controller;
    if (synthesisTimerRef.current) {
      clearTimeout(synthesisTimerRef.current);
      synthesisTimerRef.current = null;
    }
    synthesisStepIdRef.current = null;

    const scheduleSynthesisStep = () => {
      if (synthesisTimerRef.current) {
        clearTimeout(synthesisTimerRef.current);
        synthesisTimerRef.current = null;
      }
      synthesisTimerRef.current = setTimeout(() => {
        const synthId = `synth-${assistantId}`;
        synthesisStepIdRef.current = synthId;
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== assistantId) return m;
            const hasRunningTool = (m.toolCalls ?? []).some(
              (step) => step.state === "running",
            );
            const alreadyExists = (m.toolCalls ?? []).some(
              (step) => step.id === synthId,
            );
            if (!m.streaming || hasRunningTool || alreadyExists) return m;
            return {
              ...m,
              toolCalls: [
                ...(m.toolCalls ?? []),
                {
                  id: synthId,
                  toolName: "synthesize_results",
                  status: "Synthesizing results…",
                  state: "running",
                  inputSummary: "Final response",
                },
              ],
            };
          }),
        );
      }, 1200);
    };

    const completeSynthesisStep = (status: string) => {
      if (synthesisTimerRef.current) {
        clearTimeout(synthesisTimerRef.current);
        synthesisTimerRef.current = null;
      }
      const synthId = synthesisStepIdRef.current;
      if (!synthId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                toolCalls: (m.toolCalls ?? []).map((step) =>
                  step.id === synthId && step.state === "running"
                    ? { ...step, state: "completed", status }
                    : step,
                ),
              }
            : m,
        ),
      );
    };

    const clearSynthesisStepForRealTool = () => {
      if (synthesisTimerRef.current) {
        clearTimeout(synthesisTimerRef.current);
        synthesisTimerRef.current = null;
      }
      const synthId = synthesisStepIdRef.current;
      if (!synthId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                toolCalls: (m.toolCalls ?? []).filter(
                  (step) => step.id !== synthId,
                ),
              }
            : m,
        ),
      );
      synthesisStepIdRef.current = null;
    };

    try {
      const convexAccessToken = await getAccessToken().catch(() => null);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          webSearch,
          convexAccessToken,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error(`API error ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;

          try {
            const chunk = JSON.parse(raw);

            if (chunk.type === "text_delta") {
              completeSynthesisStep("Derived insights");
              assistantDraftContent += chunk.content;
              queueInitialAssistantPersist();
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + chunk.content }
                    : m,
                ),
              );
            } else if (chunk.type === "tool_call") {
              clearSynthesisStepForRealTool();
              const toolCallId =
                typeof chunk.toolCallId === "string" &&
                chunk.toolCallId.length > 0
                  ? chunk.toolCallId
                  : `${chunk.toolName}-${Date.now()}`;
              assistantDraftToolCalls = [
                ...assistantDraftToolCalls,
                {
                  id: toolCallId,
                  toolName: chunk.toolName,
                  status: chunk.status,
                  state: "running",
                  substeps: initialSubstepsForTool(chunk.toolName),
                },
              ];
              queueInitialAssistantPersist();
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        toolCalls: [
                          ...(m.toolCalls ?? []),
                          {
                            id: toolCallId,
                            toolName: chunk.toolName,
                            status: chunk.status,
                            state: "running",
                            substeps: initialSubstepsForTool(chunk.toolName),
                          },
                        ],
                      }
                    : m,
                ),
              );
            } else if (chunk.type === "tool_result") {
              const toolCallId =
                typeof chunk.toolCallId === "string" &&
                chunk.toolCallId.length > 0
                  ? chunk.toolCallId
                  : null;
              const callUpdate = buildToolStepFromResult(
                chunk.toolName,
                (chunk.input ?? {}) as Record<string, unknown>,
                chunk.result,
              );
              assistantDraftToolCalls = assistantDraftToolCalls.map((step) =>
                (toolCallId !== null && step.id === toolCallId) ||
                (toolCallId === null &&
                  step.state === "running" &&
                  step.toolName === chunk.toolName)
                  ? {
                      ...step,
                      ...callUpdate,
                    }
                  : step,
              );
              const nextDraftCards = buildStructuredCardsFromToolResult(
                chunk.toolName,
                chunk.result,
                assistantDraftStructuredCards,
              );
              assistantDraftStructuredCards = [
                ...assistantDraftStructuredCards,
                ...nextDraftCards.filter(
                  (card) =>
                    !assistantDraftStructuredCards.some(
                      (existing) => existing.kind === card.kind,
                    ),
                ),
              ];
              queueInitialAssistantPersist();
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? (() => {
                        const nextCards = buildStructuredCardsFromToolResult(
                          chunk.toolName,
                          chunk.result,
                          m.structuredCards ?? [],
                        );
                        return {
                          ...m,
                          toolCalls: (m.toolCalls ?? []).map((step) =>
                            (toolCallId !== null && step.id === toolCallId) ||
                            (toolCallId === null &&
                              step.state === "running" &&
                              step.toolName === chunk.toolName)
                              ? {
                                  ...step,
                                  ...callUpdate,
                                }
                              : step,
                          ),
                          structuredCards: [
                            ...(m.structuredCards ?? []),
                            ...nextCards.filter(
                              (card) =>
                                !(m.structuredCards ?? []).some(
                                  (existing) => existing.kind === card.kind,
                                ),
                            ),
                          ],
                        } as Message;
                      })()
                    : m,
                ),
              );
              scheduleSynthesisStep();
            } else if (chunk.type === "error") {
              completeSynthesisStep("Unable to synthesize");
              assistantDraftContent = `Error: ${chunk.error}`;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        content: `Error: ${chunk.error}`,
                        streaming: false,
                      }
                    : m,
                ),
              );
            } else if (chunk.type === "done") {
              completeSynthesisStep("Summary ready");
              assistantDraftToolCalls = assistantDraftToolCalls.map((step) =>
                step.state === "running"
                  ? {
                      ...step,
                      state: "completed",
                      status: "Completed",
                    }
                  : step,
              );
              await persistAssistantDraft();
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        streaming: false,
                        toolCalls: (m.toolCalls ?? []).map((step) =>
                          step.state === "running"
                            ? {
                                ...step,
                                state: "completed",
                                status: "Completed",
                              }
                            : step,
                        ),
                      }
                    : m,
                ),
              );
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        completeSynthesisStep("Unable to synthesize");
        assistantDraftContent = "Something went wrong. Please try again.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: "Something went wrong. Please try again.",
                  streaming: false,
                }
              : m,
          ),
        );
      }
    } finally {
      if (synthesisTimerRef.current) {
        clearTimeout(synthesisTimerRef.current);
        synthesisTimerRef.current = null;
      }
      synthesisStepIdRef.current = null;
      setMessages((prev) => {
        return prev.map((m) =>
          m.id === assistantId ? { ...m, streaming: false } : m,
        );
      });
      await persistAssistantDraft();
      setIsLoading(false);
      isSubmittingRef.current = false;
      if (convoId) {
        void setStatus({
          conversationId: convoId,
          status: "idle",
        });
      }
    }
  }, [
    query,
    attachments,
    isLoading,
    messages,
    webSearch,
    createConversation,
    addMessage,
    getAccessToken,
    setStatus,
    router,
  ]);

  const handleSuggestion = (s: string) => {
    setQuery(s);
  };

  // Auto-submit when mission planning completes
  useEffect(() => {
    if (!isMissionPlanning && missionConfig && query.trim().length > 0 && !hasConversation) {
      handleSubmit();
    }
  }, [isMissionPlanning, missionConfig, query, hasConversation, handleSubmit]);

  if (!hasConversation) {
    if (isMissionPlanning) {
      return (
        <MissionPlanner onComplete={handleMissionComplete} />
      );
    }
    return (
      <EmptyState
        user={user}
        query={query}
        onQueryChange={setQuery}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        webSearch={webSearch}
        onToggleWebSearch={() => setWebSearch((v) => !v)}
        onSuggestion={handleSuggestion}
        attachments={attachments}
        onAttach={handleAttach}
        onRemoveAttachment={handleRemoveAttachment}
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full items-stretch overflow-hidden">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <ConversationView
          messages={messages}
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
          onStop={handleStop}
          isLoading={isLoading}
          webSearch={webSearch}
          onToggleWebSearch={() => setWebSearch((v) => !v)}
          attachments={attachments}
          onAttach={handleAttach}
          onRemoveAttachment={handleRemoveAttachment}
          onOpenWorkspace={openWorkspace}
          onOpenVisualization={openVisualization}
        />
      </div>
      {workspacePanel && workspacePanel.openMode !== "tab" && (
        <ChatWorkspacePanel
          workspace={workspacePanel}
          onClose={() => setWorkspacePanel(null)}
        />
      )}
      {visualizationPanel && (
        <VisualizationExpansionPanel
          data={visualizationPanel}
          onClose={() => setVisualizationPanel(null)}
        />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChatPage() {
  return (
    <AppGate>
      <AppShell>
        <Suspense>
          <ChatContent />
          <style jsx global>{`
            @keyframes data-engine-flow {
              0% {
                background-position: 200% 0;
              }
              100% {
                background-position: 0% 0;
              }
            }

            @keyframes data-engine-float {
              0%,
              100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-3px);
              }
            }

            @keyframes textShine {
              0% {
                background-position: 100% center;
              }
              100% {
                background-position: -100% center;
              }
            }
            .text-shine-container {
              position: relative;
              color: transparent;
              -webkit-background-clip: text;
              background-clip: text;
              background-image: linear-gradient(
                90deg,
                #9ca3af 0%,
                #9ca3af 32%,
                #7dd3fc 42%,
                #7dd3fc 50%,
                #7dd3fc 58%,
                #9ca3af 68%,
                #9ca3af 100%
              );
              background-size: 300% 300%;
              animation: textShine 6s ease-in-out infinite;
            }
            .dark .text-shine-container {
              background-image: linear-gradient(
                90deg,
                #a1a1aa 0%,
                #a1a1aa 30%,
                #7dd3fc 42%,
                #bae6fd 50%,
                #7dd3fc 58%,
                #a1a1aa 70%,
                #a1a1aa 100%
              );
            }
            .placeholder-shine-animation::placeholder {
              color: transparent;
              -webkit-background-clip: text;
              background-clip: text;
              background-image: linear-gradient(
                90deg,
                #9ca3af 0%,
                #9ca3af 32%,
                #7dd3fc 42%,
                #7dd3fc 50%,
                #7dd3fc 58%,
                #9ca3af 68%,
                #9ca3af 100%
              );
              background-size: 300% 300%;
              animation: textShine 6s ease-in-out infinite;
            }
            .dark .placeholder-shine-animation::placeholder {
              background-image: linear-gradient(
                90deg,
                #6b7280 0%,
                #6b7280 32%,
                #7dd3fc 42%,
                #7dd3fc 50%,
                #7dd3fc 58%,
                #6b7280 68%,
                #6b7280 100%
              );
            }
          `}</style>
        </Suspense>
      </AppShell>
    </AppGate>
  );
}
