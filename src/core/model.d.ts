export interface Model {
    vertexBuffer: WebGLBuffer
    elementBuffer: WebGLBuffer | undefined
    shaderProgram: WebGLProgram | undefined
}