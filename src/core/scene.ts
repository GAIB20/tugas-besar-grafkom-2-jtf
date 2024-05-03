import { Mesh, VertexData } from "./interface";
import { Model } from "./model";
import { WebGL } from "./webgl";


export class Scene {
    webGL : WebGL;
    renderId : number | undefined;
    models : Model[] = [];
    meshes: Mesh[] = [];

    renderLoop = () => {
        this.webGL.clear();
        this.models.forEach(model => {
            this.webGL.draw(model);
        });
        this.renderId = requestAnimationFrame(this.renderLoop);
    }

    constructor(webGL : WebGL) {
        this.webGL = webGL;

        const test : VertexData = {
            data: new Float32Array(vertices),
            posOffset: 0,
            colOffset: 3,
            stride: vertices.length/3,
        }

        const test2 : VertexData = {
            data: new Float32Array(vertices2),
            posOffset: 0,
            stride: vertices2.length/3,
        }

        this.meshes.push(this.webGL.createMesh(test, new Uint16Array(indices)));
        this.meshes.push(this.webGL.createMesh(test2, new Uint16Array(indices)));
        this.models.push(new Model(this.meshes[0]));
        this.models.push(new Model(this.meshes[1]));
    }

    startRender() {
        this.renderLoop();
    }

    stopRender() {
        this.renderId && cancelAnimationFrame(this.renderId);
    }
}


const vertices = [
    // X, Y, Z coordinates for each vertex
    -0.5, -0.5, 0, 0.1, 0.2, 0.3, 1.0, // Vertex 0
     0.5, -0.5, 0, 0.1, 0.4, 0.3, 1.0,// Vertex 1
     0.5,  0.5, 0, 0.5, 0.2, 0.3, 1.0,// Vertex 2
];

const vertices2 = [
    // X, Y, Z coordinates for each vertex
    -0.5, -0.3, 0, 0.1, 0.2, 0.7, 1.0, // Vertex 0
     0.5, -0.3, 0, 0.1, 0.4, 0.7, 1.0,// Vertex 1
     0.5,  0.3, 0, 0.5, 0.2, 0.7, 1.0,// Vertex 2
];

const indices = [
    // Front face
    0, 1, 2,
];

