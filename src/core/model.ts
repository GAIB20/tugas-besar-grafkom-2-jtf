import { Mesh } from "./interface"
import { identity } from "./mat4";

export class Model {
    meshID: number;
    translation: Float32Array;
    rotation: Float32Array;

    constructor(meshID : number) {
        this.meshID = meshID;
        this.translation = identity();
        this.rotation = identity();
    }
}