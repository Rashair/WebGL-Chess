import { GUI } from "dat.gui";
import { Vector3, PerspectiveCamera } from "three";

/**
 * @param {PerspectiveCamera} camera - camera
 * @param {Vector3} initialPosition - camera position
 * @param {Vector3} initialTarget - camera target
 */
const renderGui = (camera, controls) => {
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
      // seedScene.updateMatrixWorld();
      seedScene.selectedPiece.getWorldPosition(target);
      camera.lookAt(target);
    }
  };
  const updateFP = seedScene => {
    const selected = seedScene.selectedPiece;
    if (selected) {
      // seedScene.updateMatrixWorld();
      selected.getWorldPosition(target);
      const maxY = selected.getMaxY();
      camera.position.set(target.x, maxY + 0.1, target.z);
      const dir = selected.pieceColour == "White" ? 1 : -1;
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

  gui.add(options, "reset");
  camOptions.staticCamera();
};

export default renderGui;
