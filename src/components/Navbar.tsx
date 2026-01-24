"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isInHero, setIsInHero] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight;
      
      setScrolled(scrollPosition > 0);
      setIsInHero(scrollPosition < heroHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-200/30 ${
    isInHero 
      ? "bg-transparent backdrop-blur-sm" 
      : "bg-white"
  }`;

  const logoSrc = isInHero ? "/nura logo original white.png" : "/Nura Logo Black.png";
  const textColorClass = isInHero ? "text-white" : "text-black";
  const buttonClass = isInHero 
    ? "text-white hover:text-gray-200" 
    : "text-black hover:text-gray-700";

  return (
    <nav className={navClass}>
      <div className="relative h-16">
        <div className="absolute inset-0 flex items-center justify-between px-6 lg:px-8">
          {/* Logo - Top Left */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src={logoSrc}
                alt="Nura"
                width={60}
                height={15}
                className="h-4 w-auto"
              />
            </Link>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-10 absolute left-1/2 transform -translate-x-1/2">
            <Link href="#" className={`${textColorClass} font-normal transition-colors`}>
              Product
            </Link>
            <Link href="#" className={`${textColorClass} font-normal transition-colors`}>
              Company
            </Link>
            <Link href="#" className={`${textColorClass} font-normal transition-colors`}>
              Blog
            </Link>
            <Link href="https://app.dover.com/jobs/nura" className={`${textColorClass} font-normal transition-colors`}>
              Careers
            </Link>
          </div>

          {/* Right Buttons */}
          <div className="flex items-center space-x-4">
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
              Request Demo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}