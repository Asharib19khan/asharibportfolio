"use client";

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';

// Page metrics, refreshed on resize instead of read every frame: reading scrollHeight inside
// the render loop forces a synchronous layout on every frame.
const metrics = { maxScroll: 1, width: 1, height: 1 };
function measure() {
  metrics.maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  metrics.width = window.innerWidth;
  metrics.height = window.innerHeight;
}

/** Compiles the scene's shaders up front, so waking the loop later never stalls a scroll. */
function Precompile() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    gl.compileAsync(scene, camera).catch(() => undefined);
  }, [gl, scene, camera]);
  return null;
}

function SolidGlassGallery() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';

  const groupRef = useRef<THREE.Group>(null);
  const shape2Ref = useRef<THREE.Mesh>(null);
  const shape3Ref = useRef<THREE.Mesh>(null);
  const shape4Ref = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('resize', measure);
    };
  }, []);

  useFrame((state, delta) => {
    // Read scroll directly in the WebGL loop to avoid React re-renders.
    const scrollProgress = Math.min(Math.max((window.scrollY || 0) / metrics.maxScroll, 0), 1);
    const pointerX = (mousePosition.current.x / metrics.width) * 2 - 1 || 0;
    const pointerY = -(mousePosition.current.y / metrics.height) * 2 + 1 || 0;

    const targetZ = THREE.MathUtils.lerp(30, -50, scrollProgress);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 4, delta);
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, pointerX * 4, 4, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, pointerY * 4, 4, delta);
    state.camera.lookAt(0, 0, state.camera.position.z - 20);

    if (lightRef.current) {
      const lx = (pointerX * state.viewport.width) / 2;
      const ly = (pointerY * state.viewport.height) / 2;
      lightRef.current.position.set(lx, ly, state.camera.position.z - 5);
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
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, pointerY * 0.3, 3, delta);
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, pointerX * 0.3, 3, delta);
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

  // Fully transparent at the top of the page: don't render frames nobody can see.
  const [awake, setAwake] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setAwake(y > 16));

  return (
    <motion.div
      style={{ opacity: opacityFadeIn, scale: scaleUp }}
      className="fixed inset-0 pointer-events-none -z-10"
    >
      <Canvas
        frameloop={awake ? "always" : "never"}
        camera={{ position: [0, 0, 30], fov: 45 }}
        dpr={1}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <Precompile />
        <SolidGlassGallery />
      </Canvas>
    </motion.div>
  );
}
