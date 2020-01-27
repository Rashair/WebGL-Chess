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

  const renderer = new WebGLRenderer({ antialias: true });
  const dom = renderer.domElement;
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
}

appendShaders().then(
  () => init(),
  error => console.log(error)
);
