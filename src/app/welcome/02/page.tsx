"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PopButton } from "@/components/ui/pop-button";
import { WelcomeOnboardingGate } from "@/components/welcome-onboarding-gate";
import { SpreadsheetDemo } from "@/components/welcome/onboarding-demos";
import { OnboardingProgress } from "@/components/welcome/onboarding-progress";

export default function Onboarding02Page() {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setPressedKey("enter");
      }
      if (e.key === "Escape") {
        window.location.href = "/welcome/01";
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setPressedKey(null);
        window.location.href = "/welcome/03";
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
    return pressedKey === key ? { borderBottomWidth: "2px", transform: "scaleY(0.95)" } : undefined;
  };

  return (
    <WelcomeOnboardingGate>
    <main className="bg-noise min-h-screen bg-neutral-100 dark:bg-[#0f0f0f] transition-colors duration-300 flex flex-col items-center justify-center p-8">
      <div className="relative rounded-xl overflow-hidden border-[3px] border-double border-neutral-300 dark:border-neutral-600">
        <Image
          src="/Earth-from-space-1-64e9a7c.jpg"
          alt="Trajectory"
          width={500}
          height={600}
          className="block"
        />
        {/* Demo overlay */}
        <div className="absolute top-[12%] left-[8%] right-[8%] bottom-[28%]">
          <SpreadsheetDemo />
        </div>
        <div className="absolute bottom-1 left-1 right-1 bg-white dark:bg-[#1c1c1c] dark:border dark:border-gray-600 rounded-lg p-4">
          <div className="mb-3">
            <h1 className="text-lg font-canela font-semibold text-black dark:text-white mb-1">
              Space mission planning is complex.
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-manrope text-sm">
              Planning a mission to another planet involves countless variables: launch windows, spacecraft selection, crew requirements, and budget constraints. It's a puzzle that takes experts months to solve.
            </p>
          </div>
          <div className="flex justify-end items-center">
            <Link href="/welcome/03">
              <PopButton 
                color="default" 
                size="sm" 
                keybind="enter"
                style={getButtonStyle("enter")}
              >
                Next
              </PopButton>
            </Link>
          </div>
        </div>
      </div>
      {/* Progress indicator outside card at bottom */}
      <div className="mt-6">
        <OnboardingProgress currentStep={1} totalSteps={7} />
      </div>
    </main>
    </WelcomeOnboardingGate>
  );
}