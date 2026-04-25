"use client";

import { AppGate } from "@/components/app-gate";
import { AppShell } from "@/components/app-shell";

export default function FilesPage() {
  return (
    <AppGate>
      <AppShell>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-canela text-3xl font-bold text-white">
              Files
            </h1>
            <p className="mt-2 font-manrope text-sm text-gray-500">
              Coming soon.
            </p>
          </div>
        </div>
      </AppShell>
    </AppGate>
  );
}
