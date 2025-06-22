import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FontLoader } from 'https://esm.sh/three@0.152.2/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://esm.sh/three@0.152.2/examples/jsm/geometries/TextGeometry.js';

// === SCENE SETUP ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 9;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.toneMappingExposure = 1.25;
renderer.dithering = true;

// === SPHERE ===
const sphereGeometry = new THREE.SphereGeometry(1.6, 128, 128);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  transmission: 0.98,
  roughness: 0.1,
  thickness: 1.5,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
  reflectivity: 0,
  metalness: 0,
  color: new THREE.Color(0x222222)
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// === LIGHTS ===
scene.add(new THREE.DirectionalLight(0xffffff, 1.6).position.set(4, 5, 6));
scene.add(new THREE.DirectionalLight(0xffffff, 0.5).position.set(-5, 3, -4));
scene.add(new THREE.AmbientLight(0x111111));

// === PARTICLES ===
const particleGeo = new THREE.BufferGeometry();
const count = 800;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20;
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
scene.add(new THREE.Points(particleGeo, particleMat));

// === CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotateSpeed = 1.5;
controls.enableDamping = true;
controls.dampingFactor = 0.04;
controls.enableZoom = false;

// === BLOOM ===
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.4, 0.4, 0.9));

// === RESIZE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// === TEXT SEQUENCE ===
const texts = ['Loading...', 'Ninja Content Creator', 'Branding Specialist', 'Video & Visuals', 'Immersive Experiences'];
const headline = document.getElementById('headline');
let i = 0;
const cycle = setInterval(() => {
  i = (i + 1) % texts.length;
  headline.textContent = texts[i];
}, 1500);

// === ANIMATE ===
let zoomFrame = 0;
let clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  let t = clock.getElapsedTime();

  if (zoomFrame < 300) {
    camera.position.z -= 0.009;
    zoomFrame++;
  }

  sphere.rotation.y += 0.002;
  sphere.rotation.x += 0.0015;

  // === GLITCH/WAVE effect on sphere geometry
  const position = sphere.geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const wave = 0.02 * Math.sin(x * 4 + t * 2) + 0.02 * Math.cos(z * 4 + t * 2);
    position.setXYZ(i, x, y + wave, z);
  }
  position.needsUpdate = true;

  controls.update();
  composer.render();
}
animate();

// === TEXT GLITCH OUT + OVERLAY HIDE ===
setTimeout(() => clearInterval(cycle), 6000);
setTimeout(() => headline.classList.add('glitch-out'), 6000);
setTimeout(() => document.getElementById('overlay').style.opacity = 0, 7500);
setTimeout(() => document.getElementById('overlay').style.display = 'none', 8500);

// === BLACKDROP 3D TEXT ===
function createBlackdropText() {
  const loader = new FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
    const textGeo = new TextGeometry('BLACKDROP', {
      font: font,
      size: 0.6,
      height: 0.15,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5
    });

    textGeo.center();
    const textMat = new THREE.MeshPhysicalMaterial({
      transmission: 1,
      roughness: 0,
      thickness: 1,
      clearcoat: 1,
      metalness: 0.3,
      color: new THREE.Color(0xffffff)
    });

    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.set(0, 0, 0);
    textMesh.scale.set(0.1, 0.1, 0.1);
    scene.add(textMesh);

    // Morph scaling animation
    const appear = { s: 0.1 };
    const target = { s: 1 };
    const duration = 1.5;
    let start = null;
    function scaleAnim(time) {
      if (!start) start = time;
      let progress = (time - start) / (duration * 1000);
      if (progress > 1) progress = 1;
      const scale = appear.s + (target.s - appear.s) * progress;
      textMesh.scale.set(scale, scale, scale);
      if (progress < 1) requestAnimationFrame(scaleAnim);
    }
    requestAnimationFrame(scaleAnim);
  });
}
setTimeout(createBlackdropText, 8800);