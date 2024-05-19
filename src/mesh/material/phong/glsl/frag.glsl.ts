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
uniform sampler2D u_parallaxTexture;
uniform float u_useSpecularTexture;
uniform float u_useDiffuseTexture;
uniform float u_useNormalTexture;
uniform float u_useParallaxTexture;

varying lowp vec3 v_fragPos;
varying lowp vec3 v_normal;
varying lowp mat3 TBN;
varying lowp mat3 pTBN;
varying vec2 v_texcoord;

vec2 parallaxMapping(vec2 texCoords, vec3 viewDir)
{ 
    float height =  1.0 - texture2D(u_parallaxTexture, v_texcoord).r;     
    return v_texcoord - viewDir.xy * (height * u_useParallaxTexture);        
}

void main() {
    vec3 N = normalize(v_normal);
    vec3 L = normalize(u_lightPos - v_fragPos);
    vec3 V = normalize(u_viewPos - v_fragPos);
    vec2 TexCoord = v_texcoord;
    vec3 HV;
    // if(u_useDiffuseTexture > 0.0) {
    //     vec3 texNormal = 2.0 * texture2D(u_diffuseTexture, TexCoord).rgb - 1.0;
    //     N = normalize(N + normalize(texNormal));
    // }
    if(u_useNormalTexture > 0.0) {
        vec3 tangentLightPos = TBN * u_lightPos;
        vec3 tangentViewPos = TBN * u_viewPos;
        vec3 tangentFragPos = TBN * v_fragPos;
        N = texture2D(u_normalTexture, TexCoord).rgb;
        N = normalize(N * 2.0 - 1.0);
        L = normalize(tangentLightPos - tangentFragPos);
        V = normalize(tangentViewPos - tangentFragPos);
        HV = normalize(L + V);
    }
    if(u_useParallaxTexture > 0.0) {
        vec3 tangentLightPos = pTBN * u_lightPos;
        vec3 tangentViewPos = pTBN * u_viewPos;
        vec3 tangentFragPos = pTBN * v_fragPos;

        V = normalize(tangentViewPos - tangentFragPos);

        TexCoord = parallaxMapping(v_texcoord, V);
        if(TexCoord.x > 1.0 || TexCoord.y > 1.0 || TexCoord.x < 0.0 || TexCoord.y < 0.0)
            discard;

        if(u_useNormalTexture > 0.0) {
            N = texture2D(u_normalTexture, TexCoord).rgb;
            N = normalize(N * 2.0 - 1.0);
        }
        L = normalize(tangentLightPos - tangentFragPos);
        HV = normalize(L + V);
    }
    // Lambert's cosine law
    float lambertian = max(dot(N, L), 0.0);
    float specular = 0.0;
    if(lambertian > 0.0) {
        vec3 R = reflect(-L, N);      // Reflected light vector
        // Compute the specular term
        float specAngle = max(dot(R, HV), 0.0);
        specular = pow(specAngle, u_brightness);
    }

    vec3 texDiffColor = vec3(0.0,0.0,0.0);
    vec3 diffuse = lambertian * u_diffuseColor;
    if(u_useDiffuseTexture > 0.0) {
        texDiffColor = texture2D(u_diffuseTexture, TexCoord).rgb;
        diffuse = lambertian * mix(u_diffuseColor, texDiffColor, u_useDiffuseTexture);
    }

    vec3 spec = specular * u_specularColor;
    if(u_useSpecularTexture > 0.0) {
        vec3 specTexture = texture2D(u_specularTexture, TexCoord).rgb;
        float threshold = 0.1;
        spec = specular * mix(u_specularColor, specTexture, step(length(specTexture), threshold));
    }
        
    vec3 result = (0.5 * texDiffColor + diffuse + spec);
    gl_FragColor = vec4(result, 1.0);
}
`;
