let camera, scene, renderer;
const originBoxSize = 3;

let stack = [];
const boxHeight = 1;

let gameStarted = false;


init();

function init() {
  scene = new THREE.Scene(); // 새로운 신 생성

  //add box
  addLayer(0, 0, originBoxSize, originBoxSize);//foundation
  addLayer(-10, 0, originBoxSize, originBoxSize, "x");


  //Set up lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(10, 20, 0)
  scene.add(directionalLight);

  //Camera
  const width = 10;
  const height = width * (window.innerHeight / window.innerWidth);
  camera = new THREE.OrthographicCamera(
    width / -2,
    width / 2,
    height / 2,
    height / -2,
    1,
    100
  )

  camera.position.set(4, 4, 4)
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);

  document.body.appendChild(renderer.domElement);
}


function addLayer(x, z, width, depth, direction) {
  const y = boxHeight * stack.length;
  const layer = generateBox(x, y, z,width, depth)
  layer.direction = direction;
  stack.push(layer)
}


function generateBox(x, y, z, width, depth) {
  //add a cube to the scene
  const geometry = new THREE.BoxGeometry(width, boxHeight, depth);

  const color = new THREE.Color(`hsl(${30 + stack.length * 4}, 100%, 50%)`);
  const material = new THREE.MeshLambertMaterial({ color })

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);

  scene.add(mesh)

  return {
    threejs: mesh,
    width,
    depth,
  }
}


window.addEventListener("click", () => {
  if (!gameStarted) {
    renderer.setAnimationLoop(animation);
    gameStarted = true;
  } else {
    const topLayer = stack[stack.length - 1];
    const direction = topLayer.direction;

    const nextX = direction == "x" ? 0 : -10;
    const nextZ = direction == "z" ? 0 : -10;
    const newWidth = originBoxSize;
    const newDepth = originBoxSize;
    const nextDirection = direction === "x" ? "z" : "x";

    addLayer(nextX, nextZ, newWidth, newDepth, nextDirection);
  }
})


function animation() {
  const speed = 0.15;

  const topLayer = stack[stack.length - 1];
  topLayer.threejs.position[topLayer.direction] += speed;

  if (camera.position.y < boxHeight * (stack.length - 2) + 4) {
    camera.position.y += speed;
  }

  renderer.render(scene, camera)
}