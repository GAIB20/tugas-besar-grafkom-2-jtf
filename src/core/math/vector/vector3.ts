import { Vector3Type } from './vector.d';
import { Vector } from './vector';

/**
 * Vector3 class represents a 3D vector in a Cartesian coordinate system.
 * It extends the base Vector class and works specifically with Vector3Type.
 */
export class Vector3 extends Vector<Vector3Type> {
  /**
   * Constructs a new Vector3 instance.
   * @param x - The x-coordinate of the vector.
   * @param y - The y-coordinate of the vector.
   * @param z - The z-coordinate of the vector.
   */
  constructor(public x: number, public y: number, public z: number) {
    super([x, y, z]);
  }

  protected override createVector(coords: Vector3Type): Vector<Vector3Type> {
    return new Vector3(coords[0], coords[1], coords[2]);
  }

  /**
   * Calculates the cross product of the current vector and the given vector.
   * @param v - The vector to calculate the cross product with.
   * @returns A new Vector3 instance representing the cross product of the two vectors.
   */
  cross(v: Vector3): Vector<Vector3Type> {
    const [x1, y1, z1] = this.coords;
    const [x2, y2, z2] = v.coords;

    const crossProduct = [
      y1 * z2 - z1 * y2,
      z1 * x2 - x1 * z2,
      x1 * y2 - y1 * x2
    ] as Vector3Type;

    return this.createVector(crossProduct);
  }
}
