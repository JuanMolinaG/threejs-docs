import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

const loader = new FontLoader()

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)
scene.fog = new THREE.Fog(0x000000, 250, 1400)

const dirLight = new THREE.DirectionalLight(0xffffff, 0.4)
dirLight.position.set(0, 0, 1).normalize()
scene.add(dirLight)

const pointLight = new THREE.PointLight(0xffffff, 4.5, 0, 0)
pointLight.color.setHSL(Math.random(), 1, 0.5)
pointLight.position.set(0, 100, 90)
scene.add(pointLight)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(-100, 300, 600)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0, 0)
controls.update()
controls.addEventListener('change', render)

const materials = [
  new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
  new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
]

const group = new THREE.Group()
group.position.y = 100

scene.add(group)

loader.load(
  'https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json',
  function (font) {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10000, 10000),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
      })
    )
    plane.position.y = 100
    plane.rotation.x = -Math.PI / 2
    scene.add(plane)

    const geometry = new TextGeometry('Hello three.js!', {
      font: font,
      size: 80,
      height: 20,
      curveSegments: 4,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 1.5
    })
    geometry.computeBoundingBox()

    const xMid =
      -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)

    const mesh1 = new THREE.Mesh(geometry, materials)
    mesh1.position.x = xMid
    mesh1.position.y = 3

    group.add(mesh1)

    render()
  }
)

window.addEventListener('resize', onWindowResize)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)

  render()
}

function render() {
  renderer.render(scene, camera)
}
