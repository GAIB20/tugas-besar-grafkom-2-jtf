export default `
precision highp float;
//uniform vec3 u_lightPos; 
uniform vec3 u_viewPos; 
//uniform vec3 u_lightColor;
uniform vec3 u_diffuseColor;

varying lowp vec3 v_fragPos;
varying lowp vec3 v_normal;

void main() {
    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * vec3(1.0, 1.0, 1.0);

    vec3 norm = normalize(v_normal);
    vec3 lightDir = normalize(vec3(1.2, 1.0, 2.0) - v_fragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * vec3(1.0, 1.0, 1.0);

    float specularStrength = 0.5;
    vec3 viewDir = normalize(u_viewPos - v_fragPos);
    vec3 reflectDir = reflect(-lightDir, norm);  
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = specularStrength * spec * vec3(1.0, 1.0, 1.0);  
        
    vec3 result = (ambient + diffuse + specular) * u_diffuseColor;
    gl_FragColor = vec4(result, 1.0);
}
`;
