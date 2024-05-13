import { BufferAttribute } from "../mesh/geometry/bufferAttribute";
import { BufferGeometry } from "../mesh/geometry/bufferGeometry";
import { Matrix4 } from "./math/matrix/matrix4";
import { Vector4 } from "./math/vector/vector4";

type AttribSetter = (v: BufferAttribute) => void;

export class WebGL {
    gl: WebGLRenderingContext;
    shaderProgram: WebGLProgram | null;
    uViewMatrixLocation: WebGLUniformLocation | null;
    uColor: WebGLUniformLocation | null;

    vsSource = `
        attribute vec3 position;
    
        uniform mat4 uViewMatrix;
        uniform vec4 uColor;
    
        varying lowp vec4 vColor;
    
        void main(void) {
            gl_Position = uViewMatrix * vec4(position, 1.0);
            vColor = uColor;
        }
    `;

    fsSource = `
        varying lowp vec4 vColor;

        void main(void) {
            gl_FragColor = vColor;
        }
    `;

    attribSetters : {[name: string] : AttribSetter} = {};


    constructor(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) {
        this.gl = gl;
        this.gl.clearColor(0.2, 0.2, 0.9, 1.0); // Clear to black, fully opaque
        this.gl.clearDepth(1.0); // Clear everything
        this.gl.enable(gl.DEPTH_TEST); // Enable depth testing
        this.gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        this.gl.viewport(0, 0, canvas.width, canvas.height);
        
        this.shaderProgram = null;
        this.uViewMatrixLocation = null;
        this.uColor = null;

        this.compileShaders();
        this.getAttribSetters();
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
      
        this.gl.linkProgram(shaderProgram);
        this.shaderProgram = shaderProgram;

        const uViewMatrixLocation = this.gl.getUniformLocation(shaderProgram, 'uViewMatrix');
        if (uViewMatrixLocation == null) {
            throw new Error('Failed to retrieve view matrix location.');
        }
        this.uViewMatrixLocation =  uViewMatrixLocation;
    }

    createAttrib(name: string) : AttribSetter {
        if(this.shaderProgram == null) {
            throw new Error('Failed to retrieve shader program.');
        }
        const gl = this.gl;
        const loc = gl.getAttribLocation(this.shaderProgram, name);
        const buf = gl.createBuffer();
        return (v : BufferAttribute) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.enableVertexAttribArray(loc);
            gl.bufferData(gl.ARRAY_BUFFER, v.data, gl.STATIC_DRAW);
            gl.vertexAttribPointer(loc, v.size, v.dtype, v.normalize, v.stride, v.offset);
        }
    }

    getAttribSetters() {
        const gl = this.gl;
        if(this.shaderProgram == null) {
            throw new Error('Failed to retrieve shader program.');
        }
        const attribSetters: {[name: string] : AttribSetter} = {};
        const numAttribs = gl.getProgramParameter(this.shaderProgram, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < numAttribs; i++) {
            const info = gl.getActiveAttrib(this.shaderProgram, i);
            if (!info) break;
            attribSetters[info.name] = this.createAttrib(info.name);
        }

        this.attribSetters = attribSetters;
    }

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    draw(bufferGeometry : BufferGeometry) {
        const gl = this.gl;        
        gl.useProgram(this.shaderProgram);

        this.attribSetters["position"](bufferGeometry.attributes["position"]);
        
        const identity = new Matrix4().identity();
        const color = new Float32Array(4);
        color[0] = 1;
        color[1] = 1;
        color[2] = 1;
        color[3] = 1;
        gl.uniformMatrix4fv(this.uViewMatrixLocation, false, identity.toColumnMajorArray());
        gl.uniformMatrix4fv(this.uColor, false, color);

        if(bufferGeometry.indices) {
            const eleBuf = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eleBuf);
            gl.bufferData(
                gl.ELEMENT_ARRAY_BUFFER,
                bufferGeometry.indices.data,
                gl.STATIC_DRAW
            );
            this.gl.drawElements(this.gl.TRIANGLES, bufferGeometry.indices.count, this.gl.UNSIGNED_SHORT, bufferGeometry.indices.offset);
        } else {
            this.gl.drawArrays(this.gl.TRIANGLES, 0, bufferGeometry.attributes['position'].count);
        }
    }

    // destroy() {
    //     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    //     this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    //     this.meshes.forEach(mesh => {
    //         this.gl.deleteBuffer(mesh.vertexBuffer);
    //         mesh.elementBuffer && this.gl.deleteBuffer(mesh.elementBuffer);
    //     });
    // }
}