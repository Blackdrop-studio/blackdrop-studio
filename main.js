import * as THREE from 'https://esm.sh/three@0.152.2';

// === SCENE ===
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

// === LIGHTING ===
const backLight = new THREE.DirectionalLight(0xffffff, 2);
backLight.position.set(0, 0, -6);
scene.add(backLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
rimLight.position.set(5, 5, 5);
scene.add(rimLight);

const fillLight = new THREE.HemisphereLight(0xeeeeee, 0x111111, 0.4);
scene.add(fillLight);

// === SPHERE ===
const sphereGeometry = new THREE.SphereGeometry(1.6, 128, 128);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x000000,
  metalness: 0.4,
  roughness: 0.15,
  transmission: 1.0,
  thickness: 1.0,
  ior: 1.45,
  clearcoat: 1.0,
  clearcoatRoughness: 0.03,
  reflectivity: 0.9,
  attenuationDistance: 1.2,
  attenuationColor: new THREE.Color(0x111111)
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.geometry.computeVertexNormals();
scene.add(sphere);

// === PARTICLES ===
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 800;
const pos = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  pos[i] = (Math.random() - 0.5) * 16;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const particleMaterial = new THREE.PointsMaterial({
  size: 0.015,
  color: 0xffffff,
  transparent: true,
  opacity: 0.2,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// === RESPONSIVE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === INCRESPATURE ===
const vertexArray = sphere.geometry.attributes.position.array;
const vertexCount = vertexArray.length;
function updateSphereWave(time) {
  const pos = sphere.geometry.attributes.position;
  for (let i = 0; i < vertexCount; i += 3) {
    const x = pos.array[i];
    const y = pos.array[i + 1];
    const z = pos.array[i + 2];
    const r = Math.sqrt(x * x + y * y + z * z);
    const ripple = 0.01 * Math.sin(r * 12 - time * 2);
    pos.array[i] = x * (1 + ripple);
    pos.array[i + 1] = y * (1 + ripple);
    pos.array[i + 2] = z * (1 + ripple);
  }
  pos.needsUpdate = true;
  sphere.geometry.computeVertexNormals();
}

// === ANIMATION ===
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  updateSphereWave(t);
  sphere.rotation.y += 0.0025;
  sphere.rotation.x += 0.001;
  particles.rotation.y += 0.001;
  particles.rotation.x += 0.0005;

  renderer.render(scene, camera);
}
animate();