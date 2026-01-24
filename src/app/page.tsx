import Image from "next/image";
import Link from "next/link";
import DemoOne from "@/components/demo-one";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 h-screen">
        <Image
          src="/city2.gif"
          alt="Cities"
          fill
          className="object-cover"
          priority
          style={{ objectPosition: 'center' }}
        />
{/* True bottom-only progressive blur */}
<div className="pointer-events-none absolute inset-0">
  {/* Light blur start */}
  <div
    className="
      absolute bottom-0 left-0 right-0 h-2/3
      backdrop-blur-sm
      [mask-image:linear-gradient(to_bottom,transparent,black)]
      [-webkit-mask-image:linear-gradient(to_bottom,transparent,black)]
    "
  />

  {/* Medium blur */}
  <div
    className="
      absolute bottom-0 left-0 right-0 h-1/2
      backdrop-blur-lg
      [mask-image:linear-gradient(to_bottom,transparent,black)]
      [-webkit-mask-image:linear-gradient(to_bottom,transparent,black)]
    "
  />

  {/* Heavy blur at very bottom */}
  <div
    className="
      absolute bottom-0 left-0 right-0 h-1/3
      backdrop-blur-2xl
      [mask-image:linear-gradient(to_bottom,transparent,black)]
      [-webkit-mask-image:linear-gradient(to_bottom,transparent,black)]
    "
  />
</div>


      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-16">
        <div className="max-w-4xl text-center">
          {/* Title */}
          <h1 className="mb-6 font-canela text-5xl md:text-7xl font-bold text-white">
            The AI Platform for Real Estate.
          </h1>
          
          {/* Description */}
          <p className="mb-10 font-manrope text-lg md:text-xl text-white max-w-3xl mx-auto leading-relaxed font-semibold">
            Purpose-built AI real estate intelligence that helps teams analyze sites, assess feasibility, and move faster on multi-million-dollar opportunities.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Get Started for Free - Left Button (Solid) */}
            <Link
              href="https://app.nura.construction/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold text-center transition-all duration-300 hover:bg-gray-200"
            >
              Get Started for Free
            </Link>
            
            {/* Request a Demo - Right Button (Clear with subtle backdrop blur) */}
            <Link
              href="https://calendly.com/usman-nura/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 border-2 border-white bg-white/5  text-white font-semibold text-center transition-all duration-300 hover:bg-white hover:text-black"
            >
              Request a Demo
            </Link>
          </div>
        </div>
      </div>

      {/* New Section with White Background */}
      <div className="relative z-10 w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-32">
          <div className="text-center">
            <h2 className="font-canela text-4xl md:text-5xl font-medium text-gray-500 mb-6">
              $1.3 trillion in property decisions still trapped in manual workflows and months of research. <span className="text-black">Nura changes that.</span>
            </h2>
          </div>
        </div>
      </div>
 
      {/* New Garden Section */}
