"use client";
/* eslint-disable react-hooks/immutability -- uniforms, textures and materials here are mutable
   GPU state driven from the render loop (standard three.js), not React state. */

import { Component, ReactNode, RefObject, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useOnScreen } from "../../lib/useOnScreen";
import { PROVOKE_EVENT } from "../../lib/android";
import { buildHair, hairMask } from "./androidHair";
import {
  CHASSIS_FRAGMENT_EMISSIVE,
  CHASSIS_FRAGMENT_HEAD,
  CHASSIS_FRAGMENT_MAP,
  CHASSIS_FRAGMENT_ROUGHNESS,
  CHASSIS_VERTEX_BODY,
  CHASSIS_VERTEX_HEAD,
  HAIR_FRAGMENT,
  HAIR_VERTEX,
  NECK_NORMAL,
  LED_FRAGMENT_LIGHTS,
  SKIN_FRAGMENT_EMISSIVE,
  SKIN_FRAGMENT_HEAD,
  SKIN_FRAGMENT_MAP,
  SKIN_FRAGMENT_REVEAL,
  SKIN_VERTEX_BODY,
  SKIN_VERTEX_HEAD,
} from "./androidShaders";

/**
 * Hero android, after Detroit: Become Human's skin retraction. A photoscanned head with grown
 * hair whose skin dissolves tile by tile around the cursor to show a white chassis, with lit
 * optics under the closed eyelids and a temple LED that reports state: blue idle, yellow while
 * you're "scanning" it, red when provoked. The head turns on its neck; the shoulders stay put.
 *
 * Head scan: "Infinite, 3D Head Scan" by Lee Perry-Smith, CC BY 3.0 (credited on the page).
 */

const BASE = "/models/android/";
const MODEL = `${BASE}LeePerrySmith.glb`;
const COLOR_MAP = `${BASE}Map-COL.jpg`;
const NORMAL_MAP = `${BASE}Infinite-Level_02_Tangent_SmoothUV.jpg`;

const LED_IDLE = new THREE.Color("#2b8fff");
const LED_FOCUS = new THREE.Color("#ffc21a");
const LED_STRESS = new THREE.Color("#ff2626");

// All distances below are in the scan's own units (the head is ~8 units tall, +z = face).
const PIVOT = new THREE.Vector3(-0.05, -0.6, -0.4); // top of the neck column
const EYES_X = [-0.7, 0.5];
const EYES_Y = 1.68;
const CURSOR_RADIUS = 1.05;
const SCAR_RADIUS = 0.95;
const STRESS_TIME = 1.8;
const MAX_YAW = 0.5;
const MAX_PITCH = 0.22;

export type AndroidPointer = {
  ndc: THREE.Vector2; // pointer over the canvas, -1..1
  inside: boolean;
  pressed: boolean;
};

type Pose = {
  look: THREE.Vector2; // pointer anywhere in the window, -1..1: where the head looks
  yaw: number;
  pitch: number;
  hovering: boolean;
  cursorTarget: THREE.Vector3;
  provokedAt: number;
  pendingProvoke: boolean;
  reduced: boolean;
};

