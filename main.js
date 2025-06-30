import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';

// === SCENE SETUP ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;

// === LIGHTING ===
scene.add(new THREE.HemisphereLight(0xffffff, 0x111111, 1.2));

// BACK LIGHT FIXA
const backLight = new THREE.DirectionalLight(0xffffff, 1.3);
backLight.position.set(0, 0, -5); // dietro la sfera
scene.add(backLight);

// === SPHERE SETUP ===
const geo = new THREE.SphereGeometry(1.6, 128, 128);
const mat = new THREE.MeshPhysicalMaterial({
  color: 0x111111,
  metalness: 0.2,
  roughness: 0.08,
  transmission: 0.95,
  thickness: 1.5,
  ior: 1.2,
  clearcoat: 1,
  clearcoatRoughness: 0.08
});
const sphere = new THREE.Mesh(geo, mat);
scene.add(sphere);

// === DYNAMIC VERTEX WAVES (INCRESPATURE) ===
const originalPositions = geo.attributes.position.array.slice();
const updateRipples = (time) => {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const ix = i * 3;
    const x = originalPositions[ix];
    const y = originalPositions[ix + 1];
    const z = originalPositions[ix + 2];
    const r = Math.sqrt(x * x + y * y + z * z);
    const ripple = 0.015 * Math.sin(r * 10 - time * 2);
    pos.array[ix] = x + x * ripple;
    pos.array[ix + 1] = y + y * ripple;
    pos.array[ix + 2] = z + z * ripple;
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
};

// === PARTICLES ===
const particleGeo = new THREE.BufferGeometry();
const count = 700;
const posArray = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 18;
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particleMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.02,
  transparent: true,
  opacity: 0.25,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// === CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 1.2;
controls.enableZoom = false;
controls.enablePan = false;

// === TEXT ROTATION ===
const phrases = [
  'Loading...',
  'Ninja Content Creator',
  'Branding Specialist',
  'Video & Visuals',
  'Immersive Experiences'
];

const headline = document.getElementById('headline');
let i = 0;
const cycle = setInterval(() => {
  i = (i + 1) % phrases.length;
  headline.textContent = phrases[i];
}, 1500);

setTimeout(() => {
  clearInterval(cycle);
  headline.classList.add('glitch-out');
}, 6000);

setTimeout(() => {
  document.getElementById('overlay').style.opacity = 0;
}, 7500);

setTimeout(() => {
  document.getElementById('overlay').style.display = 'none';
}, 9000);

// === LOOP ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  updateRipples(t);
  particles.rotation.y += 0.0008;
  sphere.rotation.y += 0.001;
  controls.update();
  renderer.render(scene, camera);
}
animate();