import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';

// === SCENA E RENDERER ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('bg'),
  antialias: true
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;
renderer.shadowMap.enabled = false;

// === MATERIALE SPHERA FLUIDA ===
const sphereGeometry = new THREE.SphereGeometry(1.6, 128, 128);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x111111,
  roughness: 0.25,
  metalness: 0.4,
  transmission: 0.95,
  thickness: 1.2,
  ior: 1.5,
  clearcoat: 0.6,
  clearcoatRoughness: 0.1
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// === LUCI CINEMATICHE ===
// Luce ambientale diffusa
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Luce direzionale soft
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(4, 5, 6);
directionalLight.castShadow = false;
scene.add(directionalLight);

// Seconda luce più calda
const warmLight = new THREE.DirectionalLight(0xffccaa, 1.2);
warmLight.position.set(-3, 2, 4);
scene.add(warmLight);

// === PARTICELLE SOFT ===
const particleCount = 1000;
const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.02,
  transparent: true,
  opacity: 0.15,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// === CONTROLLI E CAMERA ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 1.2;
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;

// === TEXT OVERLAY ===
const headline = document.getElementById('headline');
const texts = ['Loading...', 'Ninja Content Creator', 'Branding Specialist', 'Video & Visuals', 'Immersive Experiences'];
let index = 0;
const textCycle = setInterval(() => {
  index = (index + 1) % texts.length;
  headline.textContent = texts[index];
}, 1500);

// === OVERLAY E TESTO ===
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

setTimeout(() => { clearInterval(textCycle); headline.classList.add('glitch-out'); }, 6000);
setTimeout(() => { document.getElementById('overlay').style.opacity = 0; }, 7200);
setTimeout(() => { document.getElementById('overlay').style.display = 'none'; createBlackdropText(); }, 8500);

// === RESIZE ===
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// === ANIMAZIONE ===
let zoom = 0;
function animate() {
  requestAnimationFrame(animate);
  if (zoom < 300) {
    camera.position.z -= 0.008;
    zoom++;
  }
  sphere.rotation.y += 0.003;
  controls.update();
  renderer.render(scene, camera);
}
animate();