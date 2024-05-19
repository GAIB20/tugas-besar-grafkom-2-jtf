export default `
attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec3 a_tangent;
attribute vec2 a_texcoord;

uniform mat4 u_worldMatrix;
uniform mat4 u_viewProjectionMatrix;

varying lowp vec3 v_fragPos;
varying lowp vec3 v_normal;
varying lowp mat3 TBN;
varying lowp mat3 pTBN;

varying vec2 v_texcoord;

float determinant(mat3 m) {
    return m[0][0] * (m[1][1] * m[2][2] - m[2][1] * m[1][2]) -
           m[1][0] * (m[0][1] * m[2][2] - m[2][1] * m[0][2]) +
           m[2][0] * (m[0][1] * m[1][2] - m[1][1] * m[0][2]);
}

// Function to calculate the inverse of a 3x3 matrix
mat3 inverse(mat3 m) {
    float det = determinant(m);
    if (det == 0.0) {
        return mat3(1.0); // Return identity matrix if determinant is zero
    }
    float invDet = 1.0 / det;
    return mat3(
        (m[1][1] * m[2][2] - m[2][1] * m[1][2]) * invDet,
        (m[2][1] * m[0][2] - m[0][1] * m[2][2]) * invDet,
        (m[0][1] * m[1][2] - m[1][1] * m[0][2]) * invDet,
        (m[2][0] * m[1][2] - m[1][0] * m[2][2]) * invDet,
        (m[0][0] * m[2][2] - m[2][0] * m[0][2]) * invDet,
        (m[1][0] * m[0][2] - m[0][0] * m[1][2]) * invDet,
        (m[1][0] * m[2][1] - m[2][0] * m[1][1]) * invDet,
        (m[2][0] * m[0][1] - m[0][0] * m[2][1]) * invDet,
        (m[0][0] * m[1][1] - m[1][0] * m[0][1]) * invDet
    );
}

// Function to calculate the transpose of a 3x3 matrix
mat3 transpose(mat3 m) {
    return mat3(
        m[0][0], m[1][0], m[2][0],
        m[0][1], m[1][1], m[2][1],
        m[0][2], m[1][2], m[2][2]
    );
}

void main() {
    gl_Position = u_viewProjectionMatrix * u_worldMatrix * a_position;
    v_normal = mat3(u_worldMatrix) * a_normal;
    mat3 normalMatrix = transpose(inverse(mat3(u_worldMatrix)));
    vec3 N = normalize(normalMatrix * a_normal);
    vec3 T = normalize(normalMatrix * a_tangent);
    T = normalize(T - dot(T, N) * N);
    vec3 B = cross(N, T);
    TBN = transpose(mat3(T, B, N));
    vec3 pN = normalize(mat3(u_worldMatrix) * a_normal);
    vec3 pT = normalize(mat3(u_worldMatrix) * a_tangent);
    pT = normalize(pT - dot(pT, pN) * pN);
    vec3 pB = cross(pN, pT);
    pTBN = transpose(mat3(pT, pB, pN));
    v_fragPos = gl_Position.xyz / gl_Position.w;
    v_texcoord = a_texcoord;
}
`;
