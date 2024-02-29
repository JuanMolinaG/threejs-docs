import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'

const fontUrl =
  'https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json'

const loadFont = (url, onSuccess) => {
  const loader = new FontLoader()
  loader.load(url, onSuccess)
}

const createCamera = () => {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  )
  camera.position.set(0, -400, 600)
  return camera
}

const createScene = () => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

  return scene
}

const createRenderer = () => {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
  return renderer
}

const onWindowResize = (camera, renderer) => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const animate = (renderer, scene, camera) => {
  requestAnimationFrame(() => animate(renderer, scene, camera))
  renderer.render(scene, camera)
}

const addTextToScene = (scene, font, { text, size, color, position }) => {
  const shapes = font.generateShapes(text, size)
  const geometry = new THREE.ShapeGeometry(shapes)
  geometry.computeBoundingBox()
  const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
  geometry.translate(xMid, 0, 0)

  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide
  })
  const textMesh = new THREE.Mesh(geometry, material)
  textMesh.position.set(position.x, position.y, position.z)
  scene.add(textMesh)

  addLineGeometry(shapes, xMid, scene, color)
}

const addLineGeometry = (shapes, xMid, scene, color) => {
  const matDark = new THREE.LineBasicMaterial({ color, side: THREE.DoubleSide })
  const shapesHoles = shapes.flatMap((shape) =>
    shape.holes?.map((hole) => hole)
  )
  shapes.push(...shapesHoles)

  shapes.forEach((shape) => {
    const points = shape.getPoints()
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    geometry.translate(xMid, 0, 0)

    const lineMesh = new THREE.Line(geometry, matDark)
    scene.add(lineMesh)
  })
}

const init = (font) => {
  const camera = createCamera()
  const scene = createScene()
  const renderer = createRenderer()
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0, 0)
  controls.update()
  window.addEventListener('resize', () => onWindowResize(camera, renderer))

  const textDetails = {
    text: 'Hello\nThree.js!',
    size: 100,
    color: 0x006699,
    position: { x: 0, y: 0, z: -150 }
  }

  addTextToScene(scene, font, textDetails)
  animate(renderer, scene, camera)
}

loadFont(fontUrl, (font) => init(font))
