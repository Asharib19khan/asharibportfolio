"use client";

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import { motion, useScroll, useTransform } from 'framer-motion';

function SolidGlassGallery() {
  const { theme } = useTheme();
  const isDark = theme !== 'light';

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
    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  useFrame((state, delta) => {
    // Read scroll directly in the WebGL loop to avoid React re-renders (Fixes massive hanging)
    const currentScrollY = window.scrollY || 0;
    
    const docHeight = typeof document !== 'undefined' ? document.documentElement.scrollHeight : 4000;
    const winHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
    const maxScroll = Math.max(docHeight - winHeight, 1);

    const scrollProgress = Math.min(Math.max(currentScrollY / maxScroll, 0), 1);

    const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const pointerX = (mousePosition.current.x / winWidth) * 2 - 1 || 0;
    const pointerY = -(mousePosition.current.y / winHeight) * 2 + 1 || 0;

    const targetZ = THREE.MathUtils.lerp(30, -50, scrollProgress);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 4, delta);

    const targetX = pointerX * 4;
    const targetY = pointerY * 4;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 4, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 4, delta);

    state.camera.lookAt(0, 0, state.camera.position.z - 20);

    if (lightRef.current) {
      const lx = (pointerX * state.viewport.width) / 2;
      const ly = (pointerY * state.viewport.height) / 2;
      lightRef.current.position.set(lx, ly, state.camera.position.z - 5);
    }

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

    if (groupRef.current) {
      const targetGroupRotX = pointerY * 0.3;
      const targetGroupRotY = pointerX * 0.3;
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetGroupRotX, 3, delta);
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetGroupRotY, 3, delta);
    }
  });

  const glassMaterial = (
    <meshPhysicalMaterial
      color={isDark ? "#050505" : "#ffffff"}
      metalness={isDark ? 1.0 : 0.4}
      roughness={isDark ? 0.05 : 0.1}
      clearcoat={1.0}
      clearcoatRoughness={0.1}
      transparent={true}
      opacity={isDark ? 0.4 : 0.6}
      envMapIntensity={isDark ? 4.0 : 2.0}
    />
  );

  return (
    <group ref={groupRef}>
      <pointLight ref={lightRef} color="#ffffff" intensity={300} distance={40} decay={1.5} />
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

export default function ThreeBackground() {
  const { scrollY } = useScroll();

  const opacityFadeIn = useTransform(scrollY, [0, 400], [0, 0.95]);
  const scaleUp = useTransform(scrollY, [0, 400], [0.8, 1]);

  return (
    <motion.div
      style={{ opacity: opacityFadeIn, scale: scaleUp }}
      className="fixed inset-0 pointer-events-none -z-10"
    >
      <Canvas
        camera={{ position: [0, 0, 30], fov: 45 }}
        dpr={1}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <SolidGlassGallery />
      </Canvas>
    </motion.div>
  );
}
