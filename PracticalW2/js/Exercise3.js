import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/utils/BufferGeometryUtils.js';
import {FontLoader} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/geometries/TextGeometry.js';
import {GUI} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/libs/lil-gui.module.min.js';


const canvas = document.querySelector('#canvas')

const gui = new GUI();

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
    scene.add(axesHelper);

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
        return light;
    }

    const ambientLight = (color = "#0c0c0c") => {
        const ambient = new THREE.AmbientLight(color, 1);
        ambient.position.set( 5, 9, 5);
        scene.add(ambient);
        return ambient;
    }

    const directionalLight = (color = 0xffffff) => {
        const directional = new THREE.DirectionalLight(color, 1);
        directional.position.set( 5, 9, 5);
        // scene.add(directional);
        return directional;
    }

    const spotLight = (color = 0xffffff) => {
        const spot = new THREE.SpotLight(color);
        spot.position.set( 5, 9, 5);
        // spot.castShadow = true;
        // spot.shadow.mapSize.width = 1024;
        // spot.shadow.mapSize.height = 1024;
        // spot.shadow.camera.near = 500;
        // spot.shadow.camera.far = 4000;
        // spot.shadow.camera.fov = 30;
        scene.add( spot );
        return spot;
    }

    const hemisphereLight = (sky = 0x99d6e1, ground = 0xd28d2d) => {
        const hemisphere = new THREE.HemisphereLight(sky, ground, 1);
        hemisphere.position.set( 5, 9, 5);
        // hemisphere.castShadow = true;
        // hemisphere.shadow.mapSize.width = 1024;
        // hemisphere.shadow.mapSize.height = 1024;
        // hemisphere.shadow.camera.near = 500;
        // hemisphere.shadow.camera.far = 4000;
        // hemisphere.shadow.camera.fov = 30;
        scene.add( hemisphere );
        return hemisphere;
    }

    ////CameraHelperForShadows
    // const helper = new THREE.CameraHelper ( light.shadow.camera );
    // scene.add(helper);

    //Light Cube Lamp
    {
        const geometry = new THREE.BoxGeometry( 2, 0.4, 2 );
        const material = new THREE.MeshBasicMaterial();
        const lamp = new THREE.Mesh(geometry, material);
        lamp.position.set(5, 9.8, 5);
        lamp.castShadow = true;
        lamp.receiveShadow = false;
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

    //Exercise 1 Cornel Box Architecture
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

    //Exercise 2 - GUI
    // {
    //     const wallColor = {
    //         rightWall: 0xffffff,
    //         leftWall: 0xffffff,
    //         backWall: 0xffffff,
    //         ceiling: 0xffffff,
    //         floor: 0xffffff
    //     }
    //     gui.addColor( wallColor, 'rightWall'  )
    //         .onChange( function(value) {    
    //             rightWall.material.color.set(value);
    //         });
    //     gui.addColor( wallColor, 'leftWall'  )
    //     .onChange( function(value) {    
    //         leftWall.material.color.set(value);
    //     });
    //     gui.addColor( wallColor, 'backWall'  )
    //     .onChange( function(value) {    
    //         backWall.material.color.set(value);
    //     });
    //     gui.addColor( wallColor, 'floor'  )
    //     .onChange( function(value) {    
    //         floor.material.color.set(value);
    //     });
    //     gui.addColor( wallColor, 'ceiling'  )
    //     .onChange( function(value) {    
    //         ceiling.material.color.set(value);
    //     });
    // }

    //Exercise 3 - Lightings
    {

    const directional = directionalLight("#ffffff");
    directional.target = floor;
    directional.target.updateMatrixWorld();
    directional.visible = false;
    scene.add(directional);

    const light = pointLight();

    const spot = spotLight();
    spot.visible = false;

    const hemisphere = hemisphereLight();
    hemisphere.visible = false;
    
    const ambient = ambientLight("#ffffff");
    ambient.visible = false;

    //Light Helpers

    const directionalHelper = new THREE.DirectionalLightHelper( directional, 5 );
    scene.add( directionalHelper );
    directionalHelper.visible = false;
    const hemisphereLightHelper = new THREE.HemisphereLightHelper( hemisphere );
    scene.add( hemisphereLightHelper );
    hemisphereLight.visible = false;
    const pointLightHelper = new THREE.PointLightHelper( light, 1);
    scene.add(pointLightHelper);
    pointLightHelper.visible = false;
    const spotLightHelper = new THREE.SpotLightHelper( spot );
    scene.add( spotLightHelper );
    spotLightHelper.visible = false;

        
    const lightControls = {
        directionalLight : false,
        pointLight : true,
        spotLight : false,
        hemisphereLight : false,
        ambientLight : false,

        helperEnabled: false,
        intensity: 1,
        color: 0xffffff

    }
    const directionalFolder = gui.addFolder( 'Directional Light' );
    directionalFolder.add( lightControls, 'directionalLight'  )
                        .onChange( function(value) {    
                            directional.visible = value
                        });
    directionalFolder.add( lightControls, 'intensity', 0, 1  )
                        .onChange( function(value) {    
                            directional.intensity = value
                        });
    directionalFolder.addColor( lightControls, 'color'  )
                        .onChange( function(value) {    
                            directional.color.set(value);
                        });
    directionalFolder.add( lightControls, 'helperEnabled'  )
                        .onChange( function(value) {    
                            directionalHelper.visible = value
                        });





    const pointFolder = gui.addFolder( 'Point Light' ); 
    pointFolder.add( lightControls, 'pointLight'  )
        .onChange( function(value) {    
            light.visible = value
        }); 
    pointFolder.add( lightControls, 'intensity', 0, 1  )
        .onChange( function(value) {    
            light.intensity = value
        });
    pointFolder.addColor( lightControls, 'color'  )
        .onChange( function(value) {    
            light.color.set(value);
        });
    pointFolder.add( lightControls, 'helperEnabled'  )
        .onChange( function(value) {    
            pointLightHelper.visible = value
        });


 
    const spotFolder = gui.addFolder( 'Spot Light' );  
    spotFolder.add( lightControls, 'spotLight'  )
        .onChange( function(value) {    
            spot.visible = value
        });
    
    spotFolder.add( lightControls, 'intensity', 0, 1  )
        .onChange( function(value) {    
            spot.intensity = value
        });
    spotFolder.addColor( lightControls, 'color'  )
        .onChange( function(value) {    
            spot.color.set(value);
        });
    spotFolder.add( lightControls, 'helperEnabled'  )
        .onChange( function(value) {    
            spotLightHelper.visible = value
        });




    const hemisphereFolder = gui.addFolder( 'Hemisphere Light' );
    hemisphereFolder.add( lightControls, 'hemisphereLight'  )
        .onChange( function(value) {    
            hemisphere.visible = value
        });

    hemisphereFolder.add( lightControls, 'intensity', 0, 1  )
        .onChange( function(value) {    
            hemisphere.intensity = value
        });
    hemisphereFolder.addColor( lightControls, 'color'  )
        .onChange( function(value) {    
            hemisphere.color.set(value);
        });
    hemisphereFolder.add( lightControls, 'helperEnabled'  )
        .onChange( function(value) {    
            hemisphereLightHelper.visible = value
        });



    const ambientFolder = gui.addFolder( 'Ambient Light' );
    ambientFolder.add( lightControls, 'ambientLight'  )
        .onChange( function(value) {    
            ambient.visible = value
        });        

    ambientFolder.add( lightControls, 'intensity', 0, 1  )
        .onChange( function(value) {    
            ambient.intensity = value
        });
    ambientFolder.addColor( lightControls, 'color'  )
        .onChange( function(value) {    
            ambient.color.set(value);
        });
    
    }

    //Shapes
    {
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