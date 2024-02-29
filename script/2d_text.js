import * as THREE from 'three'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
)

const textRenderer = new CSS2DRenderer()
textRenderer.domElement.style.position = 'absolute'
textRenderer.domElement.style.left = '50%'
textRenderer.domElement.style.top = '50%'
textRenderer.domElement.style.transform = 'translate(-50%, -50%)'
textRenderer.domElement.textContent = '2D Text'
textRenderer.domElement.style.color = 'white'
textRenderer.domElement.style.fontSize = '30px'
document.body.appendChild(textRenderer.domElement)

renderer.render(scene, camera)
