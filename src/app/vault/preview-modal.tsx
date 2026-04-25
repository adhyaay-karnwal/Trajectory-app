"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { MarkdownRenderer } from "@/components/chat/markdown-renderer";

import { XIcon, DownloadIcon, CopyIcon, FileIcon } from "@/icons";
import {
  HugeLayersIcon,
  HugeFlowsIcon,
  HugeChatIcon,
  HugeCameraIcon,
  HugeBrainIcon,
} from "@/components/huge-icons";
import { Loader2Icon } from "@/icons";

// Types
type VaultItemType =
  | "attachment"
  | "conversation"
  | "report"
  | "trajectory"
  | "memory";

interface VaultItem {
  id: string;
  name: string;
  type: VaultItemType;
  date: string;
  size: string;
  data?: unknown;
}

// Type labels and icons
const TYPE_CONFIG: Record<
  VaultItemType,
  { label: string; icon: React.ReactElement }
> = {
  attachment: {
    label: "File",
    icon: (<HugeCameraIcon className="w-6 h-6" />) as React.ReactElement,
  },
  conversation: {
    label: "Chat",
    icon: (<HugeChatIcon className="w-6 h-6" />) as React.ReactElement,
  },
  report: {
    label: "Report",
    icon: (<HugeLayersIcon className="w-6 h-6" />) as React.ReactElement,
  },
  trajectory: {
    label: "Trajectory",
    icon: (<HugeFlowsIcon className="w-6 h-6" />) as React.ReactElement,
  },
  memory: {
    label: "Memory",
    icon: (<HugeBrainIcon className="w-6 h-6" />) as React.ReactElement,
  },
};

