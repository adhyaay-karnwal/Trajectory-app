"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { AppGate } from "@/components/app-gate";
import { AppShell } from "@/components/app-shell";
import { PopButton } from "@/components/ui/pop-button";

const tasks = [
  { href: "/chat", keybind: "c", label: "Plan a mission" },
  { href: "/vault", keybind: "v", label: "Open Vault" },
];

function TaskButtons({ pressedKey }: { pressedKey: string | null }) {
  const router = useRouter();

  const getButtonStyle = (key: string) => {
    return pressedKey === key
      ? { borderBottomWidth: "2px", transform: "scaleY(0.95)" }
      : undefined;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6 flex-wrap overflow-hidden">
      {tasks.map((task, i) => (
        <Link
          key={task.href + task.keybind}
          href={task.href}
          className="animate-think"
          style={{ animationDelay: `${i * 60 + 50}ms` }}
        >
          <PopButton
            color="default"
            size="sm"
            keybind={task.keybind}
            style={getButtonStyle(task.keybind)}
          >
            {task.label}
          </PopButton>
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const router = useRouter();

  const navigateTo = useCallback(
    (key: string) => {
      const task = tasks.find((t) => t.keybind === key);
      if (task) {
        router.push(task.href);
      }
    },
    [router],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const task = tasks.find((t) => t.keybind === key);
      if (task) {
        setPressedKey(key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const task = tasks.find((t) => t.keybind === key);
      if (task) {
        setPressedKey(null);
        navigateTo(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [navigateTo]);

  return (
    <AppGate>
      <AppShell>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-canela text-3xl font-bold text-gray-900 dark:text-white">
              Plan your mission.
            </h1>
            <p className="mt-2 font-manrope text-sm text-gray-500">
              Where do you want to go today?
            </p>
            {mounted && <TaskButtons pressedKey={pressedKey} />}
          </div>
        </div>
      </AppShell>
    </AppGate>
  );
}
