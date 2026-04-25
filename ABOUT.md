# About Trajectory

## Inspiration

Trajectory was born from our team's shared fascination with space exploration and the realization that mission planning tools are either overly technical or too simplistic. We wanted to create something that bridges this gap—making space mission planning accessible to enthusiasts while maintaining the depth needed for realistic configurations. The idea crystallized during Ridgehacks 2026, where we set out to build an immersive experience that captures the wonder of space travel.

## What We Built

Trajectory is an interactive space mission planner that lets users configure every aspect of their journey to the stars. Users can:

- Choose their destination planet from our solar system
- Select spacecraft from real-world rockets (Starship, Falcon Heavy, SLS, New Glenn)
- Set crew size and mission objectives
- Define budget constraints
- Launch their mission with a beautiful, immersive interface

The app features 3D planet visualization using GLTF models, AI-powered recommendations for optimal mission parameters, and real-time validation to ensure configurations are feasible.

## How We Built It

### Tech Stack

**Frontend**: Next.js 16 (App Router) with React 19 and TypeScript
- Tailwind CSS v4 for styling
- Custom 3D model viewer for planets and spacecraft
- WorkOS AuthKit for authentication with PKCE and OAuth

**Backend**: Convex as our complete backend solution
- Database for storing user profiles and mission configurations
- Serverless functions for real-time data sync
- JWT validation on every function call

**Assets**: 
- 7 planet models and 4 spacecraft models in GLTF format
- Custom sound effects for immersive audio feedback
- Canela and Manrope fonts for modern typography

### Architecture

We used Convex's reactive data model to sync mission state across components. The mission planner walks users through configuration steps, with each step updating the Convex database in real-time. AI functions analyze the complete mission configuration to provide success probability estimates and resource requirements.

## Challenges We Faced

### 3D Model Integration

Integrating GLTF models into a React application proved challenging. We had to:
- Optimize model sizes for web performance
- Handle different coordinate systems across models
- Implement proper lighting and camera controls for an immersive experience

The solution involved creating a custom 3D viewer component that abstracts away the complexity of Three.js while providing smooth interactions.

### AI-Powered Validation

Ensuring mission configurations are realistic required careful calibration of our AI validation logic. We needed to:
- Define realistic parameters for each spacecraft's capabilities
- Calculate fuel requirements based on the rocket equation:
  
  $$ \Delta v = I_{sp} \cdot g_0 \cdot \ln\left(\frac{m_0}{m_f}\right) $$
  
  Where $\Delta v$ is the change in velocity, $I_{sp}$ is specific impulse, $g_0$ is standard gravity, $m_0$ is initial mass, and $m_f$ is final mass.

- Balance between accessibility (not overwhelming users) and accuracy (providing realistic constraints)

### Real-Time State Management

Managing mission state across multiple steps while maintaining a smooth user experience required careful state architecture. We solved this by:
- Using Convex's reactive queries to automatically update UI when mission parameters change
- Implementing optimistic UI updates for instant feedback
- Adding validation at each step to prevent invalid configurations

## What We Learned

This project taught us the importance of:
- **User Experience in Complex Domains**: Making technical concepts accessible without oversimplifying
- **3D Web Performance**: Balancing visual fidelity with load times and responsiveness
- **Reactive Data Patterns**: Leveraging Convex's real-time sync to create fluid interfaces
- **Team Collaboration**: Coordinating across frontend, backend, and asset creation in a hackathon setting

We also gained deep appreciation for the complexity of real space mission planning—and the incredible engineers who make space exploration possible.

## Future Vision

## Inspiration
Our project was inspired by the Artemis II mission, NASA’s first crewed mission back to the Moon in decades. It represents a major step toward long-term space exploration and eventually missions to Mars. What stood out to us was not just the idea of reaching another celestial body, but the complexity behind whether a mission is actually feasible. That led us to think about how we could make those kinds of questions more accessible. We wanted to build something that lets people explore what it really takes to travel to another planet and understand the challenges behind it.

