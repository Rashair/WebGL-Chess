import { Group, SpotLight, PointLight, AmbientLight, HemisphereLight, Vector3 } from "three";

export default class BasicLights extends Group {
  /**
   *
   * @param {Group} lightTarget
   */
  constructor(lightTarget) {
    super();

    const point = new PointLight(0xffffff, 1, 100, 2);
    const dir = new SpotLight(0xffffff, 1.5, 200, 0.3, 0, 2);
    const ambi = new AmbientLight(0x404040, 0.66);
    const hemi = new HemisphereLight(0xffffbb, 0x080820, 1.15);

    dir.position.set(0, 0, 0);
    dir.target = lightTarget;

    point.position.set(0, 0, 0);

    this.add(dir, ambi, hemi);
  }
}
