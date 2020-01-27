#define saturate(a) clamp( a, 0.0, 1.0 )
#ifdef PHONG

varying vec3 fNormal;
varying vec3 fPosition;

void main() {
    vec4 vert = vec4(position, 1.0);
    fNormal = normalize(normalMatrix * normal);
    fPosition = vec3(modelViewMatrix * vert);
    gl_Position = projectionMatrix * modelViewMatrix * vert;
}

#elif defined(GOURAUD)

varying vec3 fNormal;
varying vec3 fPosition;
varying vec4 computedColor;

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

float punctualLightIntensityToIrradianceFactor( const float lightDistance, const float cutoffDistance, const float decayExponent ) {
    if( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
        float distMult = saturate( -lightDistance / cutoffDistance + 1.0 );
        return pow(distMult, decayExponent);
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
    vec3 diffuse = saturate(Kd * max(dot(s, n), 0.0));
    vec3 specular = saturate(Ks * pow(max(dot(r, v), 0.0), Shininess));

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
    vec4 vertex = vec4(position, 1.0);
    fNormal = normalize(normalMatrix * normal);
    fPosition = vec3(modelViewMatrix * vertex);
    gl_Position = projectionMatrix * modelViewMatrix * vertex;

    vec3 finalColor = vec3(0.0, 0.0, 0.0);
    for(int i = 0; i < NUM_POINT_LIGHTS; ++i) {
        finalColor += calculatePointLight(fNormal, pointLights[i]); 
    }
    finalColor += calculateSpotLight(fNormal, spotLights[0]);
    
    computedColor = saturate(vec4(finalColor, 1.0));
}

#endif