## What it does

Trajectory is an interactive space mission planner that lets users configure every aspect of their journey to the stars. Users can:

- Choose their destination planet from our solar system
- Select spacecraft from real-world rockets (Starship, Falcon Heavy, SLS, New Glenn)
- Set crew size and mission objectives
- Define budget constraints
- Launch their mission and calculate logistics that would take weeks in minutes

The app features 2D visualization, AI-powered recommendations for optimal mission parameters, and real-time validation to ensure configurations are feasible.

## How we built it

### Tech Stack

**Frontend**: Next.js 16 (App Router) with React 19 and TypeScript
- Tailwind CSS v4 for styling
- Custom AI agent using Claude API 
- NASA API connection

**Backend**: Convex as our complete backend solution
- Database for storing user profiles and mission configurations
- Serverless functions for real-time data sync
- JWT validation on every function call

**Assets**: 
- Custom sound effects for immersive audio feedback(soundtracks made by us)
- Canela and Manrope fonts for modern typography
- Images from the Web
- Custom icons and SVGs

### Architecture

We used Convex's reactive data model to sync mission state across components. The mission planner walks users through configuration steps, with each step updating the Convex database in real-time. AI functions analyze the complete mission configuration to provide success probability estimates and resource requirements.

## Challenges we ran into

### AI-Powered Validation

Ensuring mission configurations are realistic required careful calibration of our AI validation logic. We needed to:
- Define realistic parameters for each spacecraft's capabilities
- Calculate fuel requirements based on the rocket equation:
  
  $$ \Delta v = I_{sp} \cdot g_0 \cdot \ln\left(\frac{m_0}{m_f}\right) $$
  
  Where $\Delta v$ is the change in velocity, $I_{sp}$ is specific impulse, $g_0$ is standard gravity, $m_0$ is initial mass, and $m_f$ is final mass.

- Balance between accessibility (not overwhelming users) and accuracy (providing realistic constraints)

### Real-Time State Management

Managing mission state across multiple steps while maintaining a smooth user experience required careful state architecture. We solved this by:
- Using Convex's reactive queries to automatically update UI when mission parameters change
- Implementing optimistic UI updates for instant feedback
- Adding validation at each step to prevent invalid configurations

### Working as a team

It was sometimes hard to work as a team, especially when we disagreed sometimes. Often times we had to compromise, and it definitely helped us learn to work better together.

## Accomplishments that we're proud of

We are especially proud of the chatbot, which successfully explains mission feasibility in a way that feels intuitive rather than overly technical. We are also proud of how we were able to bring together multiple parts of the project, including the interface, animations, and calculations, into a single working system. Another accomplishment was how we handled setbacks, particularly the failed 3D rendering, and were still able to adapt and deliver a complete product within the time limit.

## What we learned


This project taught us the importance of:
- **User Experience in Complex Domains**: Making technical concepts accessible without oversimplifying
- **Reactive Data Patterns**: Leveraging Convex's real-time sync to create fluid interfaces
- **Team Collaboration**: Coordinating across frontend, backend, and asset creation in a hackathon setting

We also gained deep appreciation for the complexity of real space mission planning—and the incredible engineers who make space exploration possible. We learned more about astronomy, especially how different planetary conditions such as gravity, distance, and environment impact space travel. We also applied and reinforced concepts from physics, including motion, force, and energy, to model travel in a simplified way. Beyond the technical knowledge, we learned how important it is to stay flexible, manage time effectively, and adapt quickly when things do not go as planned.



## What's next for Trajectory

We envision expanding Trajectory to include:
- More destinations beyond our solar system
- Detailed mission timeline planning
- Collaborative mission planning for teams
- Integration with real NASA data and APIs

The journey to the stars begins with a single mission, and Trajectory makes that first step accessible to everyone.

