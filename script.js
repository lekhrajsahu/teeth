let scene, camera, renderer, controls;
let raycaster, mouse;

init();
animate();

function init(){

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#0f172a");

  // Camera
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 8);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("scene"),
    antialias:true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lights
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(5, 5, 5);
  scene.add(dir);

  scene.add(new THREE.AmbientLight(0xffffff, .6));

  // Loader
  const loader = new THREE.GLTFLoader();

  console.log("Loading model...");

  loader.load(
    "teeth.glb",

    (gltf) => {
      console.log("Model Loaded");
      const model = gltf.scene;
      model.position.set(0, 0, 0);
      model.scale.set(1.5, 1.5, 1.5);
      scene.add(model);
    },

    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + "% loaded");
    },

    (err) => {
      console.error("Error loading model:", err);
    }
  );

  // Raycaster
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  window.addEventListener("click", onClick);
  window.addEventListener("resize", onResize);
}

function onClick(e){
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const hits = raycaster.intersectObjects(scene.children, true);

  if(hits.length > 0){
    document.getElementById("title").innerText = "Tooth Selected";
    document.getElementById("desc").innerText =
      hits[0].object.name || "Unnamed Mesh";
  }
}

function onResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
