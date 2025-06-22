import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 3);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
document.getElementById('bg').appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const areaLight = new THREE.RectAreaLight(0xffffff, 4, 5, 5);
areaLight.position.set(5, 5, 5);
areaLight.lookAt(0, 0, 0);
scene.add(areaLight);

// Geometry: Fluid sphere with noise
const sphereGeometry = new THREE.SphereGeometry(1, 256, 256);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x111111,
  metalness: 1,
  roughness: 0.25,
  transmission: 0.85,
  thickness: 1.5,
  ior: 1.33,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Shader-based increspature
const clock = new THREE.Clock();
const vertexDisplacement = [];
for (let i = 0; i < sphereGeometry.attributes.position.count; i++) {
  vertexDisplacement.push(Math.random());
}

// Particles
const particleCount = 250;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  particlePositions[i] = (Math.random() - 0.5) * 10;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleMaterial = new THREE.PointsMaterial({
  size: 0.015,
  color: 0xffffff,
  opacity: 0.3,
  transparent: true,
  depthWrite: false,
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Controls (for dev)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;
controls.enableZoom = false;

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  const t = clock.getElapsedTime();

  // Zoom-in effect
  if (camera.position.z > 1.7) {
    camera.position.z -= 0.002;
  }

  // Surface increspature animation
  const position = sphere.geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const ix = i * 3;
    const iy = i * 3 + 1;
    const iz = i * 3 + 2;

    const noise = 0.015 * Math.sin(t * 2 + vertexDisplacement[i] * 10);
    position.array[ix] += noise;
    position.array[iy] += noise;
    position.array[iz] += noise;
  }
  position.needsUpdate = true;

  // Rotate the sphere
  sphere.rotation.y += 0.002;

  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});