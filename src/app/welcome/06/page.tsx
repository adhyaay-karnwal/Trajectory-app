"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PopButton } from "@/components/ui/pop-button";
import { WelcomeOnboardingGate } from "@/components/welcome-onboarding-gate";
import { SitesDemo } from "@/components/welcome/onboarding-demos";
import { OnboardingProgress } from "@/components/welcome/onboarding-progress";

export default function Onboarding06Page() {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setPressedKey("enter");
      }
      if (e.key === "Escape") {
        window.location.href = "/welcome/05";
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setPressedKey(null);
        window.location.href = "/welcome/07";
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
            <SitesDemo />
          </div>
          <div className="absolute bottom-1 left-1 right-1 bg-white dark:bg-[#1c1c1c] dark:border dark:border-gray-600 rounded-lg p-4">
            <div className="mb-3">
              <h1 className="text-lg font-canela font-semibold text-black dark:text-white mb-1">
                Track destinations. Know the distance.
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-manrope text-sm">
                Save planets to your mission list. Trajectory automatically calculates distances, launch windows, and travel times.
              </p>
            </div>
            <div className="flex justify-between items-center">
              <Link href="/welcome/05">
                <div className="relative inline-block group">
                  <div className="absolute inset-0 rounded-lg border border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500 pointer-events-none"></div>
                  <div
                    className="absolute inset-0 rounded-lg
                  bg-gray-50 dark:bg-[#383838]
                  pointer-events-none
                  transition-colors duration-150
                  group-hover:bg-gray-200 dark:group-hover:[#404040]
                  group-active:bg-gray-300 dark:group-active:bg-[#303030]"
                  ></div>
                  <span
                    className="
                  relative
                  block
                  bg-transparent
                  text-black dark:text-white
                  px-4 py-1.5
                  rounded-lg
                  font-manrope font-medium text-sm
                  transition-all duration-150
                  active:translate-y-[2px]
                  shadow-none
                  active:shadow-[inset_0_4px_6px_rgba(0,0,0,0.25)]
                ">
                    Back
                  </span>
                </div>
              </Link>
              <Link href="/welcome/07">
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
          <OnboardingProgress currentStep={5} totalSteps={7} />
        </div>
      </main>
    </WelcomeOnboardingGate>
  );
}