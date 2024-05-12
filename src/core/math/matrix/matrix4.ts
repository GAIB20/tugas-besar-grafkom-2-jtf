import { Matrix } from './matrix';
import { Matrix4Type } from './matrix.d';
import { Vector4 } from '../vector/vector4';

/**
 * Matrix4 class represents a 4x4 matrix in a Cartesian coordinate system.
 * It extends the base Matrix class and works specifically with Matrix4Type.
 */
export class Matrix4 extends Matrix<Matrix4Type> {
  /**
   * Constructs a new Matrix4 instance.
   * @param x - The first row of the matrix.
   * @param y - The second row of the matrix.
   * @param z - The third row of the matrix.
   * @param w - The fourth row of the matrix.
   */
  constructor(x: Vector4, y: Vector4, z: Vector4, w: Vector4) {
    super([x.coords, y.coords, z.coords, w.coords]);
  }

  /**
   * Creates a new Matrix4 of the same type.
   * @param rows - The rows of the new matrix.
   * @returns A new Matrix4 of the same type.
   */
  protected override createMatrix(rows: Matrix4Type): Matrix<Matrix4Type> {
    const vectors = rows.map((row) => new Vector4(...row));
    return new Matrix4(vectors[0], vectors[1], vectors[2], vectors[3]);
  }
}
