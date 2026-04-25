"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TrajectoryMapCardProps {
  data: {
    kind: "trajectory_map";
    fromPlanet: string;
    toPlanet: string;
    transferType: "hohmann" | "gravity-assist" | "direct";
    waypoints: string[];
    showOrbits: boolean;
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
  onOpenVisualization?: (data: { kind: "trajectory_map"; fromPlanet: string; toPlanet: string; transferType: "hohmann" | "gravity-assist" | "direct"; waypoints: string[]; showOrbits: boolean; }) => void;
  onOpenWorkspace?: (workspace: { kind: string; resourceId: string; title: string; subtitle?: string; embedPath: string; peekLabel?: string; openMode?: "panel" | "tab" }) => void;
}

export function TrajectoryMapCard({ data, expanded = false, onOpenVisualization, onOpenWorkspace }: TrajectoryMapCardProps) {
  const { fromPlanet, toPlanet, transferType, waypoints, showOrbits } = data;

  // Planet positions (simplified 2D representation) - wider layout
  const planetPositions: Record<string, { x: number; y: number; color: string; radius: number }> = {
    mercury: { x: expanded ? 100 : 60, y: expanded ? 120 : 75, color: "#b5b5b5", radius: expanded ? 12 : 6 },
    venus: { x: expanded ? 180 : 100, y: expanded ? 100 : 60, color: "#e6c87a", radius: expanded ? 18 : 9 },
    earth: { x: expanded ? 280 : 150, y: expanded ? 85 : 50, color: "#6b93d6", radius: expanded ? 20 : 10 },
    mars: { x: expanded ? 400 : 220, y: expanded ? 70 : 40, color: "#c1440e", radius: expanded ? 16 : 8 },
    jupiter: { x: expanded ? 600 : 350, y: expanded ? 55 : 30, color: "#d8ca9d", radius: expanded ? 36 : 18 },
    saturn: { x: expanded ? 780 : 450, y: expanded ? 60 : 35, color: "#f4d59e", radius: expanded ? 32 : 16 },
    uranus: { x: expanded ? 920 : 530, y: expanded ? 80 : 45, color: "#d1e7e7", radius: expanded ? 24 : 12 },
    neptune: { x: expanded ? 1050 : 600, y: expanded ? 85 : 50, color: "#5b5ddf", radius: expanded ? 22 : 11 },
  };

  const from = planetPositions[fromPlanet.toLowerCase()] || planetPositions.earth;
  const to = planetPositions[toPlanet.toLowerCase()] || planetPositions.mars;

  // Calculate trajectory path
  const calculateTrajectory = () => {
    const points = [{ x: from.x, y: from.y }];
    
    if (transferType === "hohmann") {
      // Elliptical transfer orbit
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2 - 20; // Curve outward
      points.push({ x: midX, y: midY });
    } else if (transferType === "gravity-assist" && waypoints.length > 0) {
      // Add waypoint
      const waypoint = planetPositions[waypoints[0].toLowerCase()] || planetPositions.earth;
      points.push({ x: waypoint.x, y: waypoint.y });
    }
    
    points.push({ x: to.x, y: to.y });
    return points;
  };

  const trajectoryPoints = calculateTrajectory();

  // Generate SVG path
  const generatePath = () => {
    if (trajectoryPoints.length === 2) {
      return `M ${trajectoryPoints[0].x} ${trajectoryPoints[0].y} L ${trajectoryPoints[1].x} ${trajectoryPoints[1].y}`;
    }
    
    // Bezier curve for smooth trajectory
    const start = trajectoryPoints[0];
    const end = trajectoryPoints[trajectoryPoints.length - 1];
    const mid = trajectoryPoints[1];
    
    return `M ${start.x} ${start.y} Q ${mid.x} ${mid.y} ${end.x} ${end.y}`;
  };

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1c1c1c] p-4 w-full", expanded && "p-8")}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-manrope text-sm font-semibold text-gray-900 dark:text-white">
          {fromPlanet} → {toPlanet} Trajectory
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
        Transfer Type: <span className="font-medium text-blue-500">{transferType}</span>
        {waypoints.length > 0 && (
          <span className="ml-2">via {waypoints.join(", ")}</span>
        )}
      </div>
      <svg width={expanded ? 1200 : 700} height={expanded ? 200 : 100} className="w-full" viewBox={`0 0 ${expanded ? 1200 : 700} ${expanded ? 200 : 100}`}>
        {/* Background */}
        <rect width={expanded ? 1200 : 700} height={expanded ? 200 : 100} fill="#0a0a1a" rx={8} />
        
        {/* Stars */}
        {[...Array(expanded ? 60 : 30)].map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * (expanded ? 1200 : 700)}
            cy={Math.random() * (expanded ? 200 : 100)}
            r={Math.random() * (expanded ? 2 : 1.5)}
            fill="white"
            opacity={Math.random() * 0.5 + 0.3}
          />
        ))}
        
        {/* Orbits */}
        {showOrbits && Object.entries(planetPositions).map(([name, pos]) => (
          <circle
            key={name}
            cx={expanded ? 600 : 350}
            cy={expanded ? 100 : 50}
            r={Math.sqrt(Math.pow(pos.x - (expanded ? 600 : 350), 2) + Math.pow(pos.y - (expanded ? 100 : 50), 2))}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}
        
        {/* Trajectory path */}
        <path
          d={generatePath()}
          fill="none"
          stroke="#87CEFA"
          strokeWidth={expanded ? 4 : 2}
          strokeDasharray="6 4"
        />
        
        {/* Spacecraft */}
        <circle
          cx={trajectoryPoints[0].x}
          cy={trajectoryPoints[0].y}
          r={expanded ? 10 : 5}
          fill="#87CEFA"
        >
          <animate
            attributeName="cx"
            values={trajectoryPoints.map(p => p.x).join(";")}
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values={trajectoryPoints.map(p => p.y).join(";")}
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        
        {/* Planets */}
        {Object.entries(planetPositions).map(([name, pos]) => (
          <g key={name}>
            <circle cx={pos.x} cy={pos.y} r={pos.radius} fill={pos.color} />
            <text
              x={pos.x}
              y={pos.y + pos.radius + (expanded ? 20 : 12)}
              textAnchor="middle"
              className={cn("fill-white capitalize", expanded ? "text-[14px]" : "text-[9px]")}
            >
              {name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
