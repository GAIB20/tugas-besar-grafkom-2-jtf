import { Attribute } from './enum';

export interface Mesh {
  vertexBuffer: WebGLBuffer;
  vertexLength: number;
  elementBuffer?: WebGLBuffer;
  elementLength?: number;
  stride: number;
  posOffset: number;
  colOffset?: number;
}

export interface VertexData {
  stride: number;
  posOffset: number;
  colOffset?: number;
  data: Float32Array;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface Coordinate {
  x: number;
  y: number;
  z: number;
}
