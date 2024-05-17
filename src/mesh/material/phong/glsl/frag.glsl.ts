export default `
precision highp float;
uniform vec3 u_lightPos; 
uniform vec3 u_viewPos; 
uniform vec3 u_specularColor;
uniform vec3 u_diffuseColor;
uniform float u_brightness;

varying lowp vec3 v_fragPos;
varying lowp vec3 v_normal;

void main() {
    vec3 N = normalize(v_normal);
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
        
    vec3 result = (1.0 * vec3(0, 0, 0) + lambertian * u_diffuseColor + specular * u_specularColor);
    gl_FragColor = vec4(result, 1.0);
}
`;
