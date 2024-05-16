import { Matrix4 } from '../core/math/matrix/matrix4';
import { Camera } from './Camera';

export class OrthographicCamera extends Camera {
  top: number;
  bottom: number;
  left: number;
  right: number;
  near: number;
  far: number;
  teta: number;
  gamma: number;

  constructor(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number,
    teta: number,
    gamma: number,
  ) {
    super(); // Setup Node
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;
    this.teta = teta;
    this.gamma = gamma;
    // Jangan lupa untuk panggil computeProjectionMatrix() setiap
    // kali mengubah nilai left, right, top, bottom, near, atau far.
    this.computeProjectionMatrix();
  }

  computeProjectionMatrix() {
    // M4.orthographic() menghasilkan proyeksi matriks ortografik
    // dengan 6 tupel left, right, bottom, top, near, dan far.
    this._projectionMatrix = Matrix4.oblique(
      this.left,
      this.right,
      this.bottom,
      this.top,
      this.near,
      this.far,
      this.teta,
      this.gamma
    );
  }
}
