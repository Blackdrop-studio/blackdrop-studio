import * as THREE from 'https://esm.sh/three@0.152.2';

// === SCENE SETUP ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;

// === LIGHTS ===
const hemi = new THREE.HemisphereLight(0xffffff, 0x111111, 0.6);
scene.add(hemi);

const rectLight = new THREE.RectAreaLight(0xffffff, 3.2, 5, 5);
rectLight.position.set(2, 2, 3);
scene.add(rectLight);

// === SPHERE MATERIAL ===
const geometry = new THREE.SphereGeometry(1.6, 128, 128);
const material = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(0x000000),
  roughness: 0.05,
  metalness: 0.0,
  transmission: 1.0,
  thickness: 1.5,
  reflectivity: 0.6,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// === INCRESPATURE ===
geometry.computeVertexNormals();
const pos = geometry.attributes.position;
const base = new Float32Array(pos.array);

for (let i = 0; i < pos.count * 3; i++) {
  base[i] = pos.array[i];
}

function updateRipples(time) {
  for (let i = 0; i < pos.count; i++) {
    const ix = i * 3;
    const x = base[ix];
    const y = base[ix + 1];
    const z = base[ix + 2];
    const r = Math.sqrt(x * x + y * y + z * z);
    const factor = 1 + 0.015 * Math.sin(r * 10 - time * 3);
    pos.array[ix] = x * factor;
    pos.array[ix + 1] = y * factor;
    pos.array[ix + 2] = z * factor;
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}

// === ANIMATION ===
let clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  updateRipples(t);
  sphere.rotation.y += 0.002;
  renderer.render(scene, camera);
}
animate();

// === RESIZE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});