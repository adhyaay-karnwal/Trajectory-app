"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import DemoOne from "@/app/archived/components/demo-one";
import Testimonials from "@/app/archived/components/testimonials";
import FAQ from "@/app/archived/components/FAQ";
import Footer from "@/app/archived/components/Footer";

export default function Product() {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedButton, setSelectedButton] = useState(1);

  const prompts = [
    "Given current zoning, what are the realistic uses for this parcel not theoretical ones?",
    "Can I build multifamily here? If yes, what approval path would I need?",
    "What zoning changes or variances would unlock the most value on this site?",
    "What are the top 5 hidden risks on this property that could kill the deal late?",
    "Check for flood, environmental, wildfire, and seismic risk and summarize it like I'm sending it to an investor.",
    "Has this parcel or nearby parcels had permit issues or rejections in the past?",
    "Is there anything here that would make lenders uncomfortable?"
  ];

  useEffect(() => {
    const currentPrompt = prompts[currentPromptIndex];
    const typingSpeed = isDeleting ? 30 : 50;
    const pauseDuration = isDeleting ? 500 : 2000;

    const handleTyping = () => {
      if (!isDeleting) {
        if (displayText.length < currentPrompt.length) {
          setDisplayText(currentPrompt.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentPromptIndex, prompts]);

  return (
    <div className="relative min-h-screen w-full bg-white">
      {/* First Section */}
      <div className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-32">
          <div className="text-center">
            {/* Title */}
            <h1 className="font-canela text-5xl md:text-7xl font-medium text-black mb-6">
              Stop Wasting Your Team's Time
            </h1>
            
            {/* Description */}
            <p className="font-manrope text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
              Accelerate firm productivity, automate research, and unify real estate data at scale with one secure platform
            </p>
            
            {/* Button */}
            <Link
              href="https://calendly.com/usman-nura/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-black text-white font-semibold transition-all duration-300 hover:bg-gray-700 mb-12"
            >
              Request a Demo
            </Link>
            
            {/* Image with Prompt Box */}
            <div className="relative w-full max-w-4xl mx-auto flex justify-center">
              <div className="relative w-3/4">
                <Image
                  src="/guy4.jpg"
                  alt="Product illustration"
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover rotate-180"
                  priority
                />
                {/* Prompt Box Overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="relative w-full">
                    <div 
                      className="bg-white rounded-lg shadow-2xl p-3"
                      style={{ 
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        backdropFilter: 'blur(2px)',
                        WebkitBackdropFilter: 'blur(2px)'
                      }}
                    >
                    <div className="flex items-start gap-4">
                      {/* Text area */}
                      <div className="flex-1 min-h-[32px] bg-white rounded-md p-2 text-left">
                        <p className="text-black text-base leading-relaxed">
                          {displayText}
                          <span className="animate-pulse">|</span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Bottom controls */}
                    <div className="flex items-center justify-between mt-2">
                      {/* File attachment button */}
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>
                      
                      {/* Arrow button */}
                      <Link
                        href="https://app.nura.construction/signup"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-purple-600 text-white rounded-md hover:bg-black transition-all duration-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Section */}
      <div className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-left">
            <h2 className="font-canela text-xl md:text-2xl font-medium">
              <span className="text-gray-600">Just as Palantir turned fragmented data into operational intelligence, </span>
              <span className="text-black">Nura is doing the same for real estate development.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* New Interactive Section */}
      <div className="relative z-10 w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-40 md:py-60">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
            
            {/* Left side - Image with Pond background and changing overlay */}
            <div className="md:w-2/3 flex justify-start">
              <div className="relative w-full h-96 md:h-[500px]">
                <Image
                  src="/pond.png"
                  alt="Petal Platform"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center' }}
                  priority
                />
                {/* Dynamic overlay positioned inside the pond image */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="relative">
                    <div 
                      className="rounded-lg shadow-2xl"
                      style={{ 
                        width: '500px'
                      }}
                    >
                      {selectedButton === 1 && (
                        <video
                          src="/nura-demo-1.mp4"
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-auto h-auto rounded-lg shadow-2xl object-cover"
                          style={{ 
                            width: '500px',
                            height: 'auto'
                          }}
                        />
                      )}
                      {selectedButton === 2 && (
                        <div 
                          className="rounded-lg shadow-2xl"
                          style={{ 
                            width: '500px',
                            border: '8px solid rgba(255, 255, 255, 0.3)',
                            backdropFilter: 'blur(2px)',
                            WebkitBackdropFilter: 'blur(2px)'
                          }}
                        >
                          <DemoOne />
                        </div>
                      )}
                      {selectedButton === 3 && (
                        <video
                          src="/nura-demo-3.mp4"
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-auto h-auto rounded-lg shadow-2xl object-cover"
                          style={{ 
                            width: '500px',
                            height: 'auto'
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Title and Buttons */}
            <div className="md:w-1/3">
              <h3 className="font-canela text-3xl md:text-4xl font-medium text-gray-800 mb-8">
                An Integrated, AI-first Platform Built to Drive Your Progress Forward
              </h3>
              
              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedButton(1)}
                  className={`w-full text-left px-6 py-4 font-medium ${
                    selectedButton === 1 
                      ? 'bg-gray-100' 
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold  text-black">1</span>
                    <span className="text-gray-800">All the work, done for you</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setSelectedButton(2)}
                  className={`w-full text-left px-6 py-4 font-medium ${
                    selectedButton === 2 
                      ? 'bg-gray-100' 
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-black">2</span>
                    <span className="text-gray-800">Scrape thousands of sources in seconds</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setSelectedButton(3)}
                  className={`w-full text-left px-6 py-4 font-medium ${
                    selectedButton === 3 
                      ? 'bg-gray-100' 
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold  text-black">3</span>
                    <span className="text-gray-800">Create the right reports for you</span>
                  </div>
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Trusted by Real Estate Developers Section */}
      <div className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="font-canela text-3xl md:text-4xl font-medium text-black mb-12">
              Trusted by Real Estate Developers
            </h2>
            
            {/* Companies Image */}
            <div className="w-full max-w-5xl mx-auto">
              <Image
                src="/companies.jpg"
                alt="Trusted by Real Estate Developers"
                width={1200}
                height={400}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ />

      {/* Testimonials Section */}
      <Testimonials />

      {/* New CTA Section */}
      <div className="relative z-10 w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-32">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {/* Left side - Logo and Text */}
            <div className="flex flex-col items-start">
              <div className="mb-8">
                <Image
                  src="/nura-black.png"
                  alt="Nura"
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
                Request Demo
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