"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/components/theme-provider";

function TransitionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const [phase, setPhase] = useState<"fade-out" | "animation" | "ready" | "fade-in">("fade-out");
  const [readyTextVisible, setReadyTextVisible] = useState(false);
  const [readyTextBlurred, setReadyTextBlurred] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      const t = searchParams.get("t");
      if (t) {
        setAnimationKey(prev => prev + 1);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setPhase("animation");
    }, 400);

    return () => clearTimeout(fadeOutTimer);
  }, []);

  useEffect(() => {
    if (phase === "ready") {
      const blurInTimer = setTimeout(() => {
        setReadyTextBlurred(true);
      }, 800);

      const blurOutTimer = setTimeout(() => {
        setReadyTextBlurred(false);
      }, 5000);

      const fadeOutTimer = setTimeout(() => {
        setPhase("fade-in");
        setTimeout(() => {
          router.push("/");
        }, 400);
      }, 5700);

      return () => {
        clearTimeout(blurInTimer);
        clearTimeout(blurOutTimer);
        clearTimeout(fadeOutTimer);
      };
    }
  }, [phase, router]);

  const handleSVGLoad = () => {
    setTimeout(() => {
      setPhase("ready");
      setReadyTextVisible(true);
    }, 7500);
  };

  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 bg-white dark:bg-[#2a2a2a] transition-colors duration-300">
      {phase === "fade-out" && (
        <div 
          className="absolute inset-0 bg-white dark:bg-[#2a2a2a] pointer-events-none"
          style={{ animation: "fadeOut 0.4s ease-out forwards" }}
        />
      )}

      {(phase === "animation" || phase === "ready") && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-[80vh] h-[80vh] max-w-[500px] max-h-[500px]">
            {phase === "animation" && (
              <object
                key={animationKey}
                type="image/svg+xml"
                data="/rocket-launch-fast.svg"
                className="w-full h-full"
                aria-label="Loading"
                onLoad={handleSVGLoad}
              />
            )}
          </div>
        </div>
      )}

      {phase === "ready" && readyTextVisible && (
        <div
          className={`absolute inset-0 flex flex-row items-center justify-center gap-4 transition-all duration-[1500ms] ease-out ${
            readyTextBlurred ? "opacity-100 blur-0" : "opacity-0 blur-lg"
          }`}
        >
          <img
            src="/trajectory-logo-white.svg"
            alt="Trajectory"
            className="w-8 h-8"
          />
          <p key={animationKey} className="text-4xl font-canela font-bold text-shine-container">
            Trajectory is yours.
          </p>
        </div>
      )}

      {phase === "fade-in" && (
        <div 
          className="absolute inset-0 bg-white dark:bg-[#2a2a2a] pointer-events-none"
          style={{ animation: "fadeIn 0.4s ease-out forwards" }}
        />
      )}

      <style jsx global>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes textShine {
          0% {
            background-position: 100% center;
          }
          100% {
            background-position: -100% center;
          }
        }
        .text-shine-container {
          position: relative;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          background-image: linear-gradient(
            90deg,
            #71717a 0%,
            #71717a 32%,
            rgba(125, 211, 252, 0.8) 42%,
            rgba(125, 211, 252, 1) 50%,
            rgba(125, 211, 252, 0.8) 58%,
            #71717a 68%,
            #71717a 100%
          );
          background-size: 300% 300%;
          animation: textShine 8.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}

export default function TransitionPage() {
  return (
    <Suspense fallback={null}>
      <TransitionContent />
    </Suspense>
  );
}