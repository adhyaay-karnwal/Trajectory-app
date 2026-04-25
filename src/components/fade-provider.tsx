"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface FadeContextType {
  fadeOut: (href: string) => void;
}

const FadeContext = createContext<FadeContextType | null>(null);

export function FadeProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [overlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      setTimeout(() => setOverlayVisible(false), 100);
    };

    window.addEventListener('popstate', handleRouteChangeComplete);
    return () => {
      window.removeEventListener('popstate', handleRouteChangeComplete);
    };
  }, []);

  const fadeOut = (href: string) => {
    setOverlayVisible(true);
    setTimeout(() => {
      router.push(href);
    }, 350);
  };

  return (
    <FadeContext.Provider value={{ fadeOut }}>
      {children}
      {overlayVisible && (
        <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#2a2a2a] fade-out pointer-events-none" />
      )}
    </FadeContext.Provider>
  );
}

export function useFade() {
  const context = useContext(FadeContext);
  if (!context) {
    throw new Error("useFade must be used within FadeProvider");
  }
  return context;
}
