/**
 * index.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */

import { WebGLRenderer, PerspectiveCamera, Scene, Vector3, Fog } from "three";
import renderGui from "./components/Gui.js";
import SeedScene from "./components/Scene.js";

const width = 640;
const height = 380;

const renderer = new WebGLRenderer({ antialias: true });
const scene = new Scene();

const seedScene = new SeedScene();
const camera = new PerspectiveCamera(40, width / height, 0.1, 1000);

// gui
let cameraPos = new Vector3(8.5, 2, -3);
let targetPos = new Vector3(1, 0, 3);
renderGui(camera, cameraPos, targetPos);

// scene
scene.add(seedScene);

// renderer
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x313131, 1);

// render loop
const render = timeStamp => {
  renderer.render(scene, camera);
  //camera.lookAt(targetPos);
  //seedScene.update && seedScene.update(timeStamp);
  window.requestAnimationFrame(render);
};
render();

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
document.body.appendChild(renderer.domElement);
