"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { AppGate } from "@/components/app-gate";
import { cn } from "@/lib/utils";
import { CopyIcon, DownloadIcon } from "@/icons";
import { HugeBrainIcon } from "@/components/huge-icons";

// Download memory as file
function downloadMemory(content: string, title: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const filename = `${title.replace(/[^a-z0-9]/gi, "_")}.txt`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Memory content component
function MemoryViewer({
  content,
}: {
  content: string;
}) {
  // Simple markdown-like rendering for preview
  const renderContent = () => {
    // Simple markdown rendering
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-base font-semibold text-gray-900 dark:text-white mt-4 mb-2">
            {line.slice(4)}
          </h3>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-lg font-bold text-gray-900 dark:text-white mt-5 mb-2">
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h1 key={idx} className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
            {line.slice(2)}
          </h1>
        );
      }
      // List items
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={idx} className="ml-4 text-sm text-gray-700 dark:text-gray-300">
            {line.slice(2)}
          </li>
        );
      }
      // Empty lines
      if (!line.trim()) {
        return <br key={idx} />;
      }
      // Regular text
      return (
        <p key={idx} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="p-4 overflow-auto">
      {renderContent()}
    </div>
  );
}

// Main content component
function MemoryPreviewContent() {
  const searchParams = useSearchParams();
  const memoryId = searchParams.get("id");
  const embed = searchParams.get("embedPanel") === "1";

  const [copied, setCopied] = useState(false);

  // Fetch memory data
  const memory = useQuery(
    api.vault.getMemoryPreview,
    memoryId ? { id: memoryId as Id<"vaultMemories"> } : "skip"
  );

  // Copy to clipboard
  const handleCopy = async () => {
    if (memory?.content) {
      await navigator.clipboard.writeText(memory.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Loading state
  if (memory === undefined) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Loading memory...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (!memory) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-sm text-red-500">Memory not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-full flex flex-col", embed ? "bg-white dark:bg-[#0a0a0a]" : "")}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-4 py-3 border-b border-black/[0.07] dark:border-white/[0.06]",
        embed ? "bg-[#f5f5f5] dark:bg-[#141414]" : "bg-white dark:bg-[#0a0a0a]"
      )}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
            <HugeBrainIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="min-w-0">
            <h1 className="font-manrope text-sm font-semibold text-gray-900 dark:text-white truncate">
              {memory.title}
            </h1>
            <p className="font-manrope text-[11px] text-gray-500 dark:text-gray-400">
              Memory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={() => downloadMemory(memory.content, memory.title)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-600 text-white hover:bg-teal-700 transition-colors"
          >
            <DownloadIcon className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white dark:bg-[#0a0a0a]">
        <MemoryViewer content={memory.content} />
      </div>

      {/* Footer with tags and date */}
      <div className="px-4 py-2 border-t border-black/[0.07] dark:border-white/[0.06] bg-[#f5f5f5] dark:bg-[#141414]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {memory.tags && memory.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {memory.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <span className="font-manrope text-[10px] text-gray-400 dark:text-gray-500">
            Updated: {new Date(memory.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// Page shell
function MemoryPreviewShell() {
  const searchParams = useSearchParams();
  const embed = searchParams.get("embedPanel") === "1";

  if (embed) {
    return (
      <div className="h-[100dvh] min-h-0 w-full overflow-hidden bg-[#fafafa] dark:bg-[#050505]">
        <MemoryPreviewContent />
      </div>
    );
  }

  return (
    <div className="h-full">
      <MemoryPreviewContent />
    </div>
  );
}

export default function MemoryPreviewPage() {
  return (
    <AppGate>
      <Suspense fallback={null}>
        <MemoryPreviewShell />
      </Suspense>
    </AppGate>
  );
}