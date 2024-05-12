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
  constructor(x: number, y: number, z: number) {
    super([x, y, z]);
  }

  protected override createVector(coords: Vector3Type): Vector<Vector3Type> {
    return new Vector3(coords[0], coords[1], coords[2]);
  }
}
