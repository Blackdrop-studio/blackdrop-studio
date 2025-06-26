import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';

// === SCENE ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;

// === LIGHTING ===
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111111, 1.2);
scene.add(hemiLight);

// === SPHERE ===
const geometry = new THREE.SphereGeometry(1.6, 128, 128);
const material = new THREE.MeshPhysicalMaterial({
  color: 0x000000,
  metalness: 0.4,
  roughness: 0.05,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
  transmission: 0.9,
  ior: 1.45,
  thickness: 0.5
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// === PARTICLES ===
const particleGeometry = new THREE.BufferGeometry();
const count = 800;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 12;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.015,
  transparent: true,
  opacity: 0.2,
  blending: THREE.AdditiveBlending
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// === CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.5;

// === RESIZE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === ANIMATION LOOP ===
function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.002;
  particles.rotation.y += 0.001;
  controls.update();
  renderer.render(scene, camera);
}
animate();
