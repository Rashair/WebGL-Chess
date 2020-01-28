import { ShaderMaterial, MeshPhongMaterial, MeshLambertMaterial, Color, UniformsLib, UniformsUtils } from "three";
import { defaultGouraud, defaultPhong, black, white, defines } from "./constants";
import { getVertShader, getFragShader } from "./shaders";

export const getMaterial = ({ color }) => {
  if (defines.SHADING_TYPE === defaultPhong) {
    return new MeshPhongMaterial({
      color: new Color(color, color, color),
      fog: true,
      shininess: 100,
    });
  } else if (defines.SHADING_TYPE === defaultGouraud) {
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

  const sharedUniforms = {
    Shininess: { value: 128.0 },
    time: { value: 23.0 },
  };

  const material = new ShaderMaterial({
    lights: true,
    fog: true,
    uniforms: UniformsUtils.merge([
      {
        Ka: { value: kAmbient },
        Kd: { value: kDiffuse },
        Ks: { value: kSpecular },
      },
      sharedUniforms,
      UniformsLib["lights"],
      UniformsLib["fog"],
    ]),
    defines,
    vertexShader: getVertShader(),
    fragmentShader: getFragShader(),
  });

  return material;
};
