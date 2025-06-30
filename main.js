import * as THREE from 'https://esm.sh/three@0.152.2';
import { RectAreaLightUniformsLib } from 'https://esm.sh/three@0.152.2/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';

RectAreaLightUniformsLib.init();

// === SCENE SETUP ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.dithering = true;

// === LIGHTING ===
const areaLight = new THREE.RectAreaLight(0xffffff, 6, 12, 12);
areaLight.position.set(0, 0, -6);
areaLight.lookAt(0, 0, 0);
scene.add(areaLight);

// === MATERIAL & SPHERE ===
const geometry = new THREE.SphereGeometry(1.6, 128, 128);
const material = new THREE.MeshPhysicalMaterial({
  color: 0x000000,
  metalness: 0.2,
  roughness: 0.05,
  transmission: 1,
  thickness: 1.4,
  ior: 1.45,
  clearcoat: 1,
  clearcoatRoughness: 0.04,
  reflectivity: 0.6,
  attenuationColor: new THREE.Color(0x111111),
  attenuationDistance: 0.8
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// === PARTICLES (optional, background stars) ===
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 500;
const posArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 20;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particleMaterial = new THREE.PointsMaterial({
  size: 0.02,
  color: 0xffffff,
  transparent: true,
  opacity: 0.2,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// === WAVE DEFORMATION ===
const positionAttr = geometry.attributes.position;
const basePositions = positionAttr.array.slice(); // copy original
function updateRipples(time) {
  for (let i = 0; i < positionAttr.count; i++) {
    const ix = i * 3;
    const x = basePositions[ix];
    const y = basePositions[ix + 1];
    const z = basePositions[ix + 2];
    const r = Math.sqrt(x * x + y * y + z * z);
    const wave = 0.015 * Math.sin(10 * r - time * 2);
    positionAttr.array[ix] = x * (1 + wave);
    positionAttr.array[ix + 1] = y * (1 + wave);
    positionAttr.array[ix + 2] = z * (1 + wave);
  }
  positionAttr.needsUpdate = true;
  geometry.computeVertexNormals();
}

// === CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;

// === RESPONSIVE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === ANIMATION ===
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  updateRipples(time);
  sphere.rotation.y += 0.002;
  particles.rotation.y += 0.0005;
  renderer.render(scene, camera);
}
animate();