"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface RocketDiagramCardProps {
  data: {
    kind: "rocket_diagram";
    spacecraft: string;
    showStages: boolean;
    showPayload: boolean;
    annotations: string[];
    workspace?: {
      kind: string;
      resourceId: string;
      title: string;
      subtitle?: string;
      embedPath: string;
      peekLabel?: string;
      openMode?: "panel" | "tab";
    };
  };
  expanded?: boolean;
  onOpenVisualization?: (data: { kind: "rocket_diagram"; spacecraft: string; showStages: boolean; showPayload: boolean; annotations: string[]; }) => void;
  onOpenWorkspace?: (workspace: { kind: string; resourceId: string; title: string; subtitle?: string; embedPath: string; peekLabel?: string; openMode?: "panel" | "tab" }) => void;
}

export function RocketDiagramCard({ data, expanded = false, onOpenVisualization, onOpenWorkspace }: RocketDiagramCardProps) {
  const { spacecraft, showStages, showPayload, annotations } = data;

  // Spacecraft specifications
  const spacecraftSpecs: Record<string, { height: number; stages: number; color: string }> = {
    "starship": { height: expanded ? 160 : 80, stages: 2, color: "#c0c0c0" },
    "falcon-heavy": { height: expanded ? 100 : 50, stages: 3, color: "#ffffff" },
    "sls": { height: expanded ? 130 : 65, stages: 2, color: "#ff6b35" },
    "new-glenn": { height: expanded ? 130 : 65, stages: 2, color: "#0052cc" },
  };

  const spec = spacecraftSpecs[spacecraft.toLowerCase()] || spacecraftSpecs.starship;
  const stageHeight = spec.height / spec.stages;

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1c1c1c] p-4 w-full", expanded && "p-8")}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-manrope text-sm font-semibold text-gray-900 dark:text-white">
          {spacecraft} Diagram
        </h3>
        <div className="flex gap-2">
          {onOpenVisualization && (
            <button
              onClick={() => onOpenVisualization(data)}
              className="text-xs text-blue-500 hover:text-blue-600 font-medium"
            >
              Expand →
            </button>
          )}
          {data.workspace && onOpenWorkspace && (
            <button
              onClick={() => onOpenWorkspace(data.workspace!)}
              className="text-xs text-blue-500 hover:text-blue-600 font-medium"
            >
              Open in panel →
            </button>
          )}
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        {spec.stages} stages • {spec.height}m height
      </div>
      <svg width={expanded ? 1000 : 600} height={spec.height + 40} className="w-full" viewBox={`0 0 ${expanded ? 1000 : 600} ${spec.height + 40}`}>
        {/* Rocket body - centered horizontally */}
        <g transform={cn("translate(250, 0)", expanded && "translate(400, 0)")}>
          {showStages && [...Array(spec.stages)].map((_, i) => (
            <g key={i}>
              <rect
                x={0}
                y={20 + i * stageHeight}
                width={expanded ? 100 : 50}
                height={stageHeight - 5}
                fill={spec.color}
                stroke="#333"
                strokeWidth={2}
                rx={4}
              />
              {/* Stage separator */}
              {i < spec.stages - 1 && (
                <line
                  x1={0}
                  y1={20 + (i + 1) * stageHeight - 5}
                  x2={50}
                  y2={20 + (i + 1) * stageHeight - 5}
                  stroke="#333"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                />
              )}
              {/* Engines */}
              <ellipse
                cx={expanded ? 50 : 25}
                cy={20 + (i + 1) * stageHeight - 5}
                rx={expanded ? 30 : 15}
                ry={expanded ? 12 : 6}
                fill="#87CEFA"
              />
            </g>
          ))}
          
          {/* Payload fairing */}
          {showPayload && (
            <g>
              <path
                d={cn("M 0 20 L 25 5 L 50 20", expanded && "M 0 20 L 50 5 L 100 20")}
                fill={spec.color}
                stroke="#333"
                strokeWidth={2}
              />
              <rect
                x={0}
                y={20}
                width={expanded ? 100 : 50}
                height={expanded ? 40 : 20}
                fill={spec.color}
                stroke="#333"
                strokeWidth={2}
              />
            </g>
          )}
        </g>
        
        {/* Annotations */}
        {annotations.map((annotation, i) => (
          <g key={i}>
            <line
              x1={expanded ? 510 : 310}
              y1={30 + i * (expanded ? 30 : 20)}
              x2={expanded ? 560 : 350}
              y2={30 + i * (expanded ? 30 : 20)}
              stroke="#87CEFA"
              strokeWidth={1}
            />
            <text
              x={expanded ? 565 : 355}
              y={34 + i * (expanded ? 30 : 20)}
              className={cn("fill-gray-700 dark:fill-gray-300", expanded ? "text-[14px]" : "text-[10px]")}
            >
              {annotation}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
