"use client";

import { useState, useEffect } from "react";
import { PetalNavbar } from "@/components/petal-navbar";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("petal-nav-collapsed");
    if (saved !== null) setCollapsed(saved === "true");
  }, []);

  const handleCollapsedChange = (next: boolean) => {
    setCollapsed(next);
    localStorage.setItem("petal-nav-collapsed", String(next));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f5] dark:bg-[#0f0f0f]">
      <PetalNavbar
        collapsed={collapsed}
        onCollapsedChange={handleCollapsedChange}
      />

      <main
        className={cn(
          "relative z-10 flex-1 overflow-auto transition-all duration-200 pt-6",
          collapsed ? "ml-16" : "ml-56",
        )}
      >
        {children}
      </main>
    </div>
  );
}
