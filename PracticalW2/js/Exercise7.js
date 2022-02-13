import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/utils/BufferGeometryUtils.js';
import {FontLoader} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/geometries/TextGeometry.js';
// import * as Exercise1 from "./js/Exercise1.js"
// import * as Exercise2 from "./js/Exercise2.js"

const canvas = document.querySelector('#canvas')

const createCamera = () => {
    const fov = 45;
    const aspect = 2; //Before it was 2
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    return camera;
} 

const createRenderer = () => {
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setClearColor("#000");
    renderer.setPixelRatio(devicePixelRatio);
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild( renderer.domElement );
    return renderer;
}
export function main(){
    const scene = new THREE.Scene();
    const camera = createCamera();
    scene.add(camera);
    const renderer = createRenderer()
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    //Axes Helper
    const axesHelper = new THREE.AxesHelper( 50 );
    // scene.add(axesHelper);

    //Light
    const pointLight = () => {
        const light = new THREE.PointLight( 0xffffff, 1, 100, 2 );
        light.position.set( 5, 8, 5 );
        light.castShadow = true;
        light.shadow.mapSize.width = 512; // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = 0.5; // default
        light.shadow.camera.far = 500; // default
        scene.add( light );
        //  const pointLightHelper = new THREE.PointLightHelper( light, 1);
        //  scene.add(pointLightHelper);
        return light;
    }

    const ambientLight = (color = "#0c0c0c") => {
        const ambient = new THREE.AmbientLight(color);
        ambient.position.set( 5, 9, 5);
        scene.add(ambient);
        return ambient;
    }

    const light = pointLight();
    // const ambient = ambientLight("#0c0c0c")
    // const helper = new THREE.CameraHelper ( light.shadow.camera );
    // scene.add(helper);

    //Light Cube Lamp
    {
        const geometry = new THREE.BoxGeometry( 2, 0.4, 2 );
        const material = new THREE.MeshBasicMaterial();
        const lamp = new THREE.Mesh(geometry, material);
        lamp.position.set(5, 9.8, 5);
        scene.add(lamp);
    }
    
    //Geometry of surface
    const wall = (x, y, color = 0xffffff) => {
        const geometry = new THREE.PlaneGeometry( x, y );
        const material = new THREE.MeshLambertMaterial ({ color: color});
        const plane = new THREE.Mesh( geometry, material );
        plane.receiveShadow = true;
        return plane;
    }

    const floor = wall(10, 10);
    const rightWall = wall(10, 10, 0x00ff00);
    const leftWall = wall(10, 10, 0xff0000);
    const backWall = wall(10, 10);
    const ceiling = wall(10, 10);
    scene.add(floor);
    scene.add(rightWall);
    scene.add(leftWall);
    scene.add(backWall);
    scene.add(ceiling);

    floor.position.set(5, 0, 5);
    floor.rotation.x = THREE.MathUtils.degToRad(-90)
    rightWall.position.set(0, 5, 5);
    rightWall.rotation.y = THREE.MathUtils.degToRad(90)
    leftWall.position.set(10, 5, 5);
    leftWall.rotation.y = THREE.MathUtils.degToRad(-90)
    backWall.position.set(5, 5, 0);
    ceiling.position.set(5, 10, 5);
    ceiling.rotation.x = Math.PI / 2;
    camera.position.set(8, 10 , 30.1);
    camera.lookAt(backWall.position)

    //Shapes

    //Cone
    {
    const geometry = new THREE.ConeGeometry( 1, 2, 32 );
    const material = new THREE.MeshLambertMaterial( {color: 0xffff00} );
    const cone = new THREE.Mesh( geometry, material );
    cone.position.set(1.4, 1, 3);
    cone.castShadow = true;
    cone.receiveShadow = false;
    scene.add( cone );
    }

    //Cylinder
    {
    const geometry = new THREE.CylinderGeometry( 2, 2, 5, 20 );
    const material = new THREE.MeshPhongMaterial( {color: 0xff7733} );
    const cylinder = new THREE.Mesh( geometry, material );
    cylinder.position.set(7, 2.5, 5 );
    cylinder.castShadow = true;
    cylinder.receiveShadow = false;
    scene.add( cylinder );
    }

    //Sphere
    {
    const geometry = new THREE.SphereGeometry( 1.2, 32, 16 );
    const material = new THREE.MeshPhysicalMaterial( { color: 0xffff00 } );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.set(4, 1.2, 8);
    sphere.castShadow = true;
    sphere.receiveShadow = false;
    scene.add( sphere );
    }

    //Orbit Controls
    var controls = new OrbitControls (camera, renderer.domElement);
    //Renderer Function

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
      }
    
    function render(time) {
    //    time *= 0.0004;

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    // controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    }

requestAnimationFrame(render);

}