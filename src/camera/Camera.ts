import { Matrix4 } from '../core/math/matrix/matrix4';
import { Vector3 } from '../core/math/vector/vector3';
import { Object3D } from '../core/object3D';

export class Camera extends Object3D {
  protected _projectionMatrix = new Matrix4().identity();
  private _invWorldMatrix = new Matrix4().identity();
  protected _zoom: number = 1;
  protected _angle: number = 45;
  protected _orbitRotaion = new Vector3();

  constructor(type: string) {
    super();
    this.name = type + ' camera';
  }

  computeWorldMatrix() {
    super.computeWorldMatrix();
    this._invWorldMatrix = this.worldMatrix.inverse();
  }

  public get zoom(): number {
    return this._zoom;
  }

  public set zoom(d: number) {
    this._zoom = d;
  }

  public get orbitRotation(): Vector3 {
    return this._orbitRotaion;
  }

  public set orbitRotation(rotation: Vector3) {
    this._orbitRotaion = rotation;
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
