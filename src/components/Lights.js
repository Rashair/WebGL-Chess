import {
  Group,
  SpotLight,
  PointLight,
  AmbientLight,
  HemisphereLight,
  Vector3,
  DirectionalLight,
  SphereBufferGeometry,
  DirectionalLightHelper,
} from "three";

export default class BasicLights extends Group {
  /**
   *
   * @param {Group} lightTarget
   */
  constructor(lightTarget) {
    super();

    const light1 = new PointLight(0xccffff, 1.5, 0, 2);
    light1.position.set(9, 3, 9);
    this.add(light1);

    const light2 = new PointLight(0xfff0cf, 2, 32, 2);
    light2.position.set(-9, 3, 9);
    this.add(light2);

    const light3 = new SpotLight(0x0ff0ff, 0.7, 4);
    light3.position.set(-0.5, 10, 2.5);
    this.add(light3);
    this.directLight = light3;
  }
}
