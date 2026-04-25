"use client";

import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { HugeLocationIcon } from "@/components/huge-icons";
import { MapboxMap } from "@/components/chat/mapbox-map";
import { useResolvedCoordinates } from "@/components/chat/use-resolved-coordinates";
import type { LocationMapCardData } from "@/lib/chat-ui";

interface LocationMapCardProps {
  data: LocationMapCardData;
}

function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M8 3H3V8M16 3H21V8M8 21H3V16M16 21H21V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LocationModal({ data, onClose }: { data: LocationMapCardData; onClose: () => void }) {
  const { latitude, longitude } = useResolvedCoordinates(data.address, data.latitude, data.longitude);
  const hasMap = latitude !== null && longitude !== null;
  const markers = hasMap
    ? [{ id: "location", longitude, latitude, title: data.address ?? data.title }]
    : [];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-[#f7f6f3] shadow-2xl dark:border-white/[0.08] dark:bg-[#111014]">
        <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-2.5 dark:border-white/[0.07]">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <HugeLocationIcon className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="font-manrope text-xs font-semibold text-gray-900 dark:text-white">Property Location</p>
              {data.address && <p className="font-manrope text-[10px] text-gray-500 dark:text-gray-400">{data.address}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-black/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.06]"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        {hasMap ? (
          <MapboxMap
            key="location-modal"
            center={[longitude, latitude]}
            zoom={16}
            markers={markers}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            className="h-[340px] w-full"
            showControls
            enable3D={false}
          />
        ) : (
          <div className="flex h-[340px] items-center justify-center bg-blue-50 text-xs text-gray-500 dark:bg-[#0f1722] dark:text-gray-400">
            Location preview unavailable
          </div>
        )}

        <div className="border-t border-black/[0.06] px-4 py-2 dark:border-white/[0.07]">
          <p className="font-manrope text-[10px] text-gray-400 dark:text-gray-500">
            {hasMap ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` : data.address ?? "Coordinates unavailable"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function LocationMapCard({ data }: LocationMapCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { latitude, longitude } = useResolvedCoordinates(data.address, data.latitude, data.longitude);
  const hasMap = latitude !== null && longitude !== null;
  const markers = hasMap
    ? [{ id: "location", longitude, latitude, title: data.address ?? data.title }]
    : [];

  const handleOpen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  }, []);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.stopPropagation();
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        className="group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-black/[0.06] bg-white/95 text-left shadow-[0_12px_48px_-18px_rgba(15,23,42,0.2)] backdrop-blur-sm transition-all duration-300 hover:border-sky-200/50 hover:shadow-[0_20px_56px_-18px_rgba(14,165,233,0.14)] dark:border-white/[0.08] dark:bg-white/[0.05] dark:hover:border-sky-500/30"
      >
        <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-[#0f1722] dark:via-[#111827] dark:to-[#172554]">
          {hasMap ? (
            <div className="pointer-events-none absolute inset-0">
              <MapboxMap
                key="location-preview"
                center={[longitude, latitude]}
                zoom={15}
                markers={markers}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                className="h-full w-full"
                showControls={false}
                interactive={false}
                enable3D={false}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <HugeLocationIcon className="h-6 w-6 text-blue-400/70" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent dark:from-[#111014]/75" />
          <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex size-7 items-center justify-center rounded-lg border border-slate-200 bg-white/90 shadow-sm dark:border-white/[0.08] dark:bg-[#111014]/90">
              <ExpandIcon className="h-3.5 w-3.5 text-slate-600 dark:text-gray-200" />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 px-3 py-2 dark:border-white/[0.07]">
          <div className="flex items-center gap-2">
            <HugeLocationIcon className="h-3.5 w-3.5 flex-shrink-0 text-blue-500" />
            <span className="truncate font-manrope text-xs font-medium text-slate-700 dark:text-gray-100">Location</span>
          </div>
          {data.address && <p className="mt-0.5 truncate font-manrope text-[10px] text-slate-500 dark:text-gray-400">{data.address}</p>}
        </div>
      </div>

      {isOpen && typeof document !== "undefined" &&
        createPortal(<LocationModal data={data} onClose={() => setIsOpen(false)} />, document.body)}
    </>
  );
}
