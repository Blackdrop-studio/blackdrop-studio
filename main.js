import * as THREE from 'https://esm.sh/three@0.152.2';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;

const geometry = new THREE.SphereGeometry(1.6, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.4, metalness: 1 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(2, 2, 4);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();