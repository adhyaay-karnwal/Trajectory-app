"use client";

import type { ToolWorkspaceRef } from "@/lib/chat-ui";
import { cn } from "@/lib/utils";
import { PopButton } from "@/components/ui/pop-button";

function kindLabel(kind: string): string {
  const m: Record<string, string> = {
    proforma: "Pro forma",
    flow: "Flow",
    site: "Site",
    vault: "Vault",
    conversation: "Chat",
    attachment: "File",
  };
  return m[kind] ?? kind;
}

function FlowPeek() {
  return (
    <div className="flex h-14 min-w-[120px] items-center justify-center gap-1 rounded-lg border border-black/[0.06] bg-white/80 px-2 dark:border-white/[0.08] dark:bg-white/[0.04]">
      <div className="h-8 w-14 rounded-md border border-sky-200/60 bg-sky-50/80 dark:border-sky-500/25 dark:bg-sky-500/10" />
      <div className="h-0.5 w-3 rounded-full bg-gray-300 dark:bg-gray-600" />
      <div className="h-8 w-14 rounded-md border border-sky-200/60 bg-sky-50/80 dark:border-sky-500/25 dark:bg-sky-500/10" />
    </div>
  );
}

function ProformaPeek() {
  return (
    <div className="flex h-14 min-w-[120px] flex-col justify-center gap-1 rounded-lg border border-black/[0.06] bg-white/80 px-2 py-1.5 dark:border-white/[0.08] dark:bg-white/[0.04]">
      <div className="h-1.5 w-full rounded-sm bg-gray-200/90 dark:bg-gray-700" />
      <div className="h-1.5 w-4/5 rounded-sm bg-gray-100 dark:bg-gray-800" />
      <div className="h-1.5 w-full rounded-sm bg-gray-100 dark:bg-gray-800" />
      <div className="h-1.5 w-3/5 rounded-sm bg-gray-100 dark:bg-gray-800" />
    </div>
  );
}

function FilePeek() {
  return (
    <div className="flex h-14 min-w-[100px] items-center justify-center rounded-lg border border-dashed border-black/[0.08] bg-black/[0.02] dark:border-white/[0.1] dark:bg-white/[0.03]">
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-gray-400" fill="none" aria-hidden>
        <path
          d="M8 7V3h8l4 4v14a2 2 0 01-2 2H8a2 2 0 01-2-2V7a2 2 0 012-2z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function ChatVaultFileEmbed({
  workspace,
  onOpen,
  className,
}: {
  workspace: ToolWorkspaceRef;
  onOpen: () => void;
  className?: string;
}) {
  const showFlowPeek = workspace.kind === "flow";
  const showProformaPeek = workspace.kind === "proforma";
  const showFilePeek = workspace.kind === "attachment" || workspace.kind === "site";

  return (
    <div
      className={cn(
        "rounded-[13px] border border-black/[0.08] p-[2px] dark:border-white/[0.1]",
        className,
      )}
    >
      <div className="rounded-[11px] border border-black/[0.06] bg-white dark:border-white/[0.08] dark:bg-[#1a1a1e]">
        <div className="m-1 flex min-h-[72px] items-stretch gap-3 rounded-lg bg-[#f0f0f0] px-3 py-2.5 dark:bg-[#282828]">
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
            <span className="font-manrope text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
              {kindLabel(workspace.kind)}
            </span>
            <p className="truncate font-manrope text-sm font-semibold text-gray-900 dark:text-white">
              {workspace.title}
            </p>
            {(workspace.subtitle || workspace.peekLabel) && (
              <p className="line-clamp-2 font-manrope text-[11px] text-gray-500 dark:text-gray-400">
                {[workspace.subtitle, workspace.peekLabel].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          {showProformaPeek && <ProformaPeek />}
          {showFlowPeek && <FlowPeek />}
          {showFilePeek && !showProformaPeek && !showFlowPeek && <FilePeek />}
        </div>
        <div className="flex items-center justify-end px-2 pb-2 pt-1">
          <PopButton color="default" size="sm" onClick={onOpen}>
            Open
          </PopButton>
        </div>
      </div>
    </div>
  );
}
