# Trajectory - Space Mission Planner

A space mission planning application built for Ridgehacks 2026.

## Team

- **Adhyaay Karnwal**
- **Nishant Das**
- **Keshav Patel**
- **Kapil Raghul**

## About

Trajectory is an interactive space mission planner that lets users configure every aspect of their journey to the stars. Choose your destination planet, select your spacecraft, set your crew size, define mission objectives, and launch your mission with a beautiful, immersive interface.

## Problem We're Solving

Space mission planning is complex, requiring careful consideration of multiple variables including destination selection, spacecraft capabilities, crew requirements, budget constraints, and mission objectives. Existing tools are either too technical for enthusiasts or too simplistic for serious planning. Trajectory bridges this gap by providing an intuitive, visually engaging interface that makes mission planning accessible while maintaining the depth needed for realistic configurations.

## AI Capabilities

Trajectory leverages AI to enhance the mission planning experience:

- **Intelligent Recommendations**: AI suggests optimal spacecraft and mission parameters based on your destination and budget
- **Real-time Validation**: AI-powered validation ensures mission configurations are feasible and realistic
- **Adaptive UI**: The interface adapts based on user choices, highlighting relevant options and filtering unrealistic combinations
- **Mission Analysis**: AI analyzes your complete mission configuration and provides insights on success probability, resource requirements, and potential challenges

## Features

- **Interactive Mission Planning**: Step-by-step wizard to configure your space mission
- **3D Planet Visualization**: View planets and spacecraft in 3D with interactive models
- **Mission Configuration**: Choose destination, launch date, rocket, crew size, mission type, and budget
- **Immersive UI**: Beautiful space-themed interface with stars and nebula effects
- **Sound Effects**: Ambient sounds and interactive audio feedback

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **3D Models**: Custom 3D model viewer for planets and spacecraft
- **Backend**: Convex (database + backend functions)
- **Fonts**: Canela (headings), Manrope (body)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env.local`:
```bash
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=

NEXT_PUBLIC_CONVEX_URL=

NEXT_PUBLIC_CONVEX_SITE_URL=

─── AI ───────────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
TAVILY_API_KEY=


# ─── Environmental & Terrain ──────────────────────────────────────────────────
OPENTOPOGRAPHY_API_KEY=

# ─── Market & Demographics ───────────────────────────────────────────────────
CENSUS_API_KEY=

# ─── Vector Search ───────────────────────────────────────────────────────────
PINECONE_API_KEY=

# ─── Pro Forma Builder ───────────────────────────────────────────────────────
UNIVER_API_KEY=
UNIVER_MCP_URL=https://mcp.univer.ai/mcp/

# ─── Memory ──────────────────────────────────────────────────────────────────
SUPERMEMORY_API_KEY=
SUPERMEMORY_PROJECT_ID=

# ─── Space ──────────────────────────────────────────────────────────────────
NASA_API_KEY=
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
petal/
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   │   ├── chat/        # Mission planner component
│   │   └── ui/          # UI components
│   └── lib/             # Utility functions
├── convex/              # Convex backend
│   ├── _generated/      # Generated types
│   └── *.ts             # Backend functions
└── public/              # Static assets
    └── kapil-models/    # 3D models
```


## Built for Ridgehacks 2026

This project was developed for the Ridgehacks hackathon competition.
