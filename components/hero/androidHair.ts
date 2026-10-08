import * as THREE from "three";

// Hair for the hero android: a short textured crop grown from the scan's scalp as individual
// strands (one instanced line strip each), gathered into locks around guide strands the way
// real hair clumps. Everything is in the scan's own space: the head is ~8 units tall, +y up,
// +z toward the viewer, face centre around x = -0.08.
//
// Generation runs on the main thread at load, so it works on flat typed arrays with numeric
// grid keys and no per-strand allocation (~90k strands in well under 100 ms).

const CX = -0.08;
const CZ = -0.15;

// Hairline height by angle around the head (0 = front, π = back): forehead, slight temple
// recession, a clean line above the ear, then down to the nape.
const HAIRLINE: ReadonlyArray<readonly [number, number]> = [
  [0.0, 3.15],
  [0.5, 3.22],
  [0.8, 3.05],
  [1.0, 2.55],
  [1.18, 2.15],
  [1.42, 2.06],
  [1.88, 2.06],
  [2.15, 1.35],
  [2.5, 0.55],
  [2.85, 0.0],
  [Math.PI, -0.25],
];

function hairlineAt(theta: number) {
  for (let i = 1; i < HAIRLINE.length; i++) {
    const [t1, y1] = HAIRLINE[i];
    if (theta <= t1) {
      const [t0, y0] = HAIRLINE[i - 1];
      return y0 + ((theta - t0) / (t1 - t0)) * (y1 - y0);
    }
  }
  return HAIRLINE[HAIRLINE.length - 1][1];
}

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function hash3(x: number, y: number, z: number) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function valueNoise(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  return l(
    l(l(hash3(xi, yi, zi), hash3(xi + 1, yi, zi), u), l(hash3(xi, yi + 1, zi), hash3(xi + 1, yi + 1, zi), u), v),
    l(l(hash3(xi, yi, zi + 1), hash3(xi + 1, yi, zi + 1), u), l(hash3(xi, yi + 1, zi + 1), hash3(xi + 1, yi + 1, zi + 1), u), v),
    w,
  );
}

/** Hair coverage (0..1) at a point on the scan: an irregular, natural hairline with bare ears. */
export function hairMask(x: number, y: number, z: number) {
  const theta = Math.abs(Math.atan2(x - CX, z - CZ));
  const ragged = (valueNoise(x * 3.1, y * 3.1, z * 3.1) - 0.5) * 0.16 + (valueNoise(x * 9, y * 9, z * 9) - 0.5) * 0.06;
  let m = smoothstep(-0.05, 0.14, y - hairlineAt(theta) + ragged);
  // Keep the ears bare: an ellipsoid around each one.
  const ex = (Math.abs(x - CX) - 1.67) / 0.42, ey = (y - 1.3) / 0.88, ez = (z + 0.2) / 0.62;
  if (ex * ex + ey * ey + ez * ez < 1) m = 0;
  return m;
}

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Points per strand. Four segments keep the curve smooth at hero size. */
const STRAND_POINTS = 5;
/** Strands per lock (guide). */
const STRANDS_PER_LOCK = 40;
/** Lock lookup grid cell size, in scan units. */
const CELL = 0.22;
const cellOf = (v: number) => Math.floor(v / CELL);
const cellKey = (ix: number, iy: number, iz: number) => ((ix + 512) * 1024 + (iy + 512)) * 1024 + (iz + 512);

/**
 * Plants `count` strands on the scalp of `geometry` (which must carry the aHair coverage
 * attribute). Roots are area-weighted so density is even and the hairline thins out naturally.
 * Strands follow their nearest lock and pull their tips toward its tip, which is what makes
 * hair read as hair instead of fur.
 */
