// === BLACKDROP LOADING SEQUENCE RESET ===

import * as THREE from 'https://esm.sh/three@0.152.2';

// === SCENE SETUP ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;

// === DARK LIQUID SHAPE ===
const geometry = new THREE.IcosahedronGeometry(1.5, 5);
const material = new THREE.MeshStandardMaterial({
  color: 0x000000,
  roughness: 0.2,
  metalness: 0.6,
  flatShading: true
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// === LIGHTING ===
const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(2, 2, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x111111));

// === LOGO ELEMENT ===
const logo = document.createElement('div');
logo.id = 'logo';
logo.innerText = 'BLACKDROP';
logo.style.position = 'absolute';
logo.style.top = '5vh';
logo.style.left = '50%';
logo.style.transform = 'translateX(-50%)';
logo.style.color = '#fff';
logo.style.fontSize = '1.2rem';
logo.style.fontWeight = '700';
logo.style.fontFamily = 'Outfit, sans-serif';
document.body.appendChild(logo);

// === PROGRESS BAR ===
const progressContainer = document.createElement('div');
progressContainer.style.position = 'absolute';
progressContainer.style.bottom = '10vh';
progressContainer.style.left = '50%';
progressContainer.style.transform = 'translateX(-50%)';
progressContainer.style.width = '60%';
progressContainer.style.height = '6px';
progressContainer.style.background = '#333';
progressContainer.style.borderRadius = '3px';

const progressBar = document.createElement('div');
progressBar.style.height = '100%';
progressBar.style.width = '0%';
progressBar.style.background = '#fff';
progressBar.style.borderRadius = '3px';
progressBar.style.transition = 'width 0.2s ease';
progressContainer.appendChild(progressBar);
document.body.appendChild(progressContainer);

const percentText = document.createElement('div');
percentText.innerText = 'Loading 0%';
percentText.style.position = 'absolute';
percentText.style.bottom = '8vh';
percentText.style.left = '50%';
percentText.style.transform = 'translateX(-50%)';
percentText.style.color = '#aaa';
percentText.style.fontFamily = 'Outfit, sans-serif';
percentText.style.fontSize = '0.9rem';
document.body.appendChild(percentText);

// === LOADING SIMULATION ===
let loadProgress = 0;
const loadingInterval = setInterval(() => {
  loadProgress += Math.random() * 5;
  if (loadProgress >= 100) {
    loadProgress = 100;
    clearInterval(loadingInterval);
  }
  progressBar.style.width = `${loadProgress}%`;
  percentText.innerText = `Loading ${Math.floor(loadProgress)}%`;
}, 100);

// === ANIMATION LOOP ===
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  mesh.rotation.x += 0.002;
  mesh.rotation.y += 0.004;

  // Basic vertex displacement for liquid effect
  const pos = mesh.geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const offset = 0.05 * Math.sin(t * 2 + x * 10 + y * 10 + z * 10);
    pos.setXYZ(i, x + offset * x, y + offset * y, z + offset * z);
  }
  pos.needsUpdate = true;
  mesh.geometry.computeVertexNormals();

  renderer.render(scene, camera);
}
animate();