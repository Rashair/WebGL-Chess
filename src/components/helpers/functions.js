import {
  Object3D,
  ShaderMaterial,
  Vector3,
  MeshPhongMaterial,
  MeshLambertMaterial,
  Vector4,
  Color,
  UniformsLib,
  UniformsUtils,
  FileLoader,
} from "three";
import { defaultGouraud, defaultPhong, Phong, Gouraud, black, white } from "./constants";

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
  if (type === defaultPhong) {
    return new MeshPhongMaterial({
      color: new Color(color, color, color),
      shininess: 100,
    });
  } else if (type === defaultGouraud) {
    return new MeshLambertMaterial({
      color: new Color(color, color, color),
    });
  }

  let kAmbient;
  let kDiffuse;
  let kSpecular;
  switch (color) {
    case white: {
      kAmbient = new Color("rgb(5%, 5%, 5%)");
      kDiffuse = new Color("rgb(50%, 50%, 50%)");
      kSpecular = new Color("rgb(70%, 70%, 70%)");
      break;
    }

    case black: {
      kAmbient = new Color("rgb(2%, 2%, 2%)");
      kDiffuse = new Color("rgb(5%, 5%, 5%)");
      kSpecular = new Color("rgb(40%, 40%, 40%)");
      break;
    }
  }
  const shininess = 100;

  const defines = {};
  if (type === Phong) {
    defines.PHONG = 1;
  } else if (type === Gouraud) {
    defines.GOURAUD = 1;
  }

  const vertex = document.getElementById("vertex").innerHTML;
  const fragment = document.getElementById("fragment").innerHTML;

  const material = new ShaderMaterial({
    lights: true,
    fog: true,
    uniforms: UniformsUtils.merge([
      {
        Ka: { value: kAmbient },
        Kd: { value: kDiffuse },
        Ks: { value: kSpecular },
        Shininess: { value: shininess },
      },
      UniformsLib["lights"],
    ]),
    defines,
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  return material;
};
