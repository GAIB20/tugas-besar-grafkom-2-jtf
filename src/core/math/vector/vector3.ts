import { Vector3Type } from './vector.d';
import { Vector } from './vector';
import { IVector3 } from '../../interface';

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
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {
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

  rotate(angleX: number, angleY: number, angleZ: number): Vector3 {
    const radX = (angleX * Math.PI) / 180;
    const radY = (angleY * Math.PI) / 180;
    const radZ = (angleZ * Math.PI) / 180;

    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);
    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);
    const cosZ = Math.cos(radZ);
    const sinZ = Math.sin(radZ);

    // Rotation around X-axis
    const y1 = this.y * cosX - this.z * sinX;
    const z1 = this.y * sinX + this.z * cosX;

    // Rotation around Y-axis
    const x2 = this.x * cosY + z1 * sinY;
    const z2 = z1 * cosY - this.x * sinY;

    // Rotation around Z-axis
    const x3 = x2 * cosZ - y1 * sinZ;
    const y3 = x2 * sinZ + y1 * cosZ;

    return new Vector3(x3, y3, z2);
  }

  toJSON(): IVector3 {
    return {
      x: this.x,
      y: this.y,
      z: this.z
    };
  }
}
