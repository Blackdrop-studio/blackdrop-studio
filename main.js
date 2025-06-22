import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/UnrealBloomPass.js';

// === SCENE ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.toneMappingExposure = 1.2;
renderer.dithering = true;

// === SPHERE ===
const geometry = new THREE.SphereGeometry(1.5, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 1, roughness: 0.4 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// === LIGHTING ===
const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
keyLight.position.set(5, 5, 5);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
rimLight.position.set(-5, 2, -5);
scene.add(rimLight);

scene.add(new THREE.AmbientLight(0x111111));

// === PARTICLES ===
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 500;
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < posArray.length; i++) {
  posArray[i] = (Math.random() - 0.5) * 20;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.03,
  transparent: true,
  opacity: 0.4,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// === CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotateSpeed = 1.2;
controls.enableDamping = true;
controls.dampingFactor = 0.04;
controls.enableZoom = false;

// === BLOOM ===
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.4, 0.4, 0.85);
composer.addPass(bloomPass);

// === RESPONSIVE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// === ANIMATE ===
let zoomFrame = 0;
function animate() {
  requestAnimationFrame(animate);

  if (zoomFrame < 240) {
    camera.position.z -= 0.01;
    zoomFrame++;
  }

  sphere.rotation.y += 0.002;

  controls.update();
  composer.render();
}
animate();

// === TEXT LOOP & GLITCH ===
const texts = [
  'Loading...',
  'Ninja Content Creator',
  'Branding Specialist',
  'Video & Visuals',
  'Immersive Experiences'
];

let index = 0;
const headline = document.getElementById('headline');
const cycle = setInterval(() => {
  index = (index + 1) % texts.length;
  headline.textContent = texts[index];
}, 1500);

// === GLITCH & FADE ===
setTimeout(() => {
  clearInterval(cycle);
  headline.classList.add('glitch-out');
}, 6000);

setTimeout(() => {
  document.getElementById('overlay').style.opacity = 0;
}, 7500);

setTimeout(() => {
  document.getElementById('overlay').style.display = 'none';
}, 8500);