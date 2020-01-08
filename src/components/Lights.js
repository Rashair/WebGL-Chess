import { Group, SpotLight, PointLight, AmbientLight, HemisphereLight, Vector3 } from "three";

export default class BasicLights extends Group {
  /**
   *
   * @param {Group} lightTarget
   */
  constructor(lightTarget) {
    super();

    const light1 = new PointLight(0xccffff, 1, 22);
    light1.position.set(9, 3, 9);

    const light2 = new PointLight(0xfff0cf, 2, 22);
    light2.position.set(-9, 3, 9);

    this.add(light1, light2);
  }
}
