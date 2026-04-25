"use client";

import { useMemo, useState } from "react";
import { ChatVaultFileEmbed } from "@/components/chat/chat-vault-file-embed";
import { cn } from "@/lib/utils";
import type { ToolCallStep, ToolWorkspaceRef } from "@/lib/chat-ui";

interface DataEngineNodesProps {
  steps: ToolCallStep[];
  streaming?: boolean;
  onOpenWorkspace?: (ref: ToolWorkspaceRef) => void;
}

function openWorkspaceTarget(
  ref: ToolWorkspaceRef,
  onOpenWorkspace?: (r: ToolWorkspaceRef) => void,
) {
  if (typeof window === "undefined") return;
  const path = ref.embedPath.startsWith("/")
    ? ref.embedPath
    : `/${ref.embedPath}`;
  if (ref.openMode === "tab") {
    const u = new URL(path, window.location.origin);
    u.searchParams.delete("embedPanel");
    window.open(u.toString(), "_blank", "noopener,noreferrer");
    return;
  }
  if (onOpenWorkspace) {
    onOpenWorkspace(ref);
    return;
  }
  const u = new URL(path, window.location.origin);
  window.open(u.toString(), "_blank", "noopener,noreferrer");
}

/** Thin stroke icons (Notion-style), 16×16 viewBox */
function IconThought({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M8 1.5a4 4 0 00-4 4c0 1.2.6 2.3 1.5 3v1.5a.5.5 0 00.5.5h5a.5.5 0 00.5-.5V8.5A4.02 4.02 0 009 5.5a4 4 0 00-1-4z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M6.25 13.25h3.5M7 14.5h2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <circle
        cx="6.75"
        cy="6.75"
        r="4.25"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M10 10l3.25 3.25"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconEye({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M1.5 8s2.5-4 6.5-4 6.5 4 6.5 4-2.5 4-6.5 4S1.5 8 1.5 8z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function IconPencil({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M9.5 2.5l4 4-8 8H2.5v-3l8-8z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 3.5l4 4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPlus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M8 3.5v9M3.5 8h9"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M8 1.75c-1.75 2.25-3 4.1-3 6a3 3 0 006 0c0-1.9-1.25-3.75-3-6z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M8 14.25v-2.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLayers({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M8 1.75L2.5 4.25 8 6.75l5.5-2.5L8 1.75zM2.5 8l5.5 2.5L13.5 8M2.5 10.75L8 13.25l5.5-2.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M2.5 13.5h11"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M4.5 10V6M8 10V3.5M11.5 10V8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconHistory({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M8 4.75V8l2.5 1.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSpinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={cn("animate-spin", className)}
      aria-hidden
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeDasharray="28 12"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconChevron({
  className,
  open,
}: {
  className?: string;
  open?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={cn(
        "transition-transform duration-200",
        open && "rotate-90",
        className,
      )}
      aria-hidden
    >
      <path
        d="M6 3.5L10.5 8L6 12.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDoc({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M4 2.5h5.5L12 5v8.5a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 2.5V5H12"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMemory({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M8 1.5a4 4 0 00-4 4c0 1.2.6 2.3 1.5 3v1.5a.5.5 0 00.5.5h5a.5.5 0 00.5-.5V8.5A4.02 4.02 0 009 5.5a4 4 0 00-1-4z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M6.25 13.25h3.5M7 14.5h2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getItemIcon(iconName?: string) {
  switch (iconName) {
    case "memory":
      return IconMemory;
    case "proforma":
      return IconPlus;
    case "flow":
      return IconPlus;
    case "report":
      return IconLayers;
    default:
      return IconDoc;
  }
}

type TraceIcon =
  | "thought"
  | "search"
  | "eye"
  | "pencil"
  | "plus"
  | "pin"
  | "layers"
  | "chart"
  | "history"
  | "spinner"
  | "memory";

function traceIcon(toolName: string, running: boolean): TraceIcon {
  if (toolName === "thought") return "thought";
  if (running) return "spinner";
  switch (toolName) {
    case "synthesize_results":
      return "thought";
    case "web_search":
      return "search";
    case "vault_search":
      return "search";
    case "vault_read_item":
      return "eye";
    case "vault_update_item":
      return "pencil";
    case "vault_create_flow":
    case "vault_create_proforma":
      return "plus";
    case "vault_create_memory":
      return "memory";
    case "vault_create_report":
      return "layers";
    case "get_property_data":
      return "pin";
    case "get_zoning_data":
      return "layers";
    case "get_market_data":
      return "chart";
    case "get_property_history":
      return "history";
    default:
      return "search";
  }
}

function TraceGlyph({
  name,
  running,
  className,
}: {
  name: TraceIcon;
  running: boolean;
  className?: string;
}) {
  const k = running ? "spinner" : name;
  switch (k) {
    case "thought":
      return <IconThought className={className} />;
    case "search":
      return <IconSearch className={className} />;
    case "eye":
      return <IconEye className={className} />;
    case "pencil":
      return <IconPencil className={className} />;
    case "plus":
      return <IconPlus className={className} />;
    case "pin":
      return <IconPin className={className} />;
    case "layers":
      return <IconLayers className={className} />;
    case "chart":
      return <IconChart className={className} />;
    case "history":
      return <IconHistory className={className} />;
    case "spinner":
      return <IconSpinner className={className} />;
    case "memory":
      return <IconMemory className={className} />;
    default:
      return <IconSearch className={className} />;
  }
}

function countFromStatus(status: string): number | null {
  const m = status.match(/^(\d+)\s/);
  return m ? parseInt(m[1], 10) : null;
}

function lineParts(step: ToolCallStep): {
  verb: string;
  object: string;
  suffix?: string;
} {
  const name = step.toolName;
  const status = step.status ?? "";
  const input = step.inputSummary ?? "";
  const nItems = step.resultItems?.length ?? 0;

  if (step.state === "running") {
    return { verb: "", object: status };
  }

  if (name === "thought") {
    return { verb: "", object: "Thought" };
  }

  if (name === "synthesize_results") {
    return {
      verb: "",
      object: step.status || "Summary ready",
    };
  }

  if (name === "vault_search") {
    const n = nItems > 0 ? nItems : countFromStatus(status);
    const object =
      n !== null && Number.isFinite(n)
        ? `${n} result${n === 1 ? "" : "s"}`
        : "Vault";
    const suffix = input && input !== "Recent vault items" ? input : undefined;
    return { verb: "Searched vault ·", object, suffix };
  }

  if (name === "web_search") {
    const n = nItems > 0 ? nItems : countFromStatus(status);
    const object =
      n !== null && Number.isFinite(n)
        ? `${n} result${n === 1 ? "" : "s"}`
        : "Web";
    return { verb: "Searched ·", object, suffix: input || undefined };
  }

  if (name === "vault_read_item") {
    const o = status.replace(/^Opened\s+/i, "").trim() || input || "item";
    return { verb: "Opened", object: o };
  }

  if (name === "vault_update_item") {
    return {
      verb: "Updated",
      object: input.replace(/^Updating\s+/i, "").trim() || "vault",
    };
  }

  if (name === "vault_create_flow") {
    return { verb: "Created", object: input || "flow" };
  }

  if (name === "vault_create_proforma") {
    return { verb: "Created", object: input || "pro forma" };
  }

  if (name === "get_property_data") {
    return { verb: "Looked up", object: input || "parcel" };
  }

  if (name === "get_zoning_data") {
    return { verb: "Pulled zoning", object: input || "district" };
  }

  if (name === "get_market_data") {
    return { verb: "Pulled market data", object: input || "area" };
  }

  if (name === "get_property_history") {
    return { verb: "Loaded history", object: input || "property" };
  }

  return { verb: "", object: status || "Done" };
}

export function DataEngineNodes({
  steps,
  streaming = false,
  onOpenWorkspace,
}: DataEngineNodesProps) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const normalizedSteps = useMemo(
    () =>
      steps.map((step, index) => {
        const stepId = step.id ?? `${step.toolName}-${index}`;
        return { ...step, id: stepId };
      }),
    [steps],
  );
  if (normalizedSteps.length === 0) return null;

  return (
    <div className="w-full space-y-1">
      <div className="flex flex-col">
        {normalizedSteps.map((step, index) => {
          const hasDetails =
            Boolean(step.resultSummary) || (step.resultItems?.length ?? 0) > 0;
          const hasSubsteps = (step.substeps?.length ?? 0) > 0;
          const isRunning = step.state === "running";
          const isError = step.state === "error";
          const isSettled =
            step.state === "completed" ||
            step.state === "done" ||
            step.state === "error";
          const isActive =
            isRunning ||
            (streaming && index === normalizedSteps.length - 1 && !isSettled);
          const stepOpen = openMap[step.id] ?? false;
          const { verb, object, suffix } = lineParts(step);
          const isThought = step.toolName === "thought";
          const iconName = traceIcon(step.toolName, isRunning);

          return (
            <div
              key={step.id}
              className="relative flex flex-col gap-2 py-3 first:pt-1"
            >
              <div className="relative flex gap-3.5">
                {index < normalizedSteps.length - 1 && (
                  <div
                    className="absolute left-[7px] top-[26px] h-[calc(100%-10px)] w-px bg-gray-200 dark:bg-gray-800"
                    aria-hidden
                  />
                )}
                <div className="relative z-[1] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#f5f5f5] dark:bg-[#0f0f0f]">
                  <TraceGlyph
                    name={iconName}
                    running={isRunning && !isThought}
                    className={cn(
                      "h-4 w-4",
                      isError && "text-red-500",
                      isActive &&
                        !isError &&
                        "text-sky-500 dark:text-sky-400",
                      !isActive &&
                        !isError &&
                        "text-gray-400 dark:text-gray-500",
                    )}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    disabled={!hasDetails}
                    onClick={() =>
                      hasDetails &&
                      setOpenMap((p) => ({ ...p, [step.id]: !stepOpen }))
                    }
                    className={cn(
                      "flex w-full min-w-0 items-center gap-2 text-left",
                      hasDetails && "cursor-pointer",
                      !hasDetails && "cursor-default",
                    )}
                  >
                    <span className="min-w-0 inline-flex max-w-full items-center gap-1.5">
                      <span className="min-w-0">
                        {isActive && !isError ? (
                          <span
                            className={cn(
                              "block font-manrope text-[14px] leading-snug text-shine-container",
                              isThought ? "font-normal" : "font-medium",
                            )}
                          >
                            {isRunning
                              ? step.status
                              : [verb, object, suffix]
                                  .filter(Boolean)
                                  .join(" ")}
                          </span>
                        ) : (
                          <span
                            className={cn(
                              "block font-manrope text-[14px] leading-snug",
                              isError && "text-red-600 dark:text-red-300",
                            )}
                          >
                            {verb && (
                              <span className="font-normal text-gray-500 dark:text-gray-400">
                                {verb}{" "}
                              </span>
                            )}
                            <span
                              className={cn(
                                isThought
                                  ? "font-normal text-gray-700 dark:text-gray-200"
                                  : "font-semibold text-gray-900 dark:text-gray-50",
                                isError && "text-red-600 dark:text-red-300",
                              )}
                            >
                              {object}
                            </span>
                            {suffix && (
                              <span className="font-normal text-gray-500 dark:text-gray-400">
                                {" "}
                                · {suffix}
                              </span>
                            )}
                          </span>
                        )}
                      </span>
                      {hasDetails && (
                        <IconChevron
                          className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-gray-500"
                          open={stepOpen}
                        />
                      )}
                    </span>
                  </button>

                  {hasDetails && stepOpen && (
                    <div className="mt-3 space-y-0.5 pl-0">
                      {step.resultSummary && (
                        <p className="font-manrope text-[12px] leading-relaxed text-gray-600 dark:text-gray-300">
                          {step.resultSummary}
                        </p>
                      )}
                      {(step.resultItems?.length ?? 0) > 0 && (
                        <div className="mt-2 space-y-0">
                          {step.resultItems?.map((item, itemIndex) => (
                            <div
                              key={`${step.id}-r-${itemIndex}`}
                              className="flex items-start gap-2.5 py-1.5"
                            >
                              {(() => {
                                const IconComponent = getItemIcon(item.icon);
                                return <IconComponent className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-gray-500" />;
                              })()}
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-manrope text-[13px] text-gray-900 dark:text-gray-100">
                                  {item.title}
                                </p>
                                {item.subtitle && (
                                  <p className="truncate font-manrope text-[11px] text-gray-500 dark:text-gray-400">
                                    {item.subtitle}
                                  </p>
                                )}
                              </div>
                              {item.href && (
                                <a
                                  href={item.href}
                                  className="shrink-0 font-manrope text-[11px] text-gray-400 underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                  Open
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {hasSubsteps && (
                    <div className="mt-2 space-y-1.5 pl-3">
                      {step.substeps?.map((sub, subIndex) => {
                        const subRunning = sub.state === "running";
                        const subError = sub.state === "error";
                        const subDone =
                          sub.state === "completed" || sub.state === "done";
                        return (
                          <div
                            key={`${step.id}-sub-${sub.id ?? subIndex}`}
                            className="flex items-start gap-2"
                          >
                            <span
                              className={cn(
                                "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full",
                                subError && "bg-red-500",
                                subRunning && "bg-sky-500 dark:bg-sky-400",
                                subDone && "bg-emerald-500",
                                !subRunning &&
                                  !subError &&
                                  !subDone &&
                                  "bg-gray-300 dark:bg-gray-700",
                              )}
                            />
                            <div className="min-w-0">
                              <p
                                className={cn(
                                  "font-manrope text-[12px] leading-relaxed",
                                  subError && "text-red-600 dark:text-red-300",
                                  subRunning &&
                                    "text-sky-600 dark:text-sky-300",
                                  subDone && "text-gray-700 dark:text-gray-200",
                                  !subRunning &&
                                    !subError &&
                                    !subDone &&
                                    "text-gray-500 dark:text-gray-400",
                                )}
                              >
                                {sub.status}
                              </p>
                              {sub.detail && (
                                <p className="font-manrope text-[11px] text-gray-500 dark:text-gray-400">
                                  {sub.detail}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              {step.workspace && (
                <div className="max-w-xl pl-[26px]">
                  <ChatVaultFileEmbed
                    workspace={step.workspace}
                    onOpen={() =>
                      openWorkspaceTarget(step.workspace!, onOpenWorkspace)
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
