import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/utils/BufferGeometryUtils.js';
import {FontLoader} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/geometries/TextGeometry.js';
import {GUI} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/libs/lil-gui.module.min.js';
import {RectAreaLightHelper} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/helpers/RectAreaLightHelper.js';

const canvas = document.querySelector('#canvas')

const gui = new GUI( );

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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

    //Materials
    const lambertMat = new THREE.MeshLambertMaterial( {color: 0xffff00});
    const phongMat = new THREE.MeshPhongMaterial( {color: 0xff7733} ); 
    const physicalMat = new THREE.MeshPhysicalMaterial( { color: 0xffff00 } );
     
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

    const ambientLight = (color = "#ffffff") => {
        const ambient = new THREE.AmbientLight(color, 0.48);
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
        spot.castShadow = true;
        spot.shadow.mapSize.width = 1024;
        spot.shadow.mapSize.height = 1024;
        spot.shadow.camera.near = 500;
        spot.shadow.camera.far = 4000;
        spot.shadow.camera.fov = 30;
        scene.add( spot );
        return spot;
    }

    const hemisphereLight = (sky = 0x99d6e1, ground = 0xd28d2d) => {
        const hemisphere = new THREE.HemisphereLight(sky, ground, 1);
        hemisphere.position.set( 5, 9, 5);
        scene.add( hemisphere );
        return hemisphere;
    }

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

    ////Exercise 2 - GUI
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
    const directional = directionalLight("#ffffff");
    directional.target = floor;
    directional.target.updateMatrixWorld();
    directional.visible = true;
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
        dirposX: directional.position.x,
        dirposY: directional.position.y,
        dirposZ: directional.position.z,

        
        pointposX: light.position.x,
        pointposY: light.position.y,
        pointposZ: light.position.z,

        
        spotposX: spot.position.x,
        spotposY: spot.position.y,
        spotposZ: spot.position.z,

        
        hemisposX: hemisphere.position.x,
        hemisposY: hemisphere.position.y,
        hemisposZ: hemisphere.position.z,

        helperEnabled: false,
        intensity: 1,
        color: 0xffffff

    }

    const lightControlsGUI = gui.addFolder('Light Controls');
    const directionalFolder = lightControlsGUI.addFolder( 'Directional Light' );
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
                        
    directionalFolder.add( lightControls, 'dirposX', 0, 10 )
                        .onChange( function(value) {    
                            directional.position.x = value;
                        });

    directionalFolder.add( lightControls, 'dirposY', 0, 10 )
                        .onChange( function(value) {    
                            directional.position.y = value;
                        });

    directionalFolder.add( lightControls, 'dirposZ', 0, 10 )
                        .onChange( function(value) {    
                            directional.position.z = value;
                        });


    const pointFolder = lightControlsGUI.addFolder( 'Point Light' ); 
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
                        
    pointFolder.add( lightControls, 'pointposX', 0, 10 )
                        .onChange( function(value) {    
                            light.position.x = value;
                        });

    pointFolder.add( lightControls, 'pointposY', 0, 10 )
                        .onChange( function(value) {    
                            light.position.y = value;
                        });

    pointFolder.add( lightControls, 'pointposZ', 0, 10 )
                        .onChange( function(value) {    
                            light.position.z = value;
                        });


    const spotFolder = lightControlsGUI.addFolder( 'Spot Light' );  
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
                        
    spotFolder.add( lightControls, 'spotposX', 0, 10 )
                        .onChange( function(value) {    
                            spot.position.x = value;
                        });

    spotFolder.add( lightControls, 'spotposY', 0, 10 )
                        .onChange( function(value) {    
                            spot.position.y = value;
                        });

    spotFolder.add( lightControls, 'spotposZ', 0, 10 )
                        .onChange( function(value) {    
                            spot.position.z = value;
                        });


    const hemisphereFolder = lightControlsGUI.addFolder( 'Hemisphere Light' );
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
                        
    hemisphereFolder.add( lightControls, 'hemisposX', 0, 10 )
                        .onChange( function(value) {    
                            hemisphere.position.x = value;
                        });

    hemisphereFolder.add( lightControls, 'hemisposY', 0, 10 )
                        .onChange( function(value) {    
                            hemisphere.position.y = value;
                        });

    hemisphereFolder.add( lightControls, 'hemisposZ', 0, 10 )
                        .onChange( function(value) {    
                            hemisphere.position.z = value;
                        });


    const ambientFolder = lightControlsGUI.addFolder( 'Ambient Light' );
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
    
    



    //Shapes

    //Building the Geometries
    {
    //Cone
    {
    const geometry = new THREE.ConeGeometry( 1, 2, 32 );
    const cone = new THREE.Mesh( geometry, physicalMat );
    cone.position.set(1.4, 1, 3);
    cone.castShadow = true;
    cone.receiveShadow = true;
    scene.add( cone );
    }

    //Cylinder
    {
    const geometry = new THREE.CylinderGeometry( 2, 2, 5, 20 );
    const cylinder = new THREE.Mesh( geometry, physicalMat );
    cylinder.position.set(7, 2.5, 5 );
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    scene.add( cylinder );
    }

    //Sphere
    {
    const geometry = new THREE.SphereGeometry( 1.2, 32, 16 );
    const sphere = new THREE.Mesh( geometry, physicalMat );
    sphere.position.set(4, 1.2, 8);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add( sphere );
    }
   
    }

    //Exercise 4 - Material Properties

    //This code was adapted from Threejs.org Examples
    //Required from documentation:
    const constants = {

        combine: {

            'THREE.MultiplyOperation': THREE.MultiplyOperation,
            'THREE.MixOperation': THREE.MixOperation,
            'THREE.AddOperation': THREE.AddOperation

        },

        side: {

            'THREE.FrontSide': THREE.FrontSide,
            'THREE.BackSide': THREE.BackSide,
            'THREE.DoubleSide': THREE.DoubleSide

        },

        blendingMode: {

            'THREE.NoBlending': THREE.NoBlending,
            'THREE.NormalBlending': THREE.NormalBlending,
            'THREE.AdditiveBlending': THREE.AdditiveBlending,
            'THREE.SubtractiveBlending': THREE.SubtractiveBlending,
            'THREE.MultiplyBlending': THREE.MultiplyBlending,
            'THREE.CustomBlending': THREE.CustomBlending

        },

        equations: {

            'THREE.AddEquation': THREE.AddEquation,
            'THREE.SubtractEquation': THREE.SubtractEquation,
            'THREE.ReverseSubtractEquation': THREE.ReverseSubtractEquation

        },

        destinationFactors: {

            'THREE.ZeroFactor': THREE.ZeroFactor,
            'THREE.OneFactor': THREE.OneFactor,
            'THREE.SrcColorFactor': THREE.SrcColorFactor,
            'THREE.OneMinusSrcColorFactor': THREE.OneMinusSrcColorFactor,
            'THREE.SrcAlphaFactor': THREE.SrcAlphaFactor,
            'THREE.OneMinusSrcAlphaFactor': THREE.OneMinusSrcAlphaFactor,
            'THREE.DstAlphaFactor': THREE.DstAlphaFactor,
            'THREE.OneMinusDstAlphaFactor': THREE.OneMinusDstAlphaFactor

        },

        sourceFactors: {

            'THREE.DstColorFactor': THREE.DstColorFactor,
            'THREE.OneMinusDstColorFactor': THREE.OneMinusDstColorFactor,
            'THREE.SrcAlphaSaturateFactor': THREE.SrcAlphaSaturateFactor

        }

    };
    function getObjectsKeys( obj ) {

        const keys = [];

        for ( const key in obj ) {

            if ( obj.hasOwnProperty( key ) ) {

                keys.push( key );

            }

        }

        return keys;

    }

    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    const envMaps = ( function () {

        const path = 'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/';
        const format = '.jpg';
        const urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
        ];

        const reflectionCube = cubeTextureLoader.load( urls );

        const refractionCube = cubeTextureLoader.load( urls );
        refractionCube.mapping = THREE.CubeRefractionMapping;

        return {
            none: null,
            reflection: reflectionCube,
            refraction: refractionCube
        };

    } )();

    const diffuseMaps = ( function () {

        const bricks = textureLoader.load( 'https://threejs.org/examples/textures/brick_diffuse.jpg' );
        bricks.wrapS = THREE.RepeatWrapping;
        bricks.wrapT = THREE.RepeatWrapping;
        bricks.repeat.set( 9, 1 );

        return {
            none: null,
            bricks: bricks
        };

    } )();

    const roughnessMaps = ( function () {

        const bricks = textureLoader.load( 'https://threejs.org/examples/textures/brick_roughness.jpg' );
        bricks.wrapT = THREE.RepeatWrapping;
        bricks.wrapS = THREE.RepeatWrapping;
        bricks.repeat.set( 9, 1 );

        return {
            none: null,
            bricks: bricks
        };

    } )();

    const matcaps = ( function () {

        return {
            none: null,
            porcelainWhite: textureLoader.load( 'https://threejs.org/examples/textures/matcaps/matcap-porcelain-white.jpg' )
        };

    } )();

    const alphaMaps = ( function () {

        const fibers = textureLoader.load( 'https://threejs.org/examples/textures/alphaMap.jpg' );
        fibers.wrapT = THREE.RepeatWrapping;
        fibers.wrapS = THREE.RepeatWrapping;
        fibers.repeat.set( 9, 1 );

        return {
            none: null,
            fibers: fibers
        };

    } )();

    const gradientMaps = ( function () {

        const threeTone = textureLoader.load( 'https://threejs.org/examples/textures/gradientMaps/threeTone.jpg' );
        threeTone.minFilter = THREE.NearestFilter;
        threeTone.magFilter = THREE.NearestFilter;

        const fiveTone = textureLoader.load( 'https://threejs.org/examples/textures/gradientMaps/fiveTone.jpg' );
        fiveTone.minFilter = THREE.NearestFilter;
        fiveTone.magFilter = THREE.NearestFilter;

        return {
            none: null,
            threeTone: threeTone,
            fiveTone: fiveTone
        };

    } )();

    const envMapKeys = getObjectsKeys( envMaps );
    const diffuseMapKeys = getObjectsKeys( diffuseMaps );
    const roughnessMapKeys = getObjectsKeys( roughnessMaps );
    const matcapKeys = getObjectsKeys( matcaps );
    const alphaMapKeys = getObjectsKeys( alphaMaps );
    const gradientMapKeys = getObjectsKeys( gradientMaps );

    function generateVertexColors( geometry ) {

        const positionAttribute = geometry.attributes.position;

        const colors = [];
        const color = new THREE.Color();

        for ( let i = 0, il = positionAttribute.count; i < il; i ++ ) {

            color.setHSL( i / il * Math.random(), 0.5, 0.5 );
            colors.push( color.r, color.g, color.b );

        }

        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    }

    function handleColorChange( color ) {

        return function ( value ) {

            if ( typeof value === 'string' ) {

                value = value.replace( '#', '0x' );

            }

            color.setHex( value );

        };

    }

    function needsUpdate( material, geometry ) {

        return function () {

            material.vertexColors = material.vertexColors;
            material.side = parseInt( material.side ); //Ensure number
            material.needsUpdate = true;
            geometry.attributes.position.needsUpdate = true;
            geometry.attributes.normal.needsUpdate = true;
            geometry.attributes.color.needsUpdate = true;

        };

    }

    function updateCombine( material ) {

        return function ( combine ) {

            material.combine = parseInt( combine );
            material.needsUpdate = true;

        };

    }

    function updateMultipleTextures(lambertMat, phongMat, physicalMat, materialKey, textures){

        return function ( key ) {

            lambertMat[ materialKey ] = textures[ key ];
            lambertMat.needsUpdate = true;
            
            phongMat[ materialKey ] = textures[ key ];
            phongMat.needsUpdate = true;

            physicalMat[ materialKey ] = textures[ key ];
            physicalMat.needsUpdate = true;

        };
    }

    function updateTexture( material, materialKey, textures ) {

        return function ( key ) {

            material[ materialKey ] = textures[ key ];
            material.needsUpdate = true;

        };

    }


    //This code was taken from Threejs.org Examples

    // const light = pointLight();
    // const ambient = ambientLight();
    
    //Exercise 4 GUI
        const mainFolder = gui.addFolder ( 'Main Scene' );
        const fog = new THREE.Fog( 0x3f7b9d, 0, 60);
        const materialProperties = {
            'Ambient light': ambient.color.getHex(),
            fog: {
                'Enable Fog': false,
                'Fog color': fog.color.getHex(),
            },
            material: {
                'Transparent': false,
                'Opacity': 1,
                'DepthTest': false,
                'DepthWrite': false,
                'AlphaTest': 1,
                'Visible': true,
            },
            lambertMaterial: {
                'color': lambertMat.color.getHex(),
                'emissive': lambertMat.emissive.getHex(),
                'envMaps': envMapKeys[ 0 ],
                'map': diffuseMapKeys[ 0 ],
                'alphaMap': alphaMapKeys[ 0 ],
                'wireframe': false,
                'vertexColors': false,
                'fog': false,
                'combine': "none",
                'reflectivity': 0,
                'refractionRatio': 0,
            },
            phongMaterial: {
                'color': phongMat.color.getHex(),
                'specular': phongMat.specular.getHex(),
                'shininess': 0,
                'flatShading': false //fix,
            },
            physicalMaterial: {
                'color': physicalMat.color.getHex(),
                'roughness': 0,
                'metalness': 0,
                'clearcoat': 0,
                'clearcoatRoughness': 0,
                'roughnessMap': roughnessMapKeys[ 0 ],
            },
        };

        mainFolder.addColor( materialProperties, 'Ambient light')
                    .onChange( function(value) { 
                        ambient.color.set(value);
                    });
        
        const fogFolder = mainFolder.addFolder( 'Fog' );

        fogFolder.add( materialProperties.fog, 'Enable Fog')
                    .onChange( function (value){
                        if( value ){
                            scene.fog = fog;
                        } else {
                            scene.fog = null;
                        }
                    });
        fogFolder.addColor( materialProperties.fog, 'Fog color')
                    .onChange( function (value){
                        fog.color.set(value);
                    });

        const materialFolder = mainFolder.addFolder( 'All Material' );

        materialFolder.add( materialProperties.material, 'Transparent')
                    .onChange( function (value){
                        lambertMat.transparent = value;
                        phongMat.transparent = value;
                        physicalMat.transparent = value;
                    });
                    
        materialFolder.add( materialProperties.material, 'Opacity', 0, 1)
                    .onChange( function (value){
                        lambertMat.opacity = value;
                        phongMat.opacity = value;
                        physicalMat.opacity = value; 
                    });
        
        materialFolder.add( materialProperties.material, 'DepthTest')
                    .onChange( function (value){
                        lambertMat.depthTest = value;
                        phongMat.depthTest = value;
                        physicalMat.depthTest = value;
                    });
                    
        materialFolder.add( materialProperties.material, 'DepthWrite')
                    .onChange( function (value){
                        lambertMat.depthWrite = value;
                        phongMat.depthWrite = value;
                        physicalMat.depthWrite = value; 
                    });
        
        materialFolder.add( materialProperties.material, 'AlphaTest', 0, 1)
                    .onChange( function (value){
                        lambertMat.alphaTest = value;
                        phongMat.alphaTest = value;
                        physicalMat.alphaTest = value;
                    });
                    
        materialFolder.add( materialProperties.material, 'Visible')
                    .onChange( function (value){
                        lambertMat.visible = value;
                        phongMat.visible = value;
                        physicalMat.visible = value;
                    });

        materialFolder.addColor( materialProperties.lambertMaterial, 'emissive')
                    .onChange( function (value){
                        lambertMat.emissive.set(value);
                        phongMat.emissive.set(value);
                        physicalMat.emissive.set(value);
                    });
                    
        materialFolder.add( materialProperties.lambertMaterial, 'envMaps', envMapKeys)
                    .onChange(
                        updateMultipleTextures(lambertMat, phongMat, physicalMat, 'envMap', envMaps),
                    );

        materialFolder.add( materialProperties.lambertMaterial, 'map' , diffuseMapKeys)
                    .onChange( 
                        updateMultipleTextures(lambertMat, phongMat, physicalMat, 'map', diffuseMaps),
                    );

        materialFolder.add( materialProperties.lambertMaterial, 'alphaMap', alphaMapKeys)
                    .onChange( 
                        updateMultipleTextures(lambertMat, phongMat, physicalMat, 'alphaMap', alphaMaps),
                    );

        materialFolder.add( materialProperties.lambertMaterial, 'wireframe')
                    .onChange( function (value){
                        lambertMat.wireframe = value;
                        phongMat.wireframe = value;
                        physicalMat.wireframe = value;
                    });

        materialFolder.add( materialProperties.lambertMaterial, 'vertexColors')
                    .onChange( function (value){
                        lambertMat.vertexColors = value;
                        phongMat.vertexColors = value;
                        physicalMat.vertexColors = value;
                    });

        materialFolder.add( materialProperties.lambertMaterial, 'fog')
                    .onChange( function (value){
                        lambertMat.fog = value;
                        phongMat.fog = value;
                        physicalMat.fog = value;
                    });

        materialFolder.add( materialProperties.lambertMaterial, 'combine', constants.combine)
                    .onChange( updateCombine( lambertMat ) );

        materialFolder.add( materialProperties.lambertMaterial, 'reflectivity', 0, 1)
                    .onChange( function (value){
                        lambertMat.reflectivity = value;
                        phongMat.reflectivity = value;
                        physicalMat.reflectivity = value;
                    });

        materialFolder.add( materialProperties.lambertMaterial, 'refractionRatio', 0, 1)
                    .onChange( function (value){
                        lambertMat.refractionRatio = value;
                        phongMat.refractionRatio = value;
                        physicalMat.refractionRatio = value;
                    });
        
        const lambertianFolder = materialFolder.addFolder( 'Lambertian Material')
        
        lambertianFolder.addColor( materialProperties.lambertMaterial, 'color')
                    .onChange( function (value){
                        lambertMat.color.set(value);
                    });

        const phongFolder = materialFolder.addFolder( 'Phong Material')

        phongFolder.addColor( materialProperties.phongMaterial, 'color')
                    .onChange( function (value){
                        phongMat.color.set(value);
                    });
        
        phongFolder.addColor( materialProperties.phongMaterial, 'specular')
                    .onChange( function (value){
                        phongMat.specular.set(value);
                    });

        phongFolder.add( materialProperties.phongMaterial, 'shininess', 0, 100)
                    .onChange( function (value){
                        phongMat.shininess = value;
                    });

        phongFolder.add( materialProperties.phongMaterial, 'flatShading')
                    .onChange( function (value){
                        phongMat.flatShading = value;
                    });

        const physicalFolder = materialFolder.addFolder( 'Physical Material')

        physicalFolder.addColor( materialProperties.physicalMaterial, 'color')
                    .onChange( function (value){
                        physicalMat.color.set(value);
                    });
                    
        physicalFolder.add( materialProperties.physicalMaterial, 'roughness', 0, 1)
                    .onChange( function (value){
                        physicalMat.roughness = value;
                    });
                    
        physicalFolder.add( materialProperties.physicalMaterial, 'metalness', 0 , 1)
                    .onChange( function (value){
                        physicalMat.metalness = value;
                    });
                    
        physicalFolder.add( materialProperties.physicalMaterial, 'clearcoat', 0 , 1)
                    .onChange( function (value){
                        physicalMat.clearcoat = value;
                    });
                    
        physicalFolder.add( materialProperties.physicalMaterial, 'clearcoatRoughness', 0, 1 ).step( 0.01 )
                    .onChange( function (value){
                        physicalMat.clearcoatRoughness = value;
                    });
                    
        physicalFolder.add( materialProperties.physicalMaterial, 'roughnessMap', roughnessMapKeys)
                    .onChange( 
                        updateTexture( physicalMat, 'roughnessMap', roughnessMaps ),
                    );
                    
    mainFolder.close();


    //Exercise 5
    
    //RectAreaLight
    const rectLight = (x, y, int = 1, color = 0xffffff, w = 10, h = 10) => {
        const width = w;
        const height = h;
        const intensity = int;
        const rectLight = new THREE.RectAreaLight( color, intensity,  width, height );
        rectLight.position.set( x, y, 0 );
        rectLight.lookAt( 0, 0, 0 );
        scene.add( rectLight )
        return rectLight;
    }
    const floorRect = rectLight(10, 10, 0.5);
    const rightWallRect = rectLight(10, 10, 0.5, 0x00ff00);
    const leftWallRect = rectLight(10, 10, 0.5, 0xff0000);
    const backWallRect = rectLight(10, 10, 0.5);
    const ceilingRect = rectLight(10, 10, 0.5);

    scene.add(floorRect);

    scene.add(rightWallRect);
    scene.add(leftWallRect);
    scene.add(backWallRect);
    scene.add(ceilingRect);

    floorRect.position.set(5, 0, 5);
    floorRect.rotateX (THREE.MathUtils.degToRad(135))

    rightWallRect.position.set(0, 5, 5);
    rightWallRect.rotateY(THREE.MathUtils.degToRad(180))
    rightWallRect.rotateX(THREE.MathUtils.degToRad(-45))
     
    leftWallRect.position.set(10, 5, 5);
    leftWallRect.rotateY(THREE.MathUtils.degToRad(180))
    leftWallRect.rotateX(THREE.MathUtils.degToRad(135))


    backWallRect.position.set(5, 5, 0);
    backWallRect.rotateY(THREE.MathUtils.degToRad(-90))
    backWallRect.rotateZ(THREE.MathUtils.degToRad(45))
    backWallRect.rotateX(THREE.MathUtils.degToRad(180))


    ceilingRect.position.set(5, 10, 5);
    ceilingRect.rotateX(THREE.MathUtils.degToRad(-45))

    //RectAreaHelpers to visualize changes
    // const rectLightHelper = new RectAreaLightHelper( floorRect );
    // floorRect.add( rectLightHelper );
    // const rectLightHelper2 = new RectAreaLightHelper( rightWallRect );
    // rightWallRect.add( rectLightHelper2 );
    // const rectLightHelper3 = new RectAreaLightHelper( leftWallRect );
    // leftWallRect.add( rectLightHelper3 );
    // const rectLightHelper4 = new RectAreaLightHelper( backWallRect );
    // backWallRect.add( rectLightHelper4 );
    // const rectLightHelper5 = new RectAreaLightHelper( ceilingRect );
    // ceilingRect.add( rectLightHelper5 );
    
    //Exercise 6 - Shadows
    
    ////CameraHelperForShadows
    const helper = new THREE.CameraHelper ( directional.shadow.camera );
    scene.add(helper);

    //Shadows Gui
    const shadowsProperties = {
        'Enable Shadows': renderer.shadowMap.enabled,
        dirMapWidth : directional.shadow.mapSize.width,
        dirMapHeight : directional.shadow.mapSize.height,
        dirCameraNear : directional.shadow.camera.near,
        dirCameraFar : directional.shadow.camera.far,
        
        lightMapWidth : light.shadow.mapSize.width,
        lightMapHeight : light.shadow.mapSize.height,
        lightCameraNear : light.shadow.camera.near,
        lightCameraFar : light.shadow.camera.far,
        
        spotMapWidth : spot.shadow.mapSize.width,
        spotMapHeight : spot.shadow.mapSize.height,
        spotCameraNear : spot.shadow.camera.near,
        spotCameraFar : spot.shadow.camera.far,
        
    }

    gui.add(shadowsProperties, 'Enable Shadows')
        .onChange( function(value) {
            renderer.shadowMap.enabled = value;
        })
    const shadowFolder = gui.addFolder ( 'Shadows' );
    const directionalShadows = shadowFolder.addFolder( 'Directional Shadows')

    directionalShadows.add(shadowsProperties, 'dirMapWidth')
                .onChange(function (value) {
                    directional.shadow.mapSize.width = value;
                })

                ////todo-continue the shadowproperties



    //Orbit Controls
    var controls = new OrbitControls (camera, renderer.domElement);

    //Hide Gui
    lightControlsGUI.close();

    //Renderer Function
    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
          scene.traverse(function (child) {
            if (child.material) {
              child.material.needsUpdate = true
            }
          })
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