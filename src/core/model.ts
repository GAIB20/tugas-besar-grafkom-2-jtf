import { Mesh } from "./interface"
import { identity } from "./mat4";

export class Model {
    mesh: Mesh;
    translation: Float32Array;
    rotation: Float32Array;

    constructor(mesh : Mesh) {
        this.mesh = mesh;
        this.translation = identity();
        this.rotation = identity();
    }
}