"use client";

import type { VaultSummaryCardData } from "@/lib/chat-ui";
import { cn } from "@/lib/utils";

function DocIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M4 2.5h5.5L12 5v8.5a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M9.5 2.5V5H12" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function asRecordArray(v: unknown): Record<string, unknown>[] {
  return Array.isArray(v) ? (v as Record<string, unknown>[]) : [];
}

function asString(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v : null;
}

function Row({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex gap-2.5 py-1.5">
      <DocIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-gray-500" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-manrope text-[13px] text-gray-900 dark:text-gray-100">{title}</p>
        {meta && (
          <p className="truncate font-manrope text-[11px] text-gray-500 dark:text-gray-400">{meta}</p>
        )}
      </div>
    </div>
  );
}

export function VaultStructuredSummary({
  data,
  className,
}: {
  data: VaultSummaryCardData;
  className?: string;
}) {
  const vd = data.vaultData ?? {};
  const proformas = asRecordArray(vd.proformas);
  const flows = asRecordArray(vd.flows);
  const sites = asRecordArray(vd.sites);
  const conversations = asRecordArray(vd.conversations);
  const attachments = asRecordArray(vd.attachments);
  const folders = asRecordArray(vd.folders);
  const stats = typeof vd.stats === "object" && vd.stats !== null ? (vd.stats as Record<string, unknown>) : null;

  const statLine = stats
    ? [
        typeof stats.proformaCount === "number" ? `${stats.proformaCount} pro formas` : null,
        typeof stats.propertiesAnalyzed === "number" ? `${stats.propertiesAnalyzed} analyses` : null,
        typeof stats.reportsGenerated === "number" ? `${stats.reportsGenerated} reports` : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : null;

  const hasRows =
    proformas.length +
      flows.length +
      sites.length +
      conversations.length +
      attachments.length +
      folders.length >
    0;

  return (
    <div
      className={cn(
        "rounded-xl bg-sky-50/60 px-3 py-2 dark:bg-sky-950/25",
        className,
      )}
    >
      <p className="font-manrope text-[11px] font-medium uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
        {data.title}
      </p>
      {statLine && (
        <p className="mt-1 font-manrope text-[11px] text-gray-500 dark:text-gray-400">{statLine}</p>
      )}
      {hasRows && (
        <div className="mt-2 max-h-48 overflow-y-auto pr-1">
          {folders.map((f, i) => (
            <Row key={`f-${i}`} title={asString(f.name) ?? "Folder"} meta="Folder" />
          ))}
          {proformas.map((p, i) => (
            <Row
              key={`p-${i}`}
              title={asString(p.name) ?? asString(p.projectName) ?? "Pro forma"}
              meta={[asString(p.assetType), asString(p.address)].filter(Boolean).join(" · ") || undefined}
            />
          ))}
          {flows.map((f, i) => (
            <Row key={`fl-${i}`} title={asString(f.name) ?? "Flow"} meta="Workflow" />
          ))}
          {sites.map((s, i) => (
            <Row key={`s-${i}`} title={asString(s.address) ?? "Site"} meta="Saved site" />
          ))}
          {conversations.map((c, i) => (
            <Row
              key={`c-${i}`}
              title={asString(c.title) ?? "Chat"}
              meta={
                typeof c.messageCount === "number" ? `${c.messageCount} messages` : undefined
              }
            />
          ))}
          {attachments.map((a, i) => (
            <Row
              key={`a-${i}`}
              title={asString(a.fileName) ?? "File"}
              meta={asString(a.fileType) ?? undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
