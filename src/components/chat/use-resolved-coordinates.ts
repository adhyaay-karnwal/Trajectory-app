"use client";

import { useEffect, useState } from "react";

interface ResolvedCoordinates {
  latitude: number | null;
  longitude: number | null;
}

export function useResolvedCoordinates(
  address?: string | null,
  latitude?: number | null,
  longitude?: number | null
): ResolvedCoordinates {
  const hasDirectCoordinates =
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined;

  const [resolved, setResolved] = useState<ResolvedCoordinates>({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    if (hasDirectCoordinates) return;
    if (!address) return;

    let cancelled = false;

    void fetch(`/api/google/geocode?address=${encodeURIComponent(address)}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        setResolved({
          latitude: typeof data?.latitude === "number" ? data.latitude : null,
          longitude: typeof data?.longitude === "number" ? data.longitude : null,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setResolved({
          latitude: null,
          longitude: null,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [address, hasDirectCoordinates]);

  if (hasDirectCoordinates) {
    return {
      latitude,
      longitude,
    };
  }

  return resolved;
}
