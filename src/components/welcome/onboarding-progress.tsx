"use client";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center gap-3 p-2">
        {/* Border container with padding */}
        <div className="absolute inset-0 rounded-full border border-gray-300 dark:border-gray-600 pointer-events-none" />
        
        {/* Connected filled capsule - extends from first to current */}
        <div 
          className="absolute z-0 bg-gray-400 dark:bg-gray-500 rounded-full transition-all duration-300"
          style={{
            left: '0.5rem',
            width: `calc(${(currentStep / totalSteps) * 100}% - 1rem)`,
            height: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
        
        {/* All capsules - same color always */}
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          
          return (
            <div
              key={step}
              className="relative z-10 w-4 h-2 rounded-full bg-gray-400 dark:bg-gray-500 transition-all duration-300"
            />
          );
        })}
      </div>
    </div>
  );
}