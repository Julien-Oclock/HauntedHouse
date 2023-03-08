import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// walls texture 
const bricks = textureLoader.load('textures/bricks/color.jpg')
const bricksAmbientOcclusion = textureLoader.load('textures/bricks/ambientOcclusion.jpg')
const bricksNormal = textureLoader.load('textures/bricks/normal.jpg')
const bricksRoughness = textureLoader.load('textures/bricks/roughness.jpg')
// door texture
const doorColor = textureLoader.load('textures/door/color.jpg')
const doorAmbientOcclusion = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorAlpha = textureLoader.load('textures/door/alpha.jpg')
const doorHeight = textureLoader.load('textures/door/height.jpg')
const doorNormal = textureLoader.load('textures/door/normal.jpg')
const doorMetalness = textureLoader.load('textures/door/metalness.jpg')
const doorRoughness = textureLoader.load('textures/door/roughness.jpg')
//bush texture
const bushTexture = textureLoader.load('textures/bush/bush.jpg')
// grass texture
const grassTexture = textureLoader.load('textures/grass/color.jpg')
const grassAmbientOcclusion = textureLoader.load('textures/grass/ambientOcclusion.jpg')
const grassNormal = textureLoader.load('textures/grass/normal.jpg')
const grassRoughness = textureLoader.load('textures/grass/roughness.jpg')
grassTexture.repeat.set(8, 8)
grassAmbientOcclusion.repeat.set(8, 8)
grassNormal.repeat.set(8, 8)
grassRoughness.repeat.set(8, 8)

grassTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusion.wrapS = THREE.RepeatWrapping
grassNormal.wrapS = THREE.RepeatWrapping
grassRoughness.wrapS = THREE.RepeatWrapping

grassTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusion.wrapT = THREE.RepeatWrapping
grassNormal.wrapT = THREE.RepeatWrapping
grassRoughness.wrapT = THREE.RepeatWrapping

bushTexture.minFilter = THREE.NearestFilter
bushTexture.magFilter = THREE.NearestFilter

/*
* Fog
*/

const fog = new THREE.Fog('#262837', 1, 30)
scene.fog = fog

/**
 * graveyard
 */
const graveyard = new THREE.Group()
scene.add(graveyard)

// graves

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

for (let i = 0; i < 50; i++){
    const angle = Math.random() * Math.PI * 2
    const radius = (4 + Math.random() * 8) +1
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x , 0.3, z )
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 1.2
    graveyard.add(grave)
}

/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3, 4),
    new THREE.MeshStandardMaterial({ 
        map: bricks,
        aoMap: bricksAmbientOcclusion,
        normalMap: bricksNormal,
        roughnessMap: bricksRoughness,

    })
)
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y =  2.5 * 0.5
house.add(walls)

// doors
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 100, 100),
    new THREE.MeshStandardMaterial({ 
        map: doorColor,
        transparent: true,
        alphaMap: doorAlpha,
        aoMap: doorAmbientOcclusion,
        displacementMap: doorHeight,
        displacementScale: 0.1,
        normalMap: doorNormal,
        metalnessMap: doorMetalness,
        roughnessMap: doorRoughness,
     })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.y = 1 - 0.1
door.position.z = 2 + 0.01
house.add(door)

//roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({ color: '#3F0D12', aoMap : bricksAmbientOcclusion, map: bricks })
)
roof.position.y = 3 + 0.5
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ 
        map: grassTexture,
        aoMap: grassAmbientOcclusion,
        normalMap: grassNormal,
        roughnessMap: grassRoughness,
    })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0

scene.add(floor)

// Bush
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(1.5, 0.1, 2.5)
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(- 1.5, 0.1, 2.5)
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 1, 0.2, 2.4)
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.position.set(- 3, 0.3, 1.5)

house.add(bush1, bush2, bush3, bush4)

/**
 * Lights
 */
// // Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.238)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.41)
moonLight.position.set(4, 5, 1.067)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

const doorLight = new THREE.PointLight('#ff7d46', 1.5, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)


/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#3333ff', 2, 10)
ghost1.position.y = 1.5
scene.add(ghost1)
const pointLightHelper1 = new THREE.PointLightHelper( ghost1)
scene.add( pointLightHelper1 )
const ghost2 = new THREE.PointLight("#00ffff", 2, 10)
const pointLightHelper2 = new THREE.PointLightHelper( ghost2)
ghost2.position.y = 1.5
scene.add( pointLightHelper2 )
scene.add(ghost2)
const ghost3 = new THREE.PointLight("#ffff00", 2, 10)
ghost3.position.y = 1.5

const pointLightHelper3 = new THREE.PointLightHelper( ghost3)
scene.add( pointLightHelper3 )
scene.add(ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const axesHelper = new THREE.AxesHelper( 10 );
scene.add( axesHelper );

window.addEventListener('resize', () =>
{
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update ghosts
    const ghostangle1 = elapsedTime
    const ghostangle2 = elapsedTime * 0.75
    const ghostangle3 = elapsedTime * 1.2
    ghost1.position.x = Math.cos(ghostangle1) * 5
    ghost1.position.z = Math.sin(ghostangle1) * 5
    ghost1.position.z += Math.sin(elapsedTime * 3)

    ghost2.position.x = Math.cos(ghostangle2) * 6
    ghost2.position.z = Math.sin(ghostangle2) * 6
    ghost2.position.z += Math.sin(elapsedTime * 4)

    ghost3.position.x = Math.cos(ghostangle3) * 8
    ghost3.position.z = Math.sin(ghostangle3) * 8
    ghost3.position.z += Math.sin(elapsedTime * 2)


    



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()