import { Mesh, Model } from "./interface";
import { WebGL } from "./webgl";


export class Scene {
    webGL : WebGL;
    renderId : number | undefined;
    models : Model[] = [];
    meshes: Mesh[] = [];

    constructor(webGL : WebGL) {
        this.webGL = webGL;
    }

    renderLoop() {
        this.webGL.clear();
        this.models.forEach(model => {
            this.webGL.draw(model);
        });
    }

    startRender() {
        this.renderId = requestAnimationFrame(this.renderLoop);
        this.renderLoop();
    }

    stopRender() {
        this.renderId && cancelAnimationFrame(this.renderId);
    }
}