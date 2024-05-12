import { Vector3Type, Vector4Type } from '../vector/vector.d';

/**
 * Matrix3Type represents a 3x3 matrix as a tuple of three Vector3Type.
 */
export type Matrix3Type = [Vector3Type, Vector3Type, Vector3Type];

/**
 * Matrix4Type represents a 4x4 matrix as a tuple of four Vector4Type.
 */
export type Matrix4Type = [Vector4Type, Vector4Type, Vector4Type, Vector4Type];
