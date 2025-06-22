import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 4

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.outputEncoding = THREE.sRGBEncoding

// Lights
const mainLight = new THREE.SpotLight(0xffffff, 4)
mainLight.position.set(5, 5, 5)
scene.add(mainLight)

const fillLight = new THREE.SpotLight(0xffffff, 2)
fillLight.position.set(-5, -5, 5)
scene.add(fillLight)

// Geometry + Deformation Shader
const vertexShader = `
  uniform float time;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 newPosition = position + normal * 0.15 * sin(time + position.y * 10.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  void main() {
    vec3 color = vec3(0.05, 0.05, 0.05); // nero liquido elegante
    float shine = smoothstep(0.2, 0.8, length(vUv - 0.5));
    gl_FragColor = vec4(color + shine * 0.4, 1.0);
  }
`

const uniforms = {
  time: { value: 0 }
}

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader
})

// Sphere mesh
const geometry = new THREE.SphereGeometry(1, 128, 128)
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

// Camera orbit rotation
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 0.5
controls.enablePan = false

// Animate
const clock = new THREE.Clock()
function animate() {
  requestAnimationFrame(animate)
  uniforms.time.value = clock.getElapsedTime()
  controls.update()
  renderer.render(scene, camera)
}
animate()

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})