import { Group, Mesh, Box3, Material, MeshBasicMaterial } from "three";
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
}
