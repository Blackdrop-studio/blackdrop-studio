import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/UnrealBloomPass.js';

// === SCENE ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 9;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.toneMappingExposure = 1.25;
renderer.dithering = true;

// === SPHERE (Translucent) ===
const sphereGeometry = new THREE.SphereGeometry(1.6, 128, 128);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  transmission: 0.98,
  roughness: 0.1,
  thickness: 1.5,
  metalness: 0,
  reflectivity: 0.05,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
  color: new THREE.Color(0x222222)
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// === LIGHTING ===
const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
keyLight.position.set(4, 5, 6);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
rimLight.position.set(-5, 3, -4);
scene.add(rimLight);

scene.add(new THREE.AmbientLight(0x111111));

// === PARTICLES (with motion trail simulation) ===
const particlesGeometry = new THREE.BufferGeometry();
const count = 700;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.03,
  transparent: true,
  opacity: 0.35,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// === CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotateSpeed = 1.5;
controls.enableDamping = true;
controls.dampingFactor = 0.04;
controls.enableZoom = false;

// === BLOOM ===
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.4, 0.4, 0.9);
composer.addPass(bloomPass);

// === RESPONSIVE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// === TEXT CYCLE & MORPH ===
const headline = document.getElementById('headline');
const texts = [
  'Loading...',
  'Ninja Content Creator',
  'Branding Specialist',
  'Video & Visuals',
  'Immersive Experiences'
];
let i = 0;
const cycle = setInterval(() => {
  i = (i + 1) % texts.length;
  headline.textContent = texts[i];
}, 1500);

// === GLITCH & FADE SEQUENCE ===
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

setTimeout(() => {
  createBlackdropText();
}, 8600);

// === ANIMATE ===
let zoomFrame = 0;
function animate() {
  requestAnimationFrame(animate);

  if (zoomFrame < 300) {
    camera.position.z -= 0.009;
    zoomFrame++;
  }

  sphere.rotation.y += 0.003;
  sphere.rotation.x += 0.0015;
  controls.update();
  composer.render();
}
animate();

// === BLACKDROP FINAL TEXT EMERGE ===
function createBlackdropText() {
  const finalText = document.createElement('h1');
  finalText.textContent = 'BLACKDROP';
  finalText.style.position = 'absolute';
  finalText.style.top = '50%';
  finalText.style.left = '50%';
  finalText.style.transform = 'translate(-50%, -50%)';
  finalText.style.fontSize = '3.2rem';
  finalText.style.letterSpacing = '0.25em';
  finalText.style.fontWeight = '700';
  finalText.style.color = '#ffffff';
  finalText.style.fontFamily = 'Outfit, sans-serif';
  finalText.style.opacity = '0';
  finalText.style.zIndex = '3';
  finalText.style.transition = 'opacity 2s ease, transform 2s ease';
  document.body.appendChild(finalText);

  setTimeout(() => {
    finalText.style.opacity = '1';
    finalText.style.transform = 'translate(-50%, -50%) scale(1.05)';
  }, 200);

  setTimeout(() => {
    finalText.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 2000);
}