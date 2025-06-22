import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.152.2/examples/jsm/controls/OrbitControls.js';

// Scena e camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bgCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sfera nera metallizzata
const geometry = new THREE.SphereGeometry(2, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: 0x111111,
  metalness: 1,
  roughness: 0.4
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Luce posteriore
const light = new THREE.PointLight(0xffffff, 6);
light.position.set(10, 10, -10);
scene.add(light);

// Camera
camera.position.z = 8;

// Controlli orbitali
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.4;

// Testo dinamico
const texts = [
  'Loading...',
  'Ninja Content Creator',
  'Branding Specialist',
  'Video & Visuals',
  'Immersive Experiences'
];
let index = 0;
const textContainer = document.getElementById('dynamicText');

setInterval(() => {
  if (textContainer) {
    textContainer.textContent = texts[index];
    index = (index + 1) % texts.length;
  }
}, 1200);

// Animazione
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();