function Android({ pointer, onReady }: { pointer: RefObject<AndroidPointer>; onReady: () => void }) {
  const gltf = useGLTF(MODEL);
  const [colorMap, normalMap] = useTexture([COLOR_MAP, NORMAL_MAP]);
  const { viewport, camera, gl, scene } = useThree();

  const skin = useRef<THREE.Mesh>(null);
  const neck = useRef<THREE.Group>(null);
  const ledLight = useRef<THREE.PointLight>(null);

  // Our own copy of the scan, tagged per vertex with hair coverage for the scalp shading.
  const geometry = useMemo(() => {
    let source: THREE.BufferGeometry | null = null;
    gltf.scene.traverse((o) => {
      if (!source && (o as THREE.Mesh).isMesh) source = (o as THREE.Mesh).geometry;
    });
    const geo = (source as unknown as THREE.BufferGeometry).clone();
    const pos = geo.attributes.position;
    const cover = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) cover[i] = hairMask(pos.getX(i), pos.getY(i), pos.getZ(i));
    geo.setAttribute("aHair", new THREE.BufferAttribute(cover, 1));
    return geo;
  }, [gltf]);

  // Fewer strands on small canvases (phones); the hair still reads as full at that size.
  // Decided once (not from the live canvas size) so the hair is never generated twice.
  const strandCount = useMemo(() => (window.matchMedia("(min-width: 768px)").matches ? 72000 : 32000), []);
  const hair = useMemo(() => buildHair(geometry, strandCount), [geometry, strandCount]);

  // Rest-pose stand-in for raycasts: the cursor is mapped back into rest space before testing.
  const probe = useMemo(() => new THREE.Mesh(geometry, new THREE.MeshBasicMaterial()), [geometry]);

  // LED on the right temple, the permanent reveal over the right cheek and eye, and the eyes
  // themselves, all found by casting rays at the real surface instead of hand-placed numbers.
  const anchors = useMemo(() => {
    const ray = new THREE.Raycaster();
    const hit = (origin: THREE.Vector3, dir: THREE.Vector3) => {
      ray.set(origin, dir.normalize());
      return ray.intersectObject(probe, false)[0];
    };
    // Aim at the temple just behind the outer corner of the eye, where Detroit puts it: far
    // enough forward to read from the front, far enough back to stay off the face.
    const temple = hit(new THREE.Vector3(-5.38, 2.2, 4.35), new THREE.Vector3(0.8, -0.05, -0.6));
    const cheek = hit(new THREE.Vector3(-1.25, 1.2, 9), new THREE.Vector3(0, 0, -1));
    const eye = (x: number) =>
      hit(new THREE.Vector3(x, EYES_Y, 9), new THREE.Vector3(0, 0, -1))?.point.clone() ?? new THREE.Vector3(x, EYES_Y, 1.95);
    const templeNormal = temple?.face?.normal.clone() ?? new THREE.Vector3(-0.85, 0.1, 0.5).normalize();
    const ledPosition = temple ? temple.point.clone() : new THREE.Vector3(-1.38, 1.95, 1.35);
    return {
      ledPosition,
      ledNormal: templeNormal,
      ledLightPosition: ledPosition.clone().addScaledVector(templeNormal, 0.35),
      scar: cheek ? cheek.point.clone() : new THREE.Vector3(-1.25, 1.2, 1.6),
      eyeL: eye(EYES_X[0]),
      eyeR: eye(EYES_X[1]),
    };
  }, [probe]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCursor: { value: new THREE.Vector3(0, 0, 50) },
      uCursorR: { value: 0 },
      uScar: { value: anchors.scar.clone() },
      uScarR: { value: SCAR_RADIUS },
      uGlow: { value: LED_IDLE.clone() },
      uEdge: { value: 0.22 },
      uPivot: { value: PIVOT.clone() },
      uYaw: { value: 0 },
      uPitch: { value: 0 },
      uEyeL: { value: anchors.eyeL },
      uEyeR: { value: anchors.eyeR },
      uOptic: { value: 1.6 },
      uLedPos: { value: anchors.ledPosition },
      uLedNrm: { value: anchors.ledNormal },
      uLedI: { value: 1 },
    }),
    [anchors],
  );

  const materials = useMemo(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace;
    colorMap.anisotropy = 8;

    // Standard (not physical) skin: the sheen and clearcoat layers were barely visible but cost
    // several extra lighting evaluations per pixel, which integrated GPUs feel.
    const skinMat = new THREE.MeshStandardMaterial({
      map: colorMap,
      normalMap,
      normalScale: new THREE.Vector2(0.8, 0.8),
      roughness: 0.52,
    });
    skinMat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", SKIN_VERTEX_HEAD)
        .replace("#include <beginnormal_vertex>", NECK_NORMAL)
        .replace("#include <begin_vertex>", SKIN_VERTEX_BODY);
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", SKIN_FRAGMENT_HEAD)
        .replace("#include <clipping_planes_fragment>", SKIN_FRAGMENT_REVEAL)
        .replace("#include <map_fragment>", SKIN_FRAGMENT_MAP)
        .replace("#include <lights_physical_fragment>", LED_FRAGMENT_LIGHTS)
        .replace("#include <emissivemap_fragment>", SKIN_FRAGMENT_EMISSIVE);
    };
    skinMat.customProgramCacheKey = () => "android-skin";

    const chassisMat = new THREE.MeshPhysicalMaterial({
      color: "#eceef0",
      roughness: 0.3,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      normalMap,
      normalScale: new THREE.Vector2(0.12, 0.12),
    });
    chassisMat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", CHASSIS_VERTEX_HEAD)
        .replace("#include <beginnormal_vertex>", NECK_NORMAL)
        .replace("#include <begin_vertex>", CHASSIS_VERTEX_BODY);
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", CHASSIS_FRAGMENT_HEAD)
        .replace("#include <map_fragment>", CHASSIS_FRAGMENT_MAP)
        .replace("#include <roughnessmap_fragment>", CHASSIS_FRAGMENT_ROUGHNESS)
        .replace("#include <lights_physical_fragment>", LED_FRAGMENT_LIGHTS)
        .replace("#include <emissivemap_fragment>", CHASSIS_FRAGMENT_EMISSIVE);
    };
    chassisMat.customProgramCacheKey = () => "android-chassis";

    // Hair shares the pose and reveal uniforms by reference, plus its own lighting rig that
    // mirrors the scene's lights (key, cool rim, warm fill).
    // Blended rather than opaque: wispy tips and fine strands are what make it read as hair.
    const hairMat = new THREE.ShaderMaterial({
      vertexShader: HAIR_VERTEX,
      fragmentShader: HAIR_FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        ...uniforms,
        uKeyDir: { value: new THREE.Vector3(-3.5, 3, 5).normalize() },
        uKeyColor: { value: new THREE.Color("#fff2e2").multiplyScalar(2.1) },
        uRimDir: { value: new THREE.Vector3(4, 2.5, -3).normalize() },
        uRimColor: { value: new THREE.Color("#a9d0ff").multiplyScalar(1.5) },
        uFillDir: { value: new THREE.Vector3(2.5, -1.5, 4).normalize() },
        uFillColor: { value: new THREE.Color("#ffd9c7").multiplyScalar(0.35) },
        uAmbient: { value: new THREE.Color("#ffffff").multiplyScalar(0.28) },
        uRootColor: { value: new THREE.Color("#0b0807") },
        uTipColor: { value: new THREE.Color("#2b2019") },
      },
    });

    return { skinMat, chassisMat, hairMat };
  }, [colorMap, normalMap, uniforms]);

  useEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials]);
  useEffect(() => () => hair.dispose(), [hair]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  // Compile the custom shaders in the background (KHR_parallel_shader_compile) before showing
  // the head, so the first visible frame never stalls the page on shader compilation.
  const [compiled, setCompiled] = useState(false);
  useEffect(() => {
    let alive = true;
    gl.compileAsync(scene, camera)
      .catch(() => undefined)
      .then(() => {
        if (alive) setCompiled(true);
      });
    return () => {
      alive = false;
    };
  }, [gl, scene, camera, materials, hair]);
  useEffect(() => {
    if (compiled) onReady();
  }, [compiled, onReady]);

  const pose = useRef<Pose>({
    look: new THREE.Vector2(),
    yaw: 0,
    pitch: 0,
    hovering: false,
    cursorTarget: new THREE.Vector3(),
    provokedAt: -Infinity,
    pendingProvoke: false,
    reduced: false,
  });

  useEffect(() => {
    const r = pose.current;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    r.reduced = mql.matches;
    const onMotion = () => (r.reduced = mql.matches);
    const onMove = (e: PointerEvent) =>
      r.look.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    const onProvoke = () => (r.pendingProvoke = true);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener(PROVOKE_EVENT, onProvoke);
    mql.addEventListener("change", onMotion);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener(PROVOKE_EVENT, onProvoke);
      mql.removeEventListener("change", onMotion);
    };
  }, []);

  const scratch = useMemo(
    () => ({
      raycaster: new THREE.Raycaster(),
      inverse: new THREE.Matrix4(),
      unpose: new THREE.Matrix4(),
      euler: new THREE.Euler(0, 0, 0, "YXZ"),
      ledColor: LED_IDLE.clone(),
    }),
    [],
  );

  /** Where on the face (in rest space) the pointer is, or null if it's off the head. */
  const pick = (ndc: THREE.Vector2) => {
    if (!skin.current) return null;
    const { raycaster, inverse, unpose, euler } = scratch;
    raycaster.setFromCamera(ndc, camera);
    // World → scan space, then undo the neck pose (the head is rigid above the neck).
    raycaster.ray.applyMatrix4(inverse.copy(skin.current.matrixWorld).invert());
    unpose.makeRotationFromEuler(euler.set(pose.current.pitch, pose.current.yaw, 0, "YXZ")).transpose();
    raycaster.ray.origin.sub(PIVOT).applyMatrix4(unpose).add(PIVOT);
    raycaster.ray.direction.transformDirection(unpose);
    return raycaster.intersectObject(probe, false)[0]?.point ?? null;
  };

  useFrame((state, delta) => {
    const r = pose.current;
    const p = pointer.current;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const damp = THREE.MathUtils.damp;

    // Pointer over the canvas: find the spot on the face under it.
    const hit = p.inside || p.pressed ? pick(p.ndc) : null;
    const wasHovering = r.hovering;
    r.hovering = !!hit;
    if (hit) {
      r.cursorTarget.copy(hit);
      // Jump instead of sweeping across the face when the reveal (re)appears.
      if (!wasHovering && uniforms.uCursorR.value < 0.05) uniforms.uCursor.value.copy(hit);
    }
    if (p.pressed) {
      p.pressed = false;
      if (hit) r.pendingProvoke = true;
    }

    if (r.pendingProvoke) {
      r.pendingProvoke = false;
      r.provokedAt = t;
    }
    const sinceProvoke = t - r.provokedAt;
    const stressed = sinceProvoke < STRESS_TIME;
    const burst = stressed ? Math.sin(Math.min(sinceProvoke / 0.9, 1) * Math.PI) : 0;

    // Neck: look toward the pointer, with a slow idle drift so it never feels frozen.
    const idleYaw = r.reduced ? 0 : Math.sin(t * 0.31) * 0.06 + Math.sin(t * 0.13) * 0.04;
    const idlePitch = r.reduced ? 0 : Math.sin(t * 0.47) * 0.025;
    const shake = stressed && !r.reduced ? Math.sin(t * 40) * 0.025 * (1 - sinceProvoke / STRESS_TIME) : 0;
    const yawTarget = THREE.MathUtils.clamp(r.look.x * 0.6, -MAX_YAW, MAX_YAW) + idleYaw;
    const pitchTarget = THREE.MathUtils.clamp(-r.look.y * 0.28, -MAX_PITCH, MAX_PITCH) + idlePitch;
    r.yaw = damp(r.yaw, yawTarget, 3.2, dt);
    r.pitch = damp(r.pitch, pitchTarget, 3.2, dt);
    uniforms.uYaw.value = r.yaw + shake;
    uniforms.uPitch.value = r.pitch;
    neck.current?.rotation.set(r.pitch, r.yaw + shake, 0, "YXZ");

    // Skin reveal.
    uniforms.uTime.value = r.reduced ? 0 : t;
    uniforms.uCursor.value.lerp(r.cursorTarget, 1 - Math.exp(-14 * dt));
    uniforms.uCursorR.value = damp(uniforms.uCursorR.value, r.hovering ? CURSOR_RADIUS * (1 + burst * 0.6) : 0, 7, dt);
    const breathe = r.reduced ? 0 : Math.sin(t * 0.8) * 0.06;
    uniforms.uScarR.value = damp(uniforms.uScarR.value, SCAR_RADIUS + breathe + burst * 1.1, 6, dt);

    // LED, edge glow and optics share one state colour.
    const target = stressed ? LED_STRESS : r.hovering ? LED_FOCUS : LED_IDLE;
    scratch.ledColor.lerp(target, 1 - Math.exp(-8 * dt));
    const pulse = r.reduced ? 1 : stressed ? 1.2 + 0.6 * Math.sin(t * 18) : 1 + 0.25 * Math.sin(t * 2.2);
    uniforms.uGlow.value.copy(scratch.ledColor);
    uniforms.uOptic.value = damp(uniforms.uOptic.value, stressed ? 6 : r.hovering ? 3.6 : 2.6, 6, dt);
    uniforms.uLedI.value = pulse;
    if (ledLight.current) {
      ledLight.current.color.copy(scratch.ledColor);
      ledLight.current.intensity = 0.6 * pulse;
    }
  });

  const fit = Math.min(1, viewport.width / 3.1);
  const unpivot = useMemo(() => PIVOT.clone().negate(), []);

  return (
    <group scale={fit} position={[0, -0.15, 0]}>
      <group scale={0.37}>
        {/* Chassis sits just inside the skin and shows through wherever the skin retracts. */}
        <mesh geometry={geometry} material={materials.chassisMat} renderOrder={1} visible={compiled} />
        <mesh ref={skin} geometry={geometry} material={materials.skinMat} visible={compiled} />
        <lineSegments geometry={hair} material={materials.hairMat} frustumCulled={false} visible={compiled} />
        {/* The LED itself is drawn into the skin by the shader; this is only its light on the
            face, riding the same neck pose as the shader-deformed head. */}
        <group ref={neck} position={PIVOT}>
          <group position={unpivot}>
            <pointLight ref={ledLight} position={anchors.ledLightPosition} distance={2.2} decay={2} intensity={0.6} />
          </group>
        </group>
      </group>
    </group>
  );
}

