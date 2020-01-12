/**
 * index.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */

import { WebGLRenderer, PerspectiveCamera, Scene, Vector3, Fog } from "three";
import { Interaction } from "three.interaction";
import renderGui from "./components/Gui.js";
import SeedScene from "./components/Scene.js";

const width = 1280;
const height = 720;

const renderer = new WebGLRenderer({ antialias: true });
const scene = new Scene();
const camera = new PerspectiveCamera(40, width / height, 0.1, 1000);
const interaction = new Interaction(renderer, scene, camera);

// gui
let cameraPos = new Vector3(8.5, 2, -3);
let targetPos = new Vector3(1, 0, 3);
renderGui(camera, cameraPos, targetPos);

// scene
const seedScene = new SeedScene();
scene.add(seedScene);

// renderer
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x313131, 1);

// render loop
const render = timeStamp => {
  renderer.render(scene, camera);
  //camera.lookAt(targetPos);
  seedScene.update && seedScene.update(timeStamp);
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
const dom = renderer.domElement;
dom.oncontextmenu = () => false;
document.body.appendChild(renderer.domElement);
