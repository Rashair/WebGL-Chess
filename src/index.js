import { WebGLRenderer, PerspectiveCamera, Scene, Vector3, Fog } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Interaction } from "three.interaction";
import renderGui from "./components/Gui.js";
import SeedScene from "./components/SeedScene.js";

const width = 1280;
const height = 720;

const renderer = new WebGLRenderer({ antialias: true });
const dom = renderer.domElement;
//const scene = new Scene();
const info = document.getElementById("info");
const scene = new SeedScene(info);
const camera = new PerspectiveCamera(40, width / height, 0.1, 1000);
const controls = new OrbitControls(camera, dom);

//camera
camera.position.set(10, 4, -3);
camera.update = () => {};
controls.target = new Vector3(-0.5, 0, 2.5);

// gui
renderGui(camera, controls, scene);

// controls
controls.maxPolarAngle = Math.PI / 2;
controls.enableKeys = false;
controls.enablePan = false;

// interaction
const interaction = new Interaction(renderer, scene, camera);
scene.press = () => {};
const keyDownHandler = ev => {
  if (ev.key === "w") {
    scene.press();
  }
};
window.addEventListener("keydown", keyDownHandler);

// renderer
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x313131, 1);

// render loop
const render = timeStamp => {
  // controls.update();
  camera.update(scene);
  scene.update(timeStamp);

  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};
window.requestAnimationFrame(render);

// resize
// const windowResizeHandler = () => {
//   const { innerHeight, innerWidth } = window;
//   renderer.setSize(innerWidth, innerHeight);
//   camera.aspect = innerWidth / innerHeight;
//   camera.updateProjectionMatrix();
// };
// windowResizeHandler();
// window.addEventListener("resize", windowResizeHandler);

// dom
dom.oncontextmenu = () => false;
document.body.appendChild(dom);
