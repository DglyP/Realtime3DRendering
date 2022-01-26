import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/utils/BufferGeometryUtils.js';

const gridGroup = new THREE.Group();

function makeCross(){

    //First Part of the cross
    const crossHorizontal = [];
    crossHorizontal.push (new THREE.Vector3( -1, 0, 0) );
    crossHorizontal.push (new THREE.Vector3( 1, 0, 0) );
    const crossHorizontalGeom = new THREE.BufferGeometry().setFromPoints( crossHorizontal );
   
    //Second Part of the Cross
    const crossVertical = [];
    crossVertical.push (new THREE.Vector3( 0, -1, 0) );
    crossVertical.push (new THREE.Vector3( 0, 1, 0) );
    const crossVerticalGeom = new THREE.BufferGeometry().setFromPoints( crossVertical );

    //Creation of full cross
    var crossFullGeom = new BufferGeometryUtils.mergeBufferGeometries([crossHorizontalGeom, crossVerticalGeom])
    return crossFullGeom
}

export function getOpacity(x, y, width, height ){
    if (width > 150){
        width = 150;
    } 
    if (height > 300){
        height = 300;
    }
    let distance = Math.sqrt((x * x) + (y * y));
    return 1 - (distance  / width);
}

export function createGrid(params){
    var values = params ||{
        height: canvas.clientHeight,
        width: 250,
        color: 0xFFFFFF
    };

    
    for (var i = -values.height; i < values.height; i += 5){
        for (var j = -values.width; j < values.width; j += 5){
            var gridCross = makeCross();
            const positionOnGrid = new THREE.Vector3(j, i, 0)
            gridCross.translate(j, i, 0);

            let crossMaterial = new THREE.LineBasicMaterial({
                color: values.color,
                transparent: true,
                opacity: getOpacity(i, j, values.width, values.height)
            })

            let cross = new THREE.LineSegments(gridCross, crossMaterial)
            gridGroup.add(cross)
        }
    }
    return gridGroup
}