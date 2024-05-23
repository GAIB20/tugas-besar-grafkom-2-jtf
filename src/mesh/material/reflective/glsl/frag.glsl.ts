export default `
precision highp float;

uniform samplerCube u_reflectiveTexture;
uniform vec3 u_viewPos; 

varying vec3 v_worldPosition;
varying vec3 v_worldNormal;

void main() {
    vec3 worldNormal = normalize(v_worldNormal);
    vec3 eyeToSurfaceDir = normalize(v_worldPosition - u_viewPos);
    vec3 direction = reflect(eyeToSurfaceDir,worldNormal);

    gl_FragColor = textureCube(u_reflectiveTexture, direction);
}
`;
