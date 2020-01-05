import { GUI } from "dat.gui";
import { Vector3, PerspectiveCamera } from "three";

/**
 * @param {PerspectiveCamera} camera - camera
 * @param {Vector3} initialPosition - camera position
 * @param {Vector3} initialTarget - camera target
 */
const renderGui = (camera, initialPosition, initialTarget) => {
  const gui = new GUI();

  const cam = gui.addFolder("Camera");

  const pos = cam.addFolder("position");
  pos.add(camera.position, "x", -100, 100).listen();
  pos.add(camera.position, "y", -100, 100).listen();
  pos.add(camera.position, "z", -100, 100).listen();

  let target = new Vector3(initialTarget.x, initialTarget.y, initialTarget.z);
  const onTargetChange = () => camera.lookAt(target);
  const rot = cam.addFolder("rotation");
  rot
    .add(target, "x", -90, 90)
    .onChange(onTargetChange)
    .listen();
  rot
    .add(target, "y", -90, 90)
    .onChange(onTargetChange)
    .listen();
  rot
    .add(target, "z", -90, 90)
    .onChange(onTargetChange)
    .listen();

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
      camera.lookAt(initialTarget);
      camera.setFocalLength(initialLenght);
    },
  };

  gui.add(options, "reset");
  options.reset();
};

export default renderGui;
