"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { HugeLayersIcon } from "@/components/huge-icons";
import type { ZoningBoundaryCardData } from "@/lib/chat-ui";
import { useResolvedCoordinates } from "@/components/chat/use-resolved-coordinates";
import { ZoningBoundaryMap } from "@/components/chat/zoning-boundary-map";

interface ZoningBoundaryCardProps {
  data: ZoningBoundaryCardData;
}

function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8 3H3V8M16 3H21V8M8 21H3V16M16 21H21V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-black/[0.06] bg-white/75 px-2 py-0.5 font-manrope text-[10px] text-gray-600 dark:border-white/[0.08] dark:bg-white/[0.06] dark:text-gray-300">
      {children}
    </span>
  );
}

export function ZoningBoundaryCard({ data }: ZoningBoundaryCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { latitude, longitude } = useResolvedCoordinates(data.address, data.latitude, data.longitude);
  const hasMap = latitude !== null && longitude !== null;

  const modal = isOpen ? (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/20 bg-[#f7f6f3] shadow-2xl dark:border-white/[0.08] dark:bg-[#111014]">
        <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4 dark:border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <HugeLayersIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-manrope text-sm font-semibold text-gray-900 dark:text-white">Zoning Boundary</p>
                {data.isApproximate && <MetaPill>Approx.</MetaPill>}
              </div>
              {data.address && <p className="font-manrope text-xs text-gray-500 dark:text-gray-400">{data.address}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-black/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.06]"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="bg-[#ece9f7] dark:bg-[#12111b]">
          {hasMap ? (
            <ZoningBoundaryMap
              latitude={latitude}
              longitude={longitude}
              polygon={data.polygon}
              zoneCode={data.zoneCode}
              maxHeightFt={data.maxHeightFt}
              className="h-[520px] w-full"
              interactive
            />
          ) : (
            <div className="flex h-[520px] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              Boundary preview unavailable
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 border-t border-black/[0.06] px-5 py-3 dark:border-white/[0.07]">
          {data.zoneCode && <MetaPill>{data.zoneCode}</MetaPill>}
          {data.maxHeightFt !== null && data.maxHeightFt !== undefined && <MetaPill>{data.maxHeightFt}&apos; max</MetaPill>}
          {data.far !== null && data.far !== undefined && <MetaPill>FAR {data.far}</MetaPill>}
          {data.zoneName && <MetaPill>{data.zoneName}</MetaPill>}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-white/95 text-left shadow-[0_12px_48px_-18px_rgba(15,23,42,0.2)] backdrop-blur-sm transition-all duration-300 hover:border-sky-200/50 hover:shadow-[0_20px_56px_-18px_rgba(14,165,233,0.12)] dark:border-white/[0.08] dark:bg-white/[0.05] dark:hover:border-sky-500/30"
      >
        <div className="relative h-36 overflow-hidden bg-[#f1effa] dark:bg-[#161422]">
          {hasMap ? (
            <ZoningBoundaryMap
              latitude={latitude}
              longitude={longitude}
              polygon={data.polygon}
              zoneCode={data.zoneCode}
              maxHeightFt={data.maxHeightFt}
              className="h-full w-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <HugeLayersIcon className="h-8 w-8 text-indigo-400/70" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent dark:from-[#111014]/80" />
          {data.zoneCode && (
            <div className="absolute left-3 top-3">
              <span className="rounded-full border border-white/60 bg-white/88 px-2 py-1 font-manrope text-[10px] font-semibold text-indigo-700 shadow-sm dark:border-white/[0.08] dark:bg-[#111014]/85 dark:text-indigo-300">
                {data.zoneCode}
              </span>
            </div>
          )}
          <div className="absolute right-3 top-3 rounded-xl border border-white/70 bg-white/85 p-2 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            <ExpandIcon className="h-3.5 w-3.5 text-gray-700" />
          </div>
        </div>
        <div className="border-t border-black/[0.06] px-3 py-2.5 dark:border-white/[0.07]">
          <div className="flex items-center gap-2">
            <HugeLayersIcon className="h-3.5 w-3.5 text-indigo-500" />
            <p className="truncate font-manrope text-xs font-semibold text-gray-800 dark:text-gray-100">{data.title}</p>
          </div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {data.maxHeightFt !== null && data.maxHeightFt !== undefined && <MetaPill>{data.maxHeightFt}&apos; max</MetaPill>}
            {data.far !== null && data.far !== undefined && <MetaPill>FAR {data.far}</MetaPill>}
          </div>
        </div>
      </button>

      {typeof document !== "undefined" && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
