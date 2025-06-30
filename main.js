import * as THREE from 'https://esm.sh/three';
import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';

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
renderer.toneMappingExposure = 1.2;
renderer.dithering = true;

// === LIGHTS ===
const keyLight = new THREE.SpotLight(0xffffff, 1.5, 100, Math.PI / 4, 1, 2);
keyLight.position.set(5, 5, 5);
keyLight.target.position.set(0, 0, 0);
scene.add(keyLight);
scene.add(keyLight.target);

const fillLight = new THREE.HemisphereLight(0xeeeeee, 0x111111, 0.3);
scene.add(fillLight);

// === SPHERE WITH PHYSICAL MATERIAL (LIQUID LOOK) ===
const sphereGeometry = new THREE.SphereGeometry(1.6, 128, 128);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x000000,
  metalness: 0.1,
  roughness: 0.05,
  transmission: 0.8,
  thickness: 0.5,
  ior: 1.45,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
  reflectivity: 0.2,
  attenuationDistance: 0.8,
  attenuationColor: new THREE.Color(0x111111)
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.geometry.computeVertexNormals();
scene.add(sphere);

// === PARTICLES ===
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 800;
const pos = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  pos[i] = (Math.random() - 0.5) * 18;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const particleMaterial = new THREE.PointsMaterial({
  size: 0.015,
  color: 0xffffff,
  transparent: true,
  opacity: 0.2,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// === CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.enabled = false;

// === INCRESPATURE DINAMICHE ===
const positions = sphere.geometry.attributes.position.array;
const vertexCount = positions.length;
function updateSphereWave(time) {
  const pos = sphere.geometry.attributes.position;
  for (let i = 0; i < vertexCount; i += 3) {
    const x = pos.array[i];
    const y = pos.array[i + 1];
    const z = pos.array[i + 2];
    const r = Math.sqrt(x * x + y * y + z * z);
    const ripple = 0.02 * Math.sin(r * 8 - time * 2);
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

// === ANIMATION LOOP ===
let clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();
  updateSphereWave(elapsed);
  sphere.rotation.y += 0.002;
  sphere.rotation.x += 0.001;
  particles.rotation.y += 0.001;
  renderer.render(scene, camera);
}
animate();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Light
const light = new THREE.HemisphereLight(0xffffff, 0x222222, 1.2);
scene.add(light);

// Sphere
const geo = new THREE.SphereGeometry(1.5, 128, 128);
const mat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.2, metalness: 0.3 });
const sphere = new THREE.Mesh(geo, mat);
scene.add(sphere);

// Animate
function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.002;
  renderer.render(scene, camera);
}
animate();