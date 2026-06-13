"use client";

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

function SolidGlassGallery({ scrollY }: { scrollY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const shape1Ref = useRef<THREE.Mesh>(null);
  const shape2Ref = useRef<THREE.Mesh>(null);
  const shape3Ref = useRef<THREE.Mesh>(null);
  const shape4Ref = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  useFrame((state, delta) => {
    const docHeight = typeof document !== 'undefined' ? document.documentElement.scrollHeight : 4000;
    const winHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
    const maxScroll = Math.max(docHeight - winHeight, 1);
    
    const scrollProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1); // 0 to 1

    // Normalize mouse position to -1 to +1 range
    const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const pointerX = (mousePosition.current.x / winWidth) * 2 - 1 || 0;
    const pointerY = -(mousePosition.current.y / winHeight) * 2 + 1 || 0;

    // 1. Cinematic Zoom: Fly through the gallery of solid objects
    const targetZ = THREE.MathUtils.lerp(30, -50, scrollProgress);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 4, delta);
    
    // Smooth X/Y parallax based on global mouse
    const targetX = pointerX * 4;
    const targetY = pointerY * 4;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 4, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 4, delta);
    
    // Look straight ahead
    state.camera.lookAt(0, 0, state.camera.position.z - 20);

    // 2. Cinematic Cursor Light
    if (lightRef.current) {
      const lx = (pointerX * state.viewport.width) / 2;
      const ly = (pointerY * state.viewport.height) / 2;
      lightRef.current.position.set(lx, ly, state.camera.position.z - 5);
    }
    
    // 3. Dynamic Shape Rotations (Solid Objects)
    if (shape1Ref.current) {
      shape1Ref.current.rotation.y += delta * 0.15;
      shape1Ref.current.rotation.x += delta * 0.1;
    }
    if (shape2Ref.current) {
      shape2Ref.current.rotation.y += delta * 0.2;
      shape2Ref.current.rotation.z += delta * 0.15;
    }
    if (shape3Ref.current) {
      shape3Ref.current.rotation.x += delta * 0.15;
      shape3Ref.current.rotation.z += delta * 0.2;
    }
    if (shape4Ref.current) {
      shape4Ref.current.rotation.y -= delta * 0.1;
      shape4Ref.current.rotation.x -= delta * 0.1;
    }

    // 4. Mouse-Driven Group Panning (Tilt the entire gallery based on cursor)
    if (groupRef.current) {
      const targetGroupRotX = pointerY * 0.3; // Look up/down
      const targetGroupRotY = pointerX * 0.3; // Look left/right
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetGroupRotX, 3, delta);
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetGroupRotY, 3, delta);
    }
  });

  // Reusable ultra-premium glass material (True UI Refraction)
  const glassMaterial = (
    <meshPhysicalMaterial 
      color="#050505"
      metalness={0.9}
      roughness={0.0} // Perfect smoothness for crystal clear refraction
      clearcoat={1.0}
      clearcoatRoughness={0.0}
      transmission={1.0} // 100% true transmission
      ior={2.0} // Extremely high Index of Refraction for massive optical distortion
      thickness={5.0} // Deep volume for the light to bend through
      envMapIntensity={2.5} // Bright photorealistic reflections
    />
  );

  return (
    <group ref={groupRef}>
      {/* High-intensity cursor spotlight */}
      <pointLight ref={lightRef} color="#ffffff" intensity={300} distance={40} decay={1.5} />
      
      {/* Very subtle blue ambient fill */}
      <ambientLight intensity={0.1} color="#4466ff" />

      <mesh ref={shape2Ref} position={[-2.5, 0, -5]}>
        <torusKnotGeometry args={[3, 1, 100, 16]} />
        {glassMaterial}
      </mesh>

      <mesh ref={shape3Ref} position={[3, 0, -25]}>
        <torusGeometry args={[4, 1.5, 32, 48]} />
        {glassMaterial}
      </mesh>

      <mesh ref={shape4Ref} position={[-1.5, 0, -45]}>
        <sphereGeometry args={[5, 32, 32]} />
        {glassMaterial}
      </mesh>
    </group>
  );
}

import { motion, useScroll, useTransform } from 'framer-motion';

export default function ThreeBackground() {
  const [scrollYValue, setScrollYValue] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const { scrollY } = useScroll();
  
  // Crossfade: ThreeBackground starts completely invisible (0) and fades in as you scroll down
  const opacityFadeIn = useTransform(scrollY, [0, 400], [0, 0.95]);
  const scaleUp = useTransform(scrollY, [0, 400], [0.8, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollYValue(window.scrollY);
    };
    const checkSize = () => setIsDesktop(window.innerWidth >= 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('resize', checkSize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isDesktop) {
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top_right,rgba(68,102,255,0.15)_0%,transparent_50%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
    );
  }

  return (
    <motion.div 
      style={{ opacity: opacityFadeIn, scale: scaleUp }}
      className="fixed inset-0 pointer-events-none -z-10"
    >
      <Canvas 
        camera={{ position: [0, 0, 30], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <SolidGlassGallery scrollY={scrollYValue} />
        <Environment preset="city" />
      </Canvas>
    </motion.div>
  );
}
