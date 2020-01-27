#define saturate(a) clamp( a, 0.0, 1.0 )
#if TYPE == 3

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

float punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
    if( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
        return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );
    }
    return 1.0;
}

vec3 calculatePointLight(vec3 n, PointLight light) {
    vec3 lVector = light.position - fPosition;
    float lightDistance = length( lVector );
    vec3 s = normalize(lVector);
    vec3 v = normalize(-fPosition);
    vec3 r = normalize(reflect(-s, n));

    vec3 ambient = Ka;
    vec3 diffuse = clamp(Kd * max(dot(s, n), 0.0), 0.0, 1.0);
    vec3 specular = clamp(Ks * pow(max(dot(r, v), 0.0), Shininess), 0.0, 1.0);

    float distanceMult = punctualLightIntensityToIrradianceFactor(lightDistance, light.distance, light.decay);
    return distanceMult * light.color * (ambient + diffuse + specular);
}

float spotLightIntensityToIrradianceFactor( SpotLight spotLight, vec3 direction, float distanceToLight ) {
    float angleCos = dot( direction, spotLight.direction );
    if ( angleCos > spotLight.coneCos ) {
        float spotEffect = smoothstep( spotLight.coneCos, spotLight.penumbraCos, angleCos );
        return spotEffect * punctualLightIntensityToIrradianceFactor(distanceToLight, spotLight.distance, spotLight.decay);
    }

    return 0.0;
}

vec3 calculateSpotLight(vec3 n, SpotLight light) {
    vec3 lVector = light.position - fPosition;
    float distanceToLight = length( lVector );
    vec3 s = normalize(lVector);
    float distanceMult = spotLightIntensityToIrradianceFactor(light, s, distanceToLight);
    if(distanceMult == 0.0){
        return vec3(0.0);
    }

    vec3 v = normalize(-fPosition);
    vec3 r = normalize(reflect(-s, n));

    vec3 ambient = Ka;
    vec3 diffuse = clamp(Kd * max(dot(s, n), 0.0), 0.0, 1.0);
    vec3 specular = clamp(Ks * pow(max(dot(r, v), 0.0), Shininess), 0.0, 1.0);
    
    return distanceMult * light.color * (ambient + diffuse + specular);
}

void main() {
    vec3 finalColor = vec3(0.0, 0.0, 0.0);

    for(int i = 0; i < NUM_POINT_LIGHTS; ++i) {
        finalColor += calculatePointLight(fNormal, pointLights[i]);
    }
    finalColor += calculateSpotLight(fNormal, spotLights[0]);

    gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
}

#elif TYPE == 4

varying vec4 computedColor;
void main() {
  gl_FragColor = computedColor;
}

#endif
