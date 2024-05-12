import { Matrix } from './matrix';
import { Matrix3Type } from './matrix.d';
import { Vector3 } from '../vector/vector3';

/**
 * Matrix3 class represents a 3x3 matrix in a Cartesian coordinate system.
 * It extends the base Matrix class and works specifically with Matrix3Type.
 */
export class Matrix3 extends Matrix<Matrix3Type> {
  /**
   * Constructs a new Matrix3 instance.
   * @param x - The first row of the matrix.
   * @param y - The second row of the matrix.
   * @param z - The third row of the matrix.
   */
  constructor(x: Vector3, y: Vector3, z: Vector3) {
    super([x.coords, y.coords, z.coords]);
  }

  /**
   * Creates a new Matrix3 of the same type.
   * @param rows - The rows of the new matrix.
   * @returns A new Matrix3 of the same type.
   */
  protected override createMatrix(rows: Matrix3Type): Matrix<Matrix3Type> {
    const vectors = rows.map((row) => new Vector3(...row));
    return new Matrix3(vectors[0], vectors[1], vectors[2]);
  }
}
