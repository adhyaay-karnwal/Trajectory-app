"use client";

interface LoadingScreenProps {
  isLoading: boolean;
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center">
      <div className="w-[80vh] h-[80vh] max-w-[500px] max-h-[500px]">
        <object
          type="image/svg+xml"
          data="/logo-loading.svg"
          className="w-full h-full"
          aria-label="Loading"
        />
      </div>
    </div>
  );
}