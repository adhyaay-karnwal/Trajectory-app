"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  data: {
    kind: "chart";
    chartType: "bar" | "line" | "pie" | "scatter" | "area";
    title: string;
    data: Record<string, unknown>;
    xAxis?: string;
    yAxis?: string;
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
  onOpenVisualization?: (data: { kind: "chart"; chartType: "bar" | "line" | "pie" | "scatter" | "area"; title: string; data: Record<string, unknown>; xAxis?: string; yAxis?: string; }) => void;
  onOpenWorkspace?: (workspace: { kind: string; resourceId: string; title: string; subtitle?: string; embedPath: string; peekLabel?: string; openMode?: "panel" | "tab" }) => void;
}

export function ChartCard({ data, expanded = false, onOpenVisualization, onOpenWorkspace }: ChartCardProps) {
  const { chartType, title, data: chartData, xAxis, yAxis } = data;

  // Simple SVG-based chart rendering
  const renderChart = () => {
    const labels = (chartData.labels as string[]) || [];
    const datasets = (chartData.datasets as Array<{ label: string; data: number[]; color?: string }>) || [];
    
    if (datasets.length === 0) {
      return <div className="text-gray-500">No data available</div>;
    }

    const maxValue = Math.max(...datasets.flatMap(d => d.data));
    const chartHeight = expanded ? 400 : 150;
    const chartWidth = expanded ? 800 : 600;
    const padding = expanded ? 60 : 40;

    if (chartType === "bar") {
      const barWidth = (chartWidth - padding * 2) / labels.length - 10;
      
      return (
        <svg width={chartWidth} height={chartHeight} className="w-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {datasets.map((dataset, datasetIndex) => (
            <g key={datasetIndex}>
              {dataset.data.map((value, index) => {
                const barHeight = (value / maxValue) * (chartHeight - padding * 2);
                const x = padding + index * (barWidth + 10);
                const y = chartHeight - padding - barHeight;
                const color = dataset.color || `hsl(${200 + datasetIndex * 20}, 80%, 60%)`;
                
                return (
                  <rect
                    key={index}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={color}
                    rx={4}
                  />
                );
              })}
            </g>
          ))}
          {/* X-axis labels */}
          {labels.map((label, index) => (
            <text
              key={index}
              x={padding + index * ((chartWidth - padding * 2) / labels.length) + ((chartWidth - padding * 2) / labels.length) / 2}
              y={chartHeight - 10}
              textAnchor="middle"
              className="text-[10px] fill-gray-600 dark:fill-gray-400"
            >
              {label}
            </text>
          ))}
        </svg>
      );
    }

    if (chartType === "line" || chartType === "area") {
      const points = datasets[0].data.map((value, index) => {
        const x = padding + (index / (labels.length - 1)) * (chartWidth - padding * 2);
        const y = chartHeight - padding - (value / maxValue) * (chartHeight - padding * 2);
        return `${x},${y}`;
      }).join(" ");

      return (
        <svg width={chartWidth} height={chartHeight} className="w-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {chartType === "area" && (
            <polygon
              points={`${padding},${chartHeight - padding} ${points} ${chartWidth - padding},${chartHeight - padding}`}
              fill="rgba(135, 206, 250, 0.3)"
            />
          )}
          <polyline
            points={points}
            fill="none"
            stroke="#87CEFA"
            strokeWidth={3}
          />
          {datasets[0].data.map((value, index) => {
            const x = padding + (index / (labels.length - 1)) * (chartWidth - padding * 2);
            const y = chartHeight - padding - (value / maxValue) * (chartHeight - padding * 2);
            return (
              <circle key={index} cx={x} cy={y} r={expanded ? 6 : 4} fill="#87CEFA" />
            );
          })}
          {labels.map((label, index) => (
            <text
              key={index}
              x={padding + (index / (labels.length - 1)) * (chartWidth - padding * 2)}
              y={chartHeight - 10}
              textAnchor="middle"
              className="text-[10px] fill-gray-600 dark:fill-gray-400"
            >
              {label}
            </text>
          ))}
        </svg>
      );
    }

    if (chartType === "pie") {
      const total = datasets[0].data.reduce((a, b) => a + b, 0);
      let currentAngle = 0;
      const centerX = chartWidth / 2;
      const centerY = chartHeight / 2;
      const radius = Math.min(chartWidth, chartHeight) / 2 - padding;

      return (
        <svg width={chartWidth} height={chartHeight} className="w-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {datasets[0].data.map((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            const x1 = centerX + radius * Math.cos(currentAngle);
            const y1 = centerY + radius * Math.sin(currentAngle);
            const x2 = centerX + radius * Math.cos(currentAngle + sliceAngle);
            const y2 = centerY + radius * Math.sin(currentAngle + sliceAngle);
            const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
            const color = `hsl(${200 + index * 30}, 80%, 60%)`;
            
            const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            
            currentAngle += sliceAngle;
            
            return <path key={index} d={path} fill={color} stroke="white" strokeWidth={2} />;
          })}
        </svg>
      );
    }

    return <div className="text-gray-500">Chart type not implemented</div>;
  };

  return (
    <div className={cn("rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1c1c1c] p-4 w-full", expanded && "p-8")}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-manrope text-sm font-semibold text-gray-900 dark:text-white">
          {title}
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
      {xAxis && yAxis && (
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>{yAxis}</span>
          <span>{xAxis}</span>
        </div>
      )}
      <div className={cn("flex items-center justify-center w-full overflow-hidden", expanded ? "min-h-[400px]" : "min-h-[150px]")}>
        {renderChart()}
      </div>
    </div>
  );
}
