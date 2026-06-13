"use client";

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Sky, useDepthBuffer } from '@react-three/drei';
import { Physics, useBox, usePlane, useCylinder } from '@react-three/cannon';
import * as THREE from 'three';
import gsap from 'gsap';

// --------------------------------------------------------
// THE VISUAL ROCKET MESH
// --------------------------------------------------------
function RealisticRocketMesh() {
  const titaniumMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#f0f0f0', metalness: 0.8, roughness: 0.2, clearcoat: 1 }), []);
  const darkMetalMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#222222', metalness: 0.9, roughness: 0.4, clearcoat: 0.5 }), []);
  const goldMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#ffd700', metalness: 1, roughness: 0.1 }), []);

  return (
    <group>
      {/* NOSE */}
      <group position={[0, 6.5, 0]}>
        <mesh>
          <coneGeometry args={[1.2, 3, 64]} />
          <primitive object={titaniumMaterial} />
        </mesh>
      </group>

      {/* BODY */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 10, 64]} />
        <primitive object={titaniumMaterial} />
      </mesh>
      
      {/* GRID FINS */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={`fin-${i}`} position={[Math.cos(i * Math.PI / 2) * 1.3, 4, Math.sin(i * Math.PI / 2) * 1.3]} rotation={[0, -i * Math.PI / 2, 0]}>
          <boxGeometry args={[0.8, 1, 0.05]} />
          <primitive object={darkMetalMaterial} />
        </mesh>
      ))}

      {/* ENGINES */}
      <group position={[0, -5.5, 0]}>
        <mesh>
          <cylinderGeometry args={[1.2, 0.9, 1, 64]} />
          <primitive object={darkMetalMaterial} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={`engine-${i}`} position={[Math.cos(i * Math.PI * 2 / 3) * 0.4, -0.8, Math.sin(i * Math.PI * 2 / 3) * 0.4]}>
            <cylinderGeometry args={[0.3, 0.5, 0.6, 32]} />
            <primitive object={goldMaterial} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// --------------------------------------------------------
