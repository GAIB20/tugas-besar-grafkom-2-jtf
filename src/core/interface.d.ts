import { Attribute } from "./enum"

export interface Mesh {
    vertexBuffer: WebGLBuffer
    vertexLength: number
    elementBuffer?: WebGLBuffer
    elementLength?: number
    stride: number
    posOffset: number
    colOffset?: number
}

export interface VertexData {
    stride: number
    posOffset: number
    colOffset?: number
    data: Float32Array
}