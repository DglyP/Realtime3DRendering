import * as THREE from 'https://cdn.skypack.dev/three@0.136.0/build/three.module.js';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/utils/BufferGeometryUtils.js';


var allObjects = [];

function createMaterial(){
    const material = new THREE.MeshMatcapMaterial({
        side: THREE.DoubleSide,
    });
    material.color.setHex( Math.random() * 0xffffff );
    return material;
}

function solidGeometries(geometry){
    let obj = new THREE.Mesh(geometry, createMaterial());
    allObjects.push(obj);
}

function lineGeometries(geometry){
    let material = new THREE.LineBasicMaterial ({ color: 0xffffff})
    let obj = new THREE.Mesh(geometry, material); 
    allObjects.push(obj);
}

export function primitives(){
            {
            const width = 8;
            const height = 8;
            const depth = 8;
            const test = new THREE.BoxGeometry(width, height, depth);
            solidGeometries(new THREE.BoxGeometry(width, height, depth));
        }
        {
            const radius = 7;
            const segments = 24;
            solidGeometries( new THREE.CircleBufferGeometry(radius, segments));
        }
        {
            const radius = 6;
            const height = 8;
            const segments = 16;
            solidGeometries( new THREE.ConeBufferGeometry(radius, height, segments));
        }
        {
            const radiusTop = 4;
            const radiusBottom = 4;
            const height = 8;
            const radialSegments = 12;
            solidGeometries( new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments));
        }
        {
            const radius = 7;
            solidGeometries( new THREE.DodecahedronBufferGeometry(radius));
        }
        {
            const shape = new THREE.Shape();
            const x = -2.5;
            const y = -5;
            shape.moveTo(x + 2.5, y + 2.5);
            shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
            shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
            shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
            shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
            shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
            shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

            const extrudeSettings = {
                steps: 2,
                depth: 2,
                bevelEnabled: true,
                bevelThickness: 1,
                bevelSize: 1,
                bevelSegments: 2,
            };

            solidGeometries( new THREE.ExtrudeBufferGeometry(shape, extrudeSettings));
        }
        {
            const radius = 7;
            solidGeometries( new THREE.IcosahedronBufferGeometry(radius));
        }
        {
            const points = [];
            for (let i = 0; i < 10; ++i) {
                points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * .8));
            }
            solidGeometries( new THREE.LatheBufferGeometry(points));
        }
        {
            const radius = 7;
            solidGeometries( new THREE.OctahedronBufferGeometry(radius));
        }
 
        {
            const width = 9;
            const height = 9;
            const widthSegments = 2;
            const heightSegments = 2;
            solidGeometries( new THREE.PlaneBufferGeometry(width, height, widthSegments, heightSegments));
        }
        {
            const verticesOfCube = [
                -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
                -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
            ];
            const indicesOfFaces = [
                2, 1, 0, 0, 3, 2,
                0, 4, 7, 7, 3, 0,
                0, 1, 5, 5, 4, 0,
                1, 2, 6, 6, 5, 1,
                2, 3, 7, 7, 6, 2,
                4, 5, 6, 6, 7, 4,
            ];
            const radius = 7;
            const detail = 2;
            solidGeometries( new THREE.PolyhedronBufferGeometry(verticesOfCube, indicesOfFaces, radius, detail));
        }

        {
            const innerRadius = 2;
            const outerRadius = 7;
            const segments = 18;
            solidGeometries( new THREE.RingBufferGeometry(innerRadius, outerRadius, segments));
        }
        {
            const shape = new THREE.Shape();
            const x = -2.5;
            const y = -5;
            shape.moveTo(x + 2.5, y + 2.5);
            shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
            shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
            shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
            shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
            shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
            shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
            solidGeometries( new THREE.ShapeBufferGeometry(shape));
        }
        {
            const radius = 7;
            const widthSegments = 12;
            const heightSegments = 8;
            solidGeometries( new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments));
        }
        {
            const radius = 7;
            solidGeometries( new THREE.TetrahedronBufferGeometry(radius));
        }
        {
            const radius = 5;
            const tubeRadius = 2;
            const radialSegments = 8;
            const tubularSegments = 24;
            solidGeometries( new THREE.TorusBufferGeometry(radius, tubeRadius, radialSegments, tubularSegments));
        }
        {
            const radius = 3.5;
            const tube = 1.5;
            const radialSegments = 8;
            const tubularSegments = 64;
            const p = 2;
            const q = 3;
            solidGeometries( new THREE.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q));
        }
        {
            class CustomSinCurve extends THREE.Curve {
                constructor(scale) {
                    super();
                    this.scale = scale;
                }
                getPoint(t) {
                    const tx = t * 3 - 1.5;
                    const ty = Math.sin(2 * Math.PI * t);
                    const tz = 0;
                    return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
                }
            }

            const path = new CustomSinCurve(4);
            const tubularSegments = 20;
            const radius = 1;
            const radialSegments = 8;
            const closed = false;
            solidGeometries( new THREE.TubeBufferGeometry(path, tubularSegments, radius, radialSegments, closed));
        }
        {
            const width = 8;
            const height = 8;
            const depth = 8;
            const thresholdAngle = 15;
            lineGeometries( new THREE.EdgesGeometry(
                new THREE.BoxBufferGeometry(width, height, depth),
                thresholdAngle));
        }
        {
            const width = 8;
            const height = 8;
            const depth = 8;
            lineGeometries( new THREE.WireframeGeometry(new THREE.BoxBufferGeometry(width, height, depth)));
        }
        return allObjects;
}

