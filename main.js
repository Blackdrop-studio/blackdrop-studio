import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/UnrealBloomPass.js';

// === SCENE ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// === CAMERA ===
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 10);

// === RENDERER ===
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.toneMappingExposure = 1.2;
renderer.dithering = true;

// === LIGHTS ===
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.3);
keyLight.position.set(4, 6, 5);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
fillLight.position.set(-3, -2, -6);
scene.add(fillLight);

// === SPHERE ===
const sphereGeometry = new THREE.SphereGeometry(1.6, 128, 128);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x111111,
  metalness: 0.9,
  roughness: 0.25,
  emissive: new THREE.Color(0x111111),
  emissiveIntensity: 0.25
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// === DEFORMATION LOOP ===
const basePositions = sphere.geometry.attributes.position.array.slice();
let time = 0;
function updateSphereDeformation() {
  const pos = sphere.geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const ix = i * 3, iy = ix + 1, iz = ix + 2;
    const ox = basePositions[ix];
    const oy = basePositions[iy];
    const oz = basePositions[iz];
    const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
    const offset = 0.03 * Math.sin(time * 1.2 + len * 4.0);
    pos.array[ix] = ox + (ox / len) * offset;
    pos.array[iy] = oy + (oy / len) * offset;
    pos.array[iz] = oz + (oz / len) * offset;
  }
  pos.needsUpdate = true;
}

// === PARTICLES ===
const particleCount = 1000;
const particleGeo = new THREE.BufferGeometry();
const posArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 18;
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particleMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.015,
  transparent: true,
  opacity: 0.18,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// === CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.6;
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true;

// === POST FX ===
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.85, 0.4, 0.75));

// === RESPONSIVE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// === ANIMATE ===
let zoom = 0;
function animate() {
  requestAnimationFrame(animate);
  if (zoom < 400) {
    camera.position.z -= 0.007;
    zoom++;
  }

  time += 0.008;
  updateSphereDeformation();
  controls.update();
  composer.render();
}
animate();