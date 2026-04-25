import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Image
        src="/trajectory-logo.svg"
        alt="Trajectory"
        width={80}
        height={80}
        className="opacity-20 mb-8"
      />
      <h1 className="font-canela text-[12rem] leading-none text-neutral-800">
        404
      </h1>
      <p className="text-neutral-600 text-lg mt-4 mb-10 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-neutral-800 text-white px-6 py-3 font-manrope font-semibold hover:bg-neutral-700 transition-colors"
      >
        Return home
      </Link>
    </div>
  );
}
