import {
  Object3D,
  ShaderMaterial,
  Vector3,
  MeshPhongMaterial,
  Vector4,
  Color,
  UniformsLib,
  UniformsUtils,
  FileLoader,
} from "three";

/**
 *
 * @param {Object3D} obj1
 * @param {Object3D} obj2
 */
export const setPosition = (obj1, obj2) => {
  const pos = obj2.position;
  obj1.position.set(pos.x, pos.y, pos.z);
};

export const getMaterial = ({ type, color }) => {
  let kAmbient;
  let kDiffuse;
  let kSpecular;
  switch (color) {
    case "white": {
      kAmbient = "rgb(5%, 5%, 5%)";
      kDiffuse = "rgb(50%, 50%, 50%)";
      kSpecular = "rgb(70%, 70%, 70%)";
      break;
    }

    case "black": {
      kAmbient = "rgb(2%, 2%, 2%)";
      kDiffuse = "rgb(1%, 1%, 1%)";
      kSpecular = "rgb(40%, 40%, 40%)";
      break;
    }
  }

  if (type === "default") {
    console.log("def");
    return new MeshPhongMaterial({
      color: kAmbient,
      specular: kSpecular,
      shininess: 100,
    });
  }

  // phong
  const vertex = document.getElementById("vertex").innerHTML;
  const fragment = document.getElementById("fragment").innerHTML;

  const material = new ShaderMaterial({
    lights: true,
    fog: true,
    uniforms: UniformsUtils.merge([
      {
        Ka: { value: new Color(kAmbient) },
        Kd: { value: new Color(kDiffuse) },
        Ks: { value: new Color(kSpecular) },
        Shininess: { value: 100.0 },
      },
      UniformsLib["lights"],
    ]),
    defines: {
      PHONG: 1,
    },
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  return material;
};
