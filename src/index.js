import { WebGLRenderer, PerspectiveCamera, Scene, Vector3, Fog } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Interaction } from "three.interaction";
import renderGui from "./components/Gui.js";
import SeedScene from "./components/SeedScene.js";

const width = 1280;
const height = 720;

const renderer = new WebGLRenderer({ antialias: true });
const dom = renderer.domElement;
const scene = new Scene();
const info = document.getElementById("info");
const seedScene = new SeedScene(info);
const camera = new PerspectiveCamera(40, width / height, 0.1, 1000);
const controls = new OrbitControls(camera, dom);

//camera
camera.position.set(10, 4, -3);
camera.update = () => {};
controls.target = new Vector3(-0.5, 0, 2.5);

// gui
renderGui(camera, controls, seedScene);

// controls
controls.maxPolarAngle = Math.PI / 2;
controls.enableKeys = false;
controls.enablePan = false;

// mouse interaction
const interaction = new Interaction(renderer, scene, camera);

// scene
scene.add(seedScene);

// renderer
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x313131, 1);
seedScene.press = () => {};
const keyDownHandler = ev => {
  if (ev.key === "w") {
    seedScene.press();
  }
};
window.addEventListener("keydown", keyDownHandler);

// render loop
const render = timeStamp => {
  // controls.update();
  camera.update(seedScene);
  // seedScene.update();
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
