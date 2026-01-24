"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Product Section */}
          <div>
            <h3 className="font-canela text-xl font-semibold mb-6">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="font-manrope text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="https://app.nura.construction/signup" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-manrope text-gray-300 hover:text-white transition-colors"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link 
                  href="https://calendly.com/usman-nura/30min" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-manrope text-gray-300 hover:text-white transition-colors"
                >
                  Schedule a call
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="font-canela text-xl font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="font-manrope text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="font-manrope text-gray-300 hover:text-white transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link 
                  href="https://app.dover.com/jobs/nura" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-manrope text-gray-300 hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="font-canela text-xl font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="font-manrope text-gray-300 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="font-manrope text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Left - Logo and Copyright */}
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Image
                src="/logo-rebrand.png"
                alt="Nura"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <p className="font-manrope text-gray-400 text-sm">
                2026 Nura Construction. All rights reserved.
              </p>
            </div>

            {/* Right - X.com Logo */}
            <div className="flex items-center">
              <Link
                href="https://x.com/nuraintel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
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