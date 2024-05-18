export default `
precision highp float;
uniform vec3 u_lightPos; 
uniform vec3 u_viewPos; 
uniform vec3 u_specularColor;
uniform vec3 u_diffuseColor;
uniform float u_brightness;
uniform sampler2D u_diffuseTexture;
uniform sampler2D u_specularTexture;
uniform float u_useSpecularTexture;
uniform float u_useDiffuseTexture;

varying lowp vec3 v_fragPos;
varying lowp vec3 v_normal;
varying vec2 v_texcoord;

void main() {
    vec3 N = normalize(v_normal);
    // if(u_useDiffuseTexture > 0.0) {
    //     vec3 texNormal = 2.0 * texture2D(u_diffuseTexture, v_texcoord).rgb - 1.0;
    //     N = normalize(N + normalize(texNormal));
    // }
    vec3 L = normalize(u_lightPos - v_fragPos);
    // Lambert's cosine law
    float lambertian = max(dot(N, L), 0.0);
    float specular = 0.0;
    if(lambertian > 0.0) {
        vec3 R = reflect(-L, N);      // Reflected light vector
        vec3 V = normalize(u_viewPos - v_fragPos); // Vector to viewer
        // Compute the specular term
        float specAngle = max(dot(R, V), 0.0);
        specular = pow(specAngle, u_brightness);
    }

    vec3 texDiffColor = vec3(0.0,0.0,0.0);
    vec3 diffuse = lambertian * u_diffuseColor;
    if(u_useDiffuseTexture > 0.0) {
        texDiffColor = texture2D(u_diffuseTexture, v_texcoord).rgb;
        diffuse = lambertian * mix(u_diffuseColor, texDiffColor, u_useDiffuseTexture);
    }

    vec3 spec = specular * u_specularColor;
    if(u_useSpecularTexture > 0.0) {
        vec3 specTexture = texture2D(u_specularTexture, v_texcoord).rgb;
        float threshold = 0.1;
        spec = specular * mix(u_specularColor, specTexture, step(length(specTexture), threshold));
    }
        
    vec3 result = (0.5 * texDiffColor + diffuse + spec);
    gl_FragColor = vec4(result, 1.0);
}
`;
