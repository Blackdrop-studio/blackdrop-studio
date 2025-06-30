import * as THREE from 'https://esm.sh/three@0.152.2';
import { RectAreaLightUniformsLib } from 'https://esm.sh/three@0.152.2/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLight } from 'https://esm.sh/three@0.152.2/examples/jsm/lights/RectAreaLight.js';

RectAreaLightUniformsLib.init();

// === SCENE ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('bg'),
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.dithering = true;

// === LIGHTING ===
const areaLight = new RectAreaLight(0xffffff, 4.5, 8, 8);
areaLight.position.set(0, 3, -5);
areaLight.lookAt(0, 0, 0);
scene.add(areaLight);

const ambient = new THREE.AmbientLight(0x111111);
scene.add(ambient);

// === SPHERE ===
const geometry = new THREE.SphereGeometry(1.6, 128, 128);
const material = new THREE.MeshPhysicalMaterial({
  color: 0x000000,
  metalness: 0.3,
  roughness: 0.07,
  transmission: 1.0,
  thickness: 2.4,
  ior: 1.35,
  clearcoat: 1.0,
  clearcoatRoughness: 0.03,
  reflectivity: 0.4,
  attenuationColor: new THREE.Color(0x111111),
  attenuationDistance: 1.25
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// === PARTICLES ===
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 400;
const posArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 20;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particleMaterial = new THREE.PointsMaterial({
  size: 0.015,
  color: 0xffffff,
  transparent: true,
  opacity: 0.15,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// === WAVE DEFORMATION ===
const basePositions = geometry.attributes.position.array.slice();
const positionAttr = geometry.attributes.position;
function updateRipples(time) {
  for (let i = 0; i < positionAttr.count; i++) {
    const ix = i * 3;
    const x = basePositions[ix];
    const y = basePositions[ix + 1];
    const z = basePositions[ix + 2];
    const r = Math.sqrt(x * x + y * y + z * z);
    const ripple = 0.015 * Math.sin(12 * r - time * 2.2);
    positionAttr.array[ix] = x * (1 + ripple);
    positionAttr.array[ix + 1] = y * (1 + ripple);
    positionAttr.array[ix + 2] = z * (1 + ripple);
  }
  positionAttr.needsUpdate = true;
  geometry.computeVertexNormals();
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
  const time = clock.getElapsedTime();
  updateRipples(time);
  sphere.rotation.y += 0.0025;
  particles.rotation.y += 0.0004;
  renderer.render(scene, camera);
}
animate();