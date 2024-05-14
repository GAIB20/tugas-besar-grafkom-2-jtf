import { BoxGeometry } from "../mesh/geometry/boxGeometry";
import { BufferGeometry } from "../mesh/geometry/bufferGeometry";
import { PlaneGeometry } from "../mesh/geometry/planeGeometry";
import { VertexData } from "./interface";
import { Model } from "./model";
import { WebGL } from "./webgl";


export class Scene {
    webGL : WebGL;
    renderId : number | undefined;
    buffers : BufferGeometry[] = [];
    gltf: any;

    renderLoop = () => {
        this.webGL.clear();
        this.buffers.forEach(buffer => {
            this.webGL.draw(buffer);
        });
        
        this.renderId = requestAnimationFrame(this.renderLoop);
    }

    constructor(webGL : WebGL) {
        this.webGL = webGL;

        const test = new BoxGeometry();
        this.webGL.attachAttribSetter(test.attributes["position"], "position");
        this.buffers.push(test);
        const test2 = new PlaneGeometry();
        this.webGL.attachAttribSetter(test2.attributes["position"], "position");
        this.buffers.push(test2);
    }

    async loadGLTF(url: string): Promise<any> {
        try {
            const a = await fetch("data:application/octet-stream;base64,AAABAAIAAAAAAAAAAAAAAAAAAAAAAIA/AAAAAAAAAAAAAAAAAACAPwAAAAA=");
            const b = await a.blob();
            const c = await b.arrayBuffer();
            console.log(new Float32Array(c, 8));
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const gltf = await response.json();
            console.log('GLTF loaded:', gltf);
            this.gltf = gltf;
        } catch (error) {
            console.error('Error loading GLTF file:', error);
            throw error;
        }
    }

    startRender() {
        this.renderLoop();
    }

    stopRender() {
        this.renderId && cancelAnimationFrame(this.renderId);
    }

    destroy() {
        this.stopRender();
        // this.webGL.destroy();
        this.buffers = [];
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

