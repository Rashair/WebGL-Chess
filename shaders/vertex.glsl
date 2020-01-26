varying vec3 fNormal;
varying vec3 fPosition;

void main() {
    vec4 vertex = vec4(position, 1.0);
    fNormal = normalize(normalMatrix * normal);
    fPosition = vec3(modelViewMatrix * vertex);
    gl_Position = projectionMatrix * modelViewMatrix * vertex;
}