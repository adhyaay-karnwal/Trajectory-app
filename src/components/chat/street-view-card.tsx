"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { HugeCameraIcon } from "@/components/huge-icons";
import type { StreetViewCardData } from "@/lib/chat-ui";
import { useResolvedCoordinates } from "@/components/chat/use-resolved-coordinates";

interface StreetViewCardProps {
  data: StreetViewCardData;
}

function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8 3H3V8M16 3H21V8M8 21H3V16M16 21H21V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ImageOffIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 6.5C4 5.67157 4.67157 5 5.5 5H18.5C19.3284 5 20 5.67157 20 6.5V17.5C20 18.3284 19.3284 19 18.5 19H5.5C4.67157 19 4 18.3284 4 17.5V6.5Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 16L9 11L12.5 14.5L15 12L20 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 4L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

function buildStreetViewUrl(data: StreetViewCardData, width: number, height: number) {
  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    heading: "0",
    pitch: "0",
    fov: "90",
    source: "outdoor",
  });

  if (typeof data.latitude === "number" && typeof data.longitude === "number") {
    params.set("lat", String(data.latitude));
    params.set("lng", String(data.longitude));
  } else if (data.address) {
    params.set("address", data.address);
  } else {
    return null;
  }

  return `/api/google/street-view?${params.toString()}`;
}

export function StreetViewCard({ data }: StreetViewCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { latitude, longitude } = useResolvedCoordinates(data.address, data.latitude, data.longitude);
  const previewSrc = useMemo(
    () => buildStreetViewUrl({ ...data, latitude, longitude }, 640, 260),
    [data, latitude, longitude]
  );
  const modalSrc = useMemo(
    () => buildStreetViewUrl({ ...data, latitude, longitude }, 1400, 900),
    [data, latitude, longitude]
  );

  const emptyState = (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-amber-50 to-orange-50 text-center dark:from-[#201910] dark:to-[#1b1410]">
      <ImageOffIcon className="h-8 w-8 text-amber-500/70" />
      <p className="font-manrope text-xs font-medium text-amber-700 dark:text-amber-300">Street view unavailable</p>
    </div>
  );

  const modal = isOpen ? (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/20 bg-[#f7f6f3] shadow-2xl dark:border-white/[0.08] dark:bg-[#111014]">
        <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4 dark:border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <HugeCameraIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-manrope text-sm font-semibold text-gray-900 dark:text-white">Street View</p>
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
        <div className="h-[min(70vh,720px)] overflow-hidden bg-[#f1ece3] dark:bg-[#16110d]">
          {modalSrc && !imageError ? (
            <img
              src={modalSrc}
              alt={data.address ?? data.title}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            emptyState
          )}
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
        <div className="relative h-36 overflow-hidden bg-amber-50 dark:bg-[#1b1410]">
          {previewSrc && !imageError ? (
            <img
              src={previewSrc}
              alt={data.address ?? data.title}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            emptyState
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-transparent to-transparent dark:from-[#111014]/80" />
          <div className="absolute right-3 top-3 rounded-xl border border-white/70 bg-white/85 p-2 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            <ExpandIcon className="h-3.5 w-3.5 text-gray-700" />
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-black/[0.06] px-3 py-2.5 dark:border-white/[0.07]">
          <HugeCameraIcon className="h-3.5 w-3.5 text-amber-500" />
          <div className="min-w-0">
            <p className="truncate font-manrope text-xs font-semibold text-gray-800 dark:text-gray-100">{data.title}</p>
            {data.address && <p className="truncate font-manrope text-[10px] text-gray-500 dark:text-gray-400">{data.address}</p>}
          </div>
        </div>
      </button>

      {typeof document !== "undefined" && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