// Download helper
function downloadContent(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Copy helper
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// Preview content components for each type
function ReportPreview({ item }: { item: VaultItem }) {
  const reportData = item.data as
    | { content?: string; format?: string }
    | undefined;
  const content = reportData?.content || "No content available";
  const format = reportData?.format || "txt";
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const filename =
      format === "md"
        ? `${item.name}.md`
        : format === "pdf"
          ? `${item.name}.pdf.txt`
          : `${item.name}.txt`;
    downloadContent(content, filename, "text/plain");
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Actions */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-manrope font-medium text-gray-700 dark:text-gray-300 bg-[#f0f0f0] dark:bg-[#282828] hover:bg-neutral-200 dark:hover:bg-white/[0.1] transition-colors"
        >
          <DownloadIcon className="w-3.5 h-3.5" />
          Download
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-manrope font-medium text-gray-700 dark:text-gray-300 bg-[#f0f0f0] dark:bg-[#282828] hover:bg-neutral-200 dark:hover:bg-white/[0.1] transition-colors"
        >
          <CopyIcon className="w-3.5 h-3.5" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Content - with outer rectangle */}
      <div className="flex-1 rounded-2xl bg-[#f0f0f0] dark:bg-[#1c1c1c] p-1 overflow-hidden">
        {/* Inner rectangle - actual content */}
        <div className="h-full rounded-xl bg-white dark:bg-[#282828] overflow-auto p-4">
          {format === "md" ? (
            <MarkdownRenderer content={content} />
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono">
              {content}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

function AttachmentPreview({ item }: { item: VaultItem }) {
  const attachment = item.data as
    | { fileType?: string; url?: string; storageId?: string; fileSize?: number }
    | undefined;
  const isImage = attachment?.fileType?.startsWith("image/");
  const [downloading, setDownloading] = useState(false);

  const getAttachmentUrl = useQuery(
    api.vault.getAttachmentUrl,
    attachment?.storageId ? { storageId: attachment.storageId } : "skip",
  );

  const fileUrl = attachment?.url || getAttachmentUrl;
  
  const handleDownload = async () => {
    if (!fileUrl) return;
    setDownloading(true);
    try {
      const response = await fetch(fileUrl);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = item.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error("Download failed:", e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Actions */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-manrope font-medium text-gray-700 dark:text-gray-300 bg-[#f0f0f0] dark:bg-[#282828] hover:bg-neutral-200 dark:hover:bg-white/[0.1] transition-colors disabled:opacity-50"
        >
          <DownloadIcon className="w-3.5 h-3.5" />
          {downloading ? "Downloading..." : "Download"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 rounded-2xl bg-[#f0f0f0] dark:bg-[#1c1c1c] p-1 overflow-hidden">
        <div className="h-full rounded-xl bg-white dark:bg-[#282828] overflow-auto p-4">
          {isImage && fileUrl ? (
            <div className="flex items-center justify-center h-full">
              <img
                src={fileUrl}
                alt={item.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 rounded-2xl bg-[#f0f0f0] dark:bg-[#282828] flex items-center justify-center mb-4">
                <FileIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-manrope text-sm font-medium text-gray-900 dark:text-white mb-1">
                {item.name}
              </p>
              <p className="font-manrope text-xs text-gray-500 dark:text-gray-500">
                {attachment?.fileType || "File"} · {item.size}
              </p>
              {attachment?.storageId && (
                <p className="font-manrope text-[10px] text-gray-400 dark:text-gray-600 mt-2">
                  Stored in vault
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConversationPreview({ item }: { item: VaultItem }) {
  const convData = item.data as
    | { title?: string; lastMessageAt?: number; messageCount?: number }
    | undefined;
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    // Copy chat link
    const link = `/chat?id=${item.id}`;
    copyToClipboard(link).then((success) => {
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Actions */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-manrope font-medium text-gray-700 dark:text-gray-300 bg-[#f0f0f0] dark:bg-[#282828] hover:bg-neutral-200 dark:hover:bg-white/[0.1] transition-colors"
        >
          <CopyIcon className="w-3.5 h-3.5" />
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 rounded-2xl bg-[#f0f0f0] dark:bg-[#1c1c1c] p-1 overflow-hidden">
        <div className="h-full rounded-xl bg-white dark:bg-[#282828] overflow-auto p-4">
          <div className="flex items-center gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-700">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
              <HugeChatIcon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h3 className="font-manrope text-sm font-semibold text-gray-900 dark:text-white">
                {convData?.title || item.name}
              </h3>
              <p className="font-manrope text-xs text-gray-500 dark:text-gray-500">
                {convData?.messageCount || 0} messages
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="font-manrope text-sm text-gray-600 dark:text-gray-400">
              Open in chat to view full conversation
            </p>
            <button
              onClick={() => (window.location.href = `/chat?id=${item.id}`)}
              className="mt-3 px-4 py-2 rounded-lg text-xs font-manrope font-medium text-white bg-sky-600 hover:bg-sky-700 transition-colors"
            >
              Open Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MemoryPreview({ item }: { item: VaultItem }) {
  const memoryData = item.data as
    | { content?: string; tags?: string[] }
    | undefined;
  const content = memoryData?.content || "No content available";
  const tags = memoryData?.tags || [];
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    downloadContent(content, `${item.name}.txt`, "text/plain");
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Actions */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-manrope font-medium text-gray-700 dark:text-gray-300 bg-[#f0f0f0] dark:bg-[#282828] hover:bg-neutral-200 dark:hover:bg-white/[0.1] transition-colors"
        >
          <DownloadIcon className="w-3.5 h-3.5" />
          Download
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-manrope font-medium text-gray-700 dark:text-gray-300 bg-[#f0f0f0] dark:bg-[#282828] hover:bg-neutral-200 dark:hover:bg-white/[0.1] transition-colors"
        >
          <CopyIcon className="w-3.5 h-3.5" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Content - with outer rectangle */}
      <div className="flex-1 rounded-2xl bg-[#f0f0f0] dark:bg-[#1c1c1c] p-1 overflow-hidden">
        {/* Inner rectangle - actual content */}
        <div className="h-full rounded-xl bg-white dark:bg-[#282828] overflow-auto p-4">
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-700">
              {tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Memory content */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <MarkdownRenderer content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Preview Modal
interface PreviewModalProps {
  item: VaultItem | null;
  onClose: () => void;
}

export function PreviewModal({ item, onClose }: PreviewModalProps) {
  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!item) return null;

  const cfg = TYPE_CONFIG[item.type as VaultItemType] || TYPE_CONFIG.attachment;

  // Prevent click propagation on modal content
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70"
      onClick={onClose}
    >
      {/* Outer rectangle - the frame */}
      <div
        className="w-full max-w-3xl max-h-[85vh] rounded-3xl bg-[#f0f0f0] dark:bg-[#1c1c1c] shadow-2xl"
        onClick={handleContentClick}
      >
        {/* Header - top of outer rectangle */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <div className="text-gray-500 dark:text-gray-400">{cfg.icon}</div>
            <div>
              <p className="font-manrope text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600">
                {cfg.label}
              </p>
              <p className="font-manrope text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
                {item.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-neutral-200 dark:hover:bg-white/[0.1] transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Inner rectangle - the content area */}
        <div className="p-4 h-[calc(85vh-60px)]">
          {item.type === "report" && <ReportPreview item={item} />}
          {item.type === "trajectory" && <div className="h-full flex items-center justify-center text-gray-500">Trajectory preview not yet implemented</div>}
          {item.type === "attachment" && <AttachmentPreview item={item} />}
          {item.type === "conversation" && <ConversationPreview item={item} />}
          {item.type === "memory" && <MemoryPreview item={item} />}
        </div>
      </div>
    </div>
  );
}
