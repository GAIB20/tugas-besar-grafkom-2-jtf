import { Vector4Type } from './vector.d';
import { Vector } from './vector';

/**
 * Vector4 class represents a 4D vector in a Cartesian coordinate system.
 * It extends the base Vector class and works specifically with Vector4Type.
 */
export class Vector4 extends Vector<Vector4Type> {
  /**
   * Constructs a new Vector4 instance.
   * @param x - The x-coordinate of the vector.
   * @param y - The y-coordinate of the vector.
   * @param z - The z-coordinate of the vector.
   * @param w - The w-coordinate of the vector.
   */
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0,
    public w: number = 0
  ) {
    super([x, y, z, w]);
  }

  protected override createVector(coords: Vector4Type): Vector<Vector4Type> {
    return new Vector4(coords[0], coords[1], coords[2], coords[3]);
  }
}
