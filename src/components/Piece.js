import { Group, Mesh, Box3, Material, MeshBasicMaterial, Math as ThreeMath } from "three";
import { Ticker } from "three.interaction";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { white } from "./helpers/constants";
const path = require("path");

export default class Piece extends Group {
  /**
   *
   * @param {String} type - type of piece (ex. king)
   * @param {Material} [material=null] - material (ex. meshPhongMaterial)
   * @param {boolean} [shouldLoad=true] - should be mesh loaded from file
   */
  constructor(type, shouldLoad = true, material = null) {
    super();
    this.pieceType = type;
    this.loadPromise = shouldLoad === true ? this.load(material) : null;
    this.boundingBox = null;
    this.pieceSquare = null;
    this.pieceColour = white;
    this.on("rightdown", this.onMouseRightDown);
  }

  async load(material) {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(
        path.join("models", this.pieceType + ".gltf"),
        gltf => {
          const mesh = gltf.scene.children[0];
          mesh.position.set(0, 0, 0);
          mesh.scale.multiplyScalar(0.3);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          this.addPieceMesh(mesh, material);
          console.log(this.pieceType + " loaded");
          resolve(this);
        },
        null,
        reject
      );
    });
  }

  /**
   *
   * @param {Mesh} mesh
   * @param {Material} material
   */
  addPieceMesh(mesh, material) {
    mesh.material = material !== null ? material : new MeshBasicMaterial();
    this.add(mesh);
    this.pieceMesh = mesh;
  }

  getScale() {
    return this.children[0].scale;
  }

  getBoundingBox() {
    if (this.boundingBox == null) {
      this.boundingBox = new Box3().setFromObject(this);
    }

    return this.boundingBox;
  }

  getMinY() {
    return this.getBoundingBox().min.y;
  }

  getMaxY() {
    return this.getBoundingBox().max.y;
  }

  onMouseRightDown(ev) {
    ev.stopPropagation();
    if (this.rotateTimerId) {
      clearInterval(this.rotateTimerId);
      this.rotateTimerId = null;
      return;
    }

    let rotateFunc;
    if (!this.light) {
      rotateFunc = () => {
        this.rotation.y += ThreeMath.degToRad(1);
      };
    } else {
      const a = this.position.x;
      const b = this.position.z;
      let shift = 0;
      if (this.pieceType === "Knight") {
        shift = this.pieceColour === white ? this.rotation.y : -this.rotation.y;
      } else {
        shift = this.pieceColour === white ? 0 : ThreeMath.degToRad(180);
      }
      console.log(shift);
      rotateFunc = () => {
        this.rotation.y += ThreeMath.degToRad(1);
        if (this.light) {
          this.light.rotateOnMove(-this.rotation.y + shift, a, b);
        }
      };
    }

    this.rotateTimerId = setInterval(rotateFunc, 20);
  }

  move(distance, onMoving, endCallback) {
    const sign = Math.sign(distance);
    let increment = sign * 0.035;
    let distanceLeft = distance;
    const moveTimerId = setInterval(() => {
      distanceLeft -= increment;
      this.position.x += increment;
      onMoving();
      if (distanceLeft * sign <= 0) {
        clearInterval(moveTimerId);
        endCallback();
      }
    }, 20);
  }
}
