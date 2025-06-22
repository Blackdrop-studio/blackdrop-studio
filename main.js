import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/RenderPass.js';

// === SCENE ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 10;

// === RENDERER ===
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;

// === LIGHTING (Soft Area-Like Emulation) ===
const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
fillLight.position.set(2, 2, 4);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
rimLight.position.set(-3, 3, -4);
scene.add(rimLight);

const ambient = new THREE.AmbientLight(0x111111, 1.5);
scene.add(ambient);

// === SHADER MATERIAL FOR WAVEY SPHERE ===
const uniforms = {
  uTime: { value: 0.0 },
  uColor: { value: new THREE.Color(0x111111) },
};

const vertexShader = `
  uniform float uTime;
  varying vec3 vNormal;
  void main() {
    vec3 newPosition = position + normal * 0.1 * sin(3.0 * position.y + uTime * 2.0);
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vNormal;
  uniform vec3 uColor;
  void main() {
    float intensity = dot(normalize(vNormal), vec3(0.0, 0.0, 1.0));
    vec3 base = mix(vec3(0.05), uColor, intensity);
    gl_FragColor = vec4(base, 0.85);
  }
`;

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
  transparent: true,
});

const sphereGeometry = new THREE.SphereGeometry(1.5, 128, 128);
const sphere = new THREE.Mesh(sphereGeometry, material);
scene.add(sphere);

// === PARTICLES ===
const particleCount = 800;
const particleGeo = new THREE.BufferGeometry();
const posArray = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 18;
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particleMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.015,
  opacity: 0.25,
  transparent: true,
  blending: THREE.AdditiveBlending,
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// === CONTROLS ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 1.2;
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;

// === TEXT CYCLE ===
const headline = document.getElementById('headline');
const texts = ['Loading...', 'Ninja Content Creator', 'Branding Specialist', 'Video & Visuals', 'Immersive Experiences'];
let textIndex = 0;
const textCycle = setInterval(() => {
  textIndex = (textIndex + 1) % texts.length;
  headline.textContent = texts[textIndex];
}, 1500);

// === TEXT & FADE ===
setTimeout(() => {
  clearInterval(textCycle);
  headline.classList.add('glitch-out');
}, 6000);
setTimeout(() => {
  document.getElementById('overlay').style.opacity = 0;
}, 7200);
setTimeout(() => {
  document.getElementById('overlay').style.display = 'none';
  createBlackdropText();
}, 8500);

function createBlackdropText() {
  const finalText = document.createElement('h1');
  finalText.textContent = 'BLACKDROP';
  Object.assign(finalText.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(1.05)',
    fontSize: '3.5rem',
    fontWeight: '700',
    letterSpacing: '0.2em',
    color: '#fff',
    fontFamily: 'Outfit, sans-serif',
    opacity: '0',
    zIndex: '3',
    transition: 'opacity 2s ease, transform 2s ease',
  });
  document.body.appendChild(finalText);
  setTimeout(() => {
    finalText.style.opacity = '1';
    finalText.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 200);
}

// === RENDER LOOP ===
let zoom = 0;
function animate(t) {
  requestAnimationFrame(animate);
  uniforms.uTime.value = t * 0.001;
  if (zoom < 300) {
    camera.position.z -= 0.008;
    zoom++;
  }
  controls.update();
  renderer.render(scene, camera);
}
animate();

// === RESPONSIVE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});