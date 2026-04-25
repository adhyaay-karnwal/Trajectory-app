"use client";

import { useEffect, useState } from "react";

// Entrance animation wrapper - fades in and scales down (placement effect)
function DemoWrapper({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`w-full h-full transition-all duration-700 ease-out ${
        visible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-[1.08]"
      }`}
    >
      {children}
    </div>
  );
}
import { PopButton } from "@/components/ui/pop-button";
import { HugeProformaIcon, HugeLocationIcon, HugeFlowsIcon, HugeLayersIcon, HugeFolderIcon } from "@/components/huge-icons";

// CSS for shimmer animation - needed for placeholder-shine-animation class
const shimmerStyles = `
  @keyframes textShine {
    0% { background-position: 100% center; }
    100% { background-position: -100% center; }
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
`;

// ------------------------------------------------------------------
// Demo 1: Real Pro Forma Spreadsheet (horizontal grid layout)
// ------------------------------------------------------------------

export function SpreadsheetDemo() {
  const [rows, setRows] = useState<{ label: string; values: string[] }[]>([]);

  return (
    <DemoWrapper>
      <SpreadsheetDemoInner />
    </DemoWrapper>
  );
}

function SpreadsheetDemoInner() {
  const [rows, setRows] = useState<{ label: string; values: string[] }[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRows([
        { label: "Fuel Cost", values: ["$2.4M", "$2.5M", "$2.6M", "$2.7M", "$2.8M"] },
        { label: "Crew Salary", values: ["$960K", "$988K", "$1.0M", "$1.0M", "$1.1M"] },
        { label: "Launch Cost", values: ["$1.4M", "$1.5M", "$1.6M", "$1.7M", "$1.7M"] },
        { label: "Life Support", values: ["$720K", "$720K", "$720K", "$720K", "$720K"] },
        { label: "Total Budget", values: ["$5.5M", "$5.7M", "$5.9M", "$6.1M", "$6.3M"] },
      ]);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full bg-white dark:bg-[#0d0d0d] rounded-lg overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="h-9 flex items-center justify-between px-3 border-b border-black/[0.07] dark:border-white/[0.06] bg-white dark:bg-[#0a0a0a]">
        <span className="font-canela text-[11px] text-gray-500 dark:text-gray-400">
          Mars Mission 2026
        </span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gray-100 dark:bg-white/[0.05]" />
          <div className="w-4 h-4 rounded bg-gray-100 dark:bg-white/[0.05]" />
        </div>
      </div>
      
      {/* Spreadsheet Grid */}
      <div className="flex-1 overflow-auto p-2 bg-[#f5f5f5] dark:bg-[#111014]">
        <div className="min-w-[200px]">
          {/* Header */}
          <div className="flex mb-1">
            <div className="w-24 shrink-0" />
            <div className="flex-1 flex">
              {["2025", "2026", "2027", "2028", "2029"].map((year) => (
                <div key={year} className="flex-1 text-[8px] font-manrope text-center text-gray-400 dark:text-gray-500">
                  {year}
                </div>
              ))}
            </div>
          </div>
          
          {/* Rows */}
          {rows.length === 0 ? (
            // Loading skeleton
            <div className="space-y-0.5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex">
                  <div className="w-24 h-5 bg-gray-100 dark:bg-white/[0.05] rounded animate-pulse" />
                  <div className="flex-1 flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="flex-1 h-5 bg-gray-100 dark:bg-white/[0.05] rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            rows.map((row, i) => (
              <div key={i} className="flex mb-0.5">
                <div className="w-24 shrink-0 text-[9px] font-manrope text-gray-600 dark:text-gray-400 px-1 truncate">
                  {row.label}
                </div>
                <div className="flex-1 flex gap-0.5">
                  {row.values.map((val, j) => (
                    <div 
                      key={j} 
                      className={`flex-1 text-[9px] font-manrope text-center px-1 rounded-sm ${
                        row.label === "Total Budget"
                  ? "text-green-600 dark:text-green-400 font-medium"
                  : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {val}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Demo 2: Petal Agent Chat Prompt Box (from /chat page)
// ------------------------------------------------------------------


export function AgentChatDemo() {
  return (
    <DemoWrapper>
      <AgentChatDemoInner />
    </DemoWrapper>
  );
}

function AgentChatDemoInner() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shimmerStyles }} />
      <div className="w-full h-full rounded-lg overflow-hidden flex flex-col bg-transparent">
      {/* Floating prompt box - normal size, centered */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full rounded-xl overflow-hidden bg-white dark:bg-[#1c1c1c] relative flex flex-col border-[3px] border-double border-neutral-300 dark:border-neutral-600">
          {/* Textarea row */}
          <div className="flex-1 m-1 bg-[#f0f0f0] dark:bg-[#282828] rounded-lg flex items-center px-3">
            <textarea
              rows={1}
              className="block w-full resize-none bg-transparent font-manrope text-sm text-gray-900 dark:text-white outline-none py-3 placeholder-shine-animation"
              placeholder="Ask Trajectory anything..."
              readOnly
            />
          </div>
          
          {/* Bottom toolbar */}
          <div className="h-10 flex items-center justify-between px-3 pb-1">
            <div className="flex items-center gap-2">
              {/* Add files button */}
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium font-manrope text-gray-500 dark:text-gray-400 transition-all hover:bg-gray-100 dark:hover:bg-white/[0.08]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 5V19M5 12H19" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Add files</span>
              </button>
              {/* Web toggle */}
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium font-manrope text-gray-500 dark:text-gray-400 transition-all hover:bg-gray-100 dark:hover:bg-white/[0.08]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2C9.5 2 8 6.5 8 12C8 17.5 9.5 22 12 22C14.5 22 16 17.5 16 12C16 6.5 14.5 2 12 2Z" />
                </svg>
              </button>
            </div>
            {/* Go button - PopButton with enter key */}
            <PopButton color="default" size="sm" keybind="enter">
              <span className="font-manrope text-[11px] font-medium">Go</span>
            </PopButton>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

// ------------------------------------------------------------------
// Demo 3: Vault Drive View (search, folders, files grid)
// ------------------------------------------------------------------

// File icon component using official HugeIcons
const FileIcon = ({ type }: { type: string }) => {
  const iconClass = "w-8 h-8 text-neutral-500 dark:text-neutral-400";
  
  switch (type) {
    case 'proforma':
      return <HugeProformaIcon className={iconClass} />;
    case 'site':
      return <HugeLocationIcon className={iconClass} />;
    case 'flow':
      return <HugeFlowsIcon className={iconClass} />;
    case 'report':
      return <HugeLayersIcon className={iconClass} />;
    default:
      return <HugeFolderIcon className={iconClass} />;
  }
};

export function VaultDemo() {
  return (
    <DemoWrapper>
      <VaultDemoInner />
    </DemoWrapper>
  );
}

function VaultDemoInner() {
  const folders = [
    { name: "Mars Missions", color: "#ef4444", count: 12 },
    { name: "Lunar Expeditions", color: "#3b82f6", count: 5 },
    { name: "Jupiter Probes", color: "#f97316", count: 8 },
  ];

  const files = [
    { name: "Mars Colony 2026.xlsx", type: "proforma", date: "Today", size: "2.4 MB" },
    { name: "Moon Base Alpha.pdf", type: "site", date: "Yesterday", size: "856 KB" },
    { name: "Trajectory Analysis.docx", type: "attachment", date: "2 days ago", size: "1.2 MB" },
    { name: "Launch Sequence", type: "flow", date: "3 days ago", size: "Flow" },
    { name: "Europa Mission Plan.pdf", type: "report", date: "1 week ago", size: "3.1 MB" },
    { name: "Crew Manifest.docx", type: "attachment", date: "1 week ago", size: "445 KB" },
  ];

  return (
    <div className="w-full h-full bg-white dark:bg-[#0f0f0f] rounded-lg overflow-hidden flex flex-col">
      {/* Search bar - matching vault drive view */}
      <div className="p-3 border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="rounded-lg bg-[#f0f0f0] dark:bg-[#282828] px-3 py-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search your missions..."
              className="flex-1 bg-transparent outline-none font-manrope text-xs text-gray-900 dark:text-white placeholder-gray-400"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3 space-y-4">
        {/* Folders */}
        <div>
          <h3 className="text-[9px] font-manrope text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Folders</h3>
          <div className="grid grid-cols-3 gap-2">
            {folders.map((folder, i) => (
              <div
                key={i}
                className="rounded-lg p-2.5 cursor-pointer hover:opacity-90 transition-opacity"
                style={{ backgroundColor: folder.color }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
                    <HugeFolderIcon className="w-3 h-3 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-manrope font-medium text-white truncate">{folder.name}</p>
                    <p className="text-[8px] font-manrope text-white/70">{folder.count} items</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Files - exact FileCard pattern from vault */}
        <div>
          <h3 className="text-[9px] font-manrope text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Recent Files</h3>
          <div className="grid grid-cols-2 gap-3">
            {files.map((file, i) => (
              <div
                key={i}
                className="group cursor-pointer rounded-xl overflow-hidden transition-all hover:bg-neutral-50 dark:hover:bg-white/[0.03]"
              >
                {/* Outer rectangle - m-1 rounded-2xl bg-[#f0f0f0] dark:bg-[#1c1c1c] */}
                <div className="m-1 rounded-2xl bg-[#f0f0f0] dark:bg-[#1c1c1c] flex flex-col">
                  {/* Inner rectangle - m-[2px] rounded-xl bg-white dark:bg-[#282828] */}
                  <div className="m-[2px] rounded-xl bg-white dark:bg-[#282828] overflow-hidden">
                    {/* Preview area - h-28 flex items-center justify-center */}
                    <div className="h-24 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                      <FileIcon type={file.type} />
                    </div>
                  </div>

                  {/* File info - px-3 pb-2 pt-1 */}
                  <div className="px-3 pb-2 pt-1">
                    <p className="font-manrope text-xs font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-manrope text-[10px] text-gray-400 dark:text-gray-600">
                        {file.date}
                      </span>
                      <span className="font-manrope text-[10px] text-gray-400 dark:text-gray-600">
                        {file.size}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Demo 4: Pro Forma - Centered prompt box with real animation
// ------------------------------------------------------------------

const PROFORMA_SECTIONS = [
  { key: "Destination", label: "Destination" },
  { key: "Spacecraft", label: "Spacecraft" },
  { key: "Crew", label: "Crew" },
  { key: "Budget", label: "Budget" },
  { key: "Timeline", label: "Timeline" },
  { key: "Launch", label: "Launch" },
] as const;

// Official TrajectoryPulse - spins the trajectory logo
function TrajectoryPulse({ className }: { className?: string }) {
  return (
    <img
      src="/trajectory-logo.svg"
      alt="Thinking…"
      className={className}
    />
  );
}

// Proforma peek preview (spreadsheet rows)
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

export function ProformaAIDemo() {
  return (
    <DemoWrapper>
      <ProformaAIDemoInner />
    </DemoWrapper>
  );
}

function ProformaAIDemoInner() {
  const [stage, setStage] = useState(0); // 0: typing, 1: processing, 2: done
  const [typedText, setTypedText] = useState("");
  const [generationSections, setGenerationSections] = useState<Set<string>>(new Set());

  const fullPrompt = "Plan a Mars colony mission for 2026";

  useEffect(() => {
    let i = 0;
    let sectionInterval: NodeJS.Timeout | null = null;
    
    const typeInterval = setInterval(() => {
      if (i <= fullPrompt.length) {
        setTypedText(fullPrompt.slice(0, i));
        i++;
      } else {
        clearInterval(typeInterval);
        const timeout1 = setTimeout(() => {
          setStage(1);
          // Simulate data engine progression
          const sections = ["Destination", "Spacecraft", "Crew", "Budget", "Timeline", "Launch"];
          let sectionIndex = 0;
          sectionInterval = setInterval(() => {
            if (sectionIndex < sections.length) {
              setGenerationSections(new Set([...sections.slice(0, sectionIndex + 1)]));
              sectionIndex++;
            } else {
              clearInterval(sectionInterval!);
              setTimeout(() => setStage(2), 500);
            }
          }, 500);
        }, 500);
        return () => {
          clearTimeout(timeout1);
          if (sectionInterval) clearInterval(sectionInterval);
        };
      }
    }, 50);
    return () => clearInterval(typeInterval);
  }, []);

  // Helper for conditional classes
  const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      {/* Stage 0: Typing the prompt */}
      {stage === 0 && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl overflow-hidden bg-white dark:bg-[#1c1c1c] relative flex flex-col border-[3px] border-double border-neutral-300 dark:border-neutral-600">
            <div className="m-1 flex flex-1 items-end rounded-lg bg-[#f0f0f0] dark:bg-[#282828] px-3">
              <textarea
                rows={1}
                value={typedText}
                className="flex-1 resize-none bg-transparent py-3 font-manrope text-sm text-gray-900 dark:text-white outline-none placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Describe a mission to generate a plan..."
                readOnly
              />
            </div>
            <div className="h-10 flex items-center justify-between px-3 pb-1">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium font-manrope text-gray-500 dark:text-gray-400 transition-all hover:bg-gray-100 dark:hover:bg-white/[0.08]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 5V19M5 12H19" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Add files</span>
              </button>
              <div className="min-w-[38px] h-7 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <span className="font-manrope text-[11px] font-medium text-gray-600 dark:text-gray-300">Go</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 1: Processing with real data engine animation */}
      {stage === 1 && (
        <div className="flex-1 flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-b from-white to-gray-50 dark:from-[#1a1a1e] dark:to-[#111014]">
          <div className="flex flex-col gap-2">
            {/* Petal pulse + text */}
            <div className="flex items-center gap-2">
              <TrajectoryPulse className="h-18 w-18 shrink-0" />
              <span className="font-manrope text-[11px] text-gray-400 dark:text-gray-500 italic">
                Planning mission…
              </span>
            </div>

            {/* Real data engine - 6 nodes on one line with connecting lines */}
            <div className="flex items-center pl-6 mt-2">
              {PROFORMA_SECTIONS.map((s, i) => {
                const done = generationSections.has(s.key);
                const allDone = generationSections.size >= PROFORMA_SECTIONS.length;
                const isNext = [...generationSections].pop() === s.key && !done;
                
                return (
                  <div key={s.key} className="flex items-center">
                    {/* Node pill */}
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 font-manrope text-[9.5px] font-medium whitespace-nowrap transition-all duration-300",
                        done
                          ? "bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-300/40 dark:border-sky-500/30"
                          : isNext
                            ? "bg-gray-100 dark:bg-white/[0.05] text-gray-400 dark:text-gray-600 border border-black/[0.06] dark:border-white/[0.06] animate-pulse"
                            : "bg-transparent text-gray-300 dark:text-gray-700 border border-black/[0.05] dark:border-white/[0.05]",
                      )}
                    >
                      {s.label}
                    </span>

                    {/* Connector line with arrow */}
                    {i < PROFORMA_SECTIONS.length - 1 && (
                      <div className="relative flex items-center w-4 shrink-0">
                        <div
                          className={cn(
                            "h-px w-full transition-all duration-500",
                            done && generationSections.has(PROFORMA_SECTIONS[i + 1].key)
                              ? "bg-sky-300 dark:bg-sky-600"
                              : done
                                ? "bg-sky-200 dark:bg-sky-800"
                                : "bg-gray-200 dark:bg-white/[0.06]",
                          )}
                        />
                        <svg
                          className={cn(
                            "absolute right-0 w-1.5 h-1.5 transition-all duration-300",
                            done
                              ? "text-sky-300 dark:text-sky-600"
                              : "text-gray-200 dark:text-white/[0.06]",
                          )}
                          viewBox="0 0 6 6"
                          fill="currentColor"
                        >
                          <path d="M0 0 L6 3 L0 6 Z" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Stage 2: Pro forma ready - Official ChatVaultFileEmbed card */}
      {stage === 2 && (
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden rounded-lg">
          <div className="flex-1 flex items-center justify-center">
            {/* Official ChatVaultFileEmbed pattern */}
            <div className="rounded-[13px] border border-black/[0.08] p-[2px] dark:border-white/[0.1]">
              <div className="rounded-[11px] border border-black/[0.06] bg-white dark:border-white/[0.08] dark:bg-[#1a1a1e]">
                <div className="m-1 flex min-h-[72px] items-stretch gap-3 rounded-lg bg-[#f0f0f0] px-3 py-2.5 dark:bg-[#282828]">
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                    <span className="font-manrope text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                      MISSION PLAN
                    </span>
                    <p className="truncate font-manrope text-sm font-semibold text-gray-900 dark:text-white">
                      Mars Colony 2026
                    </p>
                    <p className="line-clamp-2 font-manrope text-[11px] text-gray-500 dark:text-gray-400">
                      6 astronauts · 7 months · $12.5M budget
                    </p>
                  </div>
                  <ProformaPeek />
                </div>
                <div className="flex items-center justify-end px-2 pb-2 pt-1">
                  <div className="min-w-[38px] h-7 rounded-lg bg-gray-200 dark:bg-white/[0.06] flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-white/[0.1] transition-colors">
                    <span className="font-manrope text-[11px] font-medium text-gray-600 dark:text-gray-300">Open</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Demo 5: Sites - Custom floating card UI with map and zone overlay
// ------------------------------------------------------------------

export function SitesDemo() {
  return (
    <DemoWrapper>
      <SitesDemoInner />
    </DemoWrapper>
  );
}

function SitesDemoInner() {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      {/* Floating card - centered like the onboarding logo */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-xl overflow-hidden bg-white/90 dark:bg-[#1c1c1c]/90 backdrop-blur-md border-[3px] border-double border-neutral-300 dark:border-neutral-600 shadow-xl flex flex-col">
          {/* Mini map preview */}
          <div className="relative h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#1a1a2e] dark:to-[#0f0f1a]">
            {/* Grid on mini map */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
            {/* Streets */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/50" />
            <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-white/50" />
            
            {/* Zone overlay - sky transparent rectangle */}
            <div 
              className="absolute"
              style={{
                top: '20%',
                left: '15%',
                width: '55%',
                height: '45%',
              }}
            >
              <div className="w-full h-full bg-sky-500/40 border-2 border-sky-500/60 rounded-md">
            {/* Zone label */}
                <div className="absolute -top-6 left-0 px-2 py-0.5 bg-sky-500 rounded text-[9px] font-bold font-manrope text-white">
                  MARS ZONE
                </div>
              </div>
            </div>
            
            {/* Location pin */}
            <div className="absolute" style={{ top: '35%', left: '55%' }}>
              <div className="w-3 h-3 bg-indigo-500 rounded-full border-2 border-white dark:border-[#1c1c1c] shadow-lg" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-indigo-500" />
            </div>
          </div>

          {/* Address and info */}
          <div className="flex-1 p-3 flex flex-col">
            {/* Address */}
            <div className="mb-3">
              <span className="text-[10px] font-manrope text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Destination
              </span>
              <p className="text-sm font-semibold font-manrope text-gray-900 dark:text-white mt-0.5">
                Mars
              </p>
              <p className="text-[11px] font-manrope text-gray-500 dark:text-gray-400">
                225M km from Earth
              </p>
            </div>

            {/* Zone info */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 text-[10px] font-bold font-manrope rounded">
                  Habitable
                </span>
                <span className="text-[10px] font-manrope text-gray-500 dark:text-gray-400">
                  Potential Colony Site
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mt-auto">
              <div className="rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-gray-50/70 dark:bg-white/[0.03] px-2 py-2">
                <span className="text-[8px] font-manrope text-gray-400 dark:text-gray-600 uppercase tracking-wider block">
                  Gravity
                </span>
                <span className="text-[14px] font-bold font-manrope text-gray-800 dark:text-gray-200">
                  0.38g
                </span>
              </div>
              <div className="rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-gray-50/70 dark:bg-white/[0.03] px-2 py-2">
                <span className="text-[8px] font-manrope text-gray-400 dark:text-gray-600 uppercase tracking-wider block">
                  Day Length
                </span>
                <span className="text-[14px] font-bold font-manrope text-gray-800 dark:text-gray-200">
                  24.6h
                </span>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-3 flex justify-end">
              <div className="h-7 px-3 rounded-lg bg-gray-100 dark:bg-white/[0.06] flex items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-colors">
                <span className="text-[10px] font-manrope font-medium text-gray-600 dark:text-gray-400">
                  Plan Mission
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

// ------------------------------------------------------------------
// Demo 6: Workflows - Real flows UI pattern with ReactFlow canvas
// ------------------------------------------------------------------

type FlowNodeType = "trigger" | "action" | "condition" | "output";

const NODE_CONFIG: Record<FlowNodeType, {
  tag: string;
  border: string;
  label: string;
}> = {
  trigger:   { tag: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",  border: "border-sky-300/60 dark:border-sky-500/30",  label: "Trigger"   },
  action:    { tag: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",              border: "border-sky-300/60 dark:border-sky-500/30",          label: "Action"    },
  condition: { tag: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",      border: "border-amber-300/60 dark:border-amber-500/30",      label: "Condition" },
  output:    { tag: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400", border: "border-emerald-300/60 dark:border-emerald-500/30", label: "Output" },
};

// Simplified mini flow nodes - smaller and connected like a flow
const FlowNodeGraphic = ({ type, label, desc }: { type: FlowNodeType; label: string; desc?: string }) => {
  const cfg = NODE_CONFIG[type];
  
  return (
    <div className={`w-28 rounded-lg overflow-hidden border bg-white dark:bg-[#111] shadow-sm ${cfg.border}`}>
      <div className="px-2 py-1.5">
        <span className={`inline-block text-[7px] font-manrope font-semibold uppercase tracking-wider px-1 py-px rounded mb-1 ${cfg.tag}`}>
          {cfg.label}
        </span>
        <p className="font-manrope text-[10px] font-semibold text-gray-900 dark:text-white leading-snug truncate">
          {label}
        </p>
        {desc && (
          <p className="font-manrope text-[8px] text-gray-400 dark:text-gray-500 mt-0.5 leading-snug truncate">
            {desc}
          </p>
        )}
      </div>
    </div>
  );
};

// Mini node palette
const PALETTE_ITEMS: { section: string; items: { label: string; desc: string; nodeType: FlowNodeType }[] }[] = [
  {
    section: "Triggers",
    items: [
      { label: "Launch Window", desc: "Mars · 2026", nodeType: "trigger" },
    ]
  },
  {
    section: "Actions",
    items: [
      { label: "Select Spacecraft", desc: "Choose rocket type", nodeType: "action" },
      { label: "AI Analysis", desc: "Mission planning", nodeType: "action" },
    ]
  },
  {
    section: "Logic",
    items: [
      { label: "If / Else", desc: "Budget > $10M?", nodeType: "condition" },
    ]
  },
  {
    section: "Outputs",
    items: [
      { label: "Save to Vault", desc: "Tag & archive", nodeType: "output" },
    ]
  },
];

export function WorkflowsDemo() {
  return (
    <DemoWrapper>
      <WorkflowsDemoInner />
    </DemoWrapper>
  );
}

function WorkflowsDemoInner() {
  return (
    <div className="w-full h-full backdrop-blur-md bg-white/70 dark:bg-[#3a3a3a]/70 rounded-lg overflow-hidden flex">
      {/* Left sidebar - matching flows page palette */}
      <div className="w-36 shrink-0 border-r border-black/[0.06] dark:border-white/[0.06] bg-white/50 dark:bg-[#0a0a0a]/50 flex flex-col overflow-hidden">
        <div className="px-2 pt-3 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
          <span className="text-[10px] font-semibold font-manrope text-gray-500 dark:text-gray-500 uppercase tracking-widest">
            Nodes
          </span>
        </div>
        <div className="flex-1 overflow-auto p-2">
          {PALETTE_ITEMS.map((section) => (
            <div key={section.section} className="mb-3">
              <p className="text-[8px] uppercase tracking-widest text-gray-300 dark:text-gray-700 px-1 mb-1 font-manrope">
                {section.section}
              </p>
              {section.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
                >
                  <span className={`shrink-0 text-[7px] font-manrope font-semibold uppercase tracking-wider px-1 py-px rounded ${NODE_CONFIG[item.nodeType].tag}`}>
                    {NODE_CONFIG[item.nodeType].label[0]}
                  </span>
                  <span className="font-manrope text-[10px] font-medium text-gray-700 dark:text-gray-300 truncate">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main canvas area - matching ReactFlow pattern */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="h-8 flex items-center justify-between px-3 border-b border-black/[0.06] dark:border-white/[0.06] bg-white/30 dark:bg-[#0a0a0a]/30 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold font-manrope text-gray-800 dark:text-gray-200">Mission Planning</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium font-manrope bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300">
              Running
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-5 px-2 rounded bg-gray-100 dark:bg-white/[0.06] flex items-center">
              <span className="text-[9px] font-manrope text-gray-500 dark:text-gray-400">New</span>
            </div>
            <div className="h-5 px-2 rounded bg-gray-100 dark:bg-white/[0.06] flex items-center">
              <span className="text-[9px] font-manrope text-gray-500 dark:text-gray-400">Save</span>
            </div>
            <div className="h-5 px-2 rounded bg-sky-500 flex items-center">
              <span className="text-[9px] font-manrope text-white font-medium">Run</span>
            </div>
          </div>
        </div>

        {/* Canvas with flow visualization - horizontal connected nodes */}
        <div className="flex-1 relative overflow-hidden bg-gray-50/50 dark:bg-[#0d0d0d] flex items-center justify-center p-4">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.07) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />

          {/* Horizontal flow with connecting lines */}
          <div className="flex items-center gap-0">
            {/* Node 1: Trigger */}
            <div>
              <FlowNodeGraphic type="trigger" label="Launch Window" desc="Mars · 2026" />
            </div>
            
            {/* Connection line 1 */}
            <div className="relative h-0 w-8">
              <svg className="absolute top-1/2 left-0 w-full h-0.5">
                <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
              </svg>
              <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2" viewBox="0 0 6 6" fill="none">
                <path d="M0 0 L6 3 L0 6 Z" fill="rgba(0,0,0,0.15)" />
              </svg>
            </div>

            {/* Node 2: Action */}
            <div>
              <FlowNodeGraphic type="action" label="Select Spacecraft" desc="Choose rocket type" />
            </div>

            {/* Connection line 2 */}
            <div className="relative h-0 w-8">
              <svg className="absolute top-1/2 left-0 w-full h-0.5">
                <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
              </svg>
              <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2" viewBox="0 0 6 6" fill="none">
                <path d="M0 0 L6 3 L0 6 Z" fill="rgba(0,0,0,0.15)" />
              </svg>
            </div>

            {/* Node 3: Action */}
            <div>
              <FlowNodeGraphic type="action" label="AI Analysis" desc="Mission planning" />
            </div>

            {/* Connection line 3 */}
            <div className="relative h-0 w-8">
              <svg className="absolute top-1/2 left-0 w-full h-0.5">
                <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
              </svg>
              <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2" viewBox="0 0 6 6" fill="none">
                <path d="M0 0 L6 3 L0 6 Z" fill="rgba(0,0,0,0.15)" />
              </svg>
            </div>

            {/* Node 4: Condition */}
            <div>
              <FlowNodeGraphic type="condition" label="If Budget > $10M" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}