<div className="relative z-10 w-full bg-white">
  <div className="max-w-6xl mx-auto px-4 py-32">
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
      {/* Left side - Text */}
      <div className="md:w-1/3">
        <h3 className="font-canela text-3xl md:text-4xl font-medium text-gray-800 mb-6">
          Powered by the Leading Real Estate Reasoning Model
        </h3>
        <p className="text-gray-600 text-md md:text-lg leading-relaxed mb-8">
          AI agents trained on zoning, permitting, market comps, and development workflows for institutional-grade analysis.
        </p>
        <p className="text-gray-600 text-md md:text-lg leading-relaxed">
          Delivers answers and insights in minutes, replacing weeks of manual research.
        </p>
      </div>
      
      {/* Right side - Image with Video Overlay */}
      <div className="md:w-2/3 flex justify-end">
        <div className="relative w-full h-96 md:h-[500px]">
          <Image
            src="/garden.jfif"
            alt="Nura-1"
            fill
            className="object-cover"
            style={{ objectPosition: 'center' }}
            priority
          />
          {/* Video overlay positioned inside the garden image */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative">
              <video
                src="/nura-demo-1.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-auto h-auto rounded-lg shadow-2xl object-cover"
                style={{ 
                  width: '500px',
                  height: 'auto',
                  border: '8px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(2px)',
                  WebkitBackdropFilter: 'blur(2px)'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


      {/* Skyscraper section with sides switched */}
<div className="relative z-10 w-full bg-white">
  <div className="max-w-6xl mx-auto px-4 py-40 md:py-60">
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
      
      {/* Left side - Image */}
      <div className="md:w-2/3 flex justify-start">
        <div className="relative w-full h-96 md:h-[500px]">
          <Image
            src="/skyscrapers.jfif"
            alt="Nura-2"
            fill
            className="object-cover"
            style={{ objectPosition: 'center' }}
            priority
          />
          {/* Demo overlay positioned inside the skyscraper image */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative">
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
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Text */}
      <div className="md:w-1/3">
        <h3 className="font-canela text-3xl md:text-4xl font-medium text-gray-800 mb-6">
          Accurate, Grounded Analysis Across Every Property
        </h3>
        <p className="text-gray-600 text-md md:text-lg leading-relaxed mb-8">
          Nura scrapes the web for thousands of municipal, environmental, and market data sources to deliver transparent, auditable insights you can trust.
        </p>
      </div>
      
    </div>
  </div>
</div>


{/* pond Section */}
<div className="relative z-10 w-full bg-white">
  <div className="max-w-6xl mx-auto px-4 py-40 md:py-60">
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
      
      {/* Left side - Text */}
      <div className="md:w-1/3">
        <h3 className="font-canela text-3xl md:text-4xl font-medium text-gray-800 mb-6">
          Work Within Your Existing Development Tools
        </h3>
        <p className="text-gray-600 text-md md:text-lg leading-relaxed mb-8">
        Use agents designed to produce outputs directly in PDFs, spreadsheets, and presentations—just like your team would. Generate Proformas, Reports, and Presentations in seconds.
        </p>
      </div>
      
      {/* Right side - Image with Video Overlay */}
      <div className="md:w-2/3 flex justify-end">
        <div className="relative w-full h-96 md:h-[500px]">
          <Image
            src="/pond.jfif"
            alt="Nura-3"
            fill
            className="object-cover"
            style={{ objectPosition: 'center' }}
            priority
          />
          {/* Video overlay positioned inside the garden image */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative">
              <video
                src="/nura-demo-3.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-auto h-auto rounded-lg shadow-2xl object-cover"
                style={{ 
                  width: '500px',
                  height: 'auto',
                  border: '8px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(2px)',
                  WebkitBackdropFilter: 'blur(2px)'
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</div>

      {/* New Three-Card Feature Section */}
      <div className="relative z-10 w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-32">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="font-canela text-4xl md:text-5xl font-medium text-black mb-6">
              Built for Enterprise Deployment
            </h2>
            <p className="font-manrope text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nura combines secure data, AI reasoning, and workflow integration for developers and analysts.
            </p>
          </div>

          {/* Three Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: AI-Powered Analysis */}
            <div className="bg-gray-100 p-8">
              {/* Icon */}
              <div className="mb-6 inline-block p-3 bg-black">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none">
  <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
  <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
  <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
  <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
  <circle cx="12" cy="12" r="2" fill="currentColor"/>
</svg>

              </div>
              {/* Title */}
              <h3 className="font-canela text-2xl font-semibold text-black mb-4">
                AI-Powered Analysis
              </h3>
              {/* Description */}
              <p className="font-manrope text-gray-600 leading-relaxed">
                Nura's agents reason across zoning, environmental, and market data to deliver institutional-grade insights instantly.
              </p>
            </div>

            {/* Card 2: Integrated Workflows */}
            <div className="bg-gray-100 p-8">
              {/* Icon */}
              <div className="mb-6 inline-block p-3 bg-black">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none">
  <rect x="4" y="4" width="16" height="4" stroke="currentColor" strokeWidth="2"/>
  <rect x="4" y="10" width="16" height="4" stroke="currentColor" strokeWidth="2"/>
  <rect x="4" y="16" width="16" height="4" stroke="currentColor" strokeWidth="2"/>
</svg>

              </div>
              {/* Title */}
              <h3 className="font-canela text-2xl font-semibold text-black mb-4">
                Integrated Workflows
              </h3>
              {/* Description */}
              <p className="font-manrope text-gray-600 leading-relaxed">
                Generate PDF feasibility reports, spreadsheet pro formas, and dashboard-ready property cards without leaving your workflow.
              </p>
            </div>

            {/* Card 3: Secure, Multi-Source Data */}
            <div className="bg-gray-100 p-8">
              {/* Icon */}
              <div className="mb-6 inline-block p-3 bg-black">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none">
  <rect x="4" y="3" width="16" height="18" stroke="currentColor" strokeWidth="2"/>
  <rect x="8" y="7" width="8" height="4" stroke="currentColor" strokeWidth="2"/>
  <rect x="8" y="13" width="8" height="4" stroke="currentColor" strokeWidth="2"/>
</svg>

              </div>
              {/* Title */}
              <h3 className="font-canela text-2xl font-semibold text-black mb-4">
                Secure, Multi-Source Data
              </h3>
              {/* Description */}
              <p className="font-manrope text-gray-600 leading-relaxed">
                Access municipal records, LoopNet/Redfin comps, environmental maps, and demographic datasets with strict access controls and auditing.
              </p>
            </div>
          </div>
        </div>
      </div>

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
