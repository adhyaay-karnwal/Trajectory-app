---
name: Trajectory Tech Stack & Architecture
description: Tech stack and architecture for Trajectory — a space mission planner built for Ridgehacks 2026
type: project
---

## Team
- **Adhyaay Karnwal**
- **Nishant Das**
- **Keshav Patel**
- **Kapil Raghul**

## Status
Built for Ridgehacks 2026 hackathon.

## Frontend
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- WorkOS AuthKit for authentication (PKCE, Google/Microsoft OAuth)
- Convex React hooks (useQuery, useMutation) for data management
- Custom 3D model viewer for planets and spacecraft
- HugeIcons Bulk Rounded (hand-inlined SVGs)
- Canela (headings), Manrope (body), Geist Mono (code)
- Custom PopButton design system (3D border-press)
- Pages: Mission Planner, Dashboard

## Backend — Convex
- Convex as the entire backend: database + functions + realtime sync
- Auth: WorkOS JWT validated on every function call
- Schema tables: users (tokenIdentifier, workosUserId, email, name, onboardingCompleted)
- Functions: users.viewerProfile (query), users.syncProfileAfterAuth (mutation), users.completeOnboarding (mutation)
- Mission configuration stored in Convex for persistence

## 3D Assets
- Planet models: Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune
- Spacecraft models: Starship, Falcon Heavy, SLS, New Glenn
- Models stored in GLTF format in public/kapil-models/

## Audio Assets
- Ambient space sounds (earth.wav, bells, click effects)
- Stored in public/kapil-sounds/

## Infrastructure
- Convex: primary database + backend runtime
- WorkOS: authentication, SSO, user management
- Vercel: hosting and deployment

## Features
- Interactive mission planning wizard
- Step-by-step configuration: destination, date, rocket, crew, mission type, budget
- 3D visualization of planets and spacecraft
- Immersive space-themed UI with stars and nebula effects
- Sound effects and ambient audio
- Progress tracking through mission configuration steps
