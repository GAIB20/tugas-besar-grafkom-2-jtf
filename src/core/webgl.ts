import { Model } from "./interface";


export class WebGL {
    gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) {
        this.gl = gl;
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        this.gl.clearDepth(1.0); // Clear everything
        this.gl.enable(gl.DEPTH_TEST); // Enable depth testing
        this.gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        this.gl.viewport(0, 0, canvas.width, canvas.height);
    }

    createMesh() {

    }

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    draw(model : Model) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, model.mesh.vertexBuffer);
        model.mesh.elementBuffer && this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, model.mesh.elementBuffer);
        
        const uTranslationMatrixLocation = this.gl.getUniformLocation(model.mesh.shaderProgram, 'uTranslationMatrix');
        const uRotationMatrixLocation = this.gl.getUniformLocation(model.mesh.shaderProgram, 'uRotationMatrix');
        
        this.gl.useProgram(model.mesh.shaderProgram)
        this.gl.uniformMatrix4fv(uTranslationMatrixLocation, false, model.translation);
        this.gl.uniformMatrix4fv(uRotationMatrixLocation, false, model.rotation);

        if(model.mesh.elementBuffer && model.mesh.elementLength) {
            this.gl.drawElements(this.gl.TRIANGLES, model.mesh.elementLength, this.gl.UNSIGNED_SHORT, 0);
        } else {
            this.gl.drawArrays(this.gl.TRIANGLES, 0, model.mesh.vertexLength);
        }
    }
}