"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full text-black">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/footer.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        {/* Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Product Section */}
          <div>
            <h3 className="font-canela text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-black drop-shadow-sm">Product</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/product#faq" className="font-manrope text-black/90 hover:text-black transition-colors drop-shadow-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="https://app.nura.construction/signup" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-manrope text-black/90 hover:text-black transition-colors drop-shadow-sm"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link 
                  href="https://calendly.com/usman-nura/30min" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-manrope text-black/90 hover:text-black transition-colors drop-shadow-sm"
                >
                  Schedule a call
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="font-canela text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-black drop-shadow-sm">Company</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/blog" className="font-manrope text-black/90 hover:text-black transition-colors drop-shadow-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/company" className="font-manrope text-black/90 hover:text-black transition-colors drop-shadow-sm">
                  About us
                </Link>
              </li>
              <li>
                <Link 
                  href="https://app.dover.com/jobs/nura" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-manrope text-black/90 hover:text-black transition-colors drop-shadow-sm"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="font-canela text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-black drop-shadow-sm">Support</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/terms" className="font-manrope text-black/90 hover:text-black transition-colors drop-shadow-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="font-manrope text-black/90 hover:text-black transition-colors drop-shadow-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-black/20 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Left - Logo and Copyright */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                className="w-6 h-6 sm:w-8 sm:h-8"
              >
                <defs>
                  <path id="petal-teardrop" 
                        d="M 0,22 
                           C 11,22 14,18 14,12
                           S 2,0 0,0 
                           -14,6 -14,12 
                           -11,22 0,22 Z" 
                        fill="#333333" />
                </defs>
                <g transform="translate(50, 50)">
                  <use href="#petal-teardrop" transform="rotate(0) translate(0,10) scale(1,1.8)" />
                  <use href="#petal-teardrop" transform="rotate(60) translate(0,10) scale(1,1.8)" />
                  <use href="#petal-teardrop" transform="rotate(120) translate(0,10) scale(1,1.8)" />
                  <use href="#petal-teardrop" transform="rotate(180) translate(0,10) scale(1,1.8)" />
                  <use href="#petal-teardrop" transform="rotate(240) translate(0,10) scale(1,1.8)" />
                  <use href="#petal-teardrop" transform="rotate(300) translate(0,10) scale(1,1.8)" />
                </g>
              </svg>
              <p className="font-manrope text-black/80 text-xs sm:text-sm drop-shadow-sm">
                2026 Petal. All rights reserved.
              </p>
            </div>

            {/* Right - X.com Logo */}
            <div className="flex items-center">
              <Link
                href="https://x.com/nuraintel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black/80 hover:text-black transition-colors drop-shadow-sm"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}