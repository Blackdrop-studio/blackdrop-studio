import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';

// SCENE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 9;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;

// LIGHT
scene.add(new THREE.HemisphereLight(0xffffff, 0x111111, 1.5));

// SPHERE
const geo = new THREE.SphereGeometry(1.6, 128, 128);
const mat = new THREE.MeshPhysicalMaterial({
  color: 0x0a0a0a,
  metalness: 0.6,
  roughness: 0.1,
  transmission: 1.0,
  thickness: 1.5,
  clearcoat: 1.0,
  reflectivity: 1.0
});
const sphere = new THREE.Mesh(geo, mat);
scene.add(sphere);

// PARTICLES
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

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotateSpeed = 1.2;

// TEXT ROTATION
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

// EXIT SEQUENCE
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

// LOOP
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  particles.rotation.y += 0.0008;
  sphere.rotation.y += 0.001;
  controls.update();
  renderer.render(scene, camera);
}
animate();