import { GUI } from "dat.gui";
import { Vector3, PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Gouraud, Phong, defines, white, Blinn } from "./helpers/constants";
import SeedScene from "./SeedScene";

/**
 * @param {PerspectiveCamera} camera
 * @param {OrbitControls} controls
 * @param {SeedScene} scene
 */
const renderGui = (camera, controls, scene) => {
  const gui = new GUI();
  gui.domElement.id = "gui";
  const initialPosition = { ...camera.position };
  const initialTarget = { ...controls.target };
  const initialLenght = camera.getFocalLength();

  const cam = gui.addFolder("Camera");
  const focalLength = { len: initialLenght };
  const onLenChange = val => camera.setFocalLength(val);
  cam
    .add(focalLength, "len", 5, 300)
    .name("focal length")
    .onChange(onLenChange)
    .listen();

  const target = new Vector3();
  const updateFollow = seedScene => {
    if (seedScene.selectedPiece) {
      seedScene.selectedPiece.getWorldPosition(target);
      camera.lookAt(target);
    }
  };
  const updateFP = seedScene => {
    const selected = seedScene.selectedPiece;
    if (selected) {
      selected.getWorldPosition(target);
      const maxY = selected.getMaxY();
      camera.position.set(target.x, maxY + 0.1, target.z);
      const dir = selected.pieceColour == white ? 1 : -1;
      camera.lookAt(target.x + dir, maxY, target.z);
    }
  };

  const reset = () => {
    camera.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
    camera.setFocalLength(initialLenght);
    camera.lookAt(initialTarget.x, initialTarget.y, initialTarget.z);
    controls.enabled = false;
    camera.update = () => {};
  };
  const camOptions = {
    movingCamera: () => {
      reset();
      controls.enabled = true;
    },
    staticCamera: () => {
      reset();
    },
    followCamera: () => {
      reset();
      camera.update = updateFollow;
      camera.position.set(-0.5, 4, -6);
      camera.lookAt(-0.5, 0, 2.5);
    },
    fpCamera: () => {
      reset();
      camera.update = updateFP;
    },
  };
  cam.add(camOptions, "movingCamera");
  cam.add(camOptions, "staticCamera");
  cam.add(camOptions, "followCamera");
  cam.add(camOptions, "fpCamera");
  cam.open();

  const spot = gui.addFolder("Spotlight");
  const lightTargetPos = window.directLightTarget.position;
  spot.add(lightTargetPos, "x", -20, 20, 0.1).listen();
  spot.add(lightTargetPos, "y", -15, 15, 0.1).listen();
  spot.add(lightTargetPos, "z", -15, 15, 0.1).listen();

  const sh = gui.addFolder("Shading");
  const shOptions = {
    phong: () => {
      defines.SHADING_TYPE = Phong;
      scene.whiteMat.needsUpdate = true;
      scene.blackMat.needsUpdate = true;
      scene.setInfo("Phong shading!");
    },
    gouraud: () => {
      defines.SHADING_TYPE = Gouraud;
      scene.whiteMat.needsUpdate = true;
      scene.blackMat.needsUpdate = true;
      scene.setInfo("Gouraud shading!");
    },
  };
  sh.add(shOptions, "phong");
  sh.add(shOptions, "gouraud");
  sh.open();

  const mod = gui.addFolder("Light model");
  const modOptions = {
    phong: () => {
      defines.LIGHT_MODEL = Phong;
      scene.whiteMat.needsUpdate = true;
      scene.blackMat.needsUpdate = true;
      scene.setInfo("Phong light model!");
    },
    blinn: () => {
      defines.LIGHT_MODEL = Blinn;
      scene.whiteMat.needsUpdate = true;
      scene.blackMat.needsUpdate = true;
      scene.setInfo("Blinn light model!");
    },
  };
  mod.add(modOptions, "phong");
  mod.add(modOptions, "blinn");
  mod.open();

  const options = {
    fog: () => {
      scene.whiteMat.fog = !scene.whiteMat.fog;
      scene.blackMat.fog = !scene.blackMat.fog;
      scene.whiteMat.needsUpdate = true;
      scene.blackMat.needsUpdate = true;
      scene.setInfo("Fog " + (scene.whiteMat.fog === true ? "on" : "off"));
    },
    dayNight: () => {
      defines.DAY_NIGHT = !defines.DAY_NIGHT;
      scene.whiteMat.needsUpdate = true;
      scene.blackMat.needsUpdate = true;
      scene.setInfo("Day-night " + (defines.DAY_NIGHT === true ? "on" : "off"));
    },
  };
  gui.add(options, "fog").name("Toggle fog");
  gui.add(options, "dayNight").name("Toggle day-night");
  camOptions.staticCamera();
};

export default renderGui;
