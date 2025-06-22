import * as THREE from 'https://esm.sh/three@0.152.2';
import { OrbitControls } from 'https://esm.sh/three@0.152.2/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://esm.sh/three@0.152.2/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'https://esm.sh/three@0.152.2/examples/jsm/shaders/RGBShiftShader.js';

// SCENA E RENDERER
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('bg'),
  antialias: true
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMappingExposure = 1.2;
renderer.dithering = true;

// SFERE E ANIMATION VISCOSA MINORE
const sphereGeo = new THREE.SphereGeometry(1.6, 128, 128);
const sphereMat = new THREE.MeshPhysicalMaterial({
  transmission: 0.9,
  roughness: 0.2,
  metalness: 0.1,
  clearcoat: 0.8,
  color: 0x111111
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphere);

// LUCI MORBIDE
const key = new THREE.PointLight(0xffffff, 1.2);
key.position.set(5, 5, 5);
scene.add(key);

const fill = new THREE.PointLight(0xffffff, 0.5);
fill.position.set(-5, -3, 5);
scene.add(fill);

scene.add(new THREE.AmbientLight(0x202020));

// PARTICELLE MORE SOFT
const pGeo = new THREE.BufferGeometry();
const count = 1000;
const pos = new Float32Array(count*3);
for (let i = 0; i < count*3; i++) pos[i] = (Math.random() - 0.5) * 20;
pGeo.setAttribute('position', new THREE.BufferAttribute(pos,3));

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.02,
  transparent: true,
  opacity: 0.15,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const particles = new THREE.Points(pGeo, particlesMaterial);
scene.add(particles);

// CONTROLLI
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;
controls.enableZoom = false;
controls.enableDamping = true;
controls.dampingFactor = 0.04;

// POST-PROCESSING (bloom + leggero chroma)
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 1.2, 0.4, 0.85));
const rgb = new ShaderPass(RGBShiftShader);
rgb.uniforms['amount'].value = 0.0006;
composer.addPass(rgb);

// TEXTO DINAMICO E SEQUENZA
const headline = document.getElementById('headline');
const texts = ['Loading...', 'Ninja Content Creator', 'Branding Specialist', 'Video & Visuals', 'Immersive Experiences'];
let idx = 0;
const cycle = setInterval(() => {
  idx = (idx+1)%texts.length;
  headline.textContent = texts[idx];
},1500);
setTimeout(() => { clearInterval(cycle); headline.classList.add('glitch-out'); }, 6000);
setTimeout(() => { document.getElementById('overlay').style.opacity = 0; }, 7200);
setTimeout(() => { document.getElementById('overlay').style.display = 'none'; createBlackdropText(); }, 8500);

// FUNZIONI TEXT FINALI
function createBlackdropText() {
  const h = document.createElement('h1');
  h.textContent = 'BLACKDROP';
  Object.assign(h.style, {
    position:'absolute',top:'50%',left:'50%',
    transform:'translate(-50%,-50%) scale(1)',
    fontSize:'3.5rem',letterSpacing:'0.2em',opacity:'0',
    color:'#fff',fontFamily:'Outfit',fontWeight:'700',
    transition:'opacity 2s ease, transform 2s ease'
  });
  document.body.appendChild(h);
  setTimeout(()=>{h.style.opacity='1'; h.style.transform='translate(-50%,-50%) scale(1.05)';},200);
  setTimeout(()=>{h.style.transform='translate(-50%,-50%) scale(1)';},2000);
}

// RISIZE
window.addEventListener('resize', () => {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
});

// LOOP
let zoom = 0;
function animate(){
  requestAnimationFrame(animate);
  if (zoom<300){ camera.position.z -= 0.006; zoom++; }
  sphere.rotation.y += 0.0025;
  sphere.rotation.x += 0.0012;
  controls.update();
  composer.render();
}
animate();