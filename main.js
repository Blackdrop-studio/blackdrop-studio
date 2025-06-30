import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.152.2/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('bgCanvas'),
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Sfera
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: 0x000000,
  metalness: 0.9,
  roughness: 0.3
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Luce
const light = new THREE.PointLight(0xffffff, 4);
light.position.set(5, 5, 5);
scene.add(light);

const ambient = new THREE.AmbientLight(0x111111);
scene.add(ambient);

// Controlli orbitali
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.4;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Testo animato
const texts = [
  'Loading...',
  'Ninja Content Creator',
  'Branding Specialist',
  'Video & Visuals',
  'Immersive Experiences'
];
let index = 0;
setInterval(() => {
  index = (index + 1) % texts.length;
  document.getElementById('tagline').innerText = texts[index];
}, 1200);