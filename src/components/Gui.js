import { GUI } from "dat.gui";
import { Vector3, PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Gouraud, Phong, defines, white } from "./helpers/constants";
import SeedScene from "./SeedScene";

/**
 * @param {PerspectiveCamera} camera
 * @param {OrbitControls} controls
 * @param {SeedScene} scene
 */
const renderGui = (camera, controls, scene) => {
  const gui = new GUI();
  const initialPosition = { ...camera.position };
  const initialTarget = { ...controls.target };
  const initialLenght = camera.getFocalLength();
  const options = {
    reset: () => {
      camera.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
      camera.setFocalLength(initialLenght);
      camera.lookAt(initialTarget.x, initialTarget.y, initialTarget.z);
      controls.enabled = false;
      camera.update = () => {};
    },
  };

  const cam = gui.addFolder("Camera");
  const focalLength = { len: initialLenght };
  const onLenChange = val => camera.setFocalLength(val);
  cam
    .add(focalLength, "len", 5, 300)
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
  const camOptions = {
    movingCamera: () => {
      options.reset();
      controls.enabled = true;
    },
    staticCamera: () => {
      options.reset();
    },
    followCamera: () => {
      options.reset();
      camera.update = updateFollow;
      camera.position.set(-0.5, 4, -6);
      camera.lookAt(-0.5, 0, 2.5);
    },
    fpCamera: () => {
      options.reset();
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
      defines.TYPE = Phong;
      scene.whiteMat.needsUpdate = true;
      scene.blackMat.needsUpdate = true;
      window.infoElement.textContent = "Phong!";
    },
    gouraud: () => {
      defines.TYPE = Gouraud;
      scene.whiteMat.needsUpdate = true;
      scene.blackMat.needsUpdate = true;
      window.infoElement.textContent = "Gouraud!";
    },
  };
  sh.add(shOptions, "phong");
  sh.add(shOptions, "gouraud");
  sh.open();

  gui.add(options, "reset");
  camOptions.staticCamera();
};

export default renderGui;
