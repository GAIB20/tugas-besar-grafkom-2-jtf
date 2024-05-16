export default `
precision highp float;

uniform vec3 u_diffuseColor;
uniform sampler2D u_diffuseTexture;
uniform bool u_useTexture;

varying vec2 v_texcoord;

void main() {
    vec4 color = vec4(u_diffuseColor, 1.0);
    if (u_useTexture) {
        vec4 texColor = texture2D(u_diffuseTexture, v_texcoord);
        color = mix(color, texColor, float(u_useTexture));
    }
    gl_FragColor = color;
}
`;
