import { Matrix4 } from './math/matrix/matrix4';
import { Matrix } from './math/matrix/matrix';
import { Vector3 } from './math/vector/vector3';
import { Vector4 } from './math/vector/vector4';
import { Matrix4Type } from './math/matrix/matrix.d';
import { IObject3D } from './interface';

export class Object3D {
  private _position: Vector3;
  private _rotation: Vector3;
  private _quaternion: Vector4;
  private _scale: Vector3 = new Vector3(1, 1, 1);
  private _localMatrix: Matrix<Matrix4Type>;
  private _worldMatrix: Matrix<Matrix4Type>;
  private _parent?: Object3D;
  private _children: Object3D[];
  private _name: string;
  private _type: string;
  visible = true;

  constructor() {
    this._name = new Date().getTime().toString();
    this._type = '';
    this._parent = undefined;
    this._position = new Vector3();
    this._quaternion = new Vector4();
    this._rotation = new Vector3();
    this._children = [];
    this._localMatrix = new Matrix4().identity();
    this._worldMatrix = new Matrix4().identity();
  }

  public set name(name: string) {
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public set type(type: string) {
    this._type = type;
  }

  public get type(): string {
    return this._type;
  }

  public get position(): Vector3 {
    return this._position;
  }

  public set position(v: Vector3) {
    this._position = v;
  }

  public get rotation(): Vector3 {
    return this._rotation;
  }

  public get scale(): Vector3 {
    return this._scale;
  }

  public get parent(): Object3D | undefined {
    return this._parent;
  }

  public get localMatrix(): Matrix<Matrix4Type> {
    return this._localMatrix;
  }

  public set localMatrix(newLocalMatrix: Matrix<Matrix4Type>) {
    this._localMatrix = newLocalMatrix;
  }

  public get worldMatrix(): Matrix<Matrix4Type> {
    return this._worldMatrix;
  }

  public get children(): Object3D[] {
    return this._children;
  }

  public get quaternion(): Vector4 {
    return this._quaternion;
  }

  public set parent(parent: Object3D | undefined) {
    if (this._parent !== parent) {
      this._parent = parent;
      this.computeWorldMatrix(false, true);
    }
  }

  public set rotation(v: Vector3) {
    this._rotation = v;
  }

  /**
   * computeLocalMatrix
   */
  public computeLocalMatrix() {
    this._localMatrix = Matrix4.translate(
      this._position.x,
      this._position.y,
      this._position.z
    )
      .multiply(
        Matrix4.rotate(
          this._rotation.x,
          this._rotation.y,
          this._rotation.z
        ).multiply(Matrix4.scale(this._scale.x, this._scale.y, this._scale.z))
      )
      .transpose();
  }

  public computeWorldMatrix(updateParent = true, updateChildren = true) {
    if (updateParent && this.parent) {
      this.parent.computeWorldMatrix(true, false);
    }
    this.computeLocalMatrix();
    if (this.parent) {
      this._worldMatrix = this._localMatrix.multiply(this.parent.worldMatrix);
    } else {
      this._worldMatrix = this._localMatrix.clone();
    }
    if (updateChildren) {
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].computeWorldMatrix(false, true);
      }
    }
  }

  add(node: Object3D): Object3D {
    if (node.parent !== this) {
      node.removeFromParent();
      node.parent = this;
    }
    this.children.push(node);
    return this;
  }

  remove(node: Object3D) {
    const index = this.children.indexOf(node);
    if (index !== -1) {
      node.parent = undefined;
      this.children.splice(index, 1);
    }
    return this;
  }

  removeFromParent() {
    if (this.parent) this.parent.remove(this);
    return this;
  }

  toJSON(): IObject3D {
    return {
      name: this._name,
      type: this._type,
      position: this._position.toJSON(),
      rotation: this._rotation.toJSON(),
      scale: this._scale.toJSON(),
      children: this._children.map((child: Object3D) => child.toJSON())
    };
  }

  fromJSON(object: IObject3D) {
    this.name = object.name;
    this._position = new Vector3(
      object.position.x,
      object.position.y,
      object.position.z
    );
    this._rotation = new Vector3(
      object.rotation.x,
      object.rotation.y,
      object.rotation.z
    );
    this._scale = new Vector3(object.scale.x, object.scale.y, object.scale.z);
  }
}