export function buildHair(geometry: THREE.BufferGeometry, count: number) {
  const P = geometry.attributes.position.array as Float32Array;
  const NM = geometry.attributes.normal.array as Float32Array;
  const COVER = geometry.attributes.aHair.array as Float32Array;
  const IDX = geometry.index!.array as ArrayLike<number>;

  // Scalp triangles, area-weighted.
  const triList: number[] = [];
  const cdfList: number[] = [];
  let total = 0;
  for (let i = 0; i < IDX.length; i += 3) {
    const a = IDX[i] * 3, b = IDX[i + 1] * 3, c = IDX[i + 2] * 3;
    if (COVER[a / 3] <= 0 && COVER[b / 3] <= 0 && COVER[c / 3] <= 0) continue;
    const e1x = P[b] - P[a], e1y = P[b + 1] - P[a + 1], e1z = P[b + 2] - P[a + 2];
    const e2x = P[c] - P[a], e2y = P[c + 1] - P[a + 1], e2z = P[c + 2] - P[a + 2];
    const cx = e1y * e2z - e1z * e2y, cy = e1z * e2x - e1x * e2z, cz = e1x * e2y - e1y * e2x;
    total += Math.sqrt(cx * cx + cy * cy + cz * cz) / 2;
    triList.push(i);
    cdfList.push(total);
  }
  const tris = Int32Array.from(triList);
  const cdf = Float64Array.from(cdfList);
  const rand = mulberry32(19);

  // sampleRoot writes the sampled point and normal here.
  let px = 0, py = 0, pz = 0, nx = 0, ny = 0, nz = 0;
  /** Samples a scalp point (area-weighted, thinned at the hairline); returns coverage or -1. */
  const sampleRoot = () => {
    if (!tris.length) return -1;
    const target = rand() * total;
    let lo = 0, hi = cdf.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const t = tris[lo];
    const a = IDX[t] * 3, b = IDX[t + 1] * 3, c = IDX[t + 2] * 3;
    let u = rand(), v = rand();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    const w = 1 - u - v;
    px = P[a] * w + P[b] * u + P[c] * v;
    py = P[a + 1] * w + P[b + 1] * u + P[c + 1] * v;
    pz = P[a + 2] * w + P[b + 2] * u + P[c + 2] * v;
    // Coverage interpolated from the per-vertex mask: same hairline, a fraction of the cost.
    const m = COVER[a / 3] * w + COVER[b / 3] * u + COVER[c / 3] * v;
    if (rand() > m) return -1;
    nx = NM[a] * w + NM[b] * u + NM[c] * v;
    ny = NM[a + 1] * w + NM[b + 1] * u + NM[c + 1] * v;
    nz = NM[a + 2] * w + NM[b + 2] * u + NM[c + 2] * v;
    const nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    nx /= nl; ny /= nl; nz /= nl;
    return m;
  };

  // orient writes a direction here: `dir` projected onto the scalp at n, rotated by `angle` about n.
  let fx = 0, fy = 0, fz = 0;
  const orient = (dx: number, dy: number, dz: number, angle: number) => {
    const d = dx * nx + dy * ny + dz * nz;
    let ox = dx - nx * d, oy = dy - ny * d, oz = dz - nz * d;
    const ol = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1;
    ox /= ol; oy /= ol; oz /= ol;
    const sx = ny * oz - nz * oy, sy = nz * ox - nx * oz, sz = nx * oy - ny * ox;
    const co = Math.cos(angle), si = Math.sin(angle);
    fx = ox * co + sx * si; fy = oy * co + sy * si; fz = oz * co + sz * si;
    const fl = Math.sqrt(fx * fx + fy * fy + fz * fz) || 1;
    fx /= fl; fy /= fl; fz /= fl;
  };
  /** Combed back over the crown, falling down the sides and nape. */
  const comb = (angle: number) => orient((px - CX) * 0.22, -0.18, -1, angle);

  // ── Locks: guide strands that neighbouring hairs gather around ─────────────────────────
  const lockTarget = Math.max(1, Math.round(count / STRANDS_PER_LOCK));
  const lockRoot = new Float32Array(lockTarget * 3);
  const lockFlow = new Float32Array(lockTarget * 3);
  const lockTip = new Float32Array(lockTarget * 3);
  const lockShape = new Float32Array(lockTarget * 4); // len, rise, bend, tint
  const buckets = new Map<number, number[]>();
  let locks = 0;
  for (let guard = 0; locks < lockTarget && guard < lockTarget * 10; guard++) {
    if (sampleRoot() < 0) continue;
    const top = smoothstep(2.4, 3.6, py);
    comb((rand() - 0.5) * 0.5);
    // Textured on top (longer, more lift), tight and flat on the sides and back.
    const len = (0.12 + 0.38 * top) * (0.8 + 0.4 * rand());
    const rise = (0.14 + 0.22 * top) * (0.85 + 0.3 * rand());
    const bend = (1.15 - 0.3 * top) * (0.9 + 0.25 * rand());
    const o = locks * 3;
    lockRoot[o] = px; lockRoot[o + 1] = py; lockRoot[o + 2] = pz;
    lockFlow[o] = fx; lockFlow[o + 1] = fy; lockFlow[o + 2] = fz;
    lockTip[o] = px + nx * len * rise + fx * len * bend;
    lockTip[o + 1] = py + ny * len * rise + fy * len * bend;
    lockTip[o + 2] = pz + nz * len * rise + fz * len * bend;
    lockShape.set([len, rise, bend, rand()], locks * 4);
    const key = cellKey(cellOf(px), cellOf(py), cellOf(pz));
    const bucket = buckets.get(key);
    if (bucket) bucket.push(locks);
    else buckets.set(key, [locks]);
    locks++;
  }

  // Each cell's 3×3×3 neighbourhood, gathered once and reused by every strand in that cell.
  const neighbourhoods = new Map<number, Int32Array>();
  const nearbyLocks = (ix: number, iy: number, iz: number) => {
    const key = cellKey(ix, iy, iz);
    let list = neighbourhoods.get(key);
    if (!list) {
      const found: number[] = [];
      for (let dx = -1; dx <= 1; dx++)
        for (let dy = -1; dy <= 1; dy++)
          for (let dz = -1; dz <= 1; dz++) {
            const bucket = buckets.get(cellKey(ix + dx, iy + dy, iz + dz));
            if (bucket) for (const i of bucket) found.push(i);
          }
      list = Int32Array.from(found);
      neighbourhoods.set(key, list);
    }
    return list;
  };

  // ── Strands ────────────────────────────────────────────────────────────────────────────
  const roots = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const flows = new Float32Array(count * 3);
  const shapes = new Float32Array(count * 4);
  const clumps = new Float32Array(count * 4);

  let made = 0;
  for (let guard = 0; made < count && guard < count * 8; guard++) {
    const m = sampleRoot();
    if (m < 0) continue;

    // Nearest lock.
    let lock = -1;
    let best = Infinity;
    const near = nearbyLocks(cellOf(px), cellOf(py), cellOf(pz));
    for (let k = 0; k < near.length; k++) {
      const o = near[k] * 3;
      const dx = lockRoot[o] - px, dy = lockRoot[o + 1] - py, dz = lockRoot[o + 2] - pz;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < best) { best = d; lock = near[k]; }
    }
    // A few loose flyaways break up the silhouette; everything else follows its lock.
    const flyaway = lock < 0 || rand() < 0.025;

    let len: number, rise: number, bend: number, clump: number, tint: number;
    if (flyaway) {
      comb((rand() - 0.5) * 1.6);
      const top = smoothstep(2.4, 3.6, py);
      len = (0.14 + 0.45 * top) * (0.9 + 0.5 * rand());
      rise = 0.3 + 0.3 * rand();
      bend = 0.8 + 0.4 * rand();
      clump = 0;
      tint = -1;
    } else {
      // Follow the lock's direction, projected onto this root's own tangent plane.
      const o = lock * 3, s = lock * 4;
      orient(lockFlow[o], lockFlow[o + 1], lockFlow[o + 2], (rand() - 0.5) * 0.24);
      len = lockShape[s] * (0.82 + 0.3 * rand()) * (0.6 + 0.4 * m);
      rise = lockShape[s + 1] * (0.9 + 0.2 * rand());
      bend = lockShape[s + 2] * (0.9 + 0.2 * rand());
      clump = 0.5 + 0.35 * rand();
      tint = lockShape[s + 3];
    }

    // Pull the tip toward the lock's tip; the shader applies it progressively along the strand.
    let qx = 0, qy = 0, qz = 0;
    if (!flyaway) {
      const o = lock * 3;
      qx = (lockTip[o] - (px + nx * len * rise + fx * len * bend)) * clump;
      qy = (lockTip[o + 1] - (py + ny * len * rise + fy * len * bend)) * clump;
      qz = (lockTip[o + 2] - (pz + nz * len * rise + fz * len * bend)) * clump;
      const ql = Math.sqrt(qx * qx + qy * qy + qz * qz);
      const maxPull = len * 0.6;
      if (ql > maxPull) { qx *= maxPull / ql; qy *= maxPull / ql; qz *= maxPull / ql; }
    }

    const o3 = made * 3, o4 = made * 4;
    roots[o3] = px - nx * 0.012; roots[o3 + 1] = py - ny * 0.012; roots[o3 + 2] = pz - nz * 0.012;
    normals[o3] = nx; normals[o3 + 1] = ny; normals[o3 + 2] = nz;
    flows[o3] = fx; flows[o3 + 1] = fy; flows[o3 + 2] = fz;
    shapes[o4] = len; shapes[o4 + 1] = rise; shapes[o4 + 2] = bend; shapes[o4 + 3] = rand();
    clumps[o4] = qx; clumps[o4 + 1] = qy; clumps[o4 + 2] = qz; clumps[o4 + 3] = tint;
    made++;
  }

  const strand = new THREE.InstancedBufferGeometry();
  const along = new Float32Array(STRAND_POINTS);
  for (let k = 0; k < STRAND_POINTS; k++) along[k] = k / (STRAND_POINTS - 1);
  const segments: number[] = [];
  for (let k = 0; k < STRAND_POINTS - 1; k++) segments.push(k, k + 1);
  strand.setIndex(segments);
  strand.setAttribute("position", new THREE.BufferAttribute(new Float32Array(STRAND_POINTS * 3), 3));
  strand.setAttribute("aS", new THREE.BufferAttribute(along, 1));
  strand.setAttribute("aRoot", new THREE.InstancedBufferAttribute(roots.slice(0, made * 3), 3));
  strand.setAttribute("aNrm", new THREE.InstancedBufferAttribute(normals.slice(0, made * 3), 3));
  strand.setAttribute("aFlow", new THREE.InstancedBufferAttribute(flows.slice(0, made * 3), 3));
  strand.setAttribute("aShape", new THREE.InstancedBufferAttribute(shapes.slice(0, made * 4), 4));
  strand.setAttribute("aClump", new THREE.InstancedBufferAttribute(clumps.slice(0, made * 4), 4));
  strand.instanceCount = made;
  return strand;
}
