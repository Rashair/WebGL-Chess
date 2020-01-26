import {
  Object3D,
  ShaderMaterial,
  Vector3,
  MeshPhongMaterial,
  Vector4,
  Color,
  UniformsLib,
  UniformsUtils,
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
  switch(color){
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
  //UniformsUtils.merge([uniforms, THREE.UniformsLib["lights"]]);
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
    defines:{
      PHONG: 1
    },
    vertexShader: `
      varying vec3 fNormal;
      varying vec3 fPosition;

      void main() {
        vec4 vertex = vec4(position, 1.0);
        fNormal = normalize(normalMatrix * normal);
        fPosition = vec3(modelViewMatrix * vertex);
        gl_Position = projectionMatrix * modelViewMatrix * vertex;
      }
    `,
    fragmentShader: `
      varying vec3 fNormal;
      varying vec3 fPosition;

      uniform vec3 Ka;
      uniform vec3 Kd;
      uniform vec3 Ks;
      uniform float Shininess;

      struct PointLight {
        vec3 position;
        vec3 color;
        float distance;
        float decay;
      };
      uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

      vec3 phong(vec3 n, PointLight light) {
        vec3 s = normalize(light.position - fPosition);
        vec3 v = normalize(-fPosition);
        vec3 r = normalize(reflect(-s, n));

        vec3 ambient = clamp(light.color * Ka, 0.0, 1.0);
        vec3 diffuse = clamp(Kd * max(dot(s, n), 0.0) * light.color, 0.0, 1.0);
        vec3 specular = clamp(Ks * pow(max(dot(r, v), 0.0), Shininess) * light.color, 0.0, 1.0);

        return (ambient + diffuse + specular);
      }

      void main() {
        vec3 finalColor = vec3(0.0, 0.0, 0.0);
        for(int i = 0; i < NUM_POINT_LIGHTS; ++i) {
          finalColor += phong(fNormal, pointLights[i]); 
        }

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
  });
  const tmp = `
   
 

  

  `;

  return material;
};
