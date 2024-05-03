export interface Mesh {
    vertexBuffer: WebGLBuffer
    vertexLength: number
    elementBuffer?: WebGLBuffer
    elementLength?: number
}

export interface VertexData {
    stride: number
    posOffset: number
    colOffset?: number
    data: Float32Array
}