import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'https://esm.sh/three@0.152.2/examples/jsm/shaders/RGBShiftShader.js';

// === SCENE SETUP ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = false;

// === SPHERE (liquid-style) ===
const sphereGeometry = new THREE.SphereGeometry(1.7, 128, 128);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x0f0f0f,
  metalness: 0.3,
  roughness: 0.2,
  transmission: 0.65,       // Makes it translucent
  thickness: 1.5,           // Defines depth inside
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
  envMapIntensity: 1.0,
  reflectivity: 0.6
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// === LIGHTING ===
const rimLight = new THREE.DirectionalLight(0xffffff, 3.5);
rimLight.position.set(-4, 3, -6);
scene.add(rimLight);

const fillLight = new THREE.SpotLight(0x4444ff, 1.2, 20, Math.PI / 4, 0.3);
fillLight.position.set(2, 2, 4);
scene.add(fillLight);

const ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);

// === PARTICLES ===
const particleCount = 800;
const particleGeo = new THREE.BufferGeometry();
const posArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 22;
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.04,
  transparent: true,
  opacity: 0.18,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particleGeo, particlesMaterial);
scene.add(particles);

// === CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;

// === POST FX ===
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.65, 0.3, 0.7);
composer.addPass(bloomPass);
const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.0009;
composer.addPass(rgbShiftPass);

// === TEXT CYCLE ===
const headline = document.getElementById('headline');
const texts = ['Loading...', 'Ninja Content Creator', 'Branding Specialist', 'Video & Visuals', 'Immersive Experiences'];
let textIndex = 0;
const textCycle = setInterval(() => {
  textIndex = (textIndex + 1) % texts.length;
  headline.textContent = texts[textIndex];
}, 1500);

// === FINAL TEXT ===
function createBlackdropText() {
  const finalText = document.createElement('h1');
  finalText.textContent = 'BLACKDROP';
  finalText.style.position = 'absolute';
  finalText.style.top = '50%';
  finalText.style.left = '50%';
  finalText.style.transform = 'translate(-50%, -50%) scale(1.1)';
  finalText.style.fontSize = '3.8rem';
  finalText.style.letterSpacing = '0.2em';
  finalText.style.fontWeight = '700';
  finalText.style.color = '#ffffff';
  finalText.style.fontFamily = 'Outfit, sans-serif';
  finalText.style.opacity = '0';
  finalText.style.zIndex = '3';
  finalText.style.transition = 'opacity 2s ease, transform 2s ease';
  document.body.appendChild(finalText);

  setTimeout(() => {
    finalText.style.opacity = '1';
    finalText.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 200);
}

// === RESPONSIVE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// === TIMERS ===
setTimeout(() => {
  clearInterval(textCycle);
  headline.classList.add('glitch-out');
}, 6000);

setTimeout(() => {
  document.getElementById('overlay').style.opacity = 0;
}, 7200);

setTimeout(() => {
  document.getElementById('overlay').style.display = 'none';
  createBlackdropText();
}, 8500);

// === ANIMATE ===
let zoom = 0;
function animate() {
  requestAnimationFrame(animate);

  if (zoom < 400) {
    camera.position.z -= 0.008;
    zoom++;
  }

  // Rotate sphere and particles for dynamic effect
  sphere.rotation.y += 0.004;
  sphere.rotation.x += 0.002;
  particles.rotation.y -= 0.0007;

  controls.update();
  composer.render();
}
animate();