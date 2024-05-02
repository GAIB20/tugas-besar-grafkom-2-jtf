export interface Model {
    mesh: Mesh
    translation: number[]
    rotation: number[]
}

export interface Mesh {
    vertexBuffer: WebGLBuffer
    vertexLength: number
    elementBuffer: WebGLBuffer | undefined
    elementLength: number | undefined
    shaderProgram: WebGLProgram
}

export interface VertexData {

}