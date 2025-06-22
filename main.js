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
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.toneMappingExposure = 1.25;
renderer.dithering = true;

// === PARTICLES ===
const particleCount = 1500;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 18;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.02,
  transparent: true,
  opacity: 0.3,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// === LIQUID SPHERE ===
const sphereGeometry = new THREE.SphereGeometry(1.6, 128, 128);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x111111,
  roughness: 0.25,
  metalness: 0.2,
  emissive: new THREE.Color(0x111122),
  emissiveIntensity: 0.6
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// === LIGHTING ===
const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
mainLight.position.set(4, 4, 4);
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x5555ff, 0.4);
fillLight.position.set(-4, 2, -3);
scene.add(fillLight);

scene.add(new THREE.AmbientLight(0x080808));

// === POST-PROCESSING ===
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.4, 0.85));
const rgbPass = new ShaderPass(RGBShiftShader);
rgbPass.uniforms['amount'].value = 0.001;
composer.addPass(rgbPass);

// === CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 1.1;
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true;

// === TEXT LOOP ===
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
  Object.assign(finalText.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(1.1)',
    fontSize: '3.5rem',
    letterSpacing: '0.2em',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Outfit, sans-serif',
    opacity: '0',
    zIndex: '3',
    transition: 'opacity 2s ease, transform 2s ease'
  });
  document.body.appendChild(finalText);
  setTimeout(() => {
    finalText.style.opacity = '1';
    finalText.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 200);
}

// === TIMING ===
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

// === ANIMATION ===
let clock = new THREE.Clock();
let zoom = 0;
const initialPositions = sphereGeometry.attributes.position.array.slice();

function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();

  // Animate sphere like fluid
  const positions = sphereGeometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    const ix = i, iy = i + 1, iz = i + 2;
    const offset = Math.sin(time * 2 + ix * 0.01 + iy * 0.01 + iz * 0.01) * 0.02;
    positions[ix] = initialPositions[ix] + offset;
    positions[iy] = initialPositions[iy] + offset;
    positions[iz] = initialPositions[iz] + offset;
  }
  sphereGeometry.attributes.position.needsUpdate = true;

  if (zoom < 400) {
    camera.position.z -= 0.008;
    zoom++;
  }

  controls.update();
  composer.render();
}
animate();

// === RESPONSIVE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});