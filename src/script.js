import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

//Texture Loader
const textureLoader = new THREE.TextureLoader()
const flare = textureLoader.load('/3.png')

// Debug
const gui = new dat.GUI()

const parameters = {
    color: '#30D5C8'
}
gui.addColor(parameters, 'color').onChange(() => {
    particlesMaterial.color.set(parameters.color)
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects/ Model

const gltfLoader = new GLTFLoader()
let mixer = null

 gltfLoader.load('/blu.glb', (gltf) =>{
    gltf.scene.scale.set(0.1, 0.1, 0.1)
    gltf.scene.position.set( 1.2, 2 , .5)
    gltf.scene.rotation.set(6.9, 2, 0)
    scene.add(gltf.scene)

    mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction(gltf.animations[0])
    action.play()
 })

const particlesGeometry =new THREE.BufferGeometry()
const particlesCount = 5000

const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++){
    posArray[i]= (Math.random() - 0.5) * 7
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

// Materials

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    transparent: true,
    sizeAttenuation: true,
    color: parameters.color,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    alphaMap: flare
})

// Particles

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

/*
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(78, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enable = false
controls.enableDamping = true
controls.target.set(0, 0.75, 0)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Mouse
document.addEventListener('mousemove', animateParticles)

let mouseX = 0
let mouseY = 0

function animateParticles(event){
    mouseY = event.clientY
    mouseX = event.clientX
}

/**
 * Animate
 */

const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer

    if(mixer !== null){
        mixer.update(deltaTime)
    }

    // Update objects

    particles.rotation.y = - 0.1 * elapsedTime

    if (mouseX > 0){
        particles.rotation.y = mouseX * (elapsedTime * 0.00008)
        particles.rotation.x = - mouseY * (elapsedTime * 0.00008)
    }
    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()