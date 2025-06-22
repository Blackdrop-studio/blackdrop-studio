import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'https://esm.sh/three@0.152.2/examples/jsm/shaders/RGBShiftShader.js';

// SCENE SETUP
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
renderer.toneMappingExposure = 1.35;
renderer.dithering = true;

// LIQUID SPHERE
const sphereGeometry = new THREE.SphereGeometry(1.6, 128, 128);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x0a0a0a,
  roughness: 0.15,
  metalness: 0.85,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
  transmission: 0.6,
  thickness: 1.2,
  ior: 1.45,
  sheen: 0.2
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// LIGHTING
// LUCI
const backLight = new THREE.DirectionalLight(0x3377ff, 0.8);
backLight.position.set(-2, 1, -5);
backLight.castShadow = false;
scene.add(backLight);

const keyLight = new THREE.SpotLight(0xffffff, 1.8, 30, Math.PI / 5, 0.7, 2);
keyLight.position.set(3, 5, 5);
keyLight.target = sphere;
keyLight.castShadow = false;
scene.add(keyLight);

const fillLight = new THREE.PointLight(0xffaa88, 0.5, 20);
fillLight.position.set(-3, -2, 4);
scene.add(fillLight);

const ambientLight = new THREE.AmbientLight(0x111111, 1.5);
scene.add(ambientLight);

// PARTICLES
const particleCount = 1200;
const particleGeo = new THREE.BufferGeometry();
const posArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 18;
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.025,
  transparent: true,
  opacity: 0.18,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particleGeo, particlesMaterial);
scene.add(particles);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 1.2;
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true;

// POST FX
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.4, 0.4, 0.85));
const chromaticAberration = new ShaderPass(RGBShiftShader);
chromaticAberration.uniforms['amount'].value = 0.0015;
composer.addPass(chromaticAberration);

// TEXT CYCLE
const headline = document.getElementById('headline');
const texts = ['Loading...', 'Ninja Content Creator', 'Branding Specialist', 'Video & Visuals', 'Immersive Experiences'];
let textIndex = 0;
const textCycle = setInterval(() => {
  textIndex = (textIndex + 1) % texts.length;
  headline.textContent = texts[textIndex];
}, 1500);

// FINAL TEXT
function createBlackdropText() {
  const finalText = document.createElement('h1');
  finalText.textContent = 'BLACKDROP';
  finalText.style.position = 'absolute';
  finalText.style.top = '50%';
  finalText.style.left = '50%';
  finalText.style.transform = 'translate(-50%, -50%) scale(1.1)';
  finalText.style.fontSize = '3.5rem';
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

// RESPONSIVE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// TIMERS
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

// ANIMATE
let zoom = 0;
function animate() {
  requestAnimationFrame(animate);

  if (zoom < 400) {
    camera.position.z -= 0.008;
    zoom++;
  }

  // deformazione liquida della mesh
  const time = performance.now() * 0.001;
  sphere.geometry.verticesNeedUpdate = true;
  sphere.rotation.y += 0.003;
  sphere.rotation.x += 0.0015;

  controls.update();
  composer.render();
}
animate();