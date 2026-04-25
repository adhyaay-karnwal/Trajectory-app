"use client";

import {
  Suspense,
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppGate } from "@/components/app-gate";
import { AppShell } from "@/components/app-shell";
import { useTheme } from "@/components/theme-provider";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import {
  HugeFolderIcon,
  HugeLayersIcon,
  HugeChatIcon,
  HugeHomeIcon,
  HugeGridIcon,
  HugeArrowLeftIcon,
  HugeCameraIcon,
  HugeCheckCircleIcon,
  HugeSparklesIcon,
  HugeBrainIcon,
  HugeFlowsIcon,
} from "@/components/huge-icons";
import {
  Loader2Icon,
  XIcon,
  CheckIcon,
  TrashIcon,
  DownloadIcon,
  EyeIcon,
  PlusIcon,
  MoreHorizontalIcon,
} from "@/icons";
import { PopupModal } from "@/components/ui/popup-modal";
import { PreviewModal } from "./preview-modal";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  x: number;
  y: number;
  folderId?: string;
  data?: unknown;
}

interface VaultFolder {
  _id: string;
  name: string;
  parentId?: string;
  color?: string;
  createdAt: number;
}

type SidebarView = "all" | "folder" | "type" | "uncategorized" | "home";

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

// ─── Graph Colors ─────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<
  VaultItemType,
  { primary: string; secondary: string; label: string }
> = {
  attachment: { primary: "#f59e0b", secondary: "#fbbf24", label: "Files" },
  conversation: { primary: "#8b5cf6", secondary: "#a78bfa", label: "Chats" },
  report: { primary: "#3b82f6", secondary: "#60a5fa", label: "Reports" },
  trajectory: { primary: "#6366f1", secondary: "#818cf8", label: "Trajectories" },
  memory: { primary: "#14b8a6", secondary: "#2dd4bf", label: "Memories" },
};

// ─── Config ────────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  VaultItemType,
  { label: string; icon: React.ReactNode }
> = {
  attachment: { label: "Files", icon: <HugeFolderIcon className="w-8 h-8" /> },
  conversation: { label: "Chats", icon: <HugeChatIcon className="w-8 h-8" /> },
  report: { label: "Report", icon: <HugeLayersIcon className="w-8 h-8" /> },
  trajectory: { label: "Trajectory", icon: <HugeFlowsIcon className="w-8 h-8" /> },
  memory: { label: "Memory", icon: <HugeBrainIcon className="w-8 h-8" /> },
};

// Get icon based on file type/extension - using huge icons
function getFileIcon(item: VaultItem): React.ReactNode {
  const attachment = item.data as
    | { fileType?: string; fileName?: string }
    | undefined;
  const fileName = item.name.toLowerCase();
  const fileType = attachment?.fileType?.toLowerCase() || "";

  // Image files
  if (
    fileType.startsWith("image/") ||
    fileName.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/)
  ) {
    return <HugeCameraIcon className="w-8 h-8" />;
  }

  // Video files
  if (
    fileType.startsWith("video/") ||
    fileName.match(/\.(mp4|mov|avi|mkv|webm)$/)
  ) {
    return <HugeLayersIcon className="w-8 h-8" />;
  }

  // Audio files
  if (
    fileType.startsWith("audio/") ||
    fileName.match(/\.(mp3|wav|ogg|flac|aac|m4a)$/)
  ) {
    return <HugeSparklesIcon className="w-8 h-8" />;
  }

  // PDF files
  if (fileName.endsWith(".pdf")) {
    return <HugeLayersIcon className="w-8 h-8" />;
  }

  // Code files
  if (
    fileName.match(
      /\.(js|ts|jsx|tsx|py|java|cpp|c|go|rs|rb|php|html|css|json|xml|yaml|yml|sql|sh|bash)$/,
    )
  ) {
    return <HugeBrainIcon className="w-8 h-8" />;
  }

  // Spreadsheets (Excel, CSV)
  if (fileName.match(/\.(xls|xlsx|csv|numbers)$/)) {
    return <HugeCheckCircleIcon className="w-8 h-8" />;
  }

  // Documents (Word, Text, etc.)
  if (fileName.match(/\.(doc|docx|txt|rtf|odt|pages)$/)) {
    return <HugeCheckCircleIcon className="w-8 h-8" />;
  }

  // Default file icon
  return <HugeFolderIcon className="w-8 h-8" />;
}

const FOLDER_COLORS = [
  { dark: "#6366f1", light: "#818cf8" }, // Indigo
  { dark: "#8b5cf6", light: "#a78bfa" }, // Violet
  { dark: "#0ea5e9", light: "#7dd3fc" }, // Sky blue
  { dark: "#f43f5e", light: "#fb7185" }, // Rose
  { dark: "#f97316", light: "#fb923c" }, // Orange
  { dark: "#eab308", light: "#facc15" }, // Yellow
  { dark: "#22c55e", light: "#4ade80" }, // Green
  { dark: "#06b6d4", light: "#22d3ee" }, // Cyan
  { dark: "#3b82f6", light: "#60a5fa" }, // Blue
];

// ─── Helper Functions ────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Deterministic hash function
function deterministicRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash) / 2147483647;
}

// Generate graph positions
function generateGraphPositions(items: VaultItem[]): VaultItem[] {
  const centerX = 470;
  const centerY = 350;
  const radiusX = 350;
  const radiusY = 280;

  const typeGroups: Record<VaultItemType, VaultItem[]> = {
    attachment: [],
    conversation: [],
    report: [],
    trajectory: [],
    memory: [],
  };

  items.forEach((item) => {
    typeGroups[item.type].push(item);
  });

  let positionedItems: VaultItem[] = [];
  let typeIndex = 0;
  const types = Object.keys(typeGroups) as VaultItemType[];

  types.forEach((type) => {
    const groupItems = typeGroups[type];
    if (groupItems.length === 0) return;

    const angleStart = (typeIndex / types.length) * Math.PI * 2 - Math.PI / 2;
    const angleSpread = Math.PI / 3;

    groupItems.forEach((item, i) => {
      const count = groupItems.length;
      const angleOffset = count > 1 ? (i / (count - 1) - 0.5) * angleSpread : 0;
      const angle = angleStart + angleOffset;

      const seed = item.id + type;
      const rand1 = deterministicRandom(seed);
      const rand2 = deterministicRandom(seed + "offset");

      const x = centerX + Math.cos(angle) * radiusX + (rand1 - 0.5) * 40;
      const y = centerY + Math.sin(angle) * radiusY * 0.8 + (rand2 - 0.5) * 30;

      positionedItems.push({ ...item, x, y });
    });
    typeIndex++;
  });

  return positionedItems;
}

