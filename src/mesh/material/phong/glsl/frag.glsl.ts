export default `
precision highp float;
uniform vec3 u_lightPos; 
uniform vec3 u_viewPos; 
uniform vec3 u_specularColor;
uniform vec3 u_diffuseColor;
uniform float u_brightness;
uniform sampler2D u_diffuseTexture;
uniform sampler2D u_specularTexture;
uniform sampler2D u_normalTexture;
uniform float u_useSpecularTexture;
uniform float u_useDiffuseTexture;
uniform float u_useNormalTexture;

varying lowp vec3 v_fragPos;
varying lowp vec3 v_normal;
varying lowp mat3 TBN;
varying vec2 v_texcoord;

void main() {
    vec3 N = normalize(v_normal);
    vec3 L = normalize(u_lightPos - v_fragPos);
    vec3 V = normalize(u_viewPos - v_fragPos);
    // if(u_useDiffuseTexture > 0.0) {
    //     vec3 texNormal = 2.0 * texture2D(u_diffuseTexture, v_texcoord).rgb - 1.0;
    //     N = normalize(N + normalize(texNormal));
    // }
    if(u_useNormalTexture > 0.0) {
        vec3 tangentLightPos = TBN * u_lightPos;
        vec3 tangentViewPos = TBN * u_viewPos;
        vec3 tangentFragPos = TBN * v_fragPos;
        N = texture2D(u_normalTexture, v_texcoord).rgb;
        N = normalize(N * 2.0 - 1.0);
        L = normalize(tangentLightPos - tangentFragPos);
        V = normalize(tangentViewPos - tangentFragPos);
        V = normalize(L + V);
    }
    // Lambert's cosine law
    float lambertian = max(dot(N, L), 0.0);
    float specular = 0.0;
    if(lambertian > 0.0) {
        vec3 R = reflect(-L, N);      // Reflected light vector
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
