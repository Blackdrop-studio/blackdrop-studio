import * as THREE from 'https://esm.sh/three@0.152.2';

// === SCENE SETUP ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;
renderer.dithering = true;

// === LIGHTS ===
const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
mainLight.position.set(4, 4, 6);
scene.add(mainLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
rimLight.position.set(-4, 2, -4);
scene.add(rimLight);

const ambient = new THREE.AmbientLight(0x111111);
scene.add(ambient);

// === SPHERE ===
const geometry = new THREE.SphereGeometry(1.4, 128, 128);
const material = new THREE.MeshPhysicalMaterial({
  metalness: 1.0,
  roughness: 0.1,
  clearcoat: 1,
  clearcoatRoughness: 0.05,
  reflectivity: 1,
  transmission: 0.95,
  thickness: 1.0,
  color: new THREE.Color(0x000000)
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// === INCRESPATURE DINAMICHE ===
sphere.geometry.computeVertexNormals();
const positionAttr = sphere.geometry.attributes.position;
const vertexCount = positionAttr.count;
const originalPositions = new Float32Array(positionAttr.array);

function updateWave(t) {
  for (let i = 0; i < vertexCount; i++) {
    const ix = i * 3;
    const x = originalPositions[ix];
    const y = originalPositions[ix + 1];
    const z = originalPositions[ix + 2];
    const r = Math.sqrt(x * x + y * y + z * z);
    const scale = 1 + 0.02 * Math.sin(8 * r - t * 3);
    positionAttr.array[ix] = x * scale;
    positionAttr.array[ix + 1] = y * scale;
    positionAttr.array[ix + 2] = z * scale;
  }
  positionAttr.needsUpdate = true;
  sphere.geometry.computeVertexNormals();
}

// === ANIMATION ===
let clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  updateWave(time);
  sphere.rotation.y += 0.002;
  renderer.render(scene, camera);
}
animate();

// === RESPONSIVE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});