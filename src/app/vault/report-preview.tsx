"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { AppGate } from "@/components/app-gate";
import { MarkdownRenderer } from "@/components/chat/markdown-renderer";
import { cn } from "@/lib/utils";
import { DownloadIcon } from "@/icons";
import { HugeLayersIcon } from "@/components/huge-icons";

// Download report as file
function downloadReport(content: string, name: string, format: string) {
  let blob: Blob;
  let filename: string;

  if (format === "md") {
    blob = new Blob([content], { type: "text/markdown" });
    filename = `${name}.md`;
  } else if (format === "pdf") {
    // For PDF, we'd ideally use a library like jspdf
    // For now, download as text with PDF extension (user can convert)
    blob = new Blob([content], { type: "text/plain" });
    filename = `${name}.pdf.txt`;
  } else {
    blob = new Blob([content], { type: "text/plain" });
    filename = `${name}.txt`;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Report content component
function ReportViewer({
  content,
  format,
}: {
  content: string;
  format: string;
}) {
  return (
    <div className="p-4 overflow-auto">
      {format === "md" ? (
        <MarkdownRenderer content={content} />
      ) : (
        <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono">
          {content}
        </pre>
      )}
    </div>
  );
}

// Main content component
function ReportPreviewContent() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get("id");
  const embed = searchParams.get("embedPanel") === "1";

  const [copied, setCopied] = useState(false);

  // Fetch report data
  const report = useQuery(
    api.vault.getReportPreview,
    reportId ? { id: reportId as Id<"vaultReports"> } : "skip"
  );

  // Copy to clipboard
  const handleCopy = async () => {
    if (report?.content) {
      await navigator.clipboard.writeText(report.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Loading state
  if (report === undefined) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Loading report...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (!report) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-sm text-red-500">Report not found</p>
        </div>
      </div>
    );
  }

  const formatLabel = report.format?.toUpperCase() ?? "FILE";

  return (
    <div className={cn("h-full flex flex-col", embed ? "bg-white dark:bg-[#0a0a0a]" : "")}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-4 py-3 border-b border-black/[0.07] dark:border-white/[0.06]",
        embed ? "bg-[#f5f5f5] dark:bg-[#141414]" : "bg-white dark:bg-[#0a0a0a]"
      )}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <HugeLayersIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <h1 className="font-manrope text-sm font-semibold text-gray-900 dark:text-white truncate">
              {report.name}
            </h1>
            <p className="font-manrope text-[11px] text-gray-500 dark:text-gray-400">
              {formatLabel} Report
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
            onClick={() => downloadReport(report.content, report.name, report.format)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <DownloadIcon className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white dark:bg-[#0a0a0a]">
        <ReportViewer content={report.content} format={report.format} />
      </div>

      {/* Footer with format info */}
      <div className="px-4 py-2 border-t border-black/[0.07] dark:border-white/[0.06] bg-[#f5f5f5] dark:bg-[#141414]">
        <div className="flex items-center justify-between">
          <span className="font-manrope text-[10px] text-gray-400 dark:text-gray-500">
            Format: {formatLabel}
          </span>
          <span className="font-manrope text-[10px] text-gray-400 dark:text-gray-500">
            Updated: {new Date(report.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// Page shell
function ReportPreviewShell() {
  const searchParams = useSearchParams();
  const embed = searchParams.get("embedPanel") === "1";

  if (embed) {
    return (
      <div className="h-[100dvh] min-h-0 w-full overflow-hidden bg-[#fafafa] dark:bg-[#050505]">
        <ReportPreviewContent />
      </div>
    );
  }

  return (
    <div className="h-full">
      <ReportPreviewContent />
    </div>
  );
}

export default function ReportPreviewPage() {
  return (
    <AppGate>
      <Suspense fallback={null}>
        <ReportPreviewShell />
      </Suspense>
    </AppGate>
  );
}