// CUSTOM GLSL SOFT PARTICLES (EXHAUST)
// --------------------------------------------------------
function SoftExhaustParticles({ isThrusting }: { isThrusting: boolean }) {
  const depthBuffer = useDepthBuffer({ size: 512 });
  const { size, camera } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // Initialize random particle positions at the base of the rocket
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(500 * 3);
    const vel = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2; // x
      pos[i * 3 + 1] = -7 - Math.random() * 5; // y (starts below engine)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2; // z
      
      vel[i * 3] = (Math.random() - 0.5) * 5; // vx
      vel[i * 3 + 1] = -10 - Math.random() * 20; // vy (shoot downwards)
      vel[i * 3 + 2] = (Math.random() - 0.5) * 5; // vz
    }
    return [pos, vel];
  }, []);

  const uniforms = useMemo(() => ({
    depthMap: { value: depthBuffer },
    resolution: { value: new THREE.Vector2(size.width, size.height) },
    cameraNear: { value: camera.near },
    cameraFar: { value: camera.far },
    opacity: { value: 0.0 }
  }), [depthBuffer, size, camera]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.opacity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.opacity.value,
        isThrusting ? 1.0 : 0.0,
        0.1
      );
    }
    if (pointsRef.current && isThrusting) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 500; i++) {
        // Move particles downwards
        pos[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        pos[i * 3] += velocities[i * 3] * delta;
        pos[i * 3 + 2] += velocities[i * 3 + 2] * delta;

        // Reset if they fall too far below the rocket local space
        if (pos[i * 3 + 1] < -20) {
          pos[i * 3 + 1] = -7;
          pos[i * 3] = (Math.random() - 0.5) * 2;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const vertexShader = `
    varying float vDistance;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vDistance = -mvPosition.z;
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = (1500.0 / vDistance);
    }
  `;

  const fragmentShader = `
    uniform sampler2D depthMap;
    uniform vec2 resolution;
    uniform float cameraNear;
    uniform float cameraFar;
    uniform float opacity;
    
    // Linearize depth
    float linearize_depth(float d, float zNear, float zFar) {
        return zNear * zFar / (zFar + d * (zNear - zFar));
    }

    void main() {
        vec2 screenUv = gl_FragCoord.xy / resolution;
        
        // Depth Testing for Soft Particles
        float sceneDepth = texture2D(depthMap, screenUv).r;
        float linearSceneDepth = linearize_depth(sceneDepth, cameraNear, cameraFar);
        float linearFragmentDepth = linearize_depth(gl_FragCoord.z, cameraNear, cameraFar);
        
        // Soft Intersection logic (fades out exactly at the ground plane intersection)
        float depthDiff = linearSceneDepth - linearFragmentDepth;
        float fade = clamp(depthDiff * 5.0, 0.0, 1.0);
        
        // Draw fire/smoke circular gradient
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        float alpha = smoothstep(0.5, 0.2, dist) * fade * opacity;
        
        // Core is bright yellow/white, outer is orange/smoke
        vec3 color = mix(vec3(1.0, 0.2, 0.0), vec3(1.0, 0.8, 0.0), smoothstep(0.5, 0.0, dist));
        
        gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={500} array={positions} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial 
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// --------------------------------------------------------
// PHYSICS ENTITIES
// --------------------------------------------------------
function PhysicsRocket({ setAltitude, isThrusting }: { setAltitude: (y: number) => void, isThrusting: boolean }) {
  // Rocket body in Cannon.js (1000kg)
  const [ref, api] = useCylinder(() => ({
    mass: 1000,
    position: [0, 8, 0], // Start slightly above pad to drop down
    args: [1.2, 1.2, 10, 16], 
    linearDamping: 0.1, // Air resistance
    angularDamping: 0.9, // Keep it from spinning wildly
  }));

  useFrame((state) => {
    if (isThrusting) {
      // Upward Force (Thrust > Gravity * Mass)
      // Gravity is 9.81. Mass is 1000. Required thrust to hover = 9810. 
      // 25000 gives strong acceleration
      api.applyLocalForce([0, 25000, 0], [0, 0, 0]);
    }
    
    // Auto-stabilization is handled by angularDamping: 0.9
    // Sync UI Altitude and Camera Chase
    if (ref.current) {
      const pos = ref.current.position;
      setAltitude(Math.max(0, Math.floor(pos.y)));
      
      // Cinematic Chase Camera (Follows the physics body on Y axis)
      state.camera.position.lerp(new THREE.Vector3(pos.x, pos.y + 5, pos.z + 35), 0.1);
      state.camera.lookAt(pos.x, pos.y + 10, pos.z);
    }
  });

  return (
    <group ref={ref as any}>
      <RealisticRocketMesh />
      <SoftExhaustParticles isThrusting={isThrusting} />
    </group>
  );
}

function GroundLaunchpad() {
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [0, -2, 0], // Just below origin
    args: [100, 4, 100], // Huge solid box for ground
  }));

  return (
    <mesh ref={ref as any} receiveShadow>
      <boxGeometry args={[100, 4, 100]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
    </mesh>
  );
}

// --------------------------------------------------------
// MAIN COMPONENT & UI
// --------------------------------------------------------
export default function ThreeScene() {
  const [altitude, setAltitude] = useState(0);
  const [isThrusting, setIsThrusting] = useState(false);
  const [orbitAchieved, setOrbitAchieved] = useState(false);

  // Keyboard controls mapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsThrusting(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsThrusting(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // GSAP Cinematic Transition when passing 2000m
  useEffect(() => {
    if (altitude > 2000 && !orbitAchieved) {
      setOrbitAchieved(true);
      gsap.to('.ui-overlay', { opacity: 0, duration: 2 });
      gsap.to('.cinematic-title', { opacity: 1, duration: 4, delay: 2 });
    }
  }, [altitude, orbitAchieved]);

  return (
    <div className="fixed inset-0 w-screen h-screen -z-10 bg-[#020205]">
      <Canvas 
        camera={{ position: [0, 5, 35], fov: 45 }}
        gl={{ antialias: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[20, 50, 20]} intensity={2} color="#ffffff" castShadow />
        
        {/* The Sky dims as you fly up based on altitude */}
        <color attach="background" args={[orbitAchieved ? '#000000' : '#4FA1E0']} />
        
        {/* Cannon.js Physics Engine */}
        <Physics gravity={[0, -9.81, 0]}>
          <PhysicsRocket setAltitude={setAltitude} isThrusting={isThrusting} />
          <GroundLaunchpad />
        </Physics>
        
        <Environment preset="city" />
      </Canvas>

      {/* Vue.js Style HTML UI Overlay */}
      <div className="ui-overlay absolute inset-0 pointer-events-none p-12 flex flex-col justify-between">
        <div className="text-white font-mono text-xl tracking-widest uppercase">
          Altitude: <span className="text-4xl font-bold ml-4">{altitude} m</span>
        </div>
        
        <div className="text-center pb-20">
          <div className={`inline-block px-8 py-4 border-2 rounded-full font-heading tracking-[0.2em] transition-colors duration-300 ${isThrusting ? 'border-[#ff5500] text-[#ff5500] bg-[#ff5500]/10' : 'border-white/50 text-white/50'}`}>
            HOLD [SPACE] TO IGNITE THRUSTERS
          </div>
        </div>
      </div>

      {/* Cinematic End Screen */}
      <div className="cinematic-title absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
        <h1 className="text-4xl md:text-6xl font-heading text-white tracking-[0.4em] font-light text-center px-4" style={{ textShadow: '0 0 30px rgba(255,255,255,0.8)' }}>
          ORBIT ACHIEVED
        </h1>
      </div>
    </div>
  );
}
