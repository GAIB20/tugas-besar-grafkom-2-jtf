import type { Matrix4Type } from "./math/matrix/matrix.d";
import { Matrix4 } from "./math/matrix/matrix4";
import { Vector3 } from "./math/vector/vector3";
import { Vector4 } from "./math/vector/vector4";


class Object3D {
    private _position: Vector3;
    private _rotation: Vector3;
    private _quaternion: Vector4;
    private _scale: Vector3 = new Vector3(1, 1, 1);
    private _localMatrix: Matrix4;
    private _worldMatrix: Matrix4;
    private _parent?: Object3D;
    private _children: Object3D[];
    private _name : string;
    visible=true

    constructor({name = '', children = [], parent = undefined, localMatrix = new Matrix4(), worldMatrix = new Matrix4(), position = new Vector3(), rotation = new Vector3(), quaternion = new Vector4()}){
        this._name = name;
        this._parent = parent;
        this._position = position;
        this._quaternion = quaternion;
        this._rotation = rotation;
        this._children = children;
        this._localMatrix = localMatrix;
        this._worldMatrix = worldMatrix;
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
    
    
    public get localMatrix() : Matrix4 {
        return this._localMatrix;
    }

    
    public get worldMatrix() : Matrix4 {
        return this._worldMatrix;
    }
    
    public get children() : Object3D[] {
        return this._children;
    }
    
    
    public get quaternion() : Vector4 {
        return this._quaternion;
    }
    
    public set parent(parent : Object3D) {
        this._parent = parent;
    }

    /**
     * computeLocalMatrix
     */
    public computeLocalMatrix() {
        this._localMatrix = 
    }
    
}