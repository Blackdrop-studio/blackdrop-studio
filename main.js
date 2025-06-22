import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/UnrealBloomPass.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Sfera nera
const geometry = new THREE.SphereGeometry(2.2, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 1, roughness: 0.4 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Luce
const light = new THREE.PointLight(0xffffff, 4);
light.position.set(10, 10, -10);
scene.add(light);

// Controlli orbitanti
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotateSpeed = 2;
controls.enableDamping = true;
controls.dampingFactor = 0.04;

// Bloom
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
composer.addPass(bloomPass);

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// Particelle fluttuanti (punti sottili)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 500;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 20;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.03,
  transparent: true,
  opacity: 0.4
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Animazione
let frame = 0;
function animate() {
  requestAnimationFrame(animate);

  if (frame < 120) { // primi 2 secondi
    camera.position.z -= 0.01;
    frame++;
  }

  controls.update();
  composer.render();
}

// Testo dinamico
const texts = [
  'Loading...',
  'Ninja Content Creator',
  'Branding Specialist',
  'Video & Visuals',
  'Immersive Experiences'
];

let index = 0;
const headline = document.getElementById('headline');
setInterval(() => {
  index = (index + 1) % texts.length;
  headline.textContent = texts[index];
}, 1500);

// Testo dinamico + glitch finale
let index = 0;
const headline = document.getElementById('headline');
const texts = [
  'Loading...',
  'Ninja Content Creator',
  'Branding Specialist',
  'Video & Visuals',
  'Immersive Experiences'
];

const cycle = setInterval(() => {
  index = (index + 1) % texts.length;
  headline.textContent = texts[index];
}, 1500);

// Glitch finale + fade
setTimeout(() => {
  clearInterval(cycle);
  headline.classList.add('glitch-out');
}, 4500);

// Rimuove overlay
setTimeout(() => {
  document.getElementById('overlay').style.display = 'none';
}, 6500);