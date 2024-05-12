import { ZERO_TOLERANCE } from '../../../constants/math';
import { Vector3Type, Vector4Type } from './vector.d';

/**
 * Vector class represents a vector in a Cartesian coordinate system.
 * This is an abstract class that can be used with either a Vector3Type or Vector4Type.
 */
export abstract class Vector<T extends Vector3Type | Vector4Type> {
  /**
   * Constructs a new Vector instance.
   * @param coords - The coordinates of the vector.
   */
  constructor(public coords: T) {}

  /**
   * Creates a new vector of the same type.
   * @param coords - The coordinates of the new vector.
   * @returns A new vector of the same type.
   */
  protected abstract createVector(coords: T): Vector<T>;

  /**
   * Checks if the given vector has the same dimension as the current vector.
   * @param v - The vector to check.
   * @throws {Error} If the vectors are not of the same dimension.
   */
  protected checkDimension(v: Vector<T>): void {
    if (this.coords.length !== v.coords.length) {
      throw new Error('Vectors must be of the same dimension');
    }
  }

  /**
   * Adds the given vector to the current vector.
   * @param v - The vector to add.
   * @returns A new Vector instance representing the result of the addition.
   */
  add(v: Vector<T>): Vector<T> {
    this.checkDimension(v);
    const newCoords = this.coords.map((coord, i) => coord + v.coords[i]) as T;
    return this.createVector(newCoords);
  }

  /**
   * Subtracts the given vector from the current vector.
   * @param v - The vector to subtract.
   * @returns A new Vector instance representing the result of the subtraction.
   */
  subtract(v: Vector<T>): Vector<T> {
    this.checkDimension(v);
    const newCoords = this.coords.map((coord, i) => coord - v.coords[i]) as T;
    return this.createVector(newCoords);
  }

  /**
   * Multiplies the current vector by a scalar.
   * @param scalar - The scalar to multiply the vector by.
   * @returns A new Vector instance representing the result of the multiplication.
   */
  multiply(scalar: number): Vector<T> {
    const newCoords = this.coords.map((coord) => coord * scalar) as T;
    return this.createVector(newCoords);
  }

  /**
   * Calculates the dot product of the current vector and the given vector.
   * @param v - The vector to calculate the dot product with.
   * @returns The dot product of the two vectors.
   */
  dot(v: Vector<T>): number {
    this.checkDimension(v);
    return this.coords.reduce((sum, coord, i) => sum + coord * v.coords[i], 0);
  }

  /**
   * Normalizes the current vector.
   * @returns A new Vector instance representing the normalized vector.
   * @throws {Error} If the vector is the zero vector.
   */
  normalize(): Vector<T> {
    const magnitude = Math.sqrt(
      this.coords.reduce((sum, coord) => sum + coord * coord, 0)
    );

    if (magnitude < ZERO_TOLERANCE) {
      throw new Error('Cannot normalize the zero vector');
    }

    const newCoords = this.coords.map((coord) => coord / magnitude) as T;
    return this.createVector(newCoords);
  }

  /**
   * Calculates the cross product of the current vector and the given vector.
   * Note: This method is only valid for 3D vectors.
   * @param v - The vector to calculate the cross product with.
   * @returns A new Vector instance representing the cross product of the two vectors.
   * @throws {Error} If the vectors are not both 3D.
   */
  cross(v: Vector<T>): Vector<T> {
    throw new Error('Cross product is only defined for 3D vectors');
  }
}
