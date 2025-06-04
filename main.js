import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';

function main() {
  let previousTime = 0;
  // —————————————————————————————
  //—————————————————
  //  1) SET UP renderer, camera, scene
  // ——————————————————————————————————————————————
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.shadowMap.enabled = true;

  const fov = 75;
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const near = 0.1;
  const far = 100; // give yourself some headroom
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 2, 5);

  //Camera controls
    const controls = new FirstPersonControls(camera, renderer.domElement);
    controls.lookSpeed = 0.1;    // mouse sensitivity
    controls.movementSpeed = 5;  // movement speed
    controls.lookVertical = true;  // enable looking up/down

  const scene = new THREE.Scene();

  // ——————————————————————————————————————————————
  //  2) ADD LIGHTS
  // ——————————————————————————————————————————————
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(-1, 3, 2);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const ambient = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambient);

  // ——————————————————————————————————————————————
  //  3) GROUND PLANE
  // ——————————————————————————————————————————————
  const groundSize = 30;
  const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x228822,
    roughness: 0.8,
    metalness: 0.2,
  });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -0.5;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  // ——————————————————————————————————————————————
  //  4) CUBES (just like before)
  // ——————————————————————————————————————————————
  const loader = new THREE.TextureLoader();
  const texture = loader.load('textures/monke.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;

  function makeInstance(geometry, x) {
    const mat = new THREE.MeshBasicMaterial({ map: texture });
    const m = new THREE.Mesh(geometry, mat);
    m.position.x = x;
    scene.add(m);
    return m;
  }

  const boxGeom = new THREE.BoxGeometry(1, 1, 1);
  const cubes = [
    makeInstance(boxGeom, 0),
    makeInstance(boxGeom, -2),
    makeInstance(boxGeom, 2),
  ];

  // ——————————————————————————————————————————————
  //  5) LOAD T-REX OBJ
  // ——————————————————————————————————————————————
  const objLoader = new OBJLoader();
  objLoader.load(
    'Model/T-Rex Model.obj',
    (root) => {
      // The OBJ usually comes in as a `Group` containing one or more Meshes.
      // We’ll traverse and replace each mesh’s material so it’s visible under our lights:
      root.traverse((child) => {
        if (child.isMesh) {
          // give it a simple gray, lit material
          child.material = new THREE.MeshStandardMaterial({
            color: 0x999999,
            roughness: 0.6,
            metalness: 0.1,
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // scale + position so it sits on our ground
      root.scale.set(0.02, 0.02, 0.02);  // (adjust until it looks reasonable)
      root.position.set(0, -2.1, 0);
      scene.add(root);
    },
    (xhr) => {
      // (optional) progress callback
      // console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (err) => {
      console.error('T-Rex OBJ load error:', err);
    }
  );

  // ——————————————————————————————————————————————
  //  6) ANIMATION LOOP (moved to the bottom, after everything’s defined)
  // ——————————————————————————————————————————————
  function render(time) {
    time *= 0.001; // seconds
    const deltaTime = time - previousTime;
    previousTime = time;

    // spin the cubes
    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });



    controls.update(deltaTime); // deltaTime in seconds, you can tweak if needed

    // standard render
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

// attach to window so <body onload="main()"> works
window.main = main;