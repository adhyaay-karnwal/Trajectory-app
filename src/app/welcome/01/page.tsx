"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PopButton } from "@/components/ui/pop-button";
import { useSound } from "@/lib/use-sound";

export default function WelcomePage() {
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const { playNeptune } = useSound();

  const handleContinue = () => {
    // Generate a simple user ID and store in localStorage
    const userId = localStorage.getItem('userId') || crypto.randomUUID();
    localStorage.setItem('userId', userId);
    // Navigate to next onboarding step
    window.location.href = "/welcome/02";
  };

  useEffect(() => {
    // Play neptune sound on page load
    playNeptune({ volume: 0.3, loop: false });
  }, [playNeptune]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setPressedKey("enter");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setPressedKey(null);
        handleContinue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const getButtonStyle = (key: string) => {
    return pressedKey === key
      ? { borderBottomWidth: "2px", transform: "scaleY(0.95)" }
      : undefined;
  };

  return (
    <main className="bg-noise min-h-screen bg-neutral-100 dark:bg-[#0f0f0f] transition-colors duration-300 flex flex-col items-center justify-center p-8">
      <div className="relative rounded-xl overflow-hidden border-[3px] border-double border-neutral-300 dark:border-neutral-600">
        <Image
          src="/Earth-from-space-1-64e9a7c.jpg"
          alt="Trajectory"
          width={500}
          height={600}
          className="block"
        />
        <div className="absolute left-0 right-0 flex items-center justify-center gap-3 top-[35%] z-20">
          <img src="/trajectory-logo.svg" alt="Trajectory" className="w-14 h-14" />
          <h1 className="text-4xl font-canela font-bold text-white">Trajectory</h1>
        </div>

        <div className="absolute bottom-1 left-1 right-1 bg-white dark:bg-[#1c1c1c] dark:border dark:border-gray-600 rounded-lg p-4">
          <div className="mb-3">
            <h1 className="text-lg font-manrope font-semibold text-black dark:text-white mb-1">
              Welcome to Trajectory
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-manrope text-sm">
              Trajectory is your AI-powered space mission planner, helping you design and launch your journey to the stars
            </p>
          </div>
          <div className="flex justify-end">
            <PopButton
              color="default"
              size="sm"
              keybind="enter"
              style={getButtonStyle("enter")}
              onClick={handleContinue}
            >
              Get Started
            </PopButton>
          </div>
        </div>
      </div>
    </main>
  );
}
