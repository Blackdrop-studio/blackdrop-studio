import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/UnrealBloomPass.js';

// SCENE SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.toneMappingExposure = 1.1;
renderer.dithering = true;

// SPHERE
const geometry = new THREE.SphereGeometry(2.2, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 1, roughness: 0.4 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// LIGHTS
// Luce principale morbida
const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(5, 5, 5);
scene.add(keyLight);

// Rim light laterale
const rimLight = new THREE.DirectionalLight(0x8888ff, 0.6);
rimLight.position.set(-5, 2, -5);
scene.add(rimLight);

// Ambient soft
scene.add(new THREE.AmbientLight(0x222222));

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotateSpeed = 2;
controls.enableDamping = true;
controls.dampingFactor = 0.04;
controls.enableZoom = false;

// BLOOM
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
composer.addPass(bloomPass);

// PARTICLES
const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.05,
  transparent: true,
  opacity: 0.5,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

// RESPONSIVE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// ANIMATE
let frame = 0;
let zoomFrame = 0;
animate();
function animate() {
  requestAnimationFrame(animate);

  // Zoom continuo con easing leggero
  if (zoomFrame < 180) {
    camera.position.z -= 0.015;
    zoomFrame++;
  }

  // Rotazione manuale + controllo
  sphere.rotation.y += 0.002;

  controls.update();
  composer.render();
}

// TEXT GLITCH SEQUENCE
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

// glitch finale + fade
setTimeout(() => {
  clearInterval(cycle);
  headline.classList.add('glitch-out');
}, 4500);

// rimuove overlay
setTimeout(() => {
  document.getElementById('overlay').style.display = 'none';
}, 6500);

setTimeout(() => {
  document.getElementById('subtext').classList.add('fade-out');
}, 4500);