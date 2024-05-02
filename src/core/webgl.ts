

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


    draw() {

    }

    renderLoop() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.draw();
    }

    startRender() {
        this.renderId = requestAnimationFrame(this.renderLoop);
        this.renderLoop();
    }

    stopRender() {
        this.renderId && cancelAnimationFrame(this.renderId);
    }

}