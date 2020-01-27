import {
  Object3D,
  ShaderMaterial,
  MeshPhongMaterial,
  MeshLambertMaterial,
  Color,
  UniformsLib,
  UniformsUtils,
} from "three";
import { defaultGouraud, defaultPhong, Phong, Gouraud, black, white, defines } from "./constants";
import { getVertShader, getFragShader } from "./shaders";

export const getMaterial = ({ color }) => {
  if (defines.TYPE === defaultPhong) {
    return new MeshPhongMaterial({
      color: new Color(color, color, color),
      shininess: 100,
    });
  } else if (defines.TYPE === defaultGouraud) {
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
      UniformsLib["fog"],
    ]),
    defines,
    vertexShader: getVertShader(),
    fragmentShader: getFragShader(),
  });

  return material;
};
