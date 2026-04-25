"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "@/app/archived/components/Footer";

export default function Company() {
  return (
    <div className="relative min-h-screen w-full bg-white">
      {/* Hero Section */}
      <div className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-32">
          <div className="text-center">
            {/* Title */}
            <h1 className="font-canela text-5xl md:text-7xl font-medium text-black mb-6">
              The Future of Real Estate is Here
            </h1>
            
            {/* Description */}
            <p className="font-manrope text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
              We're a team of real estate experts, engineers, and data scientists working together to transform how development decisions are made
            </p>
            
            {/* Button */}
            <Link
              href="https://calendly.com/usman-nura/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-black text-white font-semibold transition-all duration-300 hover:bg-gray-700"
            >
              Request a Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-canela text-4xl md:text-5xl font-medium text-black mb-6">
                The Goal
              </h2>
              <p className="font-manrope text-lg text-gray-600 leading-relaxed mb-6">
                To empower real estate professionals with AI-driven insights that make development faster, smarter, and more profitable.
              </p>
              <p className="font-manrope text-lg text-gray-600 leading-relaxed">
                We believe that technology should augment human expertise, not replace it. Our platform gives you the data you need to make better decisions, faster.
              </p>
            </div>
            <div className="relative h-96">
              <Image
                src="/cityskyline.gif"
                alt="City skyline"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    
     {/* Mission Section */}
      <div className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-canela text-4xl md:text-5xl font-medium text-black mb-6">
              Building The Most Capable Real Estate Intelligence in Silicon Valley
            </h2>
              
            </div>
            <div>
              {/* Team Info */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <p className="font-manrope text-xs font-light text-gray-600 mb-1">FOUNDED BY</p>
                  <p className="font-manrope text-base font-semibold text-black">Adhyaay Karnwal</p>
                </div>
                <div>
                  <p className="font-manrope text-xs font-light text-gray-600 mb-1">THE TEAM</p>
                  <div className="font-manrope text-base font-semibold text-black">
                    <p>Andrew Hunter</p>
                  </div>
                </div>
              </div>
              
              <p className="font-manrope text-md text-black leading-relaxed max-w-lg">
                At Trajectory, our mission is to be more than an AI tool; we're building the intelligence layer developers rely on to navigate zoning, risk, and feasibility with speed and confidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Backed By Section */}
      <div className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="font-canela text-4xl md:text-5xl font-medium text-black mb-12">
            Backed By
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="relative h-24 w-48">
              <Image
                src="/afore.svg"
                alt="Afore"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative h-16 w-48">
              <Image
                src="/solo.jpeg"
                alt="Solo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="font-canela text-4xl md:text-5xl font-medium text-black mb-12">
            Trusted By 
          </h2>
          <div className="flex justify-center">
            <div className="relative h-32 w-full max-w-4xl">
              <Image
                src="/companies.jpg"
                alt="Trusted Companies"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Careers Section */}
      <div className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-manrope text-lg text-black leading-relaxed">
                We're seeking talented individuals who want to build a category-defining company. If that's you, come join us.
              </p>
              <Link
                href="https://app.dover.com/jobs/nura"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 px-8 py-4 bg-black text-white font-semibold transition-all duration-300 hover:bg-gray-700"
              >
                See Careers
              </Link>
            </div>
            <div>
              <h2 className="font-canela text-4xl md:text-5xl font-medium text-black text-right">
                Join a World-Class Team
                <br />
                <span className="text-gray-500">Rethinking Real Estate</span>
              </h2>
            </div>
          </div>
        </div>
      </div>

       {/* CTA Section */}
      <div className="relative z-10 w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-32">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {/* Left side - Logo and Text */}
            <div className="flex flex-col items-start">
              <div className="mb-8">
                <Image
                  src="/nura-black.png"
                  alt="Trajectory"
                  width={60}
                  height={60}
                  className="w-12 h-12"
                />
              </div>
              <h2 className="font-canela text-4xl md:text-5xl font-medium text-gray-800">
                Unlock Real Estate AI
                <br />
                <span className="text-gray-500">For Your Firm</span>
              </h2>
            </div>
            
            {/* Right side - Button aligned to bottom */}
            <div className="flex items-end">
              <Link
                href="https://calendly.com/usman-nura/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-black text-white font-semibold transition-all duration-300 hover:bg-gray-700"
              >
                Request a Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}