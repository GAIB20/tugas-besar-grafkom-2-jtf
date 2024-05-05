import { Mesh, VertexData } from "./interface";
import { Model } from "./model";


export class WebGL {
    gl: WebGLRenderingContext;
    shaderProgram: WebGLProgram | null;
    uTranslationMatrixLocation: WebGLUniformLocation | null;
    uRotationMatrixLocation: WebGLUniformLocation | null;

    vsSource = `
        attribute vec3 aVertexPosition;
        attribute vec4 aVertexColor;
    
        uniform mat4 uTranslationMatrix;
        uniform mat4 uRotationMatrix;
    
        varying lowp vec4 vColor;
    
        void main(void) {
            gl_Position = uTranslationMatrix * uRotationMatrix * vec4(aVertexPosition, 1.0);
            vColor = aVertexColor != vec4(vec3(0.0), 1.0) ? aVertexColor : vec4(1.0);
        }
    `;

    fsSource = `
        varying lowp vec4 vColor;

        void main(void) {
            gl_FragColor = vColor;
        }
    `;

    meshes = new Array<Mesh>()


    constructor(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) {
        this.gl = gl;
        this.gl.clearColor(0.2, 0.2, 0.9, 1.0); // Clear to black, fully opaque
        this.gl.clearDepth(1.0); // Clear everything
        this.gl.enable(gl.DEPTH_TEST); // Enable depth testing
        this.gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        this.gl.viewport(0, 0, canvas.width, canvas.height);
        
        this.shaderProgram = null;
        this.uRotationMatrixLocation = null;
        this.uTranslationMatrixLocation = null;

        this.compileShaders();
    }

    compileShaders() {
        const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        if (vertexShader == null) {
            throw new Error('Failed to create vertex shader.');
        }

        this.gl.shaderSource(vertexShader, this.vsSource);
        this.gl.compileShader(vertexShader);
        if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the vertex shaders: ' + this.gl.getShaderInfoLog(vertexShader));
            this.gl.deleteShader(vertexShader);
            return;
        }

        const colorShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        if (colorShader == null) {
            throw new Error('Failed to create color shader.');
        }

        this.gl.shaderSource(colorShader, this.fsSource);
        this.gl.compileShader(colorShader);
        if (!this.gl.getShaderParameter(colorShader, this.gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the fragment shaders: ' + this.gl.getShaderInfoLog(colorShader));
            this.gl.deleteShader(colorShader);
            return;
        }

        const shaderProgram = this.gl.createProgram();
        if (shaderProgram == null) {
            throw new Error('Failed to create shader program.');
        }

        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, colorShader);

        // Bind attribute locations before linking the program
        this.gl.bindAttribLocation(shaderProgram, 0, 'aVertexPosition');
        this.gl.bindAttribLocation(shaderProgram, 1, 'aVertexColor');
      
        this.gl.linkProgram(shaderProgram);
        this.shaderProgram = shaderProgram;

        const uTranslationMatrixLocation = this.gl.getUniformLocation(shaderProgram, 'uTranslationMatrix');
        if (uTranslationMatrixLocation == null) {
            throw new Error('Failed to retrieve transalation matrix location.');
        }
        this.uTranslationMatrixLocation =  uTranslationMatrixLocation;

        const uRotationMatrixLocation = this.gl.getUniformLocation(shaderProgram, 'uRotationMatrix');
        if (uRotationMatrixLocation == null) {
            throw new Error('Failed to retrieve rotation matrix location.');
        }
        this.uRotationMatrixLocation =  uRotationMatrixLocation;
    }

    createMesh(vertexData: VertexData, elementData?: Uint16Array) : number {
        const meshID = this.meshes.length;
        const vertexBuffer = this.gl.createBuffer();
        if (vertexBuffer == null) {
            throw new Error('Failed to create vertex buffer.');
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexData.data, this.gl.STATIC_DRAW);

        const mesh : Mesh = {
            vertexBuffer: vertexBuffer,
            vertexLength: vertexData.data.length,
            stride: vertexData.stride,
            posOffset: vertexData.posOffset,
            colOffset: vertexData.colOffset,
        }

        if(elementData) {
            const elementBuffer = this.gl.createBuffer();
            if (elementBuffer == null) {
                throw new Error('Failed to create element buffer.');
            }
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, elementData, this.gl.STATIC_DRAW);

            mesh.elementBuffer = elementBuffer;
            mesh.elementLength = elementData.length;
        }

        this.meshes.push(mesh);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);


        return meshID;
    }

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    draw(model : Model) {
        
        this.gl.useProgram(this.shaderProgram);
        const mesh = this.meshes.at(model.meshID);
        if(!mesh) throw new Error(`mesh with ID ${model.meshID} not found.`);
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.vertexBuffer);
        mesh.elementBuffer && this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.elementBuffer);
        
        //handle POS atrib
        this.gl.vertexAttribPointer(
            0,
            3,
            this.gl.FLOAT,
            false,
            mesh.stride * Float32Array.BYTES_PER_ELEMENT,
            mesh.posOffset * Float32Array.BYTES_PER_ELEMENT,
        );
        this.gl.enableVertexAttribArray(0);


        //handle COL atrib
        if(mesh.colOffset) {
            this.gl.vertexAttribPointer(
                1,
                4,
                this.gl.FLOAT,
                false,
                mesh.stride * Float32Array.BYTES_PER_ELEMENT,
                mesh.colOffset * Float32Array.BYTES_PER_ELEMENT,
            );
            this.gl.enableVertexAttribArray(1);
        }
        
        this.gl.uniformMatrix4fv(this.uTranslationMatrixLocation, false, model.translation);
        this.gl.uniformMatrix4fv(this.uRotationMatrixLocation, false, model.rotation);

        if(mesh.elementBuffer && mesh.elementLength) {
            this.gl.drawElements(this.gl.TRIANGLES, mesh.elementLength, this.gl.UNSIGNED_SHORT, 0);
        } else {
            this.gl.drawArrays(this.gl.TRIANGLES, 0, mesh.vertexLength);
        }

        this.gl.disableVertexAttribArray(0);
        this.gl.disableVertexAttribArray(1);
    }

    destroy() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.meshes.forEach(mesh => {
            this.gl.deleteBuffer(mesh.vertexBuffer);
            mesh.elementBuffer && this.gl.deleteBuffer(mesh.elementBuffer);
        });
    }
}