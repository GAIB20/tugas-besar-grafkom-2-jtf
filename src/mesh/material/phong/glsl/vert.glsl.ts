export default `
attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

uniform mat4 u_worldMatrix;
uniform mat4 u_viewProjectionMatrix;

varying lowp vec3 v_fragPos;
varying lowp vec3 v_normal;
varying vec2 v_texcoord;

void main() {
    gl_Position = u_viewProjectionMatrix * u_worldMatrix * a_position;
    v_normal = mat3(u_worldMatrix) * a_normal;
    v_fragPos = gl_Position.xyz / gl_Position.w;
    v_texcoord = a_texcoord;
}
`;
