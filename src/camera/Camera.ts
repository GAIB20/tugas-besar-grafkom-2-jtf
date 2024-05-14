import { Matrix4 } from '../core/math/matrix/matrix4';
import { Object3D } from '../core/object3D';

export class Camera extends Object3D {
  protected _projectionMatrix = new Matrix4().identity();
  private _invWorldMatrix = new Matrix4().identity();

  computeWorldMatrix() {
    super.computeWorldMatrix();
    console.log('world', this.worldMatrix);
    this._invWorldMatrix = this.worldMatrix.inverse();
  }

  get viewProjectionMatrix() {
    this.computeWorldMatrix();
    return this.projectionMatrix.preMultiply(this._invWorldMatrix);
  }

  get projectionMatrix() {
    return this._projectionMatrix;
  }

  computeProjectionMatrix() {
    throw new Error(
      'Camera.computeProjectionMatrix() must be implemented in derived classes.'
    );
  }
}
