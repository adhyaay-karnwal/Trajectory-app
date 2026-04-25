"use client";

import { AppGate } from "@/components/app-gate";
import { AppShell } from "@/components/app-shell";

export default function SettingsPage() {
  return (
    <AppGate>
      <AppShell>
        <div className="mx-auto max-w-lg p-8">
          <h1 className="mb-2 font-canela text-2xl font-bold text-gray-800 dark:text-gray-200">
            Settings
          </h1>
          <p className="font-manrope text-sm text-gray-600 dark:text-gray-400">
            Account preferences and workspace options will live here.
          </p>
        </div>
      </AppShell>
    </AppGate>
  );
}
