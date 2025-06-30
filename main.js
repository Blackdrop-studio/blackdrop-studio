import * as THREE from 'https://esm.sh/three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Light
const light = new THREE.HemisphereLight(0xffffff, 0x222222, 1.2);
scene.add(light);

// Sphere
const geo = new THREE.SphereGeometry(1.5, 128, 128);
const mat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.2, metalness: 0.3 });
const sphere = new THREE.Mesh(geo, mat);
scene.add(sphere);

// Animate
function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.002;
  renderer.render(scene, camera);
}
animate();