// ─── Graph Component ─────────────────────────────────────────────────────────

function Graph({
  items,
  selected,
  onSelect,
  theme,
}: {
  items: VaultItem[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  theme: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered ?? selected;

  const types = Object.keys(TYPE_CONFIG) as VaultItemType[];

  const edges = useMemo(() => {
    const edgeList: { from: string; to: string }[] = [];
    const itemsByType: Record<VaultItemType, VaultItem[]> = {
      attachment: [],
      conversation: [],
      report: [],
      trajectory: [],
      memory: [],
    };

    items.forEach((item) => {
      itemsByType[item.type].push(item);
    });

    items.forEach((item) => {
      const rand1 = deterministicRandom(item.id + "edge1");
      if (rand1 > 0.7) {
        const sameType = itemsByType[item.type].filter(
          (it) => it.id !== item.id,
        );
        if (sameType.length > 0) {
          const idx = Math.floor(
            deterministicRandom(item.id + "edge1idx") * sameType.length,
          );
          edgeList.push({ from: item.id, to: sameType[idx].id });
        }
      }
      const rand2 = deterministicRandom(item.id + "edge2");
      if (rand2 > 0.85) {
        const otherTypes = types.filter((t) => t !== item.type);
        const typeIdx = Math.floor(
          deterministicRandom(item.id + "edgetype") * otherTypes.length,
        );
        const randomType = otherTypes[typeIdx];
        const otherItems = itemsByType[randomType];
        if (otherItems.length > 0) {
          const idx = Math.floor(
            deterministicRandom(item.id + "edge2idx") * otherItems.length,
          );
          edgeList.push({ from: item.id, to: otherItems[idx].id });
        }
      }
    });
    return edgeList;
  }, [items]);

  const connectedIds = active
    ? new Set(
        edges.flatMap((e) =>
          e.from === active ? [e.to] : e.to === active ? [e.from] : [],
        ),
      )
    : null;

  const edgeDefault =
    theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const labelFill =
    theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="w-16 h-16 rounded-2xl bg-black/[0.04] dark:bg-white/[0.05] flex items-center justify-center mb-4">
          <HugeFolderIcon className="w-8 h-8 text-gray-400 dark:text-gray-600" />
        </div>
        <p className="font-canela text-lg font-bold text-gray-900 dark:text-white mb-2">
          Your vault is empty
        </p>
        <p className="font-manrope text-sm text-gray-500 dark:text-gray-500 max-w-xs">
          Start by creating a pro forma, analyzing a property, or uploading
          files.
        </p>
      </div>
    );
  }

  // Get type counts for legend
  const typeCounts = useMemo(() => {
    const counts: Record<VaultItemType, number> = {
      attachment: 0,
      conversation: 0,
      report: 0,
      trajectory: 0,
      memory: 0,
    };
    items.forEach((item) => {
      counts[item.type]++;
    });
    return counts;
  }, [items]);

  const hasItems = items.length > 0;

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 940 700"
        className="w-full h-full"
        onClick={() => onSelect(null)}
      >
        {edges.map((edge, i) => {
          const from = items.find((n) => n.id === edge.from);
          const to = items.find((n) => n.id === edge.to);
          if (!from || !to) return null;
          const isHighlighted =
            active && (edge.from === active || edge.to === active);
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={isHighlighted ? "#818cf8" : edgeDefault}
              strokeWidth={isHighlighted ? 1.5 : 0.8}
              opacity={active && !isHighlighted ? 0.15 : 0.6}
              style={{ transition: "opacity 0.15s, stroke 0.15s" }}
            />
          );
        })}
        {items.map((node) => {
          const isActive = node.id === active;
          const isConnected = connectedIds?.has(node.id);
          const isDimmed = !!active && !isActive && !isConnected;
          const typeColor =
            TYPE_COLORS[node.type as VaultItemType] || TYPE_COLORS.attachment;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(node.id === selected ? null : node.id);
              }}
            >
              {isActive && (
                <circle r="22" fill={typeColor.primary} opacity="0.12" />
              )}
              <circle
                r={isActive ? 12 : 8}
                fill={typeColor.primary}
                fillOpacity={isDimmed ? 0.2 : isActive ? 1 : 0.65}
                stroke={typeColor.secondary}
                strokeWidth={isActive ? 0 : 1.5}
                strokeOpacity={isDimmed ? 0.25 : 0.8}
                style={{ transition: "r 0.15s, fill-opacity 0.15s" }}
              />
              <text
                y={isActive ? 28 : 22}
                textAnchor="middle"
                fontSize="10"
                fill={labelFill}
                fillOpacity={isDimmed ? 0.2 : 0.9}
                style={{
                  userSelect: "none",
                  pointerEvents: "none",
                  fontFamily: "var(--font-manrope, sans-serif)",
                }}
              >
                {node.name.length > 22
                  ? node.name.slice(0, 22) + "…"
                  : node.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      {hasItems && (
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 bg-white/90 dark:bg-[#1c1c1c]/90 backdrop-blur-sm rounded-lg p-2.5 shadow-sm">
          {(Object.keys(TYPE_COLORS) as VaultItemType[]).map((type) => {
            const color = TYPE_COLORS[type];
            const count = typeCounts[type];
            if (count === 0) return null;
            return (
              <div key={type} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color.primary }}
                />
                <span className="font-manrope text-[10px] text-gray-600 dark:text-gray-400">
                  {color.label}{" "}
                  <span className="text-gray-400 dark:text-gray-600">
                    ({count})
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Detail Card ─────────────────────────────────────────────────────────────

function DetailCard({
  item,
  onClose,
  onDelete,
  onView,
  folders,
  onMove,
}: {
  item: VaultItem;
  onClose: () => void;
  onDelete: () => void;
  onView: () => void;
  folders: VaultFolder[];
  onMove: (folderId: string | null) => void;
}) {
  const cfg = TYPE_CONFIG[item.type as VaultItemType];
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  return (
    <div className="absolute bottom-5 right-5 w-64 rounded-2xl bg-white dark:bg-[#1c1c1c] shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
      <div className="m-1 rounded-lg bg-[#f0f0f0] dark:bg-[#282828] p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-400 shrink-0" />
            <span className="text-[10px] uppercase tracking-widest font-manrope font-semibold text-neutral-500 dark:text-neutral-400">
              {cfg?.label || "Item"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
        <p className="font-manrope text-sm font-medium text-gray-900 dark:text-white leading-snug mb-3 line-clamp-2">
          {item.name}
        </p>
        <div className="space-y-1.5 mb-4">
          {[
            { label: "Size", value: item.size },
            { label: "Modified", value: item.date },
          ].map(({ label: l, value }) => (
            <div key={l} className="flex justify-between">
              <span className="text-[11px] text-gray-400 dark:text-gray-600">
                {l}
              </span>
              <span className="text-[11px] text-gray-700 dark:text-gray-400">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Move to folder button */}
        <div className="relative mb-2">
          <button
            onClick={() => setShowMoveMenu(!showMoveMenu)}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-manrope font-medium text-gray-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-white/[0.1] transition-colors"
          >
            <HugeFolderIcon className="w-3.5 h-3.5" />
            Move to folder
          </button>

          {showMoveMenu && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1c1c1c] rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-10">
              <button
                onClick={() => {
                  onMove(null);
                  setShowMoveMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-xs font-manrope text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-white/[0.1]"
              >
                Home
              </button>
              {folders.map((folder) => (
                <button
                  key={folder._id}
                  onClick={() => {
                    onMove(folder._id);
                    setShowMoveMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-manrope text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-white/[0.1] flex items-center gap-2"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: folder.color || "#6366f1" }}
                  />
                  {folder.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-700">
          <button onClick={onView} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-manrope font-medium text-gray-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-white/[0.1] transition-colors">
            <EyeIcon className="w-3.5 h-3.5" />
            View
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-manrope font-medium text-gray-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-white/[0.1] transition-colors">
            <DownloadIcon className="w-3.5 h-3.5" />
            Download
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-manrope font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirmation Modal ───────────────────────────────────────────────

function DeleteConfirmModal({
  item,
  onConfirm,
  onCancel,
}: {
  item: VaultItem | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!item) return null;

  return (
    <PopupModal
      title="Delete Item?"
      onClose={onCancel}
      actions={[
        {
          label: "Cancel",
          onClick: onCancel,
          color: "default",
          variant: "ghost",
        },
        { label: "Delete", onClick: onConfirm, color: "red" },
      ]}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 shrink-0 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <svg
            className="w-4.5 h-4.5 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <p className="font-manrope text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            This action cannot be undone
          </p>
          <p className="font-manrope text-sm text-gray-700 dark:text-gray-300">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              &ldquo;{item.name}&rdquo;
            </span>
            ? This item will be permanently removed and cannot be restored.
          </p>
        </div>
      </div>
    </PopupModal>
  );
}

// ─── Create Folder Modal ─────────────────────────────────────────────────────

function CreateFolderModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (name: string, colorIndex: number) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [colorIndex, setColorIndex] = useState(0);
  const { theme } = useTheme();

  // Get the appropriate color based on theme for the preview
  const previewColor =
    FOLDER_COLORS[colorIndex][theme === "dark" ? "dark" : "light"];

  return (
    <PopupModal
      title="Create Folder"
      onClose={onCancel}
      actions={[
        {
          label: "Cancel",
          onClick: onCancel,
          color: "default",
          variant: "ghost",
        },
        {
          label: "Create",
          onClick: () => name.trim() && onConfirm(name.trim(), colorIndex),
          color: "sky",
          disabled: !name.trim(),
        },
      ]}
    >
      <input
        type="text"
        placeholder="Folder name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-[#1c1c1c] font-manrope text-sm text-gray-900 dark:text-white mb-4 outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
        autoFocus
        onKeyDown={(e) =>
          e.key === "Enter" && name.trim() && onConfirm(name.trim(), colorIndex)
        }
      />

      <div className="flex gap-2 mb-4">
        {FOLDER_COLORS.map((c, idx) => (
          <button
            key={idx}
            onClick={() => setColorIndex(idx)}
            className={cn(
              "w-6 h-6 rounded-full transition-transform border-2",
              colorIndex === idx ? "scale-110" : "border-transparent",
            )}
            style={{
              backgroundColor: theme === "dark" ? c.dark : c.light,
              borderColor:
                colorIndex === idx
                  ? theme === "dark"
                    ? "#fff"
                    : "#000"
                  : "transparent",
            }}
          />
        ))}
      </div>

      {/* Preview */}
      <div className="p-3 rounded-lg" style={{ backgroundColor: previewColor }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <HugeFolderIcon className="w-4 h-4 text-white" />
          </div>
          <span className="font-manrope text-sm font-medium text-white">
            {name || "Folder name"}
          </span>
        </div>
      </div>
    </PopupModal>
  );
}

// ─── Right Click Context Menu ────────────────────────────────────────────────

function ContextMenu({
  x,
  y,
  item,
  onClose,
  onDelete,
  onView,
  onMove,
  folders,
}: {
  x: number;
  y: number;
  item: VaultItem;
  onClose: () => void;
  onDelete: () => void;
  onView: () => void;
  onMove: (folderId: string | null) => void;
  folders: VaultFolder[];
}) {
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white dark:bg-[#1c1c1c] rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 min-w-[160px]"
      style={{ left: x, top: y }}
    >
      <button onClick={onView} className="w-full px-3 py-2 text-left text-xs font-manrope text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-white/[0.1] flex items-center gap-2">
        <EyeIcon className="w-3.5 h-3.5" />
        View
      </button>
      <button className="w-full px-3 py-2 text-left text-xs font-manrope text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-white/[0.1] flex items-center gap-2">
        <DownloadIcon className="w-3.5 h-3.5" />
        Download
      </button>
      <div className="relative">
        <button
          onClick={() => setShowMoveMenu(!showMoveMenu)}
          className="w-full px-3 py-2 text-left text-xs font-manrope text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-white/[0.1] flex items-center gap-2"
        >
          <HugeFolderIcon className="w-3.5 h-3.5" />
          Move to...
        </button>
        {showMoveMenu && (
          <div className="absolute left-full top-0 ml-1 bg-white dark:bg-[#1c1c1c] rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 min-w-[140px]">
            <button
              onClick={() => {
                onMove(null);
                setShowMoveMenu(false);
                onClose();
              }}
              className="w-full px-3 py-2 text-left text-xs font-manrope text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-white/[0.1]"
            >
              Home
            </button>
            {folders.map((folder) => (
              <button
                key={folder._id}
                onClick={() => {
                  onMove(folder._id);
                  setShowMoveMenu(false);
                  onClose();
                }}
                className="w-full px-3 py-2 text-left text-xs font-manrope text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-white/[0.1] flex items-center gap-2"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: folder.color || "#6366f1" }}
                />
                {folder.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="border-t border-neutral-200 dark:border-neutral-700 my-1" />
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full px-3 py-2 text-left text-xs font-manrope text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
      >
        <TrashIcon className="w-3.5 h-3.5" />
        Delete
      </button>
    </div>
  );
}

// ─── Breadcrumb Navigation ───────────────────────────────────────────────────

function Breadcrumbs({
  path,
  onNavigate,
}: {
  path: BreadcrumbItem[];
  onNavigate: (index: number) => void;
}) {
  // Always show home icon and /, then path items
  return (
    <div className="flex items-center gap-1 text-xs font-manrope">
      {/* Home icon - always show */}
      <button
        onClick={() => onNavigate(-1)}
        className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-white/[0.05] text-gray-500 dark:text-gray-400"
      >
        <HugeHomeIcon className="w-4 h-4" />
      </button>

      {/* Always show /, then path items (if any) */}
      <span className="text-gray-400 dark:text-gray-600">/</span>
      {path.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <button
            onClick={() => onNavigate(index)}
            className={cn(
              "px-2 py-1 rounded transition-colors",
              index === path.length - 1
                ? "text-gray-900 dark:text-white font-medium"
                : "text-gray-500 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-white/[0.05]",
            )}
          >
            {item.name}
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Folder Card (for drag target) ───────────────────────────────────────────

function FolderCard({
  folder,
  itemCount,
  onClick,
  onDragOver,
  onDrop,
  isDragOver,
}: {
  folder: VaultFolder;
  itemCount: number;
  onClick: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDragOver: boolean;
}) {
  const { theme } = useTheme();

  // Use the stored colorIndex to get the appropriate color
  // Light colors in dark mode, dark colors in light mode (for proper contrast)
  // Color is stored as string (e.g., "0", "1") so parse it
  const colorIndex = parseInt(String(folder.color || "0"), 10);
  const colorConfig = FOLDER_COLORS[colorIndex] || FOLDER_COLORS[0];
  const bgColor = theme === "dark" ? colorConfig.light : colorConfig.dark;

  return (
    <button
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        "w-full text-left cursor-pointer rounded-xl overflow-hidden transition-all p-3",
        isDragOver ? "ring-2 ring-blue-400" : "hover:opacity-90",
      )}
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/20">
          <HugeFolderIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-manrope text-sm font-medium text-white truncate">
            {folder.name}
          </p>
          <p className="font-manrope text-[10px] text-white/70">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
      </div>
    </button>
  );
}

// ─── File Card for Drive View ───────────────────────────────────────────────

function FileCard({
  item,
  selected,
  onSelect,
  onDoubleClick,
  onDelete,
  onContextMenu,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
}: {
  item: VaultItem;
  selected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onDelete: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDragOver: boolean;
}) {
  const cfg = TYPE_CONFIG[item.type as VaultItemType];

  const attachment = item.data as
    | { fileType?: string; url?: string; storageId?: string }
    | undefined;
  const isImage =
    item.type === "attachment" && attachment?.fileType?.startsWith("image/");
  const imageUrl = attachment?.url;
  const storageId = attachment?.storageId;

  // For images, try to get a URL from convex storage
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const getAttachmentUrl = useQuery(
    api.vault.getAttachmentUrl,
    storageId ? { storageId } : "skip",
  );

  useEffect(() => {
    if (isImage && storageId && getAttachmentUrl) {
      setImagePreviewUrl(getAttachmentUrl);
    }
  }, [isImage, storageId, getAttachmentUrl]);

  const displayImageUrl = imageUrl || imagePreviewUrl;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      className={cn(
        "group cursor-pointer rounded-xl overflow-hidden transition-all",
        selected
          ? "bg-neutral-100 dark:bg-white/[0.05]"
          : isDragOver
            ? "bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-400"
            : "hover:bg-neutral-50 dark:hover:bg-white/[0.03]",
      )}
    >
      {/* Outer rectangle - inverted colors for light mode */}
      <div className="m-1 rounded-2xl bg-[#f0f0f0] dark:bg-[#1c1c1c] flex flex-col">
        {/* Inner rectangle - inverted colors for light mode */}
        <div className="m-[2px] rounded-xl bg-white dark:bg-[#282828] overflow-hidden">
          <div className="h-28 flex items-center justify-center">
            {isImage && displayImageUrl ? (
              <img
                src={displayImageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                {item.type === "attachment" ? getFileIcon(item) : cfg?.icon}
              </div>
            )}
          </div>
        </div>

        <div className="px-3 pb-2 pt-1">
          <p className="font-manrope text-xs font-medium text-gray-900 dark:text-white truncate">
            {item.name}
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <span className="font-manrope text-[10px] text-gray-400 dark:text-gray-600">
              {item.date}
            </span>
            <span className="font-manrope text-[10px] text-gray-400 dark:text-gray-600">
              {item.size}
            </span>
          </div>
        </div>
      </div>

      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-md bg-neutral-600 flex items-center justify-center">
          <CheckIcon className="w-3 h-3 text-white" />
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className={cn(
          "absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center transition-all",
          selected
            ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
            : "opacity-0 group-hover:opacity-100 bg-white/90 dark:bg-[#1c1a1a]/90 text-neutral-500 hover:text-red-500",
        )}
      >
        <TrashIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Dashboard View ──────────────────────────────────────────────────────────

function DashboardView({
  items,
  folders,
  onOpenFolder,
  onSelectItem,
  selectedItems,
  onDeleteItem,
  onDragStart,
  onDragOver,
  onDrop,
  draggedItemId,
  onCreateFolder,
  onPreviewItem,
  onContextMenu,
}: {
  items: VaultItem[];
  folders: VaultFolder[];
  onOpenFolder: (folderId: string) => void;
  onSelectItem: (itemId: string) => void;
  selectedItems: Set<string>;
  onDeleteItem: (item: VaultItem) => void;
  onDragStart: (e: React.DragEvent, item: VaultItem) => void;
  onDragOver: (e: React.DragEvent, folderId: string) => void;
  onDrop: (e: React.DragEvent, folderId: string) => void;
  draggedItemId: string | null;
  onCreateFolder: () => void;
  onPreviewItem?: (item: VaultItem) => void;
  onContextMenu?: (e: React.MouseEvent, item: VaultItem) => void;
}) {
  // Get recent items (sorted by actual timestamp, take first 8)
  const recentItems = useMemo(() => {
    return [...items]
      .sort((a, b) => {
        // Get actual timestamps from the data
        const aData = a.data as { createdAt?: number; updatedAt?: number } | undefined;
        const bData = b.data as { createdAt?: number; updatedAt?: number } | undefined;
        const aTime = aData?.updatedAt || aData?.createdAt || 0;
        const bTime = bData?.updatedAt || bData?.createdAt || 0;
        return bTime - aTime;
      })
      .slice(0, 8);
  }, [items]);

  // Get folder counts
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      if (item.folderId) {
        counts[item.folderId] = (counts[item.folderId] || 0) + 1;
      }
    });
    return counts;
  }, [items]);

  return (
    <div className="p-4 space-y-6">
      {/* Folders Section */}
      <div>
        <h2 className="font-canela text-lg font-bold text-gray-900 dark:text-white mb-3">
          Folders
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {folders.map((folder) => (
            <div
              key={folder._id}
              onDragOver={(e) => {
                e.preventDefault();
                onDragOver(e, folder._id);
              }}
              onDrop={(e) => onDrop(e, folder._id)}
            >
              <FolderCard
                folder={folder}
                itemCount={folderCounts[folder._id] || 0}
                onClick={() => onOpenFolder(folder._id)}
                onDragOver={(e) => {
                  e.preventDefault();
                  onDragOver(e, folder._id);
                }}
                onDrop={(e) => onDrop(e, folder._id)}
                isDragOver={draggedItemId !== null}
              />
            </div>
          ))}
          {/* Create folder button - dashed border style */}
          <button
            onClick={onCreateFolder}
            className="w-full text-left cursor-pointer rounded-xl overflow-hidden transition-all p-3 border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-white/[0.05] flex items-center justify-center">
                <PlusIcon className="w-5 h-5 text-neutral-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-manrope text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  New Folder
                </span>
                <span className="font-manrope text-[10px] text-neutral-300 dark:text-neutral-600">
                  Create
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Files Section */}
      <div>
        <h2 className="font-canela text-lg font-bold text-gray-900 dark:text-white mb-3">
          Recent Files
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {recentItems.map((item) => (
            <div
              key={item.id}
              className="relative"
              onDragOver={(e) => {
                e.preventDefault();
              }}
            >
              <FileCard
                item={item}
                selected={selectedItems.has(item.id)}
                onSelect={() => onSelectItem(item.id)}
                onDoubleClick={() => onPreviewItem?.(item)}
                onDelete={() => onDeleteItem(item)}
                onContextMenu={(e) => onContextMenu?.(e, item)}
                onDragStart={(e) => onDragStart(e, item)}
                onDragOver={(e) => {
                  e.preventDefault();
                  onDragOver(e, "");
                }}
                onDrop={(e) => onDrop(e, "")}
                isDragOver={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Vault Content ───────────────────────────────────────────────────────────

function VaultContent() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const vaultData = useQuery(api.vault.getVaultData);

  const [selected, setSelected] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<VaultItem | null>(
    null,
  );
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentView, setCurrentView] = useState<SidebarView>("home");
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>();
  const [filterType, setFilterType] = useState<VaultItemType | undefined>();
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: VaultItem;
  } | null>(null);
  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([]);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<VaultItem | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize view from URL params
  useEffect(() => {
    const folderParam = searchParams.get("folder");
    const typeParam = searchParams.get("type") as VaultItemType | null;
    const viewParam = searchParams.get("view");
    const createFolderParam = searchParams.get("createFolder");

    const allFolders = vaultData?.folders || [];

    if (folderParam) {
      const folder = allFolders.find((f) => f._id === folderParam);
      setCurrentView("folder");
      setCurrentFolderId(folderParam);
      setFilterType(undefined);
      setBreadcrumbPath([{ id: folderParam, name: folder?.name || "Folder" }]);
    } else if (
      typeParam &&
      ["attachment", "conversation", "report", "trajectory", "memory"].includes(
        typeParam,
      )
    ) {
      setCurrentView("type");
      setCurrentFolderId(undefined);
      setFilterType(typeParam);
      setBreadcrumbPath([
        { id: typeParam, name: TYPE_CONFIG[typeParam]?.label || typeParam },
      ]);
    } else if (viewParam === "recent") {
      setCurrentView("all");
      setCurrentFolderId(undefined);
      setFilterType(undefined);
      setBreadcrumbPath([{ id: "recent", name: "Recent" }]);
    } else {
      setCurrentView("home");
      setCurrentFolderId(undefined);
      setFilterType(undefined);
      setBreadcrumbPath([]);
    }

    // Handle create folder from URL param
    if (createFolderParam === "true") {
      setShowCreateFolder(true);
      // Clean up URL
      router.replace("/vault");
    }
  }, [searchParams, vaultData, router]);

  // Handle scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const maxScroll = 200;
      const progress = Math.min(scrollTop / maxScroll, 1);
      setScrollProgress(progress);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Process vault data into items
  const items = useMemo(() => {
    if (!vaultData) return [];

    const vaultItems: VaultItem[] = [];

    vaultData.attachments?.forEach((att) => {
      vaultItems.push({
        id: att._id,
        name: att.fileName,
        type: "attachment",
        date: formatDate(att.createdAt),
        size: formatFileSize(att.fileSize),
        x: 0,
        y: 0,
        folderId: att.folderId,
        data: att,
      });
    });

    vaultData.conversations?.forEach((conv) => {
      vaultItems.push({
        id: conv._id,
        name: conv.title,
        type: "conversation",
        date: formatDate(conv.lastMessageAt),
        size: `${conv.messageCount} messages`,
        x: 0,
        y: 0,
        folderId: conv.folderId,
        data: conv,
      });
    });


    // Add trajectories
    vaultData.vaultTrajectories?.forEach((trajectory) => {
      vaultItems.push({
        id: trajectory._id,
        name: trajectory.name,
        type: "trajectory",
        date: formatDate(trajectory.updatedAt),
        size: "Trajectory",
        x: 0,
        y: 0,
        folderId: trajectory.folderId,
        data: trajectory,
      });
    });

    // Add reports
    vaultData.vaultReports?.forEach((report) => {
      vaultItems.push({
        id: report._id,
        name: report.name,
        type: "report",
        date: formatDate(report.updatedAt),
        size: report.format?.toUpperCase() + " Report" || "Report",
        x: 0,
        y: 0,
        folderId: report.folderId,
        data: report,
      });
    });

    // Add memories
    vaultData.vaultMemories?.forEach((memory) => {
      vaultItems.push({
        id: memory._id,
        name: memory.title,
        type: "memory",
        date: formatDate(memory.updatedAt),
        size: memory.tags?.length ? memory.tags.join(", ") : "Memory",
        x: 0,
        y: 0,
        folderId: memory.folderId,
        data: memory,
      });
    });

    return generateGraphPositions(vaultItems);
  }, [vaultData]);

  // Auto-open preview when opened in embed mode with an id param
  useEffect(() => {
    const embedParam = searchParams.get("embedPanel");
    const idParam = searchParams.get("id");
    
    if (embedParam === "1" && idParam && items.length > 0) {
      // Find the item and open preview
      const item = items.find((i) => i.id === idParam);
      if (item) {
        setPreviewItem(item);
      }
    }
  }, [searchParams, items]);

  // Get folders from vault data
  const folders = vaultData?.folders || [];

  // Filter items based on current view (for drive view only - not graph)
  const filteredItems = useMemo(() => {
    let result = items;

    // Apply folder/view filter
    if (currentView === "folder" && currentFolderId) {
      result = result.filter((item) => item.folderId === currentFolderId);
    } else if (currentView === "type" && filterType) {
      result = result.filter((item) => item.type === filterType);
    } else if (currentView === "uncategorized") {
      result = result.filter((item) => !item.folderId);
    } else if (currentView === "home" || currentView === "all") {
      // Home shows all, all shows all
    }

    return result;
  }, [items, currentView, currentFolderId, filterType]);

  // Search filter - only applied to drive view, not graph
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return filteredItems;

    const query = searchQuery.toLowerCase().trim();
    const queryParts = query.split(" ");

    return filteredItems.filter((item) => {
      // Check file name
      const nameMatch = queryParts.every((part) =>
        item.name.toLowerCase().includes(part),
      );

      // Check file type (e.g., "image", "pdf", "doc")
      const attachment = item.data as
        | { fileType?: string; fileName?: string }
        | undefined;
      const fileName = item.name.toLowerCase();
      const fileType = attachment?.fileType?.toLowerCase() || "";

      let typeMatch = false;
      for (const part of queryParts) {
        // Check explicit type keywords
        if (
          part === "image" ||
          part === "photo" ||
          fileName.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/) ||
          fileType.startsWith("image/")
        ) {
          typeMatch = true;
          break;
        }
        if (
          part === "video" ||
          fileName.match(/\.(mp4|mov|avi|mkv|webm)$/) ||
          fileType.startsWith("video/")
        ) {
          typeMatch = true;
          break;
        }
        if (
          part === "audio" ||
          fileName.match(/\.(mp3|wav|ogg|flac|aac|m4a)$/) ||
          fileType.startsWith("audio/")
        ) {
          typeMatch = true;
          break;
        }
        if (part === "pdf") {
          typeMatch = true;
          break;
        }
        if (
          part === "code" ||
          part === "script" ||
          fileName.match(
            /\.(js|ts|jsx|tsx|py|java|cpp|c|go|rs|rb|php|html|css|json|xml|yaml|yml|sql|sh|bash)$/,
          )
        ) {
          typeMatch = true;
          break;
        }
        if (
          part === "spreadsheet" ||
          part === "excel" ||
          part === "csv" ||
          fileName.match(/\.(xls|xlsx|csv|numbers)$/)
        ) {
          typeMatch = true;
          break;
        }
        if (
          part === "doc" ||
          part === "document" ||
          part === "text" ||
          fileName.match(/\.(doc|docx|txt|rtf|odt|pages)$/)
        ) {
          typeMatch = true;
          break;
        }
        if (part === "folder") {
          // Check if item is in a folder that matches
          const folder = folders.find((f) => f._id === item.folderId);
          if (folder && folder.name.toLowerCase().includes(part)) {
            typeMatch = true;
            break;
          }
        }
      }

      // Check folder name
      let folderMatch = false;
      if (item.folderId) {
        const folder = folders.find((f) => f._id === item.folderId);
        if (
          folder &&
          queryParts.every((part) => folder.name.toLowerCase().includes(part))
        ) {
          folderMatch = true;
        }
      }

      // Check type category
      let categoryMatch = false;
      const typeLabels: Record<string, string> = {
        attachment: "file",
        conversation: "chat",
        report: "report",
        trajectory: "trajectory",
        memory: "memory",
      };
      for (const part of queryParts) {
        if (typeLabels[item.type]?.includes(part)) {
          categoryMatch = true;
          break;
        }
      }

      return nameMatch || typeMatch || folderMatch || categoryMatch;
    });
  }, [filteredItems, searchQuery, folders]);

  // Get current folder name for breadcrumb
  const currentFolderName = useMemo(() => {
    if (!currentFolderId) return "Home";
    const folder = folders.find((f) => f._id === currentFolderId);
    return folder?.name || "Folder";
  }, [currentFolderId, folders]);

  // Handle view change
  const handleViewChange = useCallback(
    (view: SidebarView, folderId?: string, newFilterType?: VaultItemType) => {
      setCurrentView(view);
      setCurrentFolderId(folderId);
      setFilterType(newFilterType);

      // Update breadcrumb
      if (view === "home" || (view === "all" && !folderId)) {
        setBreadcrumbPath([]);
      } else if (view === "folder" && folderId) {
        const folder = folders.find((f) => f._id === folderId);
        if (folder) {
          setBreadcrumbPath([{ id: folderId, name: folder.name }]);
        }
      }
    },
    [folders],
  );

  // Handle breadcrumb navigation
  const handleBreadcrumbNavigate = useCallback(
    (index: number) => {
      if (index === -1) {
        // Go to home
        setCurrentView("home");
        setCurrentFolderId(undefined);
        setBreadcrumbPath([]);
        router.push("/vault");
      } else {
        const item = breadcrumbPath[index];
        if (item.id) {
          setCurrentView("folder");
          setCurrentFolderId(item.id);
          setBreadcrumbPath(breadcrumbPath.slice(0, index + 1));
          router.push(`/vault?folder=${item.id}`);
        }
      }
    },
    [breadcrumbPath, router],
  );

  // Handle open folder
  const handleOpenFolder = useCallback(
    (folderId: string) => {
      const folder = folders.find((f) => f._id === folderId);
      if (folder) {
        setCurrentView("folder");
        setCurrentFolderId(folderId);
        setBreadcrumbPath([
          ...breadcrumbPath,
          { id: folderId, name: folder.name },
        ]);
        // Update URL
        router.push(`/vault?folder=${folderId}`);
      }
    },
    [folders, breadcrumbPath, router],
  );

  // Handle item selection
  const handleItemSelect = useCallback((itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter" && selectedItems.size > 0) {
      // Enter opens the first selected item
      const firstSelectedId = Array.from(selectedItems)[0];
      const item = items.find((i) => i.id === firstSelectedId);
      if (item) setPreviewItem(item);
    }
  }, [selectedItems, items]);

  // Add keyboard listener
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Handle context menu
  const handleContextMenu = useCallback(
    (e: React.MouseEvent, item: VaultItem) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, item });
    },
    [],
  );

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, item: VaultItem) => {
    setDraggedItemId(item.id);
    e.dataTransfer.setData("text/plain", item.id);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, folderId?: string) => {
      e.preventDefault();
      if (folderId) {
        setDragOverFolderId(folderId);
      }
    },
    [],
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent, folderId: string) => {
      e.preventDefault();
      const itemId = e.dataTransfer.getData("text/plain");
      const item = items.find((i) => i.id === itemId);
      if (item && folderId !== item.folderId) {
        await handleMoveItem(itemId, item.type, folderId);
      }
      setDraggedItemId(null);
      setDragOverFolderId(null);
    },
    [items],
  );

  // Mutations
  const deleteAttachment = useMutation(api.vault.deleteVaultAttachment);
  const deleteReport = useMutation(api.vault.deleteReport);
  const deleteMemory = useMutation(api.vault.deleteMemory);
  const createFolder = useMutation(api.vault.createVaultFolder);
  const moveItemToFolder = useMutation(api.vault.moveItemToFolder);
  const trackFeatureVisit = useMutation(api.dashboard.trackFeatureVisit);

  // Track vault visit on mount (only once per session)
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('trajectory_visited_vault');
    if (!hasVisited) {
      sessionStorage.setItem('trajectory_visited_vault', 'true');
      void trackFeatureVisit({ feature: "vault" });
    }
  }, [trackFeatureVisit]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirmItem) return;

    try {
      if (deleteConfirmItem.type === "attachment") {
        await deleteAttachment({
          id: deleteConfirmItem.id as Id<"attachments">,
        });
      } else if (deleteConfirmItem.type === "report") {
        await deleteReport({ id: deleteConfirmItem.id as Id<"vaultReports"> });
      } else if (deleteConfirmItem.type === "memory") {
        await deleteMemory({ id: deleteConfirmItem.id as Id<"vaultMemories"> });
      }
      setSelected((prev) => (prev === deleteConfirmItem.id ? null : prev));
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(deleteConfirmItem.id);
        return newSet;
      });
    } catch (error) {
      console.error("Delete failed:", error);
    }

    setDeleteConfirmItem(null);
  }, [deleteConfirmItem, deleteAttachment, deleteReport, deleteMemory]);

  const handleCreateFolder = useCallback(
    async (name: string, colorIndex: number) => {
      try {
        await createFolder({ name, color: String(colorIndex) });
        setShowCreateFolder(false);
      } catch (error) {
        console.error("Create folder failed:", error);
      }
    },
    [createFolder],
  );

  const handleMoveItem = useCallback(
    async (itemId: string, itemType: string, folderId: string | null) => {
      try {
        await moveItemToFolder({
          itemType,
          itemId,
          folderId: folderId as Id<"vaultFolders"> | undefined,
        });
      } catch (error) {
        console.error("Move failed:", error);
      }
    },
    [moveItemToFolder],
  );

  const selectedItem = items.find((n) => n.id === selected) ?? null;

  // Loading state
  const isLoading = vaultData === undefined;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2Icon className="w-8 h-8 animate-spin text-gray-400" />
          <p className="font-manrope text-sm text-gray-500 dark:text-gray-500">
            Loading vault...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden relative">
      {/* Main Content */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-y-auto overflow-x-hidden"
      >
        {/* Graph */}
        <div className="sticky top-0 left-0 right-0 h-[450px] z-10 bg-neutral-100 dark:bg-[#1a1a1a]">
          <div className="h-full relative">
            {/* Graph shows all items (not filtered by search) */}
            <Graph
              items={items}
              selected={selected}
              onSelect={setSelected}
              theme={theme}
            />
            {selectedItem && (
              <DetailCard
                item={selectedItem}
                onClose={() => setSelected(null)}
                onDelete={() => setDeleteConfirmItem(selectedItem)}
                onView={() => setPreviewItem(selectedItem)}
                folders={folders}
                onMove={(folderId) =>
                  handleMoveItem(selectedItem.id, selectedItem.type, folderId)
                }
              />
            )}
          </div>
        </div>

        {/* Drive View - positioned much lower to barely peek */}
        <div className="relative z-20 bg-white dark:bg-[#0f0f0f] min-h-screen -mt-4 rounded-t-3xl">
          {/* Peeking indicator */}
          <div className="flex justify-center py-3">
            <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          </div>

          {/* Vault Title */}
          <div className="px-4 pt-4 pb-2">
            <h1 className="font-canela text-2xl font-bold text-gray-900 dark:text-white">
              Trajectory's vault. Your data.
            </h1>
          </div>

          {/* Header with Breadcrumb and Search - like suggested tasks pattern */}
          <div className="mx-4 mb-4 rounded-xl overflow-hidden bg-[#f0f0f0] dark:bg-[#1c1c1c]">
            {/* Outer rectangle - white/dark with label at top */}
            <div className="flex flex-col">
              {/* Path label at top of outer rectangle */}
              <div className="px-4 pt-3 pb-2">
                <div className="flex items-center justify-between">
                  <Breadcrumbs
                    path={breadcrumbPath}
                    onNavigate={handleBreadcrumbNavigate}
                  />
                  <span className="font-manrope text-xs text-gray-500 dark:text-gray-500">
                    {searchQuery.trim()
                      ? searchResults.length
                      : filteredItems.length}{" "}
                    {searchQuery.trim()
                      ? "results"
                      : filteredItems.length === 1
                        ? "item"
                        : "items"}
                    {(searchQuery.trim() ? searchResults.length : filteredItems.length) > 0 && (
                      <span className="ml-2 text-gray-400 dark:text-gray-600">
                        · Double-click or Enter to open
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Inner rectangle - white with search (no border) */}
              <div className="mx-1 mb-1 rounded-lg bg-white dark:bg-[#282828]">
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <input
                    type="text"
                    placeholder="Search your files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none font-manrope text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 min-w-0"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Selection bar at bottom of outer rectangle */}
              {selectedItems.size > 0 && (
                <div className="flex items-center gap-3 px-4 pb-2">
                  <span className="font-manrope text-xs text-gray-600 dark:text-gray-400">
                    {selectedItems.size} selected
                  </span>
                  <div className="flex-1" />
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-manrope text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-white/[0.1] transition-colors">
                    <DownloadIcon className="w-3.5 h-3.5" />
                    Download
                  </button>
                  <button
                    onClick={() => {
                      const first = filteredItems.find((i) =>
                        selectedItems.has(i.id),
                      );
                      if (first) setDeleteConfirmItem(first);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-manrope text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedItems(new Set())}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-manrope text-xs font-medium text-gray-500 dark:text-gray-500 hover:bg-neutral-200 dark:hover:bg-white/[0.1] transition-colors"
                  >
                    <XIcon className="w-3.5 h-3.5" />
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content - Dashboard or Files Grid */}
          {currentView === "home" ? (
            searchQuery.trim() ? (
              // Search mode - show search results in grid instead of dashboard
              <div className="px-4 pb-8">
                {searchResults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#f0f0f0] dark:bg-[#282828] flex items-center justify-center mb-4">
                      <HugeFolderIcon className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
                    </div>
                    <p className="font-manrope text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      No files found
                    </p>
                    <p className="font-manrope text-xs text-gray-400 dark:text-gray-600">
                      Try a different search term
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        className="relative"
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <FileCard
                          item={item}
                          selected={selectedItems.has(item.id)}
                          onSelect={() => handleItemSelect(item.id)}
                          onDoubleClick={() => setPreviewItem(item)}
                          onDelete={() => setDeleteConfirmItem(item)}
                          onContextMenu={(e) => handleContextMenu(e, item)}
                          onDragStart={(e) => handleDragStart(e, item)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            handleDragOver(e);
                          }}
                          onDrop={(e) => handleDrop(e, "")}
                          isDragOver={dragOverFolderId !== null}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <DashboardView
                items={items}
                folders={folders}
                onOpenFolder={handleOpenFolder}
                onSelectItem={handleItemSelect}
                selectedItems={selectedItems}
                onDeleteItem={setDeleteConfirmItem}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                draggedItemId={draggedItemId}
                onCreateFolder={() => setShowCreateFolder(true)}
                onPreviewItem={(item) => setPreviewItem(item)}
                onContextMenu={(e, item) => handleContextMenu(e, item)}
              />
            )
          ) : (
            <div className="px-4 pb-8">
              {(searchQuery.trim() ? searchResults : filteredItems).length ===
              0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#f0f0f0] dark:bg-[#282828] flex items-center justify-center mb-4">
                    <HugeFolderIcon className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
                  </div>
                  <p className="font-manrope text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    No files found
                  </p>
                  <p className="font-manrope text-xs text-gray-400 dark:text-gray-600">
                    {searchQuery
                      ? "Try a different search term"
                      : "Your vault is empty"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {(searchQuery.trim() ? searchResults : filteredItems).map(
                    (item) => (
                      <div
                        key={item.id}
                        className="relative"
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <FileCard
                          item={item}
                          selected={selectedItems.has(item.id)}
                          onSelect={() => handleItemSelect(item.id)}
                          onDoubleClick={() => setPreviewItem(item)}
                          onDelete={() => setDeleteConfirmItem(item)}
                          onContextMenu={(e) => handleContextMenu(e, item)}
                          onDragStart={(e) => handleDragStart(e, item)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            handleDragOver(e);
                          }}
                          onDrop={(e) => handleDrop(e, "")}
                          isDragOver={dragOverFolderId !== null}
                        />
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          item={contextMenu.item}
          onClose={() => setContextMenu(null)}
          onDelete={() => setDeleteConfirmItem(contextMenu.item)}
          onView={() => {
            setPreviewItem(contextMenu.item);
            setContextMenu(null);
          }}
          onMove={(folderId) =>
            handleMoveItem(contextMenu.item.id, contextMenu.item.type, folderId)
          }
          folders={folders}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        item={deleteConfirmItem}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmItem(null)}
      />

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <CreateFolderModal
          onConfirm={handleCreateFolder}
          onCancel={() => setShowCreateFolder(false)}
        />
      )}

      {/* Preview Modal */}
      <PreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function VaultPageShell() {
  const searchParams = useSearchParams();
  const embed = searchParams.get("embedPanel") === "1";
  if (embed) {
    return (
      <div className="h-[100dvh] min-h-0 w-full overflow-hidden bg-[#fafafa] dark:bg-[#050505]">
        <VaultContent />
      </div>
    );
  }
  return (
    <AppShell>
      <VaultContent />
    </AppShell>
  );
}

export default function VaultPage() {
  return (
    <AppGate>
      <Suspense fallback={null}>
        <VaultPageShell />
      </Suspense>
    </AppGate>
  );
}
