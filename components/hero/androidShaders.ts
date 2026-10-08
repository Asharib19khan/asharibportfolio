// GLSL for the hero android. Skin and chassis are injected into three.js physical materials via
// onBeforeCompile, so lighting, tone mapping and colour management stay three.js-standard.
// Hair is a small custom shader (instanced line strands with Kajiya-Kay shading).

// Ashima Arts 3D simplex noise (MIT).
const SIMPLEX = /* glsl */ `
vec3 an_mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 an_mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 an_permute(vec4 x){ return an_mod289(((x * 34.0) + 10.0) * x); }
vec4 an_taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float an_snoise(vec3 v){
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = an_mod289(i);
  vec4 p = an_permute(an_permute(an_permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = an_taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

// Neck: the head turns (yaw) and nods (pitch) about a pivot at the top of the neck. The weight
// ramps up the neck column and ignores the shoulders, so the torso stays still while the neck
// twists. Skin, chassis and hair all deform through this one function, so they never drift apart.
const NECK = /* glsl */ `
uniform vec3 uPivot;
uniform float uYaw;
uniform float uPitch;
vec3 an_rotX(vec3 v, float a){ float c = cos(a); float s = sin(a); return vec3(v.x, c * v.y - s * v.z, s * v.y + c * v.z); }
vec3 an_rotY(vec3 v, float a){ float c = cos(a); float s = sin(a); return vec3(c * v.x + s * v.z, v.y, -s * v.x + c * v.z); }
float an_neckWeight(vec3 p){
  float rise = smoothstep(-1.8, -0.6, p.y);
  vec2 h = vec2(p.x - uPivot.x, (p.z - uPivot.z) * 0.85);
  float nearAxis = 1.0 - smoothstep(1.45, 2.3, length(h));
  return rise * mix(nearAxis, 1.0, smoothstep(-1.35, -0.75, p.y));
}
vec3 an_neckDir(vec3 v, float w){ return an_rotY(an_rotX(v, uPitch * w), uYaw * w); }
vec3 an_neckPoint(vec3 p, float w){ return uPivot + an_neckDir(p - uPivot, w); }
`;

// Signed distance to the nearest skin reveal (cursor or the permanent "scar"), roughened with
// noise. Shared by skin and hair so hair retracts exactly where the skin does.
const REVEAL = /* glsl */ `
uniform float uTime;
uniform vec3 uCursor;
uniform float uCursorR;
uniform vec3 uScar;
uniform float uScarR;
uniform vec3 uGlow;
uniform float uEdge;
float an_reveal(vec3 p){
  float raw = min(distance(p, uCursor) - uCursorR, distance(p, uScar) - uScarR);
  // Noise can move the edge by at most ~0.3, plus the glow band: no need to evaluate it further out.
  if (raw > 0.75) return raw;
  float n = an_snoise(p * 0.9 + vec3(0.0, uTime * 0.18, 0.0)) * 0.55
          + an_snoise(p * 3.1 - vec3(uTime * 0.3)) * 0.18;
  return raw + n * 0.35;
}
`;

// Temple LED, drawn into the surface itself rather than bolted on: a slim ring of light set flush
// in the skin, a fine seam where the module meets the skin, and a soft spill of light around it.
// Returns (ring, seam, spill).
const LED = /* glsl */ `
uniform vec3 uLedPos;
uniform vec3 uLedNrm;
uniform float uLedI;
vec3 an_led(vec3 p){
  vec3 v = p - uLedPos;
  float h = dot(v, uLedNrm);
  float r = length(v - uLedNrm * h);
  float near = 1.0 - smoothstep(0.1, 0.3, abs(h));
  float ring = (1.0 - smoothstep(0.02, 0.042, abs(r - 0.17))) * near;
  float seam = (1.0 - smoothstep(0.005, 0.013, abs(r - 0.235))) * near;
  float spill = exp(-pow((r - 0.17) / 0.11, 2.0)) * near;
  return vec3(ring, seam, spill);
}
`;

// Hex grid helpers: the skin retracts tile by tile, like Detroit's android skin.
const HEX = /* glsl */ `
float an_hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec4 an_hexCoords(vec2 uv){
  const vec2 s = vec2(1.0, 1.7320508);
  vec4 hC = floor(vec4(uv, uv - vec2(0.5, 1.0)) / s.xyxy) + 0.5;
  vec4 h = vec4(uv - hC.xy * s, uv - (hC.zw + 0.5) * s);
  return dot(h.xy, h.xy) < dot(h.zw, h.zw) ? vec4(h.xy, hC.xy) : vec4(h.zw, hC.zw + 0.5);
}
float an_hexEdge(vec2 p){ p = abs(p); return max(dot(p, normalize(vec2(1.0, 1.7320508))), p.x); }
`;

// ── Shared vertex snippets (skin + chassis) ──────────────────────────────────────────────

export const NECK_NORMAL = /* glsl */ `
#include <beginnormal_vertex>
float anW = an_neckWeight(position);
objectNormal = an_neckDir(objectNormal, anW);
`;

// ── Skin ──────────────────────────────────────────────────────────────────────────────────

export const SKIN_VERTEX_HEAD = /* glsl */ `
#include <common>
attribute float aHair;
varying vec3 vAnObj;
varying vec2 vAnUv;
varying float vAnHair;
${NECK}
`;

export const SKIN_VERTEX_BODY = /* glsl */ `
#include <begin_vertex>
vAnObj = position;
vAnUv = uv;
vAnHair = aHair;
transformed = an_neckPoint(transformed, anW);
`;

export const SKIN_FRAGMENT_HEAD = /* glsl */ `
#include <common>
varying vec3 vAnObj;
varying vec2 vAnUv;
varying float vAnHair;
float anEdge;
vec3 anLed;
${SIMPLEX}
${REVEAL}
${HEX}
${LED}
`;

// Inside the reveal the skin is discarded; a thin band of hex tiles outside it glows.
export const SKIN_FRAGMENT_REVEAL = /* glsl */ `
#include <clipping_planes_fragment>
{
  vec4 hx = an_hexCoords(vAnUv * 140.0);
  float d = an_reveal(vAnObj) + (an_hash21(hx.zw) - 0.5) * 0.22;
  if (d < 0.0) discard;
  float band = 1.0 - smoothstep(0.0, uEdge, d);
  float border = smoothstep(0.36, 0.5, an_hexEdge(hx.xy));
  anEdge = band * (0.25 + 0.75 * border);
}
`;

// Scalp under the hair reads as dense roots rather than bare skin between strands.
export const SKIN_FRAGMENT_MAP = /* glsl */ `
#include <map_fragment>
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.014, 0.010, 0.008), vAnHair * 0.9);
diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 0.55, anEdge);
anLed = an_led(vAnObj);
diffuseColor.rgb *= (1.0 - 0.95 * min(anLed.x * 1.6, 1.0)) * (1.0 - 0.5 * anLed.y);
`;

export const LED_FRAGMENT_LIGHTS = /* glsl */ `
#include <lights_physical_fragment>
{
  float ledMask = min(anLed.x * 1.6, 1.0);
  material.roughness = mix(material.roughness, 1.0, ledMask);
  material.specularColor *= 1.0 - ledMask;
  material.specularColorBlended *= 1.0 - ledMask;
  material.specularF90 *= 1.0 - ledMask;
  #ifdef USE_CLEARCOAT
    material.clearcoat *= 1.0 - ledMask;
  #endif
  #ifdef USE_SHEEN
    material.sheenColor *= 1.0 - ledMask;
  #endif
}
`;

export const SKIN_FRAGMENT_EMISSIVE = /* glsl */ `
#include <emissivemap_fragment>
totalEmissiveRadiance += uGlow * anEdge * 2.4;
totalEmissiveRadiance += uGlow * uLedI * (anLed.x * 2.4 + anLed.z * 0.22);
`;

// ── Chassis ───────────────────────────────────────────────────────────────────────────────

export const CHASSIS_VERTEX_HEAD = /* glsl */ `
#include <common>
varying vec3 vAnObj;
${NECK}
`;

export const CHASSIS_VERTEX_BODY = /* glsl */ `
#include <begin_vertex>
vAnObj = position;
// Sit just under the skin everywhere, so the shell never pokes through it.
transformed -= normal * 0.05;
transformed = an_neckPoint(transformed, anW);
`;

// Glossy white shell with symmetric panel seams (3D Voronoi edges) and optics under the eyelids.
export const CHASSIS_FRAGMENT_HEAD = /* glsl */ `
#include <common>
varying vec3 vAnObj;
uniform vec3 uGlow;
uniform float uTime;
uniform vec3 uEyeL;
uniform vec3 uEyeR;
uniform float uOptic;
vec3 an_hash33(vec3 p){
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}
vec3 an_voronoi(vec3 x){
  vec3 p = floor(x); vec3 f = fract(x);
  float f1 = 8.0; float f2 = 8.0; vec3 id = vec3(0.0);
  for (int k = -1; k <= 1; k++)
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec3 b = vec3(float(i), float(j), float(k));
    vec3 r = b + an_hash33(p + b) - f;
    float d = dot(r, r);
    if (d < f1) { f2 = f1; f1 = d; id = p + b; } else if (d < f2) { f2 = d; }
  }
  return vec3(sqrt(f2) - sqrt(f1), an_hash33(id).x, 0.0);
}
// A thin arc of light along each closed eyelid, with a soft halo.
float an_optic(vec3 p, vec3 e){
  float u = (p.x - e.x) / 0.27;
  float v = (p.y - e.y - 0.035 * u * u) / 0.06;
  float core = 1.0 - smoothstep(0.55, 1.0, length(vec2(u, v)));
  float halo = (1.0 - smoothstep(0.8, 2.4, length(vec2(u, v * 0.45)))) * 0.18;
  return (core + halo) * step(1.45, p.z);
}
float anSeam;
float anTint;
float anOptic;
vec3 anLed;
${LED}
`;

export const CHASSIS_FRAGMENT_MAP = /* glsl */ `
#include <map_fragment>
{
  vec3 q = vec3(abs(vAnObj.x), vAnObj.y, vAnObj.z) * 0.62;
  vec3 v = an_voronoi(q);
  anSeam = 1.0 - smoothstep(0.015, 0.055, v.x);
  anTint = v.y;
  diffuseColor.rgb *= mix(0.94 + 0.06 * anTint, 0.32, anSeam);
  // The optic is a dark recessed slit, so its light reads as colour, not as more white.
  anOptic = an_optic(vAnObj, uEyeL) + an_optic(vAnObj, uEyeR);
  diffuseColor.rgb *= 1.0 - 0.9 * min(anOptic, 1.0);
  anLed = an_led(vAnObj);
  diffuseColor.rgb *= (1.0 - 0.95 * min(anLed.x * 1.6, 1.0)) * (1.0 - 0.6 * anLed.y);
}
`;

export const CHASSIS_FRAGMENT_ROUGHNESS = /* glsl */ `
#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.85, anSeam);
`;

export const CHASSIS_FRAGMENT_EMISSIVE = /* glsl */ `
#include <emissivemap_fragment>
totalEmissiveRadiance += uGlow * anSeam * (0.12 + 0.08 * sin(uTime * 2.0 + vAnObj.y * 3.0));
totalEmissiveRadiance += uGlow * uOptic * anOptic;
totalEmissiveRadiance += uGlow * uLedI * (anLed.x * 2.4 + anLed.z * 0.22);
`;

// ── Hair: instanced line strands ──────────────────────────────────────────────────────────

export const HAIR_VERTEX = /* glsl */ `
attribute float aS;
attribute vec3 aRoot;
attribute vec3 aNrm;
attribute vec3 aFlow;
attribute vec4 aShape; // length, rise, bend, random
attribute vec4 aClump; // pull toward the lock tip (xyz), lock tint (w; -1 = flyaway)
varying vec3 vAnObj;
varying vec3 vTan;
varying vec3 vNrm;
varying vec3 vWorld;
varying float vS;
varying float vRand;
varying float vLock;
varying float vReveal;
${NECK}
${SIMPLEX}
${REVEAL}
void main() {
  float s = aS;
  float len = aShape.x;
  // Rise off the scalp, bend along the combed flow, and gather toward the lock tip.
  vec3 p = aRoot + aNrm * (len * aShape.y * s) + aFlow * (len * aShape.z * s * s) + aClump.xyz * (s * s);
  vec3 dp = aNrm * (len * aShape.y) + aFlow * (len * aShape.z * 2.0 * s) + aClump.xyz * (2.0 * s);
  vAnObj = p;
  vReveal = an_reveal(p);
  float w = an_neckWeight(aRoot);
  vec4 world = modelMatrix * vec4(an_neckPoint(p, w), 1.0);
  vWorld = world.xyz;
  vTan = normalize(mat3(modelMatrix) * an_neckDir(dp, w));
  vNrm = normalize(mat3(modelMatrix) * an_neckDir(aNrm, w));
  vS = s;
  vRand = aShape.w;
  vLock = aClump.w;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const HAIR_FRAGMENT = /* glsl */ `
uniform vec3 uKeyDir;
uniform vec3 uKeyColor;
uniform vec3 uRimDir;
uniform vec3 uRimColor;
uniform vec3 uFillDir;
uniform vec3 uFillColor;
uniform vec3 uAmbient;
uniform vec3 uRootColor;
uniform vec3 uTipColor;
varying vec3 vAnObj;
varying vec3 vTan;
varying vec3 vNrm;
varying vec3 vWorld;
varying float vS;
varying float vRand;
varying float vLock;
varying float vReveal;
uniform vec3 uGlow;
uniform float uEdge;
// Kajiya-Kay: strands scatter light around their axis, giving hair its stretched highlights.
// Two shifted lobes: a tight, near-white highlight and a broader one tinted by the hair.
vec3 an_kk(vec3 T, vec3 N, vec3 V, vec3 L, vec3 lightColor, vec3 base){
  float shadow = smoothstep(-0.25, 0.55, dot(N, L));
  float TL = dot(T, L);
  float diffuse = sqrt(max(0.0, 1.0 - TL * TL));
  vec3 H = normalize(L + V);
  float h1 = dot(normalize(T + N * 0.1), H);
  float h2 = dot(normalize(T - N * 0.14), H);
  float primary = pow(sqrt(max(0.0, 1.0 - h1 * h1)), 140.0);
  float secondary = pow(sqrt(max(0.0, 1.0 - h2 * h2)), 28.0);
  // Warm-tinted highlights, kept low so the hair reads dark and glossy rather than frosted.
  return lightColor * shadow * (base * diffuse * 0.55 + vec3(0.17, 0.14, 0.12) * primary + base * secondary * 0.45);
}
void main() {
  if (vReveal < 0.0) discard;
  float band = 1.0 - smoothstep(0.0, uEdge * 1.6, vReveal);
  vec3 T = normalize(vTan);
  vec3 N = normalize(vNrm);
  vec3 V = normalize(cameraPosition - vWorld);
  float flyaway = step(vLock, -0.5);
  float lockTint = mix(0.8 + 0.4 * max(vLock, 0.0), 1.2, flyaway);
  vec3 base = mix(uRootColor, uTipColor, vS) * lockTint * (0.85 + 0.3 * vRand);
  vec3 col = uAmbient * base;
  col += an_kk(T, N, V, uKeyDir, uKeyColor, base);
  col += an_kk(T, N, V, uRimDir, uRimColor, base);
  col += an_kk(T, N, V, uFillDir, uFillColor, base);
  col *= mix(0.35, 1.0, smoothstep(0.0, 0.7, vS));
  col += uGlow * band * 1.6;
  // Strands thin out to nothing at the tips; flyaways are fainter still.
  float alpha = mix(0.92, 0.06, smoothstep(0.3, 1.0, vS)) * mix(1.0, 0.45, flyaway);
  gl_FragColor = vec4(col, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
