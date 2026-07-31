/* ==========================================================================
   p1@yer — atmosphere layer (Three.js)
   Environment only. Faint dust, slow drift, a whisper of mouse influence,
   one low-opacity halo. Nobody should ever catch it performing.
   ========================================================================== */

import * as THREE from "three";

const canvas = document.getElementById("bg");
if (!canvas) throw new Error("#bg canvas missing");

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.innerWidth < 640;

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  powerPreference: "low-power",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight, false);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 6;

/* ---------- faint dust ---------- */
const COUNT = isMobile ? 140 : 360;
const positions = new Float32Array(COUNT * 3);
for (let i = 0; i < COUNT; i++) {
  positions[i * 3]     = (Math.random() - 0.5) * 18;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
}

const dustGeo = new THREE.BufferGeometry();
dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const dustMat = new THREE.PointsMaterial({
  color: 0x1a56db,
  size: 0.02,
  transparent: true,
  opacity: 0.38,
  depthWrite: false,
  sizeAttenuation: true,
});

const dust = new THREE.Points(dustGeo, dustMat);
scene.add(dust);

/* ---------- low-opacity halo ---------- */
function radialTexture(size) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(26, 86, 219, 1)");
  grad.addColorStop(0.3, "rgba(26, 86, 219, 0.16)");
  grad.addColorStop(1, "rgba(26, 86, 219, 0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

const haloMat = new THREE.SpriteMaterial({
  map: radialTexture(256),
  transparent: true,
  opacity: 0.5,
  depthWrite: false,
});
const halo = new THREE.Sprite(haloMat);
halo.position.set(0, 0, -4);
halo.scale.setScalar(16);
scene.add(halo);

/* ---------- mouse influence (kept to ±1°) ---------- */
let mx = 0, my = 0;
window.addEventListener("pointermove", (e) => {
  mx = (e.clientX / window.innerWidth) * 2 - 1;
  my = -(e.clientY / window.innerHeight) * 2 + 1;
}, { passive: true });

/* ---------- resize ---------- */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, false);
});

/* ---------- loop ---------- */
let running = true;
document.addEventListener("visibilitychange", () => {
  running = !document.hidden;
  if (running) requestAnimationFrame(tick);
});

const clock = new THREE.Clock();

function tick() {
  requestAnimationFrame(tick);
  if (!running || reduced) return;

  const t = clock.getElapsedTime();

  dust.rotation.y = t * 0.012 + mx * 0.02;   // slow drift + mouse
  dust.rotation.x = my * 0.02;

  halo.material.opacity = 0.5 + Math.sin(t * 0.25) * 0.05;   // breathe, slowly

  renderer.render(scene, camera);
}

if (reduced) {
  renderer.render(scene, camera);   // one still frame
} else {
  requestAnimationFrame(tick);
}
