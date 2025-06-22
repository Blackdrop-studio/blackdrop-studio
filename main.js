import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';

// === SCENE & RENDERER ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;

// === LIGHTS ===
scene.add(new THREE.HemisphereLight(0xffffff, 0x111111, 1.0));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
dirLight.position.set(-5, 3, 5);
scene.add(dirLight);
scene.add(new THREE.AmbientLight(0x111111, 0.5));

// === GROUP WRAPPER ===
const group = new THREE.Group();
scene.add(group);

// === SFERA ===
const sphereGeometry = new THREE.SphereGeometry(1.6, 128, 128);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x0a0a0a,
  metalness: 0.9,
  roughness: 0.05,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
  reflectivity: 1.0,
  sheen: 0.5,
  sheenRoughness: 0.25,
  sheenColor: new THREE.Color(0x222222)
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
group.add(sphere);

// === PARTICELLE ===
const particleGeometry = new THREE.BufferGeometry();
const count = 600;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 16;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMaterial = new THREE.PointsMaterial({
  size: 0.015,
  color: 0xffffff,
  transparent: true,
  opacity: 0.2,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
group.add(particles);

// === INCRESPATURE ===
const posAttr = sphere.geometry.attributes.position;
const basePositions = posAttr.array.slice(); // clone originale
function updateRipples(time) {
  for (let i = 0; i < posAttr.count; i++) {
    const ix = i * 3;
    const x = basePositions[ix];
    const y = basePositions[ix + 1];
    const z = basePositions[ix + 2];
    const r = Math.sqrt(x * x + y * y + z * z);
    const ripple = 0.01 * Math.sin(r * 12 - time * 2);
    posAttr.array[ix] = x * (1 + ripple);
    posAttr.array[ix + 1] = y * (1 + ripple);
    posAttr.array[ix + 2] = z * (1 + ripple);
  }
  posAttr.needsUpdate = true;
  sphere.geometry.computeVertexNormals();
}

// === TEXT OVERLAY ===
const overlay = document.createElement('div');
overlay.style.position = 'absolute';
overlay.style.top = '50%';
overlay.style.left = '50%';
overlay.style.transform = 'translate(-50%, -50%)';
overlay.style.fontSize = '3.2rem';
overlay.style.fontFamily = 'Outfit, sans-serif';
overlay.style.letterSpacing = '0.12em';
overlay.style.color = '#ffffff';
overlay.style.zIndex = '10';
overlay.style.opacity = '0';
overlay.style.transition = 'opacity 1s ease';
overlay.innerText = 'Loading...';
document.body.appendChild(overlay);

// === TESTO DINAMICO CON TIMING ===
const phrases = [
  'Loading...',
  'Ninja Content Creator',
  'Branding Specialist',
  'Video & Visuals',
  'Immersive Experiences',
  'BLACKDROP'
];

let phraseIndex = 0;
setTimeout(() => overlay.style.opacity = '1', 500);

const phraseInterval = setInterval(() => {
  phraseIndex++;
  if (phraseIndex < phrases.length) {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.innerText = phrases[phraseIndex];
      overlay.style.opacity = '1';
    }, 500);
  } else {
    clearInterval(phraseInterval);
  }
}, 2500);

// === RESIZE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === ANIMATE ===
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  updateRipples(t);

  group.rotation.y += 0.002;
  group.rotation.x += 0.0005;

  renderer.render(scene, camera);
}
animate();