import { GUI } from "dat.gui";
import { Vector3, PerspectiveCamera } from "three";

/**
 * @param {PerspectiveCamera} camera - camera
 * @param {Vector3} initialPosition - camera position
 * @param {Vector3} initialTarget - camera target
 */
const renderGui = (camera, initialPosition) => {
  const gui = new GUI();

  const cam = gui.addFolder("Camera");

  const pos = cam.addFolder("position");
  const step = 0.1;
  pos.add(camera.position, "x", -20, 20, step).listen();
  pos.add(camera.position, "y", -20, 20, step).listen();
  pos.add(camera.position, "z", -20, 20, step).listen();

  const initialLenght = camera.getFocalLength();
  const focalLength = { len: initialLenght };
  const onLenChange = val => camera.setFocalLength(val);
  cam
    .add(focalLength, "len", 1, 200)
    .onChange(onLenChange)
    .listen();

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
