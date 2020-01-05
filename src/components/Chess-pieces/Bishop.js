import { Group, MeshBasicMaterial, MeshPhongMaterial } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
const path = require("path");

export default class Bishop extends Group {
  constructor(col) {
    super();

    const loader = new GLTFLoader();
    this.name = "Bishop";

    const This = this;
    loader.load(
      path.join("models", "Bishop.gltf"),
      // called when the resource is loaded
      function(gltf) {
        const mesh = gltf.scene.children[0];
        mesh.material = new MeshPhongMaterial({ color: col });

        This.add(mesh);
        console.log(This.name + " loaded");
        console.log(mesh);
      }
    );
  }
}
