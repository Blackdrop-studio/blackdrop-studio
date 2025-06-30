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
const sphereGeometry = new THREE.SphereGeometry(1.5, 128, 128);
const sphereMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    uniform float uTime;
    varying vec3 vNormal;
    void main() {
      vec3 pos = position + normal * 0.1 * sin(uTime + position.y * 10.0);
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
      gl_FragColor = vec4(vec3(0.05, 0.05, 0.05) + intensity, 1.0);
    }
  `,
  uniforms: {
    uTime: { value: 0.0 }
  },
  transparent: false
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// === LIGHTING ===
const ambient = new THREE.AmbientLight(0x222222);
scene.add(ambient);

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