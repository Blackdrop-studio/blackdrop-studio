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
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.physicallyCorrectLights = true;

// === LIGHTING (cinematic) ===
scene.add(new THREE.AmbientLight(0x222222, 1.2));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
keyLight.position.set(5, 5, 5);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
rimLight.position.set(-5, 3, -5);
scene.add(rimLight);

// === GROUP (sfera + particelle) ===
const group = new THREE.Group();
scene.add(group);

// === SPHERE ===
const sphereGeometry = new THREE.SphereGeometry(1.6, 128, 128);

const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x000000,
  metalness: 0.4,
  roughness: 0.08,
  transmission: 0.6,         // meno trasparente
  thickness: 1.2,
  ior: 1.45,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  reflectivity: 0.8,
  attenuationDistance: 1.0,
  attenuationColor: new THREE.Color(0x222222)
});

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
group.add(sphere);

// === INCRESPATURE ===
sphere.geometry.computeVertexNormals();
const positions = sphere.geometry.attributes.position.array;
const vertexCount = positions.length;

function updateSphereWave(time) {
  const pos = sphere.geometry.attributes.position;
  for (let i = 0; i < vertexCount; i += 3) {
    const x = pos.array[i];
    const y = pos.array[i + 1];
    const z = pos.array[i + 2];
    const r = Math.sqrt(x * x + y * y + z * z);
    const ripple = 0.015 * Math.sin(r * 10 - time * 2);
    pos.array[i] = x * (1 + ripple);
    pos.array[i + 1] = y * (1 + ripple);
    pos.array[i + 2] = z * (1 + ripple);
  }
  pos.needsUpdate = true;
  sphere.geometry.computeVertexNormals();
}

// === PARTICLES ===
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 600;
const posArr = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  posArr[i] = (Math.random() - 0.5) * 16;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
const particleMaterial = new THREE.PointsMaterial({
  size: 0.02,
  color: 0xffffff,
  transparent: true,
  opacity: 0.25,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
group.add(particles);

// === CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.enabled = false; // disabilitiamo tutto, gestiamo la rotazione noi

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

  // Ruota l’intero gruppo
  group.rotation.y += 0.002;
  group.rotation.x += 0.0008;

  renderer.render(scene, camera);
}
animate();