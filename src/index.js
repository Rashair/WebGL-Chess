import { WebGLRenderer, PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Interaction } from "three.interaction";
import renderGui from "./components/Gui.js";
import SeedScene from "./components/SeedScene.js";

window.infoElement = document.getElementById("info");
function init() {
  const width = 1422;
  const height = 800;

  const dom = document.createElement("canvas");
  const context = dom.getContext("webgl2");
  const gl = new WebGLRenderer({ canvas: dom, context: context, antialias: true });
  const scene = new SeedScene(window.infoElement);
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
  // eslint-disable-next-line no-unused-vars
  const interaction = new Interaction(gl, scene, camera);
  scene.press = () => {};
  const keyDownHandler = ev => {
    if (ev.key === "w" || ev.key == "s") {
      scene.press(ev.key);
    }
  };
  window.addEventListener("keydown", keyDownHandler);

  // renderer
  gl.setSize(width, height, false);
  gl.setPixelRatio(window.devicePixelRatio);

  // render loop
  const whiteTime = scene.whiteMat.uniforms.time;
  const blackTime = scene.blackMat.uniforms.time;
  const render = timeStamp => {
    camera.update(scene);

    const timeVal = timeStamp * 0.001;
    whiteTime.value = timeVal;
    blackTime.value = timeVal;

    gl.render(scene, camera);
    window.requestAnimationFrame(render);
  };
  window.requestAnimationFrame(render);

  // dom
  dom.oncontextmenu = () => false;
  document.body.appendChild(dom);
}

init();
