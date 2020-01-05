import { Group, Colors } from "three";
import BasicLights from "./Lights.js";
import Bishop from "./Chess-pieces/Bishop";

export default class SeedScene extends Group {
  constructor() {
    super();

    const colorWhite = 0xffffff;
    const colorBlack = 0x101010;

    const whiteBishop1 = new Bishop(colorWhite);
    const blackBishop1 = new Bishop(colorBlack);

    const lights = new BasicLights(blackBishop1);

    blackBishop1.position.set(0, 0, 0);
    whiteBishop1.position.set(4, 0, 0);

    this.add(whiteBishop1, blackBishop1, lights);
  }

  update(timeStamp) {
    //this.rotation.y = timeStamp / 10000;
  }
}
