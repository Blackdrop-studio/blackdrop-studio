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
renderer.toneMappingExposure = 1.0;
renderer.dithering = true;

// === LIGHTS ===
const softBackLight = new THREE.DirectionalLight(0xffffff, 1000);
softBackLight.position.set(0, 0, -6);
softBackLight.castShadow = false;
scene.add(softBackLight);

const areaLight = new THREE.RectAreaLight(0xffffff, 4, 8, 8);
areaLight.position.set(3, 3, 3);
areaLight.lookAt(0, 0, 0);
scene.add(areaLight);

const fillLight = new THREE.HemisphereLight(0xeeeeee, 0x111111, 0.3);
scene.add(fillLight);

// === SPHERE WITH PHYSICAL MATERIAL (LIQUID LOOK) ===
const sphereGeometry = new THREE.SphereGeometry(1.6, 128, 128);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x000000,
  metalness: 0.2,
  roughness: 0.05,
  transmission: 1.0,
  thickness: 1.0,
  ior: 1.45,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  reflectivity: 0.8,
  attenuationDistance: 1.0,
  attenuationColor: new THREE.Color(0x222222)
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.geometry.computeVertexNormals();
scene.add(sphere);

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
  opacity: 0.25,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// === CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.2;

// === RESPONSIVE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === INCRESPATURE DINAMICHE ===
const positions = sphere.geometry.attributes.position.array;
const vertexCount = positions.length;
function updateSphereWave(time) {
  const pos = sphere.geometry.attributes.position;
  for (let i = 0; i < vertexCount; i += 3) {
    const x = pos.array[i];
    const y = pos.array[i + 1];
    const z = pos.array[i + 2];
    const r = Math.sqrt(x * x + y * y + z * z);
    const ripple = 0.02 * Math.sin(r * 10 - time * 2);
    pos.array[i] = x * (1 + ripple);
    pos.array[i + 1] = y * (1 + ripple);
    pos.array[i + 2] = z * (1 + ripple);
  }
  pos.needsUpdate = true;
  sphere.geometry.computeVertexNormals();
}

// === ANIMATION LOOP ===
let clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  updateSphereWave(elapsed);
  sphere.rotation.y += 0.003;
  sphere.rotation.x += 0.001;

  controls.update();
  renderer.render(scene, camera);
}
animate();
