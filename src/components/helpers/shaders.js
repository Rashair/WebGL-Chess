import { Gouraud, Phong, Blinn } from "./constants";

const glsl = x => x.raw[0];

export const getVertShader = () => {
  return `#version 300 es
          ${defines}
          ${posVariables}
          out float fogDepth;
          uniform float time;

          #if SHADING_TYPE == ${Phong}
              void main() {
                  ${calculatePosition}
                  ${calcFogDepth}
              }
          #elif SHADING_TYPE == ${Gouraud}
              out vec4 computedColor;
              ${lightVariables}
              ${punctualLightIntensityToIrradianceFactor}
              ${spotLightIntensityToIrradianceFactor}
              ${calculatePointLight}
              ${calculateSpotLight}
              
              void main() {
                  ${calculatePosition}
                  ${calcFogDepth}
                  
                  ${calculateColor}
                  computedColor = saturate(vec4(finalColor, 1.0));
              }
          #endif
      `;
};

export const getFragShader = () => {
  return `#version 300 es
        ${defines}
        out vec4 outputColor;

        in float fogDepth;
        uniform float fogNear;
        uniform float fogFar;
        uniform vec3 fogColor;

        uniform float time;

        #if SHADING_TYPE == ${Phong}
            in vec3 fNormal;
            in vec3 fPosition;
            ${lightVariables}
            
            ${punctualLightIntensityToIrradianceFactor}
            ${spotLightIntensityToIrradianceFactor}
            ${calculatePointLight}
            ${calculateSpotLight}

            void main() {
                ${calculateColor}

                ${mixFog}

                outputColor = vec4(finalColor, 1.0);
            }

        #elif SHADING_TYPE == ${Gouraud}
            in vec4 computedColor;
            void main() {
                vec3 finalColor = vec3(computedColor);

                ${mixFog}

                outputColor = vec4(finalColor, 1.0);
            }
        #endif
    `;
};

const defines = `
    #define saturate(a) clamp( a, 0.0, 1.0 )
    #define eps 0.000001
    #define whiteCompliment(a) ( 1.0 - saturate( a ) )
    #define LOG2 1.442695
    `;

const posVariables = `
    out vec3 fNormal;
    out vec3 fPosition;
`;

const lightVariables = `
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

    struct SpotLight {
        vec3 position;
        vec3 direction;
        vec3 color;
        float distance;
        float decay;
        float coneCos;
        float penumbraCos;
    };
    uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
    `;
const punctualLightIntensityToIrradianceFactor = `
    float punctualLightIntensityToIrradianceFactor( const float lightDistance, const float cutoffDistance, const float decayExponent ) {
        if( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
            float distMult = saturate( -lightDistance / cutoffDistance + 1.0 );
            return pow(distMult, decayExponent);
        }
        return 1.0;
    }
    `;

const spotLightIntensityToIrradianceFactor = `
    float spotLightIntensityToIrradianceFactor( SpotLight spotLight, vec3 direction, float distanceToLight ) {
        float angleCos = dot( direction, spotLight.direction );
        if ( angleCos > spotLight.coneCos ) {
            float spotEffect = smoothstep( spotLight.coneCos, spotLight.penumbraCos, angleCos );
            return spotEffect * punctualLightIntensityToIrradianceFactor(distanceToLight, spotLight.distance, spotLight.decay);
        }

        return 0.0;
    }
`;

const computeCoeff = `
    vec3 lVector = light.position - fPosition;
    float distanceToLight = length( lVector );
    vec3 s = normalize(lVector);
`;

const computeLightColor = `
    if(distanceMult < eps){
        return vec3(0.0);
    }

    vec3 v = normalize(-fPosition);
    vec3 r = normalize(reflect(-s, n));

    vec3 diffuse = saturate(Kd * max(dot(s, n), 0.0));
    float lambertian = max(dot(v, r), 0.0);
    vec3 specular = vec3(0.0);
    if (lambertian > 0.0) {
        #if LIGHT_MODEL == ${Phong}
            specular = saturate(Ks * pow(lambertian, Shininess));
        #elif LIGHT_MODEL == ${Blinn}
            vec3 h = normalize(v + s);
            float specAngle = max(dot(h, n), 0.0);
            specular = saturate(Ks * pow(specAngle, Shininess * 4.0));
        #endif
    }
`;

const calculatePointLight = `
    vec3 calculatePointLight(vec3 n, PointLight light) {
        ${computeCoeff}
        float distanceMult = punctualLightIntensityToIrradianceFactor(distanceToLight, light.distance, light.decay);
        ${computeLightColor}
        vec3 lightCol = light.color; 
        #ifdef DAY_NIGHT
            lightCol = lightCol * abs(sin(time/10.0));
        #endif
        return distanceMult * lightCol * (diffuse + specular);
    }
    `;
const calculateSpotLight = `
    vec3 calculateSpotLight(vec3 n, SpotLight light) {
        ${computeCoeff}
        float distanceMult = spotLightIntensityToIrradianceFactor(light, s, distanceToLight);
        ${computeLightColor}
        return distanceMult * light.color * (diffuse + specular);
    }
    `;

const calculatePosition = glsl`
    vec4 vert = vec4(position, 1.0);
    fNormal = normalize(normalMatrix * normal);
    fPosition = vec3(modelViewMatrix * vert);
    gl_Position = projectionMatrix * modelViewMatrix * vert;
`;

const calculateColor = glsl`
    vec3 finalColor = vec3(Ka);
    for(int i = 0; i < NUM_POINT_LIGHTS; ++i) {
        finalColor += calculatePointLight(fNormal, pointLights[i]); 
    }
    finalColor += calculateSpotLight(fNormal, spotLights[0]);
`;

const mixFog = glsl`
    #ifdef USE_FOG
        float fogFactor = smoothstep( fogNear, fogFar, fogDepth );
        finalColor = saturate(mix(finalColor, fogColor, fogFactor));
    #endif
    `;

const calcFogDepth = glsl`
    #ifdef USE_FOG
        fogDepth = -fPosition.z;
    #endif
    `;
