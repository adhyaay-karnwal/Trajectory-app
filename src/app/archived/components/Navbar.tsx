"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isInHero, setIsInHero] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Only enable hero mode on the main page
    if (pathname === "/") {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const heroHeight = window.innerHeight;
        
        setIsInHero(scrollPosition < heroHeight - 100);
      };

      window.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check

      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      // For all other pages, always show non-hero mode
      setIsInHero(false);
    }
  }, [pathname]);

  const navClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-200/30 ${
    isMobileMenuOpen 
      ? "bg-gray-800" 
      : isInHero 
        ? "bg-transparent backdrop-blur-sm" 
        : "bg-white"
  }`;

  const textColorClass = isMobileMenuOpen 
    ? "text-white" 
    : isInHero 
      ? "text-white" 
      : "text-black";
  const buttonClass = isMobileMenuOpen 
    ? "text-white hover:text-gray-200" 
    : isInHero 
      ? "text-white hover:text-gray-200" 
      : "text-black hover:text-gray-700";

  return (
    <nav className={navClass}>
      <div className="relative h-16">
        <div className="absolute inset-0 flex items-center justify-between px-6 lg:px-8">
          {/* Logo - Top Left */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-8 w-8">
                <Image
                  src={isMobileMenuOpen || isInHero ? "/petal-logo-white.svg" : "/petal-logo.svg"}
                  alt="Petal"
                  fill
                  className="object-contain"
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-[2] origin-center">
                  <Image
                    src={isMobileMenuOpen || isInHero ? "/petal-pulse-white.svg" : "/petal-pulse-dark.svg"}
                    alt="Petal"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <span className={`font-canela text-2xl font-semibold ${textColorClass}`}>Petal</span>
            </Link>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-10 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/product" className={`${textColorClass} font-normal transition-colors`}>
              Product
            </Link>
            <Link href="/company" className={`${textColorClass} font-normal transition-colors`}>
              Company
            </Link>
            <Link href="/blog" className={`${textColorClass} font-normal transition-colors`}>
              Blog
            </Link>
            <Link 
              href="https://app.dover.com/jobs/nura" 
              target="_blank"
              rel="noopener noreferrer"
              className={`${textColorClass} font-normal transition-colors`}
            >
              Careers
            </Link>
          </div>

          {/* Right Buttons - Desktop Only */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="https://app.nura.construction/signin"
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonClass} font-medium transition-colors`}
            >
              Log in
            </Link>
            <Link
              href="https://calendly.com/usman-nura/30min"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 font-medium transition-all ${
                isInHero
                  ? "bg-white text-black hover:bg-gray-300"
                  : "bg-black text-white hover:bg-gray-700"
              }`}
            >
              Book Demo
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 ${textColorClass} hover:opacity-80 transition-opacity`}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-4 space-y-3">
            <Link 
              href="/product" 
              className="flex items-center justify-between px-4 py-3 border-l border-t border-gray-600 text-white font-geist-mono text-sm transition-colors hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>Product</span>
              <span className="text-gray-400">01 /</span>
            </Link>
            <Link 
              href="/company" 
              className="flex items-center justify-between px-4 py-3 border-l border-t border-gray-600 text-white font-geist-mono text-sm transition-colors hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>Company</span>
              <span className="text-gray-400">02 /</span>
            </Link>
            <Link 
              href="/blog" 
              className="flex items-center justify-between px-4 py-3 border-l border-t border-gray-600 text-white font-geist-mono text-sm transition-colors hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>Blog</span>
              <span className="text-gray-400">03 /</span>
            </Link>
            <Link 
              href="https://app.dover.com/jobs/nura" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 border-l border-t border-gray-600 text-white font-geist-mono text-sm transition-colors hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>Careers</span>
              <span className="text-gray-400">04 /</span>
            </Link>
            <div className="pt-4 border-t border-gray-600 flex flex-col space-y-3">
              <Link
                href="https://app.nura.construction/signin"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 border-2 border-white text-white font-medium text-center transition-all hover:bg-white hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="https://calendly.com/usman-nura/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 bg-white text-black font-medium text-center transition-all hover:bg-gray-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}