"use client";

import { RefObject, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useOnScreen } from "../../lib/useOnScreen";
import { JAB_EVENT } from "../../lib/bot";

/**
 * An original sparring robot in the spirit of Real Steel's "shadow" bots: it mirrors the
 * visitor's cursor with its head and shoulders, and throws a jab on click/tap (or via the
 * "bot:jab" window event, which the keyboard-accessible button in the hero dispatches).
 * Built from primitives, so there is no model download and no Spline runtime.
 */

type Rig = {
  look: THREE.Vector2; // pointer in -1..1
  jabSide: 1 | -1;
  jabStart: number; // clock time, -1 = idle
  pendingJab: boolean;
  reduced: boolean;
};

const ACCENT = "#ff7a2f";
const JAB_TIME = 0.46;

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function jabCurve(p: number) {
  if (p <= 0 || p >= 1) return 0;
  const strike = 0.26;
  return p < strike ? easeOutCubic(p / strike) : 1 - easeInOutCubic((p - strike) / (1 - strike));
}

function useMaterials() {
  const mats = useMemo(
    () => ({
      steel: new THREE.MeshStandardMaterial({ color: "#a3a8b0", metalness: 0.95, roughness: 0.3 }),
      gunmetal: new THREE.MeshStandardMaterial({ color: "#3b3f45", metalness: 0.88, roughness: 0.4 }),
      joint: new THREE.MeshStandardMaterial({ color: "#17191c", metalness: 0.5, roughness: 0.65 }),
      visor: new THREE.MeshStandardMaterial({ color: "#060607", metalness: 0.3, roughness: 0.5 }),
      glow: new THREE.MeshBasicMaterial({ color: ACCENT, toneMapped: false }),
    }),
    [],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  return mats;
}

type Mats = ReturnType<typeof useMaterials>;

function Arm({
  side,
  mats,
  upperRef,
  foreRef,
}: {
  side: 1 | -1;
  mats: Mats;
  upperRef: RefObject<THREE.Group | null>;
  foreRef: RefObject<THREE.Group | null>;
}) {
  return (
    <group ref={upperRef} position={[side * 1.22, 1.95, 0]}>
      <mesh material={mats.joint}>
        <sphereGeometry args={[0.34, 24, 24]} />
      </mesh>
      <RoundedBox args={[0.64, 0.34, 0.72]} radius={0.14} smoothness={4} position={[side * 0.06, 0.16, 0]} rotation={[0, 0, side * -0.3]} material={mats.steel} />
      <mesh position={[0, -0.5, 0]} material={mats.gunmetal}>
        <capsuleGeometry args={[0.19, 0.6, 8, 16]} />
      </mesh>
      <mesh position={[0, -0.48, 0]} material={mats.steel}>
        <cylinderGeometry args={[0.235, 0.215, 0.34, 24]} />
      </mesh>

      <group ref={foreRef} position={[0, -0.95, 0]}>
        <mesh material={mats.joint}>
          <sphereGeometry args={[0.215, 20, 20]} />
        </mesh>
        <mesh position={[0, -0.42, 0]} material={mats.gunmetal}>
          <capsuleGeometry args={[0.2, 0.5, 8, 16]} />
        </mesh>
        <RoundedBox args={[0.38, 0.46, 0.38]} radius={0.09} smoothness={4} position={[0, -0.46, 0]} material={mats.steel} />
        <group position={[0, -0.93, 0]}>
          <RoundedBox args={[0.44, 0.4, 0.46]} radius={0.12} smoothness={4} material={mats.steel} />
          <RoundedBox args={[0.46, 0.1, 0.42]} radius={0.04} smoothness={3} position={[0, -0.19, 0]} material={mats.joint} />
          <RoundedBox args={[0.12, 0.26, 0.18]} radius={0.05} smoothness={3} position={[-side * 0.24, 0.02, 0.1]} material={mats.gunmetal} />
        </group>
      </group>
    </group>
  );
}

function Head({ mats, eyesRef }: { mats: Mats; eyesRef: RefObject<THREE.Group | null> }) {
  return (
    <>
      <RoundedBox args={[0.98, 0.86, 0.92]} radius={0.24} smoothness={5} material={mats.steel} />
      <RoundedBox args={[0.78, 0.56, 0.14]} radius={0.06} smoothness={3} position={[0, -0.05, 0.42]} material={mats.visor} />
      <group ref={eyesRef} position={[0, 0.07, 0.5]}>
        <RoundedBox args={[0.21, 0.065, 0.02]} radius={0.02} smoothness={2} position={[-0.17, 0, 0]} material={mats.glow} />
        <RoundedBox args={[0.21, 0.065, 0.02]} radius={0.02} smoothness={2} position={[0.17, 0, 0]} material={mats.glow} />
      </group>
      {[-0.27, -0.2, -0.13, -0.06].map((y) => (
        <mesh key={y} position={[0, y, 0.505]} material={mats.gunmetal}>
          <boxGeometry args={[0.66, 0.024, 0.03]} />
        </mesh>
      ))}
      <RoundedBox args={[1.04, 0.12, 0.36]} radius={0.05} smoothness={3} position={[0, 0.25, 0.32]} rotation={[0.16, 0, 0]} material={mats.gunmetal} />
      <RoundedBox args={[0.15, 0.13, 0.64]} radius={0.05} smoothness={3} position={[0, 0.47, -0.02]} material={mats.gunmetal} />
      <RoundedBox args={[0.52, 0.14, 0.32]} radius={0.05} smoothness={3} position={[0, -0.42, 0.27]} material={mats.gunmetal} />
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.52, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh material={mats.gunmetal}>
            <cylinderGeometry args={[0.18, 0.18, 0.14, 28]} />
          </mesh>
          <mesh position={[0, s * -0.08, 0]} material={mats.joint}>
            <cylinderGeometry args={[0.1, 0.1, 0.04, 20]} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function Robot({ interactRef }: { interactRef: RefObject<HTMLElement | null> }) {
  // Pointer/jab input lives here so the render loop below can mutate it freely.
  const rig = useRef<Rig>({
    look: new THREE.Vector2(0, 0),
    jabSide: 1,
    jabStart: -1,
    pendingJab: false,
    reduced: false,
  });

  useEffect(() => {
    const r = rig.current;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    r.reduced = mql.matches;
    const onMotion = () => (r.reduced = mql.matches);

    const onMove = (e: PointerEvent) => {
      r.look.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    const jab = () => (r.pendingJab = true);
    const onDown = (e: PointerEvent) => {
      // Don't punch when the visitor is pressing a real control.
      if ((e.target as HTMLElement).closest("a, button")) return;
      onMove(e);
      jab();
    };

    const target = interactRef.current;
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener(JAB_EVENT, jab);
    target?.addEventListener("pointerdown", onDown);
    mql.addEventListener("change", onMotion);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener(JAB_EVENT, jab);
      target?.removeEventListener("pointerdown", onDown);
      mql.removeEventListener("change", onMotion);
    };
  }, [interactRef]);
  const mats = useMaterials();
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const upperL = useRef<THREE.Group>(null);
  const foreL = useRef<THREE.Group>(null);
  const upperR = useRef<THREE.Group>(null);
  const foreR = useRef<THREE.Group>(null);
  const nextBlink = useRef(2.5);
  const { viewport } = useThree();
  const fit = Math.min(1, viewport.width / 4.1);

  useFrame((state, delta) => {
    const r = rig.current;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const damp = THREE.MathUtils.damp;

    if (r.pendingJab) {
      r.pendingJab = false;
      r.jabSide = r.jabSide === 1 ? -1 : 1;
      r.jabStart = t;
    }
    const punch = r.jabStart < 0 ? 0 : jabCurve((t - r.jabStart) / JAB_TIME);
    if (r.jabStart >= 0 && t - r.jabStart > JAB_TIME) r.jabStart = -1;

    const bob = r.reduced ? 0 : Math.sin(t * 2.6);
    const { x: px, y: py } = r.look;

    if (root.current) {
      root.current.position.x = damp(root.current.position.x, px * 0.14, 3, dt);
      root.current.position.y = bob * 0.025;
    }
    if (torso.current) {
      const yaw = px * 0.2 - r.jabSide * punch * 0.24;
      torso.current.rotation.y = damp(torso.current.rotation.y, yaw, 6, dt);
      torso.current.rotation.x = damp(torso.current.rotation.x, -py * 0.05, 4, dt);
    }
    if (head.current) {
      head.current.rotation.y = damp(head.current.rotation.y, px * 0.55, 7, dt);
      head.current.rotation.x = damp(head.current.rotation.x, -py * 0.3, 7, dt);
    }

    const pose = (side: 1 | -1, upper: THREE.Group | null, fore: THREE.Group | null) => {
      if (!upper || !fore) return;
      const p = r.jabSide === side ? punch : 0;
      const guard = r.reduced ? 0 : Math.sin(t * 2.6 + side) * 0.05;
      upper.rotation.x = THREE.MathUtils.lerp(-0.62 + guard, -1.5, p);
      upper.rotation.z = THREE.MathUtils.lerp(side * 0.22, side * 0.04, p);
      fore.rotation.x = THREE.MathUtils.lerp(-2.35 - guard, -0.12, p);
      fore.rotation.z = THREE.MathUtils.lerp(-side * 0.5, -side * 0.08, p);
    };
    pose(-1, upperL.current, foreL.current);
    pose(1, upperR.current, foreR.current);

    if (eyes.current) {
      if (t > nextBlink.current + 0.12) nextBlink.current = t + 2.5 + Math.random() * 3;
      const blinking = !r.reduced && t >= nextBlink.current;
      eyes.current.scale.y = damp(eyes.current.scale.y, blinking ? 0.1 : 1, 30, dt);
    }
  });

  return (
    <group ref={root} scale={fit}>
      {/* Abdomen: stacked rings, faded out by the CSS mask on the canvas */}
      {[
        [0.86, 0.62, mats.joint],
        [0.62, 0.58, mats.gunmetal],
        [0.38, 0.55, mats.joint],
        [0.14, 0.53, mats.gunmetal],
      ].map(([y, radius, mat], i) => (
        <mesh key={i} position={[0, y as number, 0]} material={mat as THREE.Material}>
          <cylinderGeometry args={[radius as number, (radius as number) - 0.02, 0.2, 32]} />
        </mesh>
      ))}

      <group ref={torso}>
        <RoundedBox args={[2.0, 1.3, 1.1]} radius={0.24} smoothness={5} position={[0, 1.62, 0]} material={mats.gunmetal} />
        <RoundedBox args={[1.42, 0.84, 0.22]} radius={0.1} smoothness={4} position={[0, 1.72, 0.5]} material={mats.steel} />
        <RoundedBox args={[0.6, 0.36, 0.16]} radius={0.06} smoothness={3} position={[-0.36, 1.08, 0.47]} material={mats.steel} />
        <RoundedBox args={[0.6, 0.36, 0.16]} radius={0.06} smoothness={3} position={[0.36, 1.08, 0.47]} material={mats.steel} />
        <mesh position={[0, 1.5, 0.615]} material={mats.glow}>
          <boxGeometry args={[0.46, 0.035, 0.01]} />
        </mesh>
        <mesh position={[0, 2.32, 0]} material={mats.joint}>
          <cylinderGeometry args={[0.46, 0.54, 0.18, 32]} />
        </mesh>
        <mesh position={[0, 2.5, 0]} material={mats.joint}>
          <cylinderGeometry args={[0.17, 0.21, 0.42, 20]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.25, 2.5, -0.05]} rotation={[0, 0, s * 0.28]} material={mats.steel}>
            <cylinderGeometry args={[0.035, 0.035, 0.44, 10]} />
          </mesh>
        ))}

        <group ref={head} position={[0, 2.84, 0]}>
          <Head mats={mats} eyesRef={eyes} />
        </group>

        <Arm side={-1} mats={mats} upperRef={upperL} foreRef={foreL} />
        <Arm side={1} mats={mats} upperRef={upperR} foreRef={foreR} />
      </group>

      <pointLight position={[0, 2.6, 1.6]} color={ACCENT} intensity={1.1} distance={2.6} decay={2} />
    </group>
  );
}

export default function SparringBot({
  interactRef,
  className,
}: {
  interactRef: RefObject<HTMLElement | null>;
  className?: string;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(wrapper);

  return (
    <div
      ref={wrapper}
      aria-hidden="true"
      className={className}
      style={{
        maskImage: "linear-gradient(to bottom, black 56%, transparent 84%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 56%, transparent 84%)",
      }}
    >
      <Canvas
        frameloop={onScreen ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 2.0, 9.8], fov: 30 }}
        onCreated={({ camera }) => camera.lookAt(0, 1.72, 0)}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        fallback={null}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[-3, 5, 6]} intensity={2.2} />
        <directionalLight position={[4, 3, -4]} intensity={2.4} color={ACCENT} />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={2.4} position={[0, 5, 2]} scale={[8, 2, 1]} rotation-x={Math.PI / 2} />
          <Lightformer form="rect" intensity={1.3} position={[-5, 1.5, 1]} scale={[3, 6, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={1.3} position={[5, 1.5, 1]} scale={[3, 6, 1]} rotation-y={-Math.PI / 2} />
          <Lightformer form="rect" intensity={1.6} position={[0, 1.5, 6]} scale={[6, 3, 1]} />
          <Lightformer form="ring" color={ACCENT} intensity={1.6} position={[3, 2, -5]} scale={3} />
        </Environment>
        <Robot interactRef={interactRef} />
      </Canvas>
    </div>
  );
}
