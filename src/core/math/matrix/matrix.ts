import { Matrix3Type, Matrix4Type } from './matrix.d';

/**
 * Matrix class represents a matrix in a Cartesian coordinate system.
 * This is an abstract class that can be used with either a Matrix3Type or Matrix4Type.
 */
export abstract class Matrix<T extends Matrix3Type | Matrix4Type> {
  /**
   * Constructs a new Matrix instance.
   * @param rows - The rows of the matrix.
   */
  constructor(public rows: T) {}

  /**
   * Multiplies the current matrix with another matrix.
   * @param other - The other matrix to multiply with.
   * @returns The result of the multiplication.
   */
  multiply(other: Matrix<T>): Matrix<T> {
    if (this.rows[0].length !== other.rows.length) {
      throw new Error(
        'The matrices cannot be multiplied due to incompatible dimensions.'
      );
    }

    const result = this.rows.map((row) =>
      other.rows.map((_, j) =>
        row.reduce((sum, elm, k) => sum + elm * other.rows[k][j], 0)
      )
    ) as T;
    return this.createMatrix(result);
  }

  /**
   * Transposes the current matrix.
   * @returns The transpose of the current matrix.
   */
  transpose(): Matrix<T> {
    const transposedRows = this.rows[0].map((_, i) =>
      this.rows.map((row) => row[i])
    ) as T;
    return this.createMatrix(transposedRows);
  }

  /**
   * Flattens the current matrix.
   * @returns The flattened matrix.
   */
  flatten(): number[] {
    return this.rows.reduce(
      (acc: number[], val: number[]) => acc.concat(val),
      []
    );
  }

  /**
   * Transposes and flattens the current matrix for WebGL.
   * @returns The transposed and flattened matrix.
   */
  toColumnMajorArray(): Float32Array {
    const transposedMatrix = this.transpose();
    const flattenedArray = transposedMatrix.flatten();
    return new Float32Array(flattenedArray);
  }

  /**
   * Creates a new identity matrix of the same type.
   * @returns A new identity matrix of the same type.
   */
  identity(): Matrix<T> {
    const size = this.rows.length;
    const identityRows = Array(size)
      .fill(0)
      .map((_, i) =>
        Array(size)
          .fill(0)
          .map((_, j) => (i === j ? 1 : 0))
      ) as T;
    return this.createMatrix(identityRows);
  }

  /**
   * Calculates the determinant of the current matrix.
   * @returns The determinant of the current matrix.
   */
  determinant(): number {
    let matrix = JSON.parse(JSON.stringify(this.rows)); // Create a copy of the matrix
    const size = matrix.length;
    let det = 1;

    for (let i = 0; i < size; i++) {
      let max = i;
      for (let j = i + 1; j < size; j++) {
        if (Math.abs(matrix[j][i]) > Math.abs(matrix[max][i])) {
          max = j;
        }
      }

      if (i !== max) {
        // Swap rows
        [matrix[i], matrix[max]] = [matrix[max], matrix[i]];
        det *= -1;
      }

      const tolerance = 1e-10;
      if (Math.abs(matrix[i][i]) < tolerance) {
        return 0; // Singular matrix, determinant is effectively 0
      }

      for (let j = i + 1; j < size; j++) {
        const factor = matrix[j][i] / matrix[i][i];
        for (let k = i; k < size; k++) {
          matrix[j][k] -= factor * matrix[i][k];
        }
      }

      det *= matrix[i][i];
    }

    return det;
  }

  /**
   * Calculates the inverse of the current matrix.
   * @returns The inverse of the current matrix.
   */
  inverse(): Matrix<T> {
    const det = this.determinant();

    // Return current matrix if not inverseable
    if (det === 0) {
      console.error('Matrix is not inverseable');
      return this;
    }

    const size = this.rows.length;
    let matrix = this.rows.map((row, i) => [
      ...row,
      ...Array(size)
        .fill(0)
        .map((_, j) => (i === j ? 1 : 0))
    ]);

    for (let i = 0; i < size; i++) {
      let maxRow = i;
      for (let j = i + 1; j < size; j++) {
        if (Math.abs(matrix[j][i]) > Math.abs(matrix[maxRow][i])) {
          maxRow = j;
        }
      }

      [matrix[maxRow], matrix[i]] = [matrix[i], matrix[maxRow]];

      for (let j = i + 1; j < size; j++) {
        const factor = matrix[j][i] / matrix[i][i];
        for (let k = i; k < 2 * size; k++) {
          matrix[j][k] -= factor * matrix[i][k];
        }
      }
    }

    for (let i = size - 1; i >= 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        const factor = matrix[j][i] / matrix[i][i];
        for (let k = i; k < 2 * size; k++) {
          matrix[j][k] -= factor * matrix[i][k];
        }
      }
    }

    for (let i = 0; i < size; i++) {
      const factor = matrix[i][i];
      for (let j = 0; j < 2 * size; j++) {
        matrix[i][j] /= factor;
      }
    }

    const inverseRows = matrix.map((row) => row.slice(size)) as T;
    return this.createMatrix(inverseRows);
  }

  /**
   * Creates a new matrix of the same type.
   * @param rows - The rows of the new matrix.
   * @returns A new matrix of the same type.
   */
  protected abstract createMatrix(rows: T): Matrix<T>;
}
