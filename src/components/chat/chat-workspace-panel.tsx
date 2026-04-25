"use client";

import { useEffect, useMemo } from "react";
import type { ToolWorkspaceRef } from "@/lib/chat-ui";
import { cn } from "@/lib/utils";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ChatWorkspacePanel({
  workspace,
  onClose,
  className,
}: {
  workspace: ToolWorkspaceRef;
  onClose: () => void;
  className?: string;
}) {
  const iframeSrc = useMemo(() => {
    if (typeof window === "undefined") return "";
    const path = workspace.embedPath.startsWith("/")
      ? workspace.embedPath
      : `/${workspace.embedPath}`;
    return `${window.location.origin}${path}`;
  }, [workspace.embedPath]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (workspace.openMode === "tab") {
    return null;
  }

  return (
    <aside
      className={cn(
        "flex min-h-0 w-[min(50vw,720px)] min-w-[300px] shrink-0 flex-col border-l border-black/[0.08] bg-[#f5f5f5] shadow-[-12px_0_40px_-12px_rgba(0,0,0,0.15)] dark:border-white/[0.08] dark:bg-[#0f0f0f]",
        "h-full rounded-l-2xl overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-black/[0.06] bg-white/90 px-3 py-2.5 dark:border-white/[0.07] dark:bg-[#141414]/95">
        <div className="min-w-0">
          <p className="truncate font-manrope text-[13px] font-semibold text-gray-900 dark:text-white">
            {workspace.title}
          </p>
          {workspace.subtitle && (
            <p className="truncate font-manrope text-[11px] text-gray-500 dark:text-gray-400">
              {workspace.subtitle}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-black/[0.05] hover:text-gray-800 dark:hover:bg-white/[0.08] dark:hover:text-gray-200"
          aria-label="Close workspace"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
      <iframe
        title={workspace.title}
        src={iframeSrc}
        className="min-h-0 flex-1 w-full border-0 bg-white dark:bg-[#0a0a0a]"
      />
    </aside>
  );
}
