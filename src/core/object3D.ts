import { Matrix4 } from "./math/matrix/matrix4";
import { Vector3Type, Vector4Type } from "./math/vector/vector.d";
import { Vector } from "./math/vector/vector";
import { Matrix } from "./math/matrix/matrix";
import { Vector3 } from "./math/vector/vector3";
import { Vector4 } from "./math/vector/vector4";
import { Matrix4Type } from "./math/matrix/matrix.d";


export class Object3D {
    private _position: Vector3;
    private _rotation: Vector3;
    private _quaternion: Vector4;
    private _scale: Vector3 = new Vector3(1, 1, 1);
    private _localMatrix: Matrix<Matrix4Type>;
    private _worldMatrix: Matrix<Matrix4Type>;
    private _parent?: Object3D;
    private _children: Object3D[];
    private _name : string;
    visible=true

    constructor(){
        this._name = '';
        this._parent = undefined;
        this._position = new Vector3();
        this._quaternion = new Vector4();
        this._rotation = new Vector3();
        this._children = [];
        this._localMatrix = new Matrix4().identity();
        this._worldMatrix = new Matrix4().identity();
    }

    public get name() : string {
        return this._name;
    }

    public get position() : Vector3 {
        return this._position;
    }

    public get rotation() : Vector3 {
        return this._rotation
    }
    
    public get scale() : Vector3 {
        return this._scale
    }
    
    public get parent() : Object3D|undefined {
        return this._parent
    }
    
    
    public get localMatrix() : Matrix<Matrix4Type> {
        return this._localMatrix;
    }

    
    public get worldMatrix() : Matrix<Matrix4Type> {
        return this._worldMatrix;
    }
    
    public get children() : Object3D[] {
        return this._children;
    }
    
    
    public get quaternion() : Vector4 {
        return this._quaternion;
    }
    
    public set parent(parent : Object3D|undefined) {
        this._parent = parent;
    }

    /**
     * computeLocalMatrix
     */
    public computeLocalMatrix() {
        this._localMatrix = this._localMatrix.translate(this._position.x, this._position.y, this._position.z)
        .rotate(this._rotation.x, this._rotation.y, this._rotation.z)
        .scale(this._scale.x,this._scale.y, this._scale.z);
    }

    public computeWorldMatrix(updateParent=true, updateChildren=true){
        if (updateParent && this.parent) {
            this.parent.computeWorldMatrix(true, false);
        }
        this.computeLocalMatrix();
        if (this.parent) {
            this._worldMatrix = this.parent.worldMatrix.preMultiply(this._localMatrix);
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

}