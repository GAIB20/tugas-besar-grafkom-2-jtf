export default `precision highp float;

uniform vec4 u_diffuseColor;
uniform sampler2D u_diffuseTexture;
uniform bool u_useTexture;

varying vec2 v_texcoord;

void main() {
    vec4 texColor = texture2D(u_diffuseTexture, v_texcoord);
    vec4 color = mix(u_diffuseColor, texColor, float(u_useTexture));
    gl_FragColor = color;
}`;
