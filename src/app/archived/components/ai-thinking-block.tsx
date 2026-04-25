"use client";

import { Card } from "@/app/archived/components/card";
import { Loader } from "@/app/archived/components/loader";
import { useEffect, useRef, useState } from "react";

export default function AIThinkingBlock() {
const [scrollPosition, setScrollPosition] = useState(0);
const contentRef = useRef<HTMLDivElement>(null);
const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
const [displayedLines, setDisplayedLines] = useState<string[]>([]);
const [currentLineIndex, setCurrentLineIndex] = useState(0);

const baseThinkingContent = `Okay, first I need to understand this property. I should start by pulling all available data from municipal, zoning, environmental, and market sources to build a full profile.

Looking at zoning records, the property is in a mixed-use district. There are height restrictions of 6 stories, floor-area ratio limits of 2.5x, and specific parking requirements.

Next, I should check recent permit history. The municipal database shows several nearby approvals for multi-family and retail developments.

Now I need to look at environmental factors. FEMA flood zone maps indicate parts of the site are in a moderate-risk area.

I should gather market data next. LoopNet and Redfin comps show recent sale prices for similar-sized lots nearby.

I also need to analyze financial feasibility. Using comparable sales and rental data, preliminary underwriting suggests the project could achieve a 12–15% cap rate.

I should also explore workflow outputs. Petal can take all this raw data and generate natural language feasibility summaries and structured reports.

I should check for cross-source validation. Comps from LoopNet align with Redfin data; census demographics match recent market studies.

Finally, I need to summarize my conclusions. Based on all sources, the property is a viable candidate for mixed-use development.`;

const toolCalls = [
  "*Petal querying LoopNet for comps...*",
  "*Fetching zoning records...*",
  "*Pulling environmental data...*",
  "*Accessing Redfin market data...*",
  "*Querying municipal permit database...*",
  "*Analyzing FEMA flood zone data...*",
  "*Fetching EPA Brownfield records...*",
  "*Pulling USGS seismic data...*",
  "*Accessing census demographic data...*",
  "*Querying construction cost databases...*"
];

const lines = baseThinkingContent.split('\n').filter(line => line.trim());
const augmentedLines = lines.flatMap((line, index) => {
  if (index > 0 && index % 2 === 0 && index < toolCalls.length) {
    return [line, toolCalls[index]];
  }
  return [line];
});

const getLineType = (line: string) => {
  if (line.startsWith('*') && line.includes('...')) {
    return { className: 'text-blue-400', showLoader: true, showProgress: true };
  }
  if (line.includes('cap rate') || line.includes('conclusions') || line.includes('viable')) {
    return { className: 'text-green-400', showLoader: false, showProgress: false };
  }
  return { className: 'text-gray-300', showLoader: false, showProgress: false };
};

const [timer, setTimer] = useState(0);

useEffect(() => {
  const timerInterval = setInterval(() => {
    setTimer((prev) => prev + 1);
  }, 1000);

  return () => {
    clearInterval(timerInterval);
  };
}, []);

useEffect(() => {
  const typingInterval = setInterval(() => {
    if (currentLineIndex < augmentedLines.length) {
      setDisplayedLines(prev => [...prev, augmentedLines[currentLineIndex]]);
      setCurrentLineIndex(prev => prev + 1);
    }
  }, 800);

  return () => {
    clearInterval(typingInterval);
  };
}, [currentLineIndex]);

useEffect(() => {
  if (contentRef.current) {
    const scrollHeight = contentRef.current.scrollHeight;
    const clientHeight = contentRef.current.clientHeight;
    const maxScroll = scrollHeight - clientHeight;

    scrollIntervalRef.current = setInterval(() => {
      setScrollPosition((prev) => {
        const newPosition = prev + 1;
        if (newPosition >= maxScroll) {
          return 0;
        }
        return newPosition;
      });
    }, 10);

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }
}, [displayedLines]);

useEffect(() => {
  if (contentRef.current) {
    contentRef.current.scrollTop = scrollPosition;
  }
}, [scrollPosition]);

return (
  <>
    <div className="flex flex-col p-3 max-w-xl bg-gray-900 border border-white/10 backdrop-blur-sm rounded-card">
      <div className="flex items-center justify-start gap-2 mb-4">
        <Loader size={"sm"} />
        <p
          className="bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-[length:200%_100%] bg-clip-text text-base text-transparent animate-[shimmer_5s_linear_infinite]"
          style={{
            animation: "shimmer 5s linear infinite",
          }}
        >
          Petal is thinking
        </p>
        <span className="text-sm text-gray-400">
          {timer}s
        </span>
        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
          
          @keyframes typewriter {
            from { 
              width: 0; 
              opacity: 0; 
              transform: translateX(-10px);
            }
            to { 
              width: 100%; 
              opacity: 1; 
              transform: translateX(0);
            }
          }
          
          @keyframes load {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          
          .animate-typewriter {
            overflow: hidden;
            display: inline-block;
            white-space: nowrap;
            animation: typewriter 0.8s ease-out forwards;
          }
        `}</style>
      </div>
      <div className="relative h-[150px] overflow-hidden rounded-lg bg-gray-800 border border-white/5">
        {/* Top fade overlay */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-gray-800 to-transparent z-10 pointer-events-none h-[60px]" />

        {/* Bottom fade overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-800 to-transparent z-10 pointer-events-none h-[60px]" />

        {/* Scrolling content */}
        <div
          ref={contentRef}
          className="h-full overflow-hidden p-4 text-white"
          style={{
            scrollBehavior: "auto",
          }}
        >
          <div className="text-sm leading-relaxed">
            {displayedLines.map((line, idx) => {
              const lineType = getLineType(line);
              return (
                <div key={idx} className="mb-3 animate-typewriter">
                  {lineType.showLoader && (
                    <span className="flex items-center gap-2 mb-1">
                      <Loader size="xs" />
                      <span className={lineType.className}>
                        {line.replace(/\*/g, '')}
                      </span>
                    </span>
                  )}
                  {!lineType.showLoader && (
                    <p className={lineType.className}>
                      {line}
                    </p>
                  )}
                  {lineType.showProgress && (
                    <div className="w-full h-1 bg-gray-700 rounded overflow-hidden mt-1">
                      <div className="h-full bg-blue-400 animate-[load_1.5s_linear_infinite]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </>
);
}