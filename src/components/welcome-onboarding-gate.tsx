"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WelcomeLoading } from "@/components/welcome-loading";

export function WelcomeOnboardingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (onboardingCompleted) {
      router.replace("/");
    }
  }, [router]);

  if (!mounted) return <>{children}</>;

  const onboardingCompleted = localStorage.getItem('onboardingCompleted');
  if (onboardingCompleted) {
    router.replace("/");
    return null;
  }

  return <>{children}</>;
}
