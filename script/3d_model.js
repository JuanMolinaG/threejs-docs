import * as THREE from 'three'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const motorcycleHelmetModelUrl =
  '../resources/models/motorcycle_helmet/scene.gltf'
const veniceSunsetExrUrl = '../resources/textures/venice_sunset_1k.exr'

const createScene = () => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#191919')

  return scene
}

const createCamera = () => {
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  )
  camera.position.set(15, 10, 60)

  return camera
}

const createRenderer = () => {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  document.body.appendChild(renderer.domElement)

  return renderer
}

const loadExr = (url) => {
  return new Promise((resolve, reject) => {
    new EXRLoader().load(url, resolve, undefined, reject)
  })
}

const createEnvironment = async (renderer) => {
  const pmremGenerator = new THREE.PMREMGenerator(renderer)
  const exrEnvMap = await loadExr(veniceSunsetExrUrl)
    .then((texture) => texture)
    .catch((e) => console.error('environment error', e))
  const environment = pmremGenerator.fromEquirectangular(exrEnvMap).texture

  return environment
}

const loadModel = (url) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    loader.load(url, resolve, undefined, reject)
  })
}

const getGltf = async (url) => {
  const gltf = await loadModel(url)
    .then((gltf) => gltf)
    .catch((e) => console.error(e))

  return gltf
}

const onWindowResize = (camera, renderer) => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const render = (renderer, scene, camera) => {
  renderer.render(scene, camera)
}

const animate = (renderer, scene, camera) => {
  requestAnimationFrame(() => animate(renderer, scene, camera))
  render(renderer, scene, camera)
}

const init = async () => {
  const scene = createScene()
  const camera = createCamera()
  const renderer = createRenderer()
  const environment = await createEnvironment(renderer)
  scene.environment = environment
  const gltf = await getGltf(motorcycleHelmetModelUrl)
  scene.add(gltf.scene)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.screenSpacePanning = true
  controls.target.set(0, 0, 0)
  controls.update()
  controls.addEventListener('change', () => render(renderer, scene, camera))

  window.addEventListener('resize', () => onWindowResize(camera, renderer))

  animate(renderer, scene, camera)
}

init()
