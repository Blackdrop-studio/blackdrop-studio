import * as THREE from 'https://esm.sh/three@0.152.2';
import { RGBELoader } from 'https://esm.sh/three@0.152.2/examples/jsm/loaders/RGBELoader.js';

// === SCENE SETUP ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;
renderer.dithering = true;

// === ENVIRONMENT MAP ===
new RGBELoader().load('https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/hdri/venice_sunset_1k.hdr', (hdrMap) => {
  hdrMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = hdrMap;
  scene.background = hdrMap;
});

// === SPHERE GEOMETRY ===
const sphereGeometry = new THREE.SphereGeometry(1.5, 256, 256);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0.9,
  roughness: 0.15,
  transmission: 1.0,
  thickness: 2.5,
  ior: 1.45,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
  reflectivity: 0.9,
  envMapIntensity: 1.5,
  color: new THREE.Color(0x111111)
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.geometry.computeVertexNormals();
scene.add(sphere);

// === PARTICLES ===
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 700;
const pos = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  pos[i] = (Math.random() - 0.5) * 20;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const particleMaterial = new THREE.PointsMaterial({
  size: 0.015,
  color: 0xffffff,
  transparent: true,
  opacity: 0.25,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// === WAVE FUNCTION ===
const positions = sphere.geometry.attributes.position.array;
const vertexCount = positions.length;
function updateSphereWave(time) {
  const pos = sphere.geometry.attributes.position;
  for (let i = 0; i < vertexCount; i += 3) {
    const x = pos.array[i];
    const y = pos.array[i + 1];
    const z = pos.array[i + 2];
    const r = Math.sqrt(x * x + y * y + z * z);
    const ripple = 0.015 * Math.sin(r * 10 - time * 3);
    pos.array[i] = x * (1 + ripple);
    pos.array[i + 1] = y * (1 + ripple);
    pos.array[i + 2] = z * (1 + ripple);
  }
  pos.needsUpdate = true;
  sphere.geometry.computeVertexNormals();
}

// === RESPONSIVE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === ANIMATE ===
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  updateSphereWave(elapsed);

  sphere.rotation.y += 0.002;
  sphere.rotation.x += 0.0012;
  particles.rotation.y += 0.0015;

  renderer.render(scene, camera);
}
animate();