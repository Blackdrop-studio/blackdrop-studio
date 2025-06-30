import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'https://esm.sh/three@0.152.2/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLight } from 'https://esm.sh/three@0.152.2/examples/jsm/lights/RectAreaLight.js';

RectAreaLightUniformsLib.init();

// === SCENE ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.dithering = true;

// === GEOMETRY & MATERIAL ===
const sphereGeometry = new THREE.SphereGeometry(1.6, 128, 128);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  transmission: 1,
  roughness: 0.08,
  thickness: 1.2,
  metalness: 0.15,
  clearcoat: 1,
  clearcoatRoughness: 0.03,
  reflectivity: 0.6,
  ior: 1.45,
  attenuationColor: new THREE.Color(0x111111),
  attenuationDistance: 0.8,
  color: 0x000000
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// === LIGHTS ===
const areaLight1 = new RectAreaLight(0xffffff, 3.5, 5, 5);
areaLight1.position.set(3, 3, 5);
areaLight1.lookAt(0, 0, 0);
scene.add(areaLight1);

const areaLight2 = new RectAreaLight(0xffffff, 2.5, 5, 5);
areaLight2.position.set(-4, -2, 5);
areaLight2.lookAt(0, 0, 0);
scene.add(areaLight2);

// === PARTICLES ===
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 600;
const pos = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  pos[i] = (Math.random() - 0.5) * 16;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const particleMaterial = new THREE.PointsMaterial({
  size: 0.02,
  color: 0xffffff,
  transparent: true,
  opacity: 0.2,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
particles.rotation.set(0, 0, 0);
scene.add(particles);

// === CONTROLS (DISABLED) ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;

// === RESIZE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === ANIMATION ===
function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.002;
  particles.rotation.y += 0.0006;
  renderer.render(scene, camera);
}
animate();