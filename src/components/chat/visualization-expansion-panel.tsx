"use client";

import { useEffect } from "react";
import { ChartCard } from "./chart-card";
import { TrajectoryMapCard } from "./trajectory-map-card";
import { RocketDiagramCard } from "./rocket-diagram-card";
import { WireframeCard } from "./wireframe-card";
import type { ChartCardData, TrajectoryMapCardData, RocketDiagramCardData, WireframeCardData } from "@/lib/chat-ui";
import { cn } from "@/lib/utils";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

interface VisualizationExpansionPanelProps {
  data: ChartCardData | TrajectoryMapCardData | RocketDiagramCardData | WireframeCardData;
  onClose: () => void;
  className?: string;
}

export function VisualizationExpansionPanel({
  data,
  onClose,
  className,
}: VisualizationExpansionPanelProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const getTitle = () => {
    switch (data.kind) {
      case "chart":
        return data.title;
      case "trajectory_map":
        return `${data.fromPlanet} → ${data.toPlanet} Trajectory`;
      case "rocket_diagram":
        return `${data.spacecraft} Diagram`;
      case "wireframe":
        return data.name;
    }
  };

  return (
    <aside
      className={cn(
        "flex min-h-0 w-[min(60vw,800px)] min-w-[400px] shrink-0 flex-col border-l border-black/[0.08] bg-[#f5f5f5] shadow-[-12px_0_40px_-12px_rgba(0,0,0,0.15)] dark:border-white/[0.08] dark:bg-[#0f0f0f]",
        "h-full rounded-l-2xl overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-black/[0.06] bg-white/90 px-4 py-3 dark:border-white/[0.07] dark:bg-[#141414]/95">
        <div className="min-w-0">
          <p className="truncate font-manrope text-[14px] font-semibold text-gray-900 dark:text-white">
            {getTitle()}
          </p>
          <p className="font-manrope text-[11px] text-gray-500 dark:text-gray-400">
            Full view
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-black/[0.05] hover:text-gray-800 dark:hover:bg-white/[0.08] dark:hover:text-gray-200"
          aria-label="Close panel"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-full">
          {data.kind === "chart" && <ChartCard data={data} expanded />}
          {data.kind === "trajectory_map" && <TrajectoryMapCard data={data} expanded />}
          {data.kind === "rocket_diagram" && <RocketDiagramCard data={data} expanded />}
          {data.kind === "wireframe" && <WireframeCard data={data} expanded />}
        </div>
      </div>
    </aside>
  );
}
