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

// === LIGHTS ===
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111111, 1.2);
scene.add(hemiLight);

const areaLight = new THREE.RectAreaLight(0xffffff, 3, 5, 5);
areaLight.position.set(3, 3, 3);
scene.add(areaLight);

// === SHADER MATERIAL WITH RIPPLE ===
const uniforms = {
  uTime: { value: 0 },
  uColor: { value: new THREE.Color(0x111111) }
};

const vertexShader = `
  uniform float uTime;
  varying vec3 vNormal;
  void main() {
    vNormal = normal;
    vec3 pos = position + normal * 0.1 * sin(uTime + position.y * 3.0 + position.x * 3.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  varying vec3 vNormal;
  void main() {
    float intensity = dot(normalize(vNormal), vec3(0.0, 0.0, 1.0));
    vec3 base = mix(vec3(0.05), uColor, intensity);
    gl_FragColor = vec4(base, 0.8);
  }
`;

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  transparent: true
});

const sphereGeometry = new THREE.SphereGeometry(1.6, 128, 128);
const sphere = new THREE.Mesh(sphereGeometry, material);
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

// === ANIMATE ===
let clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  uniforms.uTime.value = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
}
animate();