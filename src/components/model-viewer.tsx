"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import * as THREE from "three";

interface ModelViewerProps {
  modelPath: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  className?: string;
}

function Model({ modelPath, autoRotate = true, rotationSpeed = 0.5 }: { modelPath: string; autoRotate?: boolean; rotationSpeed?: number }) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <group ref={modelRef}>
      <primitive object={scene} />
    </group>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#87CEFA]" />
    </Html>
  );
}

export function ModelViewer({ modelPath, autoRotate = true, rotationSpeed = 0.5, className }: ModelViewerProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className={className}
    >
      <Suspense fallback={<LoadingFallback />}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <Environment preset="night" />
        
        <Model modelPath={modelPath} autoRotate={autoRotate} rotationSpeed={rotationSpeed} />
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={10}
          autoRotate={false}
        />
      </Suspense>
    </Canvas>
  );
}
