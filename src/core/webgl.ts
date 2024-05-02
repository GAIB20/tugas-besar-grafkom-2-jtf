import { Model } from "./model";


export class WebGL {
    gl : WebGLRenderingContext;
    renderId : number | undefined;


    constructor(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) {
        this.gl = gl;
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        this.gl.clearDepth(1.0); // Clear everything
        this.gl.enable(gl.DEPTH_TEST); // Enable depth testing
        this.gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        this.gl.viewport(0, 0, canvas.width, canvas.height);
    }

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    draw(model : Model) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, model.vertexBuffer);
        model.elementBuffer && this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, model.elementBuffer);
        model.shaderProgram && this.gl.useProgram(model.shaderProgram);
    }
}