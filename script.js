let scene, camera, renderer, controls, raycaster, mouse;

const toothData = {
  "Tooth_11":"Upper Right Central Incisor",
  "Tooth_12":"Upper Right Lateral Incisor",
  "Tooth_13":"Upper Right Canine",
  "Tooth_14":"Upper Right First Premolar",
  "Tooth_15":"Upper Right Second Premolar",
  "Tooth_16":"Upper Right First Molar",
  "Tooth_17":"Upper Right Second Molar",
  "Tooth_18":"Upper Right Third Molar",

  "Tooth_21":"Upper Left Central Incisor",
  "Tooth_22":"Upper Left Lateral Incisor",
  "Tooth_23":"Upper Left Canine",
  "Tooth_24":"Upper Left First Premolar",
  "Tooth_25":"Upper Left Second Premolar",
  "Tooth_26":"Upper Left First Molar",
  "Tooth_27":"Upper Left Second Molar",
  "Tooth_28":"Upper Left Third Molar",

  "Tooth_31":"Lower Left Central Incisor",
  "Tooth_32":"Lower Left Lateral Incisor",
  "Tooth_33":"Lower Left Canine",
  "Tooth_34":"Lower Left First Premolar",
  "Tooth_35":"Lower Left Second Premolar",
  "Tooth_36":"Lower Left First Molar",
  "Tooth_37":"Lower Left Second Molar",
  "Tooth_38":"Lower Left Third Molar",

  "Tooth_41":"Lower Right Central Incisor",
  "Tooth_42":"Lower Right Lateral Incisor",
  "Tooth_43":"Lower Right Canine",
  "Tooth_44":"Lower Right First Premolar",
  "Tooth_45":"Lower Right Second Premolar",
  "Tooth_46":"Lower Right First Molar",
  "Tooth_47":"Lower Right Second Molar",
  "Tooth_48":"Lower Right Third Molar"
};

init();
animate();

function init(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#0f172a");

  camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0,2,7);

  renderer = new THREE.WebGLRenderer({
    canvas:document.getElementById("scene"),
    antialias:true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const l1 = new THREE.DirectionalLight(0xffffff,1);
  l1.position.set(5,5,5);
  scene.add(l1);

  scene.add(new THREE.AmbientLight(0xffffff,.6));

  const loader = new THREE.GLTFLoader();
  loader.load("teeth.glb", gltf=>{
    const model = gltf.scene;

    model.traverse(obj=>{
      if(obj.isMesh){
        obj.userData.toothID = obj.name;
        obj.material.transparent = true;
      }
    });

    scene.add(model);
  });

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  window.addEventListener("click", onClick);
  window.addEventListener("resize", onResize);
}

function onClick(e){
  mouse.x = (e.clientX/window.innerWidth)*2 - 1;
  mouse.y = -(e.clientY/window.innerHeight)*2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hit = raycaster.intersectObjects(scene.children, true);

  if(hit.length>0){
    const id = hit[0].object.userData.toothID;

    if(toothData[id]){
      document.getElementById("title").innerText = toothData[id];
      document.getElementById("desc").innerText = "FDI Code: " + id;
    }
  }
}

function onResize(){
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
