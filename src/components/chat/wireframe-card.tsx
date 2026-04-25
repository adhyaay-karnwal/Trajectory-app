"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface WireframeCardProps {
  data: {
    kind: "wireframe";
    type: "base" | "lander" | "rover" | "station" | "module";
    name: string;
    components: string[];
    dimensions?: Record<string, unknown>;
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
  onOpenVisualization?: (data: { kind: "wireframe"; type: "base" | "lander" | "rover" | "station" | "module"; name: string; components: string[]; dimensions?: Record<string, unknown>; annotations: string[]; }) => void;
  onOpenWorkspace?: (workspace: { kind: string; resourceId: string; title: string; subtitle?: string; embedPath: string; peekLabel?: string; openMode?: "panel" | "tab" }) => void;
}

export function WireframeCard({ data, expanded = false, onOpenVisualization, onOpenWorkspace }: WireframeCardProps) {
  const { type, name, components, dimensions, annotations } = data;

  const renderWireframe = () => {
    const width = expanded ? 1000 : 600;
    const height = expanded ? 240 : 120;

    if (type === "base") {
      return (
        <svg width={width} height={height} className="w-full" viewBox={`0 0 ${width} ${height}`}>
          {/* Base platform */}
          <rect x={expanded ? 200 : 100} y={expanded ? 140 : 70} width={expanded ? 800 : 400} height={expanded ? 80 : 40} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          {/* Habitat modules */}
          <rect x={expanded ? 300 : 150} y={expanded ? 80 : 40} width={expanded ? 120 : 60} height={expanded ? 60 : 30} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          <rect x={expanded ? 440 : 220} y={expanded ? 80 : 40} width={expanded ? 120 : 60} height={expanded ? 60 : 30} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          <rect x={expanded ? 580 : 290} y={expanded ? 80 : 40} width={expanded ? 120 : 60} height={expanded ? 60 : 30} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          <rect x={expanded ? 720 : 360} y={expanded ? 80 : 40} width={expanded ? 120 : 60} height={expanded ? 60 : 30} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          {/* Solar panels */}
          <line x1={expanded ? 200 : 100} y1={expanded ? 110 : 55} x2={expanded ? 120 : 60} y2={expanded ? 110 : 55} stroke="#fbbf24" strokeWidth={expanded ? 4 : 2} />
          <line x1={expanded ? 1000 : 500} y1={expanded ? 110 : 55} x2={expanded ? 1080 : 540} y2={expanded ? 110 : 55} stroke="#fbbf24" strokeWidth={expanded ? 4 : 2} />
          <rect x={expanded ? 80 : 40} y={expanded ? 90 : 45} width={expanded ? 60 : 30} height={expanded ? 40 : 20} fill="none" stroke="#fbbf24" strokeWidth={expanded ? 4 : 2} />
          <rect x={expanded ? 1060 : 530} y={expanded ? 90 : 45} width={expanded ? 60 : 30} height={expanded ? 40 : 20} fill="none" stroke="#fbbf24" strokeWidth={expanded ? 4 : 2} />
        </svg>
      );
    }

    if (type === "lander") {
      return (
        <svg width={width} height={height} className="w-full" viewBox={`0 0 ${width} ${height}`}>
          {/* Lander body */}
          <polygon points={expanded ? "500,40 440,180 560,180" : "300,20 270,90 330,90"} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          {/* Landing legs */}
          <line x1={expanded ? 440 : 270} y1={expanded ? 180 : 90} x2={expanded ? 400 : 250} y2={expanded ? 220 : 110} stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          <line x1={expanded ? 560 : 330} y1={expanded ? 180 : 90} x2={expanded ? 600 : 350} y2={expanded ? 220 : 110} stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          <line x1={expanded ? 500 : 300} y1={expanded ? 180 : 90} x2={expanded ? 500 : 300} y2={expanded ? 220 : 110} stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          {/* Footpads */}
          <ellipse cx={expanded ? 400 : 250} cy={expanded ? 220 : 110} rx={expanded ? 16 : 8} ry={expanded ? 8 : 4} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          <ellipse cx={expanded ? 600 : 350} cy={expanded ? 220 : 110} rx={expanded ? 16 : 8} ry={expanded ? 8 : 4} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          <ellipse cx={expanded ? 500 : 300} cy={expanded ? 220 : 110} rx={expanded ? 16 : 8} ry={expanded ? 8 : 4} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          {/* Thrusters */}
          <ellipse cx={expanded ? 500 : 300} cy={expanded ? 180 : 90} rx={expanded ? 24 : 12} ry={expanded ? 12 : 6} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
        </svg>
      );
    }

    if (type === "rover") {
      return (
        <svg width={width} height={height} className="w-full" viewBox={`0 0 ${width} ${height}`}>
          {/* Rover body */}
          <rect x={expanded ? 450 : 250} y={expanded ? 120 : 60} width={expanded ? 200 : 100} height={expanded ? 80 : 40} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} rx={expanded ? 10 : 5} />
          {/* Wheels */}
          <circle cx={expanded ? 490 : 270} cy={expanded ? 200 : 100} r={expanded ? 24 : 12} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          <circle cx={expanded ? 610 : 330} cy={expanded ? 200 : 100} r={expanded ? 24 : 12} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          {/* Mast/camera */}
          <rect x={expanded ? 545 : 295} y={expanded ? 70 : 35} width={expanded ? 20 : 10} height={expanded ? 50 : 25} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          <circle cx={expanded ? 555 : 300} cy={expanded ? 60 : 30} r={expanded ? 12 : 6} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          {/* Solar panel */}
          <rect x={expanded ? 470 : 260} y={expanded ? 90 : 45} width={expanded ? 160 : 80} height={expanded ? 16 : 8} fill="none" stroke="#fbbf24" strokeWidth={expanded ? 4 : 2} />
        </svg>
      );
    }

    if (type === "station") {
      return (
        <svg width={width} height={height} className="w-full" viewBox={`0 0 ${width} ${height}`}>
          {/* Core module */}
          <rect x={expanded ? 510 : 280} y={expanded ? 80 : 40} width={expanded ? 80 : 40} height={expanded ? 120 : 60} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          {/* Solar arrays */}
          <rect x={expanded ? 250 : 150} y={expanded ? 100 : 50} width={expanded ? 240 : 120} height={expanded ? 30 : 15} fill="none" stroke="#fbbf24" strokeWidth={expanded ? 4 : 2} />
          <rect x={expanded ? 510 : 330} y={expanded ? 100 : 50} width={expanded ? 240 : 120} height={expanded ? 30 : 15} fill="none" stroke="#fbbf24" strokeWidth={expanded ? 4 : 2} />
          {/* Connecting modules */}
          <rect x={expanded ? 330 : 200} y={expanded ? 110 : 55} width={expanded ? 140 : 70} height={expanded ? 60 : 30} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
          <rect x={expanded ? 510 : 330} y={expanded ? 110 : 55} width={expanded ? 140 : 70} height={expanded ? 60 : 30} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
        </svg>
      );
    }

    if (type === "module") {
      return (
        <svg width={width} height={height} className="w-full" viewBox={`0 0 ${width} ${height}`}>
          {/* Module body */}
          <rect x={expanded ? 350 : 200} y={expanded ? 60 : 30} width={expanded ? 400 : 200} height={expanded ? 140 : 70} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} rx={expanded ? 16 : 8} />
          {/* Internal compartments */}
          <line x1={expanded ? 350 : 200} y1={expanded ? 130 : 65} x2={expanded ? 750 : 400} y2={expanded ? 130 : 65} stroke="#87CEFA" strokeWidth={expanded ? 2 : 1} strokeDasharray="4 2" />
          <line x1={expanded ? 550 : 300} y1={expanded ? 60 : 30} x2={expanded ? 550 : 300} y2={expanded ? 200 : 100} stroke="#87CEFA" strokeWidth={expanded ? 2 : 1} strokeDasharray="4 2" />
          {/* Hatch */}
          <rect x={expanded ? 535 : 285} y={expanded ? 190 : 95} width={expanded ? 60 : 30} height={expanded ? 16 : 8} fill="none" stroke="#87CEFA" strokeWidth={expanded ? 4 : 2} />
        </svg>
      );
    }

    return <div className="text-gray-500">Wireframe type not implemented</div>;
  };

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1c1c1c] p-4 w-full", expanded && "p-8")}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-manrope text-sm font-semibold text-gray-900 dark:text-white">
          {name}
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
        Type: <span className="font-medium text-blue-500 capitalize">{type}</span>
      </div>
      <div className={cn("flex items-center justify-center w-full overflow-hidden", expanded ? "min-h-[240px]" : "min-h-[120px]")}>
        {renderWireframe()}
      </div>
      {components.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Components:</p>
          <div className="flex flex-wrap gap-1">
            {components.map((component, i) => (
              <span
                key={i}
                className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded"
              >
                {component}
              </span>
            ))}
          </div>
        </div>
      )}
      {annotations.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Notes:</p>
          {annotations.map((annotation, i) => (
            <p key={i} className="text-xs text-gray-500 dark:text-gray-400">
              • {annotation}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
