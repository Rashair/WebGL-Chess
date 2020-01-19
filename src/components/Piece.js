import { Group, Mesh, Box3, Material, MeshBasicMaterial, Math as ThreeMath } from "three";
import { Ticker } from "three.interaction";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
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
    this.pieceColour = "";
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

    this.rotateTimerId = setInterval(() => {
      this.rotation.y += ThreeMath.degToRad(1);
    }, 15);
  }

  move(distance, endCallback) {
    const sign = Math.sign(distance);
    let increment = sign * 0.05;
    let distanceLeft = distance;
    const moveTimerId = setInterval(() => {
      distanceLeft -= increment;
      this.position.x += increment;
      if (distanceLeft * sign <= 0) {
        clearInterval(moveTimerId);
        endCallback();
      }
    }, 30);
  }
}
