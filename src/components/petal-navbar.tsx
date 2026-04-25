"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import {
  HugeChatIcon,
  HugeVaultIcon,
  HugeFlowsIcon,
  HugeProformaIcon,
  HugeSettingsIcon,
  HugeArrowLeftIcon,
  HugeSunIcon,
  HugeMoonIcon,
  HugeLocationIcon,
  HugeFolderIcon,
  HugeGridIcon,
} from "@/components/huge-icons";
import { cn } from "@/lib/utils";
import { PopupModal } from "@/components/ui/popup-modal";

function TrajectoryLogoIcon({ className }: { className?: string }) {
  return (
    <img
      src="/trajectory-logo.svg"
      alt="Trajectory"
      className={className}
    />
  );
}

const NAV_ITEMS = [
  { label: "Missions", href: "/chat", icon: HugeChatIcon },
  { label: "Vault", href: "/vault", icon: HugeVaultIcon },
] as const;

interface PetalNavbarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function PetalNavbar({
  collapsed,
  onCollapsedChange,
}: PetalNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const isOnChat = pathname === "/chat" || pathname.startsWith("/chat?");
  const isOnVault = pathname === "/vault" || pathname.startsWith("/vault?");
  // const isOnProforma = pathname === "/proforma" || pathname.startsWith("/proforma?");
  const conversations = useQuery(api.conversations.listRecent);
  const removeConversation = useMutation(api.conversations.remove);
  const vaultData = useQuery(api.vault.getVaultData);

  // Extract active conversation id from URL
  const activeConvoId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("id")
      : null;

  // Proforma dialog state - deprecated, transitioning to space missions
  // const [showProformaDialog, setShowProformaDialog] = useState(false);
  // const [proformaDialogMode, setProformaDialogMode] = useState<
  //   "create" | "rename"
  // >("create");
  // const [editingProformaId, setEditingProformaId] = useState<string | null>(
  //   null,
  // );
  // const [proformaNameInput, setProformaNameInput] = useState("");
  // const [proformaSearchQuery, setProformaSearchQuery] = useState("");
  // const deleteProforma = useMutation(api.vault.deleteVaultProforma);
  // const updateProforma = useMutation(api.vault.updateProforma);
  // const createProforma = useMutation(api.vault.createProforma);

  // const handleCreateProforma = () => {
  //   setProformaDialogMode("create");
  //   setEditingProformaId(null);
  //   setProformaNameInput("");
  //   setShowProformaDialog(true);
  // };

  // const handleRenameProforma = (id: string, currentName: string) => {
  //   setProformaDialogMode("rename");
  //   setEditingProformaId(id);
  //   setProformaNameInput(currentName);
  //   setShowProformaDialog(true);
  // };

  // const handleDeleteProforma = async (id: string) => {
  //   if (confirm("Delete this pro forma? This cannot be undone.")) {
  //     await deleteProforma({ id: id as Id<"vaultProformas"> });
  //     const currentId =
  //       typeof window !== "undefined"
  //         ? new URLSearchParams(window.location.search).get("id")
  //         : null;
  //     if (currentId === id) {
  //       router.push("/proforma");
  //     }
  //   }
  // };

  // const submitProformaDialog = async () => {
  //   if (!proformaNameInput.trim()) return;

  //   if (proformaDialogMode === "create") {
  //     // Create an empty pro forma in the vault
  //     const emptyProformaData = JSON.stringify({
  //       metadata: {
  //         projectName: proformaNameInput.trim(),
  //         address: "",
  //         assetType: "",
  //         units: 0,
  //         buildingSF: 0,
  //       },
  //       years: Array.from({ length: 5 }, (_, i) => `Year ${i + 1}`),
  //       rows: [],
  //     });
  //     const id = await createProforma({
  //       projectName: proformaNameInput.trim(),
  //       proformaData: emptyProformaData,
  //     });
  //     setShowProformaDialog(false);
  //     router.push(`/proforma?id=${id}`);
  //   } else if (proformaDialogMode === "rename" && editingProformaId) {
  //     await updateProforma({
  //       id: editingProformaId as Id<"vaultProformas">,
  //       projectName: proformaNameInput.trim(),
  //     });
  //     setShowProformaDialog(false);
  //   }
  // };

  const navItemClass = (href: string) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    return cn(
      "flex items-center gap-3 rounded-xl transition-all duration-150 font-manrope text-sm font-medium",
      collapsed ? "justify-center h-10 w-10" : "px-3 py-2 w-full",
      isActive
        ? "bg-black/[0.06] dark:bg-white/[0.07] text-gray-900 dark:text-white border border-black/[0.1] dark:border-white/[0.12] ring-1 ring-inset ring-black/[0.03] dark:ring-white/[0.04]"
        : "text-gray-500 dark:text-gray-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-white",
    );
  };

  const iconBtnClass = cn(
    "flex items-center gap-3 rounded-xl transition-all duration-150 font-manrope text-sm font-medium",
    "text-gray-500 dark:text-gray-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-white",
    collapsed ? "justify-center h-10 w-10" : "px-3 py-2 w-full",
  );

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-200",
        "bg-white dark:bg-[#0f0f0f] border-r border-black/[0.08] dark:border-white/[0.1] ring-1 ring-inset ring-black/[0.03] dark:ring-white/[0.04]",
        collapsed ? "w-16" : "w-56",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center h-14 border-b border-black/[0.06] dark:border-white/[0.07] shrink-0",
          collapsed ? "justify-center" : "justify-between px-4",
        )}
      >
        {collapsed ? (
          <button
            onClick={() => onCollapsedChange(false)}
            title="Expand sidebar"
            className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-700 dark:text-white/70 hover:bg-black/[0.05] dark:hover:bg-white/[0.06] hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <TrajectoryLogoIcon className="w-8 h-8" />
          </button>
        ) : (
          <>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-900 dark:text-white"
            >
              <TrajectoryLogoIcon className="w-8 h-8" />
              <span className="font-canela font-bold text-lg">Trajectory</span>
            </Link>
            <button
              onClick={() => onCollapsedChange(true)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-colors"
            >
              <HugeArrowLeftIcon className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Nav items */}
      <nav
        className={cn(
          "flex flex-col p-2",
          collapsed ? "items-center gap-0.5" : "gap-0.5",
        )}
      >
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} className={navItemClass(href)}>
            <Icon className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Chat history — only when expanded and on chat page */}
      {!collapsed && isOnChat && (
        <div className="flex flex-1 flex-col overflow-hidden border-t border-black/[0.05] dark:border-white/[0.06]">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="font-manrope text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
              History
            </span>
            <button
              onClick={() => router.push("/chat")}
              title="New chat"
              className="flex h-5 w-5 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-black/[0.05] dark:hover:bg-white/[0.07] hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="h-3.5 w-3.5"
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {conversations === undefined ? (
              <div className="space-y-1.5 px-1 pt-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-7 animate-pulse rounded-lg bg-black/[0.04] dark:bg-white/[0.04]"
                    style={{ opacity: 1 - i * 0.18 }}
                  />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <p className="px-2 py-2 font-manrope text-[11px] text-gray-400 dark:text-gray-600">
                No chats yet
              </p>
            ) : (
              <div className="space-y-0.5">
                {conversations.map((convo) => {
                  const isActive = activeConvoId === convo._id;
                  return (
                    <div
                      key={convo._id}
                      className="group relative flex items-center"
                    >
                      <Link
                        href={`/chat?id=${convo._id}`}
                        className={cn(
                          "flex min-w-0 flex-1 items-center rounded-lg px-2 py-1.5 transition-colors",
                          isActive
                            ? "bg-black/[0.06] dark:bg-white/[0.07] text-gray-900 dark:text-white"
                            : "text-gray-500 dark:text-gray-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-gray-800 dark:hover:text-gray-200",
                        )}
                      >
                        <span className="truncate font-manrope text-[12px]">
                          {convo.title}
                        </span>
                        <div className="ml-auto flex items-center gap-2">
                          {convo.status === "generating" && (
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                              <span className="font-manrope text-[10px] text-sky-400">Generating</span>
                            </div>
                          )}
                          <span className="shrink-0 font-manrope text-[10px] text-gray-400 dark:text-gray-600">
                            {convo.messageCount}
                          </span>
                        </div>
                      </Link>
                      {/* Delete button — appears on hover with solid background */}
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (
                            confirm("Delete this chat? This cannot be undone.")
                          ) {
                            await removeConversation({
                              conversationId: convo._id as Id<"conversations">,
                            });
                            if (isActive) router.push("/chat");
                          }
                        }}
                        className="absolute right-1 hidden h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white dark:bg-[#1c1c1c] text-gray-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 group-hover:flex shadow-sm border border-black/[0.06] dark:border-white/[0.08]"
                        title="Delete conversation"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-3.5 w-3.5"
                        >
                          <path
                            d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Proforma sidebar — deprecated, removed for Trajectory */}

      {/* Vault sidebar — only when expanded and on vault page */}
      {!collapsed && isOnVault && vaultData && (
        <div className="flex flex-1 flex-col overflow-hidden border-t border-black/[0.05] dark:border-white/[0.06]">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="font-manrope text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
              Vault
            </span>
            {/* No arrow button - removed as requested */}
          </div>

          {/* Quick Access Section */}
          <div className="px-2">
            <Link
              href="/vault"
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors mb-1",
                "text-gray-500 dark:text-gray-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-gray-800 dark:hover:text-gray-200",
              )}
            >
              <HugeGridIcon className="w-4 h-4" />
              <span className="font-manrope text-[12px]">All Files</span>
            </Link>
            <Link
              href="/vault?view=recent"
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors",
                "text-gray-500 dark:text-gray-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-gray-800 dark:hover:text-gray-200",
              )}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-manrope text-[12px]">Recent</span>
            </Link>
          </div>

          {/* Folders Section */}
          <>
            <div className="px-3 pt-3 pb-1 flex items-center justify-between">
              <span className="font-manrope text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
                Folders
              </span>
              <button
                onClick={() => router.push("/vault?createFolder=true")}
                title="Create folder"
                className="flex h-5 w-5 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-black/[0.05] dark:hover:bg-white/[0.07] hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-3.5 w-3.5"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-2">
              {vaultData.folders && vaultData.folders.length > 0 ? (
                <div className="space-y-0.5">
                  {vaultData.folders.map((folder) => (
                    <Link
                      key={folder._id}
                      href={`/vault?folder=${folder._id}`}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors text-gray-500 dark:text-gray-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: folder.color || "#6366f1" }}
                      />
                      <span className="truncate font-manrope text-[12px]">
                        {folder.name}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-2 py-2 font-manrope text-[11px] text-gray-400 dark:text-gray-600">
                  No folders yet
                </p>
              )}
            </div>
          </>

          {/* Types Section */}
          <div className="px-3 pt-3 pb-1">
            <span className="font-manrope text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
              Types
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            <div className="space-y-0.5">
              {/* Pro Formas link - deprecated for Trajectory */}
              {/* <Link
                href="/vault?type=proforma"
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors text-gray-500 dark:text-gray-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-gray-800 dark:hover:text-gray-200"
              >
                <HugeProformaIcon className="w-4 h-4" />
                <span className="font-manrope text-[12px]">Pro Formas</span>
                <span className="ml-auto font-manrope text-[10px] text-gray-400 dark:text-gray-600">
                  {vaultData.vaultProformas?.length || 0}
                </span>
              </Link> */}
              <Link
                href="/vault?type=attachment"
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors text-gray-500 dark:text-gray-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-gray-800 dark:hover:text-gray-200"
              >
                <HugeFolderIcon className="w-4 h-4" />
                <span className="font-manrope text-[12px]">Files</span>
                <span className="ml-auto font-manrope text-[10px] text-gray-400 dark:text-gray-600">
                  {vaultData.attachments?.length || 0}
                </span>
              </Link>
              <Link
                href="/vault?type=conversation"
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors text-gray-500 dark:text-gray-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-gray-800 dark:hover:text-gray-200"
              >
                <HugeChatIcon className="w-4 h-4" />
                <span className="font-manrope text-[12px]">Chats</span>
                <span className="ml-auto font-manrope text-[10px] text-gray-400 dark:text-gray-600">
                  {vaultData.conversations?.length || 0}
                </span>
              </Link>
              {/* Sites link - deprecated for Trajectory */}
              {/* <Link
                href="/vault?type=site"
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors text-gray-500 dark:text-gray-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-gray-800 dark:hover:text-gray-200"
              >
                <HugeLocationIcon className="w-4 h-4" />
                <span className="font-manrope text-[12px]">Sites</span>
                <span className="ml-auto font-manrope text-[10px] text-gray-400 dark:text-gray-600">
                  {vaultData.vaultSites?.length || 0}
                </span>
              </Link> */}
            </div>
          </div>
        </div>
      )}

      {/* Proforma Dialog - deprecated, removed for Trajectory */}
      {/* {showProformaDialog && (
        <PopupModal
          title={
            proformaDialogMode === "create"
              ? "New Pro Forma"
              : "Rename Pro Forma"
          }
          onClose={() => setShowProformaDialog(false)}
          actions={[
            {
              label: "Cancel",
              onClick: () => setShowProformaDialog(false),
              color: "default",
              variant: "ghost",
            },
            {
              label: proformaDialogMode === "create" ? "Create" : "Save",
              onClick: submitProformaDialog,
              color: "sky",
              disabled: !proformaNameInput.trim(),
            },
          ]}
        >
          <input
            type="text"
            value={proformaNameInput}
            onChange={(e) => setProformaNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitProformaDialog()}
            placeholder={
              proformaDialogMode === "create"
                ? "Project name..."
                : "New name..."
            }
            autoFocus
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-[#1c1c1c] font-manrope text-sm text-gray-900 dark:text-white mb-4 outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
          />
        </PopupModal>
      )} */}

      {/* Spacer when not showing history, vault, or proforma */}
      {(collapsed || (!isOnChat && !isOnVault)) && (
        <div className="flex-1" />
      )}

      {/* Footer */}
      <div
        className={cn(
          "shrink-0 border-t border-black/[0.06] dark:border-white/[0.07] p-2 space-y-0.5",
          collapsed && "flex flex-col items-center",
        )}
      >
        {/* Theme slider toggle */}
        <button
          onClick={toggleTheme}
          title={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          className={cn(
            "flex items-center rounded-xl transition-all duration-150",
            collapsed ? "justify-center h-10 w-10" : "px-3 py-2 w-full gap-3",
          )}
        >
          {/* Pill slider */}
          <div
            className={cn(
              "relative flex items-center rounded-full shrink-0 transition-colors duration-300",
              "w-11 h-6",
              theme === "dark"
                ? "bg-white/[0.08] border border-white/[0.12]"
                : "bg-black/[0.07] border border-black/[0.1]",
            )}
          >
            <HugeSunIcon className="absolute left-[4px]  w-3 h-3 text-amber-400 z-10 pointer-events-none" />
            <HugeMoonIcon className="absolute right-[4px] w-3 h-3 text-gray-500 dark:text-gray-400 z-10 pointer-events-none" />
            <div
              className={cn(
                "absolute w-4 h-4 rounded-full shadow transition-all duration-300 z-20",
                theme === "dark"
                  ? "right-[3px] bg-white"
                  : "left-[3px] bg-gray-800",
              )}
            />
          </div>
          {!collapsed && (
            <span className="font-manrope text-sm font-medium text-gray-500 dark:text-gray-400">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          )}
        </button>

        <Link href="/settings" className={navItemClass("/settings")}>
          <HugeSettingsIcon className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
