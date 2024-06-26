export default `
precision highp float;

uniform vec3 u_diffuseColor;
uniform sampler2D u_diffuseTexture;
uniform float u_useDiffuseTexture;

varying vec2 v_texcoord;

void main() {
    vec4 color = vec4(u_diffuseColor, 1.0);
    if (u_useDiffuseTexture > 0.0) {
        vec4 texColor = texture2D(u_diffuseTexture, v_texcoord);
        color = mix(color, texColor, u_useDiffuseTexture);
    }
    gl_FragColor = color;
}
`;
