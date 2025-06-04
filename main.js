import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    //camera
    const fov = 75;
    const aspect = canvas.clientWidth / canvas.clientHeight;  // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    camera.position.z = 2;


    const scene = new THREE.Scene();

    const loader = new THREE.TextureLoader();
    const texture = loader.load( 'textures/monke.jpg' );
    texture.colorSpace = THREE.SRGBColorSpace;

  const objLoader = new OBJLoader();
  objLoader.load('T-Rex Model.obj', (root) => {
    scene.add(root);
  });

    //Creating a cube
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const cubes = [
        makeInstance(geometry, texture,  0),
        makeInstance(geometry, texture, -2),
        makeInstance(geometry, texture,  2),
    ];





    //Adding light
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    renderer.render(scene, camera);
    function render(time) {
        time *= 0.001;  // convert time to seconds
        
        cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });
        
        renderer.render(scene, camera);
        
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);


    function makeInstance(geometry, color, x) {
        const material = new THREE.MeshBasicMaterial({
            map: texture,
        });
        
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        
        cube.position.x = x;
        
        return cube;
    }
    
}


// Option A: attach to window so <body onload="main()"> works
window.main = main;