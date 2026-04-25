import { action } from "./_generated/server";
import { v } from "convex/values";

// ─── NASA API Integration ─────────────────────────────────────────────────────

const NASA_API_KEY = process.env.NASA_API_KEY;

async function fetchNASA<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  if (!NASA_API_KEY) {
    throw new Error("NASA_API_KEY not configured");
  }

  const url = new URL(`https://api.nasa.gov${endpoint}`);
  url.searchParams.append("api_key", NASA_API_KEY);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`NASA API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ─── APOD (Astronomy Picture of the Day) ─────────────────────────────────────────

export const getAPOD = action({
  args: {
    date: v.optional(v.string()), // YYYY-MM-DD format
  },
  handler: async (ctx, args) => {
    const params: Record<string, string> = {};
    if (args.date) {
      params.date = args.date;
    }
    return await fetchNASA("/planetary/apod", params);
  },
});

// ─── Near Earth Objects (NeoWS) ───────────────────────────────────────────────────

export const getNEOFeed = action({
  args: {
    startDate: v.string(), // YYYY-MM-DD
    endDate: v.optional(v.string()), // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const params: Record<string, string> = {
      start_date: args.startDate,
    };
    if (args.endDate) {
      params.end_date = args.endDate;
    }
    return await fetchNASA("/neo/rest/v1/feed", params);
  },
});

export const lookupNEO = action({
  args: {
    asteroidId: v.string(), // Asteroid ID (e.g., "3542519")
  },
  handler: async (ctx, args) => {
    return await fetchNASA(`/neo/rest/v1/neo/${args.asteroidId}`);
  },
});

export const browseNEOs = action({
  args: {
    page: v.optional(v.number()),
    size: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const params: Record<string, string> = {};
    if (args.page !== undefined) params.page = args.page.toString();
    if (args.size !== undefined) params.size = args.size.toString();
    return await fetchNASA("/neo/rest/v1/neo/browse", params);
  },
});

// ─── Mars Rover Photos ───────────────────────────────────────────────────────────

export const getMarsPhotos = action({
  args: {
    rover: v.union(v.literal("curiosity"), v.literal("opportunity"), v.literal("spirit")),
    sol: v.optional(v.number()), // Martian sol (day)
    earthDate: v.optional(v.string()), // YYYY-MM-DD
    camera: v.optional(v.string()), // Camera abbreviation
    page: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const params: Record<string, string> = {};
    if (args.sol !== undefined) params.sol = args.sol.toString();
    if (args.earthDate) params.earth_date = args.earthDate;
    if (args.camera) params.camera = args.camera;
    if (args.page !== undefined) params.page = args.page.toString();
    return await fetchNASA(`/mars-photos/api/v1/rovers/${args.rover}/photos`, params);
  },
});

// ─── Tech Transfer Portal ─────────────────────────────────────────────────────────

export const getTechTransfer = action({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const params = {
      q: args.query,
    };
    return await fetchNASA("/techtransfer/api/v1/search", params);
  },
});

// ─── EPIC (Earth Polychromatic Imaging Camera) ─────────────────────────────────────

export const getEPICImages = action({
  args: {
    date: v.optional(v.string()), // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const endpoint = args.date 
      ? `/EPIC/api/natural/date/${args.date}`
      : "/EPIC/api/natural/images";
    return await fetchNASA(endpoint);
  },
});

// ─── Spacecraft Data (approximate based on public data) ───────────────────────────

// Since NASA doesn't have a direct spacecraft API, we'll provide curated data
// for major spacecraft and rockets used in space missions

export const getSpacecraftData = action({
  args: {
    spacecraft: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Curated spacecraft data based on public NASA and industry information
    const spacecraftDatabase = {
      "starship": {
        name: "SpaceX Starship",
        manufacturer: "SpaceX",
        type: "Reusable launch vehicle",
        payloadLEO: "150,000 kg (reusable) / 250,000 kg (expendable)",
        payloadMoon: "100,000+ kg",
        height: "120 m",
        diameter: "9 m",
        firstFlight: "2024 (expected)",
        capabilities: ["Earth orbit", "Moon missions", "Mars missions", "Beyond"],
        fuel: "Liquid methane + Liquid oxygen (CH4/LOX)",
        thrust: "7,500+ tons (33,000+ kN)",
        stages: 2,
        reusability: "Fully reusable",
      },
      "falcon-heavy": {
        name: "Falcon Heavy",
        manufacturer: "SpaceX",
        type: "Reusable launch vehicle",
        payloadLEO: "63,800 kg",
        payloadGTO: "26,700 kg",
        payloadTMI: "16,800 kg",
        height: "70 m",
        diameter: "3.7 m",
        firstFlight: "2018",
        capabilities: ["Earth orbit", "Moon missions", "Planetary missions"],
        fuel: "RP-1 + Liquid oxygen (kerosene/LOX)",
        thrust: "1,420 tons (5,700 kN)",
        stages: 3,
        reusability: "Partially reusable (first stages)",
      },
      "sls": {
        name: "Space Launch System (SLS)",
        manufacturer: "NASA/Boeing",
        type: "Expendable launch vehicle",
        payloadLEO: "95,000+ kg (Block 1)",
        payloadTMI: "27,000+ kg (Block 1)",
        height: "98 m (Block 1)",
        diameter: "8.4 m",
        firstFlight: "2021",
        capabilities: ["Earth orbit", "Moon missions (Artemis)", "Deep space"],
        fuel: "Liquid hydrogen + Liquid oxygen (LH2/LOX)",
        thrust: "3,920 tons (8.8 million lbs)",
        stages: 2,
        reusability: "Expendable",
      },
      "new-glenn": {
        name: "New Glenn",
        manufacturer: "Blue Origin",
        type: "Reusable launch vehicle",
        payloadLEO: "45,000 kg",
        payloadGTO: "13,000 kg",
        height: "98 m",
        diameter: "7 m",
        firstFlight: "2024 (expected)",
        capabilities: ["Earth orbit", "Moon missions", "Planetary missions"],
        fuel: "Liquid hydrogen + Liquid oxygen (LH2/LOX)",
        thrust: "1,700 tons (7.5 MN)",
        stages: 2,
        reusability: "Fully reusable (first stage)",
      },
    };

    if (args.spacecraft) {
      const key = args.spacecraft.toLowerCase();
      const result = spacecraftDatabase[key as keyof typeof spacecraftDatabase];
      if (result) {
        return result;
      }
      throw new Error(`Spacecraft "${args.spacecraft}" not found in database`);
    }

    return spacecraftDatabase;
  },
});

// ─── Planet Data (curated based on NASA planetary facts) ─────────────────────────────

export const getPlanetData = action({
  args: {
    planet: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Curated planet data based on NASA planetary fact sheets
    const planetDatabase = {
      "mercury": {
        name: "Mercury",
        type: "Terrestrial planet",
        distanceFromSun: "57.9 million km",
        distanceFromEarth: "77-222 million km (varies)",
        orbitalPeriod: "88 Earth days",
        dayLength: "59 Earth days",
        diameter: "4,879 km",
        gravity: "3.7 m/s² (38% of Earth)",
        atmosphere: "Minimal (exosphere)",
        temperature: "-180°C to 430°C",
        moons: 0,
        landingDifficulty: "High (extreme temperatures, no atmosphere)",
        resources: ["Iron", "Nickel", "Silicates"],
        habitability: "Very low (no atmosphere, extreme temperatures)",
        travelTime: "6-7 months (with optimal transfer)",
        deltaVFromLEO: "13.5 km/s",
      },
      "venus": {
        name: "Venus",
        type: "Terrestrial planet",
        distanceFromSun: "108.2 million km",
        distanceFromEarth: "38-261 million km (varies)",
        orbitalPeriod: "225 Earth days",
        dayLength: "243 Earth days (retrograde)",
        diameter: "12,104 km",
        gravity: "8.87 m/s² (90% of Earth)",
        atmosphere: "Dense CO₂ (92 bar pressure)",
        temperature: "465°C (surface)",
        moons: 0,
        landingDifficulty: "Extreme (crushing pressure, extreme heat)",
        resources: ["Atmospheric gases", "Possible minerals"],
        habitability: "None (surface), potential cloud habitats",
        travelTime: "3-5 months",
        deltaVFromLEO: "12.5 km/s",
      },
      "earth": {
        name: "Earth",
        type: "Terrestrial planet",
        distanceFromSun: "149.6 million km",
        distanceFromEarth: "0 km",
        orbitalPeriod: "365.25 days",
        dayLength: "24 hours",
        diameter: "12,742 km",
        gravity: "9.81 m/s²",
        atmosphere: "N₂ (78%), O₂ (21%)",
        temperature: "-89°C to 57°C",
        moons: 1,
        landingDifficulty: "Home planet",
        resources: ["All known resources"],
        habitability: "Perfect (home planet)",
        travelTime: "0 km",
        deltaVFromLEO: "0 km/s",
      },
      "mars": {
        name: "Mars",
        type: "Terrestrial planet",
        distanceFromSun: "227.9 million km",
        distanceFromEarth: "54.6-401 million km (varies)",
        orbitalPeriod: "687 Earth days",
        dayLength: "24.6 hours",
        diameter: "6,779 km",
        gravity: "3.71 m/s² (38% of Earth)",
        atmosphere: "Thin CO₂ (0.006 bar pressure)",
        temperature: "-125°C to 20°C",
        moons: 2,
        landingDifficulty: "Moderate (thin atmosphere, cold)",
        resources: ["Water ice", "Iron oxide", "Regolith", "CO₂ for fuel"],
        habitability: "Low (requires sealed habitats, possible terraforming)",
        travelTime: "6-9 months (Hohmann transfer)",
        deltaVFromLEO: "6.0 km/s",
        launchWindows: "Every 26 months",
      },
      "jupiter": {
        name: "Jupiter",
        type: "Gas giant",
        distanceFromSun: "778.5 million km",
        distanceFromEarth: "588-968 million km (varies)",
        orbitalPeriod: "11.86 Earth years",
        dayLength: "9.9 hours",
        diameter: "139,820 km",
        gravity: "24.79 m/s² (253% of Earth)",
        atmosphere: "H₂ (90%), He (10%)",
        temperature: "-145°C (cloud tops)",
        moons: 95,
        landingDifficulty: "Impossible (no solid surface)",
        resources: ["Atmospheric gases", "Moon resources"],
        habitability: "None (gas giant), moons possible",
        travelTime: "2-6 years",
        deltaVFromLEO: "9.0 km/s",
        notableMoons: ["Europa (potential life)", "Ganymede", "Io", "Callisto"],
      },
      "saturn": {
        name: "Saturn",
        type: "Gas giant",
        distanceFromSun: "1.4 billion km",
        distanceFromEarth: "1.2-1.7 billion km (varies)",
        orbitalPeriod: "29.46 Earth years",
        dayLength: "10.7 hours",
        diameter: "116,460 km",
        gravity: "10.44 m/s² (106% of Earth)",
        atmosphere: "H₂ (96%), He (3%)",
        temperature: "-178°C (cloud tops)",
        moons: 146,
        landingDifficulty: "Impossible (no solid surface)",
        resources: ["Atmospheric gases", "Moon resources", "Rings"],
        habitability: "None (gas giant), moons possible",
        travelTime: "6-8 years",
        deltaVFromLEO: "10.0 km/s",
        notableMoons: ["Titan (thick atmosphere, methane lakes)", "Enceladus (ocean)"],
      },
      "uranus": {
        name: "Uranus",
        type: "Ice giant",
        distanceFromSun: "2.9 billion km",
        distanceFromEarth: "2.6-3.2 billion km (varies)",
        orbitalPeriod: "84 Earth years",
        dayLength: "17.2 hours",
        diameter: "50,724 km",
        gravity: "8.69 m/s² (89% of Earth)",
        atmosphere: "H₂ (83%), He (15%), CH₄ (2%)",
        temperature: "-224°C",
        moons: 27,
        landingDifficulty: "Impossible (no solid surface)",
        resources: ["Atmospheric gases", "Moon resources"],
        habitability: "None (ice giant)",
        travelTime: "12+ years",
        deltaVFromLEO: "11.5 km/s",
      },
      "neptune": {
        name: "Neptune",
        type: "Ice giant",
        distanceFromSun: "4.5 billion km",
        distanceFromEarth: "4.3-4.7 billion km (varies)",
        orbitalPeriod: "164.8 Earth years",
        dayLength: "16.1 hours",
        diameter: "49,244 km",
        gravity: "11.15 m/s² (114% of Earth)",
        atmosphere: "H₂ (80%), He (19%), CH₄ (1%)",
        temperature: "-214°C",
        moons: 14,
        landingDifficulty: "Impossible (no solid surface)",
        resources: ["Atmospheric gases", "Moon resources"],
        habitability: "None (ice giant)",
        travelTime: "15+ years",
        deltaVFromLEO: "12.0 km/s",
      },
    };

    if (args.planet) {
      const key = args.planet.toLowerCase();
      const result = planetDatabase[key as keyof typeof planetDatabase];
      if (result) {
        return result;
      }
      throw new Error(`Planet "${args.planet}" not found in database`);
    }

    return planetDatabase;
  },
});

// ─── Orbital Mechanics Calculator ───────────────────────────────────────────────────

export const calculateHohmannTransfer = action({
  args: {
    fromPlanet: v.string(),
    toPlanet: v.string(),
  },
  handler: async (ctx, args) => {
    // Simplified Hohmann transfer calculation
    // Returns approximate delta-v, travel time, and launch window info
    
    const planetRadii: Record<string, number> = {
      mercury: 57.9,
      venus: 108.2,
      earth: 149.6,
      mars: 227.9,
      jupiter: 778.5,
      saturn: 1433.5,
      uranus: 2872.5,
      neptune: 4495.1,
    };

    const r1 = planetRadii[args.fromPlanet.toLowerCase()];
    const r2 = planetRadii[args.toPlanet.toLowerCase()];

    if (!r1 || !r2) {
      throw new Error("Invalid planet names");
    }

    // Semi-major axis of transfer orbit
    const aTransfer = (r1 + r2) / 2;
    
    // Travel time (half period of transfer orbit) in days
    // Using Kepler's third law: T = 2π * sqrt(a³/GM)
    // Simplified: T (days) ≈ 0.5 * sqrt(a³) where a is in AU
    const aTransferAU = aTransfer / 149.6; // Convert to AU
    const travelTimeDays = 0.5 * 365.25 * Math.pow(aTransferAU, 1.5);
    
    // Approximate delta-v calculation (very simplified)
    // This is a rough estimate for planning purposes
    const deltaV = Math.abs(2.94 * (1 - Math.sqrt(2 * r2 / (r1 + r2)))); // km/s
    
    // Synodic period (time between launch windows)
    // Simplified: 1/|1/T1 - 1/T2|
    const orbitalPeriods: Record<string, number> = {
      mercury: 88,
      venus: 225,
      earth: 365.25,
      mars: 687,
      jupiter: 4333,
      saturn: 10759,
      uranus: 30687,
      neptune: 60190,
    };
    
    const T1 = orbitalPeriods[args.fromPlanet.toLowerCase()];
    const T2 = orbitalPeriods[args.toPlanet.toLowerCase()];
    const synodicPeriod = 1 / Math.abs(1/T1 - 1/T2);

    return {
      fromPlanet: args.fromPlanet,
      toPlanet: args.toPlanet,
      transferOrbitSemiMajorAxis: `${aTransfer.toFixed(1)} million km`,
      travelTime: `${Math.round(travelTimeDays)} days (~${(travelTimeDays/30.44).toFixed(1)} months)`,
      deltaV: `${deltaV.toFixed(2)} km/s (estimate)`,
      launchWindowInterval: `${Math.round(synodicPeriod)} days (~${(synodicPeriod/365.25).toFixed(1)} years)`,
      optimalAlignment: "Planets must be at correct phase angle for Hohmann transfer",
    };
  },
});

// ─── Mission Cost Estimator ───────────────────────────────────────────────────────

export const estimateMissionCost = action({
  args: {
    destination: v.string(),
    missionType: v.union(v.literal("flyby"), v.literal("orbit"), v.literal("land"), v.literal("sample-return")),
    spacecraft: v.string(),
    crewSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Very rough cost estimates based on historical missions
    // These are order-of-magnitude estimates for planning
    
    const baseCosts: Record<string, number> = {
      mercury: 500_000_000,
      venus: 400_000_000,
      mars: 1_000_000_000,
      jupiter: 2_000_000_000,
      saturn: 3_000_000_000,
      uranus: 4_000_000_000,
      neptune: 5_000_000_000,
    };

    const missionMultipliers: Record<string, number> = {
      flyby: 1.0,
      orbit: 1.5,
      land: 2.5,
      "sample-return": 4.0,
    };

    const spacecraftMultipliers: Record<string, number> = {
      "starship": 0.5, // Reusable, lower cost per kg
      "falcon-heavy": 0.7,
      "sls": 1.2, // More expensive
      "new-glenn": 0.6,
    };

    const baseCost = baseCosts[args.destination.toLowerCase()] || 1_000_000_000;
    const missionMultiplier = missionMultipliers[args.missionType];
    const spacecraftMultiplier = spacecraftMultipliers[args.spacecraft.toLowerCase()] || 1.0;
    
    let totalCost = baseCost * missionMultiplier * spacecraftMultiplier;

    // Crew missions are much more expensive
    if (args.crewSize && args.crewSize > 0) {
      totalCost *= (5 + args.crewSize); // Base multiplier for crewed missions
    }

    return {
      destination: args.destination,
      missionType: args.missionType,
      spacecraft: args.spacecraft,
      crewSize: args.crewSize || 0,
      estimatedCost: {
        minimum: Math.round(totalCost * 0.7),
        expected: Math.round(totalCost),
        maximum: Math.round(totalCost * 1.5),
      },
      currency: "USD",
      note: "Rough order-of-magnitude estimate based on historical missions. Actual costs vary significantly based on mission design, technology, and timeline.",
    };
  },
});
