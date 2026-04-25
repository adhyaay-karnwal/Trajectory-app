"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { HugeLayersIcon } from "@/components/huge-icons";
import { PopButton } from "@/components/ui/pop-button";
import { ModelViewer } from "@/components/model-viewer";
import { useSound } from "@/lib/use-sound";

// Mission configuration types
type MissionStep = "welcome" | "planet" | "date" | "rocket" | "crew" | "type" | "budget" | "complete";

interface MissionConfig {
  planet: string;
  launchDate: string;
  rocket: string;
  crewSize: number;
  missionType: string;
  budget: string;
}

const PLANETS = [
  { id: "mercury", name: "Mercury", color: "#B5B5B5", distance: "92M km", model: "/kapil-models/Mercury.gltf" },
  { id: "venus", name: "Venus", color: "#FFC649", distance: "108M km", model: "/kapil-models/venus.gltf" },
  { id: "mars", name: "Mars", color: "#E27B58", distance: "225M km", model: "/kapil-models/mars (1).gltf" },
  { id: "jupiter", name: "Jupiter", color: "#D4A574", distance: "628M km", model: "/kapil-models/jupiter (1).gltf" },
  { id: "saturn", name: "Saturn", color: "#F4D59E", distance: "1.2B km", model: "/kapil-models/saturn (1).gltf" },
  { id: "uranus", name: "Uranus", color: "#A8D5E5", distance: "2.7B km", model: "/kapil-models/AuxScene (5).gltf" },
  { id: "neptune", name: "Neptune", color: "#5B7FD3", distance: "4.3B km", model: "/kapil-models/neptune (1).gltf" },
];

const ROCKETS = [
  { id: "starship", name: "Starship", payload: "150t", cost: "$10M/launch", model: "/kapil-models/Sketchfab_Scene.gltf", scale: 0.1 },
  { id: "falcon-heavy", name: "Falcon Heavy", payload: "63.8t", cost: "$97M/launch", model: "/kapil-models/falconheavy.gltf", scale: 0.1 },
  { id: "sls", name: "SLS", payload: "95t", cost: "$2B/launch", model: null, scale: 0.1 },
  { id: "new-glenn", name: "New Glenn", payload: "45t", cost: "$90M/launch", model: "/kapil-models/newglenn.gltf", scale: 0.05 },
];

const MISSION_TYPES = [
  { id: "flyby", name: "Flyby", description: "Pass by without stopping" },
  { id: "orbit", name: "Orbit", description: "Enter orbit around destination" },
  { id: "land", name: "Land", description: "Surface landing mission" },
  { id: "colonize", name: "Colonize", description: "Establish permanent settlement" },
];

const BUDGET_LEVELS = [
  { id: "low", name: "Low", range: "<$1B" },
  { id: "medium", name: "Medium", range: "$1B-$10B" },
  { id: "high", name: "High", range: "$10B-$100B" },
  { id: "unlimited", name: "Unlimited", range: "$100B+" },
];

interface MissionPlannerProps {
  onComplete: (config: MissionConfig) => void;
}

export function MissionPlanner({ onComplete }: MissionPlannerProps) {
  const { playEarth, playClick, playBells } = useSound();
  const [currentStep, setCurrentStep] = useState<MissionStep>("welcome");
  const [config, setConfig] = useState<MissionConfig>({
    planet: "",
    launchDate: "",
    rocket: "",
    crewSize: 4,
    missionType: "",
    budget: "",
  });

  // Play earth sound when component mounts
  useEffect(() => {
    playEarth({ loop: true });
    return () => {
      // Stop sound when component unmounts
      const audio = new Audio("/kapil-sounds/earth.wav");
      audio.pause();
    };
  }, [playEarth]);

  const steps: MissionStep[] = ["welcome", "planet", "date", "rocket", "crew", "type", "budget"];
  const currentStepIndex = steps.indexOf(currentStep);

  const handlePlanetSelect = (planet: string) => {
    playClick();
    setConfig({ ...config, planet });
  };

  const handleDateSelect = (date: string) => {
    playClick();
    setConfig({ ...config, launchDate: date });
  };

  const handleRocketSelect = (rocket: string) => {
    playClick();
    setConfig({ ...config, rocket });
  };

  const handleCrewChange = (size: number) => {
    playClick();
    setConfig({ ...config, crewSize: size });
  };

  const handleTypeSelect = (type: string) => {
    playClick();
    setConfig({ ...config, missionType: type });
  };

  const handleBudgetSelect = (budget: string) => {
    playClick();
    setConfig({ ...config, budget });
  };

  const handleNext = () => {
    playClick();
    playBells();
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex]);
    } else {
      onComplete(config);
    }
  };

  const handleBack = () => {
    playClick();
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex]);
    }
  };

  const handleLaunch = () => {
    playClick();
    playBells();
    onComplete(config);
  };

  const canProceed = () => {
    switch (currentStep) {
      case "welcome": return true;
      case "planet": return config.planet !== "";
      case "date": return config.launchDate !== "";
      case "rocket": return config.rocket !== "";
      case "crew": return true;
      case "type": return config.missionType !== "";
      case "budget": return config.budget !== "";
      case "complete": return true;
      default: return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "planet": return "Choose your destination";
      case "date": return "Select launch date";
      case "rocket": return "Select spacecraft";
      case "crew": return "Set crew size";
      case "type": return "Choose mission type";
      case "budget": return "Set budget level";
      case "complete": return "Ready to launch";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case "welcome": return "Welcome to Trajectory";
      case "planet": return "Where do you want to explore?";
      case "date": return "When will you depart?";
      case "rocket": return "Which rocket will carry your mission?";
      case "crew": return "How many astronauts?";
      case "type": return "What's your mission objective?";
      case "budget": return "What's your budget range?";
      case "complete": return "Review your mission configuration";
    }
  };

  const renderPlanetVisualization = () => {
    const selectedPlanet = PLANETS.find(p => p.id === config.planet);
    const planet = selectedPlanet || PLANETS[0];
    
    if (planet.model) {
      return (
        <div className="relative w-full h-[400px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden">
            {/* Stars */}
            <div className="absolute inset-0">
              {[...Array(100)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
            
            {/* 3D Model */}
            <div className="absolute inset-0">
              <ModelViewer 
                modelPath={planet.model} 
                autoRotate={true}
                rotationSpeed={0.3}
                className="w-full h-full"
              />
            </div>
            
            {/* Distance label */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10">
              <p className="font-manrope text-white/60 text-sm">{planet.distance} from Earth</p>
            </div>
          </div>
        </div>
      );
    }
    
    // Fallback to 2D representation
    return (
      <div className="relative w-full h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden">
          {/* Stars */}
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          
          {/* Planet */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className="rounded-full shadow-2xl"
              style={{
                width: "200px",
                height: "200px",
                background: `radial-gradient(circle at 30% 30%, ${planet.color}, #000)`,
                boxShadow: `0 0 60px ${planet.color}40`,
              }}
            />
          </div>
          
          {/* Distance label */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="font-manrope text-white/60 text-sm">{planet.distance} from Earth</p>
          </div>
        </div>
      </div>
    );
  };

  const renderRocketVisualization = () => {
    const selectedRocket = ROCKETS.find(r => r.id === config.rocket);
    const rocket = selectedRocket || ROCKETS[0];
    
    if (rocket.model) {
      return (
        <div className="relative w-full h-[400px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden">
            {/* Stars */}
            <div className="absolute inset-0">
              {[...Array(100)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
            
            {/* 3D Model */}
            <div className="absolute inset-0">
              <ModelViewer 
                modelPath={rocket.model} 
                autoRotate={true}
                rotationSpeed={0.2}
                className="w-full h-full"
              />
            </div>
            
            {/* Rocket info */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10">
              <p className="font-manrope text-white font-semibold text-lg">{rocket.name}</p>
              <p className="font-manrope text-white/60 text-sm">{rocket.payload} payload • {rocket.cost}</p>
            </div>
          </div>
        </div>
      );
    }
    
    // Fallback to 2D representation
    return (
      <div className="relative w-full h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden">
          {/* Stars */}
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
          
          {/* Rocket silhouette */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg width="120" height="280" viewBox="0 0 120 280" className="drop-shadow-2xl">
              {/* Rocket body */}
              <rect x="40" y="60" width="40" height="180" fill="#E8E8E8" rx="4" />
              {/* Nose cone */}
              <path d="M 40 60 L 60 10 L 80 60" fill="#E8E8E8" />
              {/* Fins */}
              <path d="M 40 200 L 20 260 L 40 240" fill="#C0C0C0" />
              <path d="M 80 200 L 100 260 L 80 240" fill="#C0C0C0" />
              {/* Engine */}
              <ellipse cx="60" cy="240" rx="15" ry="8" fill="#87CEFA" />
              {/* Windows */}
              <circle cx="60" cy="90" r="8" fill="#87CEFA" opacity="0.6" />
            </svg>
          </div>
          
          {/* Rocket info */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="font-manrope text-white font-semibold text-lg">{rocket.name}</p>
            <p className="font-manrope text-white/60 text-sm">{rocket.payload} payload • {rocket.cost}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderDefaultVisualization = () => {
    return (
      <div className="relative w-full h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden">
          {/* Stars */}
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
          
          {/* Solar system hint */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="w-32 h-32 rounded-full border-2 border-white/20 animate-pulse" />
            <p className="font-manrope text-white/40 text-sm mt-4">Select your destination</p>
          </div>
        </div>
      </div>
    );
  };

  const renderVisualization = () => {
    if (currentStep === "planet" || currentStep === "date") {
      return renderPlanetVisualization();
    }
    if (currentStep === "rocket" || currentStep === "crew") {
      return renderRocketVisualization();
    }
    return renderDefaultVisualization();
  };

  const renderOptions = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="font-canela text-3xl font-bold text-gray-900">
                Plan Your Space Mission
              </h2>
              <p className="font-manrope text-gray-600 text-lg">
                Configure every aspect of your journey to the stars
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 border border-gray-200">
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <span className="text-sky-600 font-semibold">1</span>
                </div>
                <span className="font-manrope text-gray-800">Choose your destination</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 border border-gray-200">
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <span className="text-sky-600 font-semibold">2</span>
                </div>
                <span className="font-manrope text-gray-800">Select launch date & spacecraft</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 border border-gray-200">
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <span className="text-sky-600 font-semibold">3</span>
                </div>
                <span className="font-manrope text-gray-800">Configure crew & mission type</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 border border-gray-200">
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <span className="text-sky-600 font-semibold">4</span>
                </div>
                <span className="font-manrope text-gray-800">Set budget & launch</span>
              </div>
            </div>
          </div>
        );

      case "planet":
        return (
          <div className="grid grid-cols-2 gap-3">
            {PLANETS.map((planet) => (
              <button
                key={planet.id}
                onClick={() => handlePlanetSelect(planet.id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  config.planet === planet.id
                    ? "border-sky-400 bg-sky-50"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full shadow-lg"
                    style={{ background: planet.color }}
                  />
                  <div className="text-left">
                    <p className="font-manrope font-semibold text-gray-900">
                      {planet.name}
                    </p>
                    <p className="font-manrope text-xs text-gray-700">
                      {planet.distance}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      case "date":
        const today = new Date();
        const futureDates = [];
        for (let i = 1; i <= 12; i++) {
          const date = new Date(today);
          date.setMonth(date.getMonth() + i);
          futureDates.push({
            value: date.toISOString().split('T')[0],
            label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          });
        }

        return (
          <div className="grid grid-cols-3 gap-3">
            {futureDates.map((date) => (
              <button
                key={date.value}
                onClick={() => handleDateSelect(date.value)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  config.launchDate === date.value
                    ? "border-sky-400 bg-sky-50"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                )}
              >
                <p className="font-manrope font-semibold text-gray-900">
                  {date.label}
                </p>
              </button>
            ))}
          </div>
        );

      case "rocket":
        return (
          <div className="grid grid-cols-2 gap-3">
            {ROCKETS.map((rocket) => (
              <button
                key={rocket.id}
                onClick={() => handleRocketSelect(rocket.id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  config.rocket === rocket.id
                    ? "border-sky-400 bg-sky-50"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                )}
              >
                <div className="text-left">
                  <p className="font-manrope font-semibold text-gray-900">
                    {rocket.name}
                  </p>
                  <p className="font-manrope text-xs text-gray-700">
                    {rocket.payload} • {rocket.cost}
                  </p>
                </div>
              </button>
            ))}
          </div>
        );

      case "crew":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleCrewChange(Math.max(0, config.crewSize - 1))}
                className="w-12 h-12 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <span className="text-2xl text-gray-900">−</span>
              </button>
              <div className="flex-1 text-center">
                <p className="font-manrope text-4xl font-bold text-gray-900">
                  {config.crewSize}
                </p>
                <p className="font-manrope text-sm text-gray-700">
                  {config.crewSize === 0 ? "Uncrewed" : config.crewSize === 1 ? "Astronaut" : "Astronauts"}
                </p>
              </div>
              <button
                onClick={() => handleCrewChange(Math.min(12, config.crewSize + 1))}
                className="w-12 h-12 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <span className="text-2xl text-gray-900">+</span>
              </button>
            </div>
          </div>
        );

      case "type":
        return (
          <div className="grid grid-cols-2 gap-3">
            {MISSION_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  config.missionType === type.id
                    ? "border-sky-400 bg-sky-50"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                )}
              >
                <div className="text-left">
                  <p className="font-manrope font-semibold text-gray-900">
                    {type.name}
                  </p>
                  <p className="font-manrope text-xs text-gray-700">
                    {type.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        );

      case "budget":
        return (
          <div className="grid grid-cols-2 gap-3">
            {BUDGET_LEVELS.map((budget) => (
              <button
                key={budget.id}
                onClick={() => handleBudgetSelect(budget.id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  config.budget === budget.id
                    ? "border-sky-400 bg-sky-50"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                )}
              >
                <div className="text-left">
                  <p className="font-manrope font-semibold text-gray-900">
                    {budget.name}
                  </p>
                  <p className="font-manrope text-xs text-gray-700">
                    {budget.range}
                  </p>
                </div>
              </button>
            ))}
          </div>
        );

      case "complete":
        const planetName = PLANETS.find(p => p.id === config.planet)?.name || config.planet;
        const rocketName = ROCKETS.find(r => r.id === config.rocket)?.name || config.rocket;
        const typeName = MISSION_TYPES.find(t => t.id === config.missionType)?.name || config.missionType;
        const budgetName = BUDGET_LEVELS.find(b => b.id === config.budget)?.name || config.budget;

        return (
          <div className="space-y-4">
            <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="font-manrope text-gray-700">Destination</span>
                <span className="font-manrope font-semibold text-gray-900">{planetName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-manrope text-gray-700">Launch Date</span>
                <span className="font-manrope font-semibold text-gray-900">
                  {new Date(config.launchDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-manrope text-gray-700">Spacecraft</span>
                <span className="font-manrope font-semibold text-gray-900">{rocketName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-manrope text-gray-700">Crew</span>
                <span className="font-manrope font-semibold text-gray-900">
                  {config.crewSize === 0 ? "Uncrewed" : `${config.crewSize} astronauts`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-manrope text-gray-700">Mission Type</span>
                <span className="font-manrope font-semibold text-gray-900">{typeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-manrope text-gray-700">Budget</span>
                <span className="font-manrope font-semibold text-gray-900">{budgetName}</span>
              </div>
            </div>
            <PopButton
              onClick={handleLaunch}
              className="w-full py-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-manrope font-bold text-lg transition-colors"
            >
              Launch Mission
            </PopButton>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6 pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-950 via-sky-950 to-black">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(200)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
        {/* Nebula effect */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[1000px]">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index <= currentStepIndex
                    ? "bg-sky-400"
                    : "bg-gray-300"
                )}
              />
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-8 h-0.5 transition-all duration-300",
                    index < currentStepIndex
                      ? "bg-sky-400"
                      : "bg-gray-300"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Main content */}
        <div className="flex justify-center">
          {/* Options panel */}
          <div className="w-full max-w-2xl">
            <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-2xl shadow-sky-500/20">
              {/* Header */}
              <div className="mb-4">
                <p className="font-manrope text-lg text-gray-900 font-semibold">
                  {getStepSubtitle()}
                </p>
              </div>

              {currentStep !== "welcome" && (
                <div className="flex items-center gap-2 mb-4">
                  <HugeLayersIcon className="w-5 h-5 text-sky-500" />
                  <span className="font-manrope font-semibold text-sm text-gray-800">
                    Mission Configuration
                  </span>
                </div>
              )}
              {renderOptions()}
              
              {/* Navigation buttons */}
              {currentStep === "welcome" ? (
                <div className="mt-4">
                  <PopButton
                    onClick={handleNext}
                    className="w-full py-3 rounded-xl font-manrope font-semibold transition-colors bg-sky-500 hover:bg-sky-600 text-white"
                  >
                    Get Started
                  </PopButton>
                </div>
              ) : currentStep !== "complete" && (
                <div className="flex gap-3 mt-4">
                  {currentStepIndex > 0 && (
                    <button
                      onClick={handleBack}
                      className="flex-1 py-3 rounded-xl font-manrope font-semibold transition-colors bg-gray-100 border border-gray-300 text-gray-900 hover:bg-gray-200"
                    >
                      Back
                    </button>
                  )}
                  <PopButton
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-manrope font-semibold transition-colors",
                      canProceed()
                        ? "bg-sky-500 hover:bg-sky-600 text-white"
                        : "bg-gray-200 border border-gray-300 text-gray-500 cursor-not-allowed"
                    )}
                  >
                    {currentStepIndex === steps.length - 1 ? "Review" : "Next"}
                  </PopButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
