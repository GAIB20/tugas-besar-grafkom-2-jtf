export default `
attribute vec4 a_position;
attribute vec3 a_normal;

uniform mat4 u_worldMatrix;
uniform mat4 u_viewProjectionMatrix;

varying vec3 v_worldPosition;
varying vec3 v_worldNormal;

void main() {
    gl_Position = u_viewProjectionMatrix * u_worldMatrix * a_position;
    v_worldPosition = (u_worldMatrix * a_position).xyz;
    v_worldNormal = mat3(u_worldMatrix) * a_normal;
}
`;
