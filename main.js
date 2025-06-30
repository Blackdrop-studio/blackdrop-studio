import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';

// === SCENE SETUP ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.dithering = true;

// === MATERIAL & SPHERE ===
const const sphereMaterial = new THREE.MeshPhysicalMaterial({
  transmission: 1,
  roughness: 0.05,
  thickness: 1.2,
  metalness: 0.15,
  clearcoat: 1,
  clearcoatRoughness: 0.04,
  reflectivity: 0.6,
  ior: 1.45,
  attenuationColor: new THREE.Color(0x111111),
  attenuationDistance: 0.8,
  color: 0x000000
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);



// === LIGHTING ===
import { RectAreaLight } from 'https://esm.sh/three@0.152.2/examples/jsm/lights/RectAreaLight.js';
import { RectAreaLightUniformsLib } from 'https://esm.sh/three@0.152.2/examples/jsm/lights/RectAreaLightUniformsLib.js';

RectAreaLightUniformsLib.init();

const areaLight1 = new RectAreaLight(0xffffff, 2.5, 5, 5);
areaLight1.position.set(3, 3, 5);
areaLight1.lookAt(0, 0, 0);
scene.add(areaLight1);

const areaLight2 = new RectAreaLight(0xffffff, 1.8, 4, 4);
areaLight2.position.set(-3, -2, 4);
areaLight2.lookAt(0, 0, 0);
scene.add(areaLight2);

// === PARTICLES ===
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 600;
const pos = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  pos[i] = (Math.random() - 0.5) * 16;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const particleMaterial = new THREE.PointsMaterial({
  size: 0.02,
  color: 0xffffff,
  transparent: true,
  opacity: 0.2,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// === CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;

// === RESPONSIVE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === ANIMATE ===
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.002;
  sphere.rotation.x += 0.001;
  particles.rotation.y += 0.0008;
  sphereMaterial.uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
}
animate();