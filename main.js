import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const objLoader = new OBJLoader();
const gltfLoader = new GLTFLoader();


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
    // const controls = new FirstPersonControls(camera, renderer.domElement);
    // controls.lookSpeed = 0.1;    // mouse sensitivity
    // controls.movementSpeed = 5;  // movement speed
    // controls.lookVertical = true;  // enable looking up/down
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();


  const scene = new THREE.Scene();

  // ——————————————————————————————————————————————
  //  2) ADD LIGHTS
  // ——————————————————————————————————————————————
    const ambient = new THREE.AmbientLight(0xffffff, 2); // color, intensity
    scene.add(ambient);



    // POINT light (like bulb)
    const pointLight = new THREE.PointLight(0xff0000, 1500, 10); // red light to make it clear
    pointLight.position.set(-7, 3, -5);
    scene.add(pointLight);

    // SPOT light (like flashlight)
    const spotLight = new THREE.SpotLight(0x00ff00, 100, 15, Math.PI / 6, 0.1, 1); // green cone
    spotLight.position.set(-5, 0, 5);
    spotLight.target.position.set(0, 0, 0); // aim at center
    scene.add(spotLight);
    scene.add(spotLight.target);
  //   const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
//   dirLight.position.set(-1, 3, 2);
//   dirLight.castShadow = true;
//   scene.add(dirLight);

//   const ambient = new THREE.AmbientLight(0x404040, 0.5);
//   scene.add(ambient);

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

    function makeInstance(geometry, x, z) {
        const mat = new THREE.MeshBasicMaterial({ map: texture });
        const m = new THREE.Mesh(geometry, mat);
        m.position.set(x, 0.5, z); 
        scene.add(m);
        return m;
    }

    const boxGeom = new THREE.BoxGeometry(1, 1, 1);
    const cubes = [
        makeInstance(boxGeom, 0, -5),
        makeInstance(boxGeom, -2, -5),
        makeInstance(boxGeom, 2, -5),
    ];



  //Sphere
    const sphereGeo = new THREE.SphereGeometry(1, 32, 32); // radius, widthSegments, heightSegments
    const sphereMat = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.3, roughness: 0.7 });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(4, 0.5, -6); // x, y, z
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);

    //Cylinder
    const cylinderGeo = new THREE.CylinderGeometry(1, 1, 2, 32); // topRadius, bottomRadius, height, radialSegments
    const cylinderMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, metalness: 0.2, roughness: 0.8 });
    const cylinder = new THREE.Mesh(cylinderGeo, cylinderMat);
    cylinder.position.set(-4,.5, -6); // x, y, z
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    scene.add(cylinder);


    //JP Cube
    const johnTex = loader.load('textures/John.jpg', () => {
        johnTex.colorSpace = THREE.SRGBColorSpace;   // correct colour
    });

    // 2.  Build a material that uses it
    const johnMat = new THREE.MeshStandardMaterial({
        map:        johnTex,
        roughness:  0.8,
        metalness:  0.1
    });

    // 3.  Create a cube and place it
    const johnCube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),   // size‑1 cube
        johnMat
    );
    johnCube.position.set(0, 0.05, 0);     // y = 0.5 so it sits on ground
    johnCube.castShadow    = true;
    johnCube.receiveShadow = true;

    scene.add(johnCube);



  // ——————————————————————————————————————————————
  //  5) LOAD T-REX OBJ
  // ——————————————————————————————————————————————
  
//   objLoader.load(
//     'Model/T-Rex Model.obj',
//     (root) => {
//       // The OBJ usually comes in as a `Group` containing one or more Meshes.
//       // We’ll traverse and replace each mesh’s material so it’s visible under our lights:
//       root.traverse((child) => {
//         if (child.isMesh) {
//           // give it a simple gray, lit material
//           child.material = new THREE.MeshStandardMaterial({
//             color: 0x999999,
//             roughness: 0.6,
//             metalness: 0.1,
//           });
//           child.castShadow = true;
//           child.receiveShadow = true;
//         }
//       });

//       // scale + position so it sits on our ground
//       root.scale.set(0.02, 0.02, 0.02);  // (adjust until it looks reasonable)
//       root.position.set(0, -2.1, 0);
//       scene.add(root);
//     },
//     (xhr) => {
//       // (optional) progress callback
//       // console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
//     },
//     (err) => {
//       console.error('T-Rex OBJ load error:', err);
//     }
//   );

gltfLoader.load('Model/t_rex_game_ready.glb', (gltf) => {

    
    const rex = gltf.scene;

    // optional: give it shadows
    rex.traverse(o => {
        if (o.isMesh) { o.castShadow = o.receiveShadow = true; }
    });

      /* ---------- 1st copy -------------------------------------------------- */
        const rexA = rex.clone(true);    // deep‑clone children + materials
        rexA.scale.set(6, 6, 6);            // same scale you used before
        rexA.position.set(-11, 4,  1);       // choose any (x,y,z)
        rexA.lookAt(0, rexA.position.y, -10); // face centre
        // rexA.rotateY(Math.PI);           // 180° flip if needed
        scene.add(rexA);

        /* ---------- 2nd copy -------------------------------------------------- */
        const rexB = rex.clone(true);
        rexB.scale.set(6, 6, 6);
        rexB.position.set( 11, 4, -1);
        rexB.lookAt(10, rexB.position.y, 0);
        scene.add(rexB);

        /* ---------- 3rd copy (manual heading) --------------------------------- */
        const rexC = rex.clone(true);
        rexC.scale.set(6, 6, 6);
        rexC.position.set(0, 4, -9);

        // Instead of lookAt you can set a heading directly (in radians):
        rexC.rotation.y = Math.PI * 0.25;   // 45° clockwise
        scene.add(rexC);
         });
    // ——————————————————————————————————————————————
    // 5.5) LOAD TREE OBJ + MTL
    // ——————————————————————————————————————————————

    const mtlLoader = new MTLLoader();

    mtlLoader.load('Model/Tree.mtl', (materials) => {
        materials.preload();

        objLoader.setMaterials(materials);

        objLoader.load('Model/Tree.obj', (root) => {
                   // common scale for every copy
        root.scale.set(1, 1, 1);

        // store the original in an array so you can reuse/clones
        const trees = [];

        // helper that makes a deep clone, moves it, and adds to scene
        function placeTree(x, z) {
            const clone = root.clone(true);   // deep‑clone children & materials
            clone.position.set(x, -0.7, z);   // y = -0.7 to sit on ground
            scene.add(clone);
            trees.push(clone);
        }

        /* ‑‑‑ place as many trees as you like ‑‑‑ */
        placeTree( 3,  11);   // your first one (same as before)

        placeTree( 4,  5);
        placeTree( 4,  -3);
        placeTree(-4,  6);   // second
        placeTree( 6, -8);   // third
        placeTree( -2, -8); 
        placeTree(-10, -5);   // fourth

            //scene.add(root);
        });
    });



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

    ///SKYBOX
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
    'textures/sky.jpg',
    () => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      scene.background = texture;
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