import { Matrix4 } from '../core/math/matrix/matrix4';
import { Camera } from './Camera';

export class PerspectiveCamera extends Camera {
  fov: number;
  near: number;
  aspect: number;
  far: number;

  constructor(fov: number, near: number, aspect: number, far: number) {
    super('perspective'); // Setup Node
    this.far = far;
    this.fov = fov;
    this.near = near;
    this.aspect = aspect;
    this._zoom = 400;
    this.position.z = this._zoom;
    // Jangan lupa untuk panggil computeProjectionMatrix() setiap
    // kali mengubah nilai left, right, top, bottom, near, atau far.
    this.computeProjectionMatrix();
  }

  public get zoom(): number {
      return this._zoom;
  }
  public set zoom(d: number) {
    this._zoom = d;
    const zoomFactor = 400 - (this._zoom-1)/4 * 300
    this.position.z = zoomFactor;
  }

  computeProjectionMatrix() {
    // M4.orthographic() menghasilkan proyeksi matriks ortografik
    // dengan 6 tupel left, right, bottom, top, near, dan far.
    this._projectionMatrix = Matrix4.perspective(
      this.fov,
      this.near,
      this.aspect,
      this.far
    );
  }
}
