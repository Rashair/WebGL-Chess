import { Object3D } from "three";

/**
 *
 * @param {Object3D} obj1
 * @param {Object3D} obj2
 */
export const setPosition = (obj1, obj2) => {
  const pos = obj2.position;
  obj1.position.set(pos.x, pos.y, pos.z);
};