class Fallback extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function AndroidHead({ className, onReady }: { className?: string; onReady: () => void }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(wrapper);
  const pointer = useRef<AndroidPointer>({ ndc: new THREE.Vector2(), inside: false, pressed: false });
  // Starts at the screen's own density (at least 1.25x, so strands land finer than a pixel on
  // standard screens; at most 2x). Measured on Intel UHD: 1x 13 ms, 1.25x 17 ms, 1.5x 22 ms per
  // frame, so it steps down automatically if the machine can't hold the frame rate.
  const [dpr, setDpr] = useState(() => Math.min(2, Math.max(1.25, window.devicePixelRatio || 1)));

  const track = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointer.current.ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    pointer.current.inside = true;
  };
  const leave = () => {
    pointer.current.inside = false;
  };

  return (
    <div
      ref={wrapper}
      aria-hidden="true"
      className={className}
      onPointerMove={track}
      onPointerDown={(e) => {
        track(e);
        pointer.current.pressed = true;
      }}
      onPointerLeave={leave}
      onPointerCancel={leave}
      style={{
        maskImage: "linear-gradient(to bottom, black 50%, transparent 80%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 80%)",
      }}
    >
      <Canvas
        frameloop={onScreen ? "always" : "never"}
        dpr={dpr}
        camera={{ position: [0, 0.2, 7.2], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        fallback={null}
      >
        <ambientLight intensity={0.12} />
        <directionalLight position={[-3.5, 3, 5]} intensity={2.1} color="#fff2e2" />
        <directionalLight position={[4, 2.5, -3]} intensity={2.6} color="#a9d0ff" />
        <directionalLight position={[2.5, -1.5, 4]} intensity={0.35} color="#ffd9c7" />
        <PerformanceMonitor
          flipflops={3}
          onIncline={() => setDpr((d) => Math.min(2, d + 0.25))}
          onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
          onFallback={() => setDpr(1)}
        />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={2} position={[0, 5, 3]} scale={[8, 2, 1]} rotation-x={Math.PI / 2} />
          <Lightformer form="rect" intensity={1.4} position={[-5, 1, 2]} scale={[3, 6, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={1.1} position={[5, 1, 1]} scale={[3, 6, 1]} rotation-y={-Math.PI / 2} />
          <Lightformer form="rect" intensity={0.8} position={[0, 0, 6]} scale={[6, 3, 1]} />
        </Environment>
        <Fallback>
          <Suspense fallback={null}>
            <Android pointer={pointer} onReady={onReady} />
          </Suspense>
        </Fallback>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL);
