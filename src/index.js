import { WebGLRenderer, PerspectiveCamera, Scene, Vector3, Fog, Cache, FileLoader } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Interaction } from "three.interaction";
import renderGui from "./components/Gui.js";
import SeedScene from "./components/SeedScene.js";

// Cache.enabled = true;

async function appendShaders() {
  return Promise.all([loadShader("vertex"), loadShader("fragment")]);
}

async function loadShader(name) {
  const loader = new FileLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      `shaders/${name}.glsl`,
      shader => {
        document.getElementById(name).innerHTML = shader;
        resolve();
      },
      null,
      error => reject(error)
    );
  });
}

window.infoElement = document.getElementById("info");
function init() {
  const width = 1280;
  const height = 720;

  const dom = document.createElement("canvas");
  const context = dom.getContext("webgl2");
  console.log(context);
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
  gl.setClearColor(0x313131, 1);

  // render loop
  const render = timeStamp => {
    camera.update(scene);
    scene.update(timeStamp);

    gl.render(scene, camera);
    window.requestAnimationFrame(render);
  };
  window.requestAnimationFrame(render);

  // dom
  dom.oncontextmenu = () => false;
  document.body.appendChild(dom);
}

init();
