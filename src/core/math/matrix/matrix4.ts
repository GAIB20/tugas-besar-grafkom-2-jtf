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
  constructor(
    private x: Vector4 = new Vector4(),
    private y: Vector4 = new Vector4(),
    private z: Vector4 = new Vector4(),
    private w: Vector4 = new Vector4()
  ) {
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

  /**
   * Clones currrent matrix and create new matrix instances.
   * @returns The cloned matrix.
   */
  clone(): Matrix<Matrix4Type> {
    return new Matrix4(this.x, this.y, this.z, this.w);
  }

  /**
   * Rotates the matrix around the x, y, and z axes.
   * The rotations are applied in sequence: first x, then y, and finally z.
   * @param x - The angle to rotate around the x-axis, in degrees.
   * @param y - The angle to rotate around the y-axis, in degrees.
   * @param z - The angle to rotate around the z-axis, in degrees.
   * @returns The rotated matrix.
   */
  rotate(x: number, y: number, z: number): Matrix<Matrix4Type> {
    const radX = (x * Math.PI) / 180;
    const radY = (y * Math.PI) / 180;
    const radZ = (z * Math.PI) / 180;

    const rotationMatrixX = new Matrix4(
      new Vector4(1, 0, 0, 0),
      new Vector4(0, Math.cos(radX), -Math.sin(radX), 0),
      new Vector4(0, Math.sin(radX), Math.cos(radX), 0),
      new Vector4(0, 0, 0, 1)
    );

    const rotationMatrixY = new Matrix4(
      new Vector4(Math.cos(radY), 0, Math.sin(radY), 0),
      new Vector4(0, 1, 0, 0),
      new Vector4(-Math.sin(radY), 0, Math.cos(radY), 0),
      new Vector4(0, 0, 0, 1)
    );

    const rotationMatrixZ = new Matrix4(
      new Vector4(Math.cos(radZ), -Math.sin(radZ), 0, 0),
      new Vector4(Math.sin(radZ), Math.cos(radZ), 0, 0),
      new Vector4(0, 0, 1, 0),
      new Vector4(0, 0, 0, 1)
    );

    return rotationMatrixZ.multiply(
      rotationMatrixY.multiply(rotationMatrixX.multiply(this))
    );
  }

  /**
   * Translates the matrix by the given x, y, and z values.
   * @param x - The value to translate along the x-axis.
   * @param y - The value to translate along the y-axis.
   * @param z - The value to translate along the z-axis.
   * @returns The translated matrix.
   */
  translate(x: number, y: number, z: number): Matrix<Matrix4Type> {
    const translationMatrix = new Matrix4(
      new Vector4(1, 0, 0, x),
      new Vector4(0, 1, 0, y),
      new Vector4(0, 0, 1, z),
      new Vector4(0, 0, 0, 1)
    );
    return this.multiply(translationMatrix);
  }

  /**
   * Scales the matrix by the given x, y, and z values.
   * @param x - The value to scale along the x-axis.
   * @param y - The value to scale along the y-axis.
   * @param z - The value to scale along the z-axis.
   * @returns The scaled matrix.
   */
  scale(x: number, y: number, z: number): Matrix<Matrix4Type> {
    const scaleMatrix = new Matrix4(
      new Vector4(x, 0, 0, 0),
      new Vector4(0, y, 0, 0),
      new Vector4(0, 0, z, 0),
      new Vector4(0, 0, 0, 1)
    );
    return this.multiply(scaleMatrix);
  }

  /**
   * Creates an orthographic projection matrix.
   * @param left - The left plane of the orthographic projection.
   * @param right - The right plane of the orthographic projection.
   * @param bottom - The bottom plane of the orthographic projection.
   * @param top - The top plane of the orthographic projection.
   * @param near - The near plane of the orthographic projection.
   * @param far - The far plane of the orthographic projection.
   * @returns A new Matrix4 instance representing the orthographic projection matrix. Followed column major ordering.
   */
  static orthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Matrix<Matrix4Type> {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    const rows: Matrix4Type = [
      [-2 * lr, 0, 0, 0],
      [0, -2 * bt, 0, 0],
      [0, 0, 2 * nf, 0],
      [(left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1]
    ];
    const mat = new Matrix4();
    mat.rows = rows;

    return mat;
  }
}
