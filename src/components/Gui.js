import { GUI } from "dat.gui";
import { Vector3, PerspectiveCamera } from "three";

/**
 * @param {PerspectiveCamera} camera - camera
 * @param {Vector3} initialPosition - camera position
 * @param {Vector3} initialTarget - camera target
 */
const renderGui = (camera, initialPosition, scene) => {
  const gui = new GUI();

  // TODO: add cameras array and switch;

  const cam = gui.addFolder("Camera");
  const initialLenght = camera.getFocalLength();
  const focalLength = { len: initialLenght };
  const onLenChange = val => camera.setFocalLength(val);
  cam
    .add(focalLength, "len", 5, 300)
    .onChange(onLenChange)
    .listen();
  const camOptions = {
    staticCamera: () => {},
    followCamera: () => {},
    fpCamera: () => {},
  };
  cam.add(camOptions, "staticCamera");
  cam.add(camOptions, "followCamera");
  cam.add(camOptions, "fpCamera");
  cam.open();

  const options = {
    reset: () => {
      camera.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
      camera.setFocalLength(initialLenght);
    },
  };

  gui.add(options, "reset");
  options.reset();
};

export default renderGui;
