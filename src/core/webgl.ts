import { Camera } from '../camera/Camera';
import { ShaderAttribute } from '../constants/shader';
import { BufferAttribute } from '../mesh/geometry/bufferAttribute';
import { BufferGeometry } from '../mesh/geometry/bufferGeometry';
import ShaderMaterial from '../mesh/material/ShaderMaterial';
import { Matrix4 } from './math/matrix/matrix4';
import { Vector4 } from './math/vector/vector4';
import { Mesh } from './mesh';
import { Object3D } from './object3D';
import { Scene } from './scene';
import { StateManager } from './state';

type AttribSetter = (v: BufferAttribute) => void;

export class WebGL {
  state: StateManager;

  gl: WebGLRenderingContext;
  shaderProgram: WebGLProgram | null;
  uViewMatrixLocation: WebGLUniformLocation | null;
  uColor: WebGLUniformLocation | null;

  uUseTexture: WebGLUniformLocation | null;
  attribSetters: { [name: string]: AttribSetter } = {};

  shader: ShaderMaterial;

  constructor(canvas: HTMLCanvasElement) {
    this.state = StateManager.getInstance();

    const gl = canvas.getContext('webgl');
    if (!gl) throw new Error('err init gl');

    this.gl = gl;
    // this.gl.clearColor(0.8, 0.8, 0.8, 1.0); // Clear to black, fully opaque
    // this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    // this.gl.clearDepth(1.0); // Clear everything
    // this.gl.enable(gl.DEPTH_TEST); // Enable depth testing
    // this.gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    this.gl.viewport(0, 0, canvas.width, canvas.height);

    console.log('canvas size: ', canvas.width, canvas.height);

    this.shaderProgram = null;
    this.uViewMatrixLocation = null;
    this.uColor = null;

    this.uUseTexture = null;

    this.shader = this.state.shader;

    // this.compileShaders();
    // this.getAttribSetters();

    this.createShaderProgram();
  }

  setShader() {
    this.shader = this.state.shader;
    this.createShaderProgram();
  }

  createShaderProgram() {
    const vertexShaderSource = this.shader.vertexShaderSource;
    const fragmentShaderSource = this.shader.fragmentShaderSource;

    // Create the vertex shader
    const vertexShader = this.createShader(
      this.gl.VERTEX_SHADER,
      vertexShaderSource
    );
    if (!vertexShader) {
      console.error('Unable to create vertex shader');
      return;
    }

    // Create the fragment shader
    const fragmentShader = this.createShader(
      this.gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    if (!fragmentShader) {
      console.error('Unable to create fragment shader');
      return;
    }

    // Create the shader program
    const shaderProgram = this.gl.createProgram();
    if (!shaderProgram) {
      console.error('Unable to create shader program');
      return;
    }
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    // Check if the shader program linked successfully
    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      console.error(
        'An error occurred linking the shader program:',
        this.gl.getProgramInfoLog(shaderProgram)
      );
      return;
    }

    this.shaderProgram = shaderProgram;
  }

  createShader(type: number, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);
    if (!shader) {
      console.error('Unable to create shader');
      return null;
    }
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.error(
      'An error occurred compiling the shaders: ',
      this.gl.getShaderInfoLog(shader)
    );
    this.gl.deleteShader(shader);
    return null;
  }

  //   bindAttributesAndUniforms() {
  //     // Use the shader program
  //     this.gl.useProgram(this.shaderProgram);

  //     if (!this.shaderProgram) return;

  //     // Bind the attributes
  //     const positionAttributeLocation = this.gl.getAttribLocation(
  //       this.shaderProgram,
  //       ShaderAttribute.Position
  //     );
  //     this.gl.enableVertexAttribArray(positionAttributeLocation);
  //     // Assuming you have a buffer with the position data
  //     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
  //     this.gl.vertexAttribPointer(
  //       positionAttributeLocation,
  //       3,
  //       this.gl.FLOAT,
  //       false,
  //       0,
  //       0
  //     );

  //     // Bind the uniforms
  //     const modelViewMatrixUniform = this.gl.getUniformLocation(
  //       this.shaderProgram,
  //       ShaderAttribute.ModelViewMatrix
  //     );
  //     const projectionMatrixUniform = this.gl.getUniformLocation(
  //       this.shaderProgram,
  //       ShaderAttribute.ProjectionMatrix
  //     );
  //     const colorUniform = this.gl.getUniformLocation(
  //       this.shaderProgram,
  //       ShaderAttribute.DiffuseColor
  //     );

  //     // Assuming you have functions to compute the model-view and projection matrices
  //     const modelViewMatrix = this.computeModelViewMatrix();
  //     const projectionMatrix = this.computeProjectionMatrix();
  //     this.gl.uniformMatrix4fv(modelViewMatrixUniform, false, modelViewMatrix);
  //     this.gl.uniformMatrix4fv(projectionMatrixUniform, false, projectionMatrix);

  //     // Assuming the color is a vec4
  //     const color = [1.0, 0.0, 0.0, 1.0]; // red color
  //     this.gl.uniform4fv(colorUniform, color);
  //   }

  draw(node: Object3D, camera: Camera) {
    console.log(node);

    // Use the shader program
    this.gl.useProgram(this.shaderProgram);

    this.gl.clearColor(0.85, 0.85, 0.85, 1); // set grey first
    this.clear();

    if (node instanceof Mesh) {
      console.log(new Float32Array(node.geometry.getPosition().data));
      // Bind the geometry
      const positionBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array(node.geometry.getPosition().data),
        this.gl.STATIC_DRAW
      );

      // Tell WebGL how to interpret the vertex data
      if (!this.shaderProgram) return;
      const positionAttributeLocation = this.gl.getAttribLocation(
        this.shaderProgram,
        ShaderAttribute.Position
      );
      this.gl.enableVertexAttribArray(positionAttributeLocation);
      this.gl.vertexAttribPointer(
        positionAttributeLocation,
        node.geometry.getPosition().size,
        this.gl.FLOAT,
        false,
        0,
        0
      );

      // Set the uniforms
      const modelViewMatrix = camera.viewProjectionMatrix.toColumnMajorArray();
      const projectionMatrix = node.worldMatrix.toColumnMajorArray();

      const color = [1, 0, 0, 1]; // red color

      // const color = this.shader.getColor().coords;

      console.log(color);

      this.gl.uniformMatrix4fv(
        this.gl.getUniformLocation(
          this.shaderProgram,
          ShaderAttribute.ModelViewMatrix
        ),
        false,
        modelViewMatrix
      );
      this.gl.uniformMatrix4fv(
        this.gl.getUniformLocation(
          this.shaderProgram,
          ShaderAttribute.ProjectionMatrix
        ),
        false,
        projectionMatrix
      );
      this.gl.uniform4fv(
        this.gl.getUniformLocation(
          this.shaderProgram,
          ShaderAttribute.DiffuseColor
        ),
        color
      );

      // Draw the geometry
      this.gl.drawArrays(
        this.gl.TRIANGLES,
        0,
        node.geometry.getPosition().count
      );
    }

    node.children.forEach((child: Object3D) => {
      this.draw(child, camera);
    });
  }

  //   //   compileShaders() {
  //   //     const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
  //   //     if (vertexShader == null) {
  //   //       throw new Error('Failed to create vertex shader.');
  //   //     }

  //   //     this.gl.shaderSource(vertexShader, this.vsSource);
  //   //     this.gl.compileShader(vertexShader);
  //   //     if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
  //   //       console.error(
  //   //         'An error occurred compiling the vertex shaders: ' +
  //   //           this.gl.getShaderInfoLog(vertexShader)
  //   //       );
  //   //       this.gl.deleteShader(vertexShader);
  //   //       return;
  //   //     }

  //   //     const colorShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
  //   //     if (colorShader == null) {
  //   //       throw new Error('Failed to create color shader.');
  //   //     }

  //   //     this.gl.shaderSource(colorShader, this.fsSource);
  //   //     this.gl.compileShader(colorShader);
  //   //     if (!this.gl.getShaderParameter(colorShader, this.gl.COMPILE_STATUS)) {
  //   //       console.error(
  //   //         'An error occurred compiling the fragment shaders: ' +
  //   //           this.gl.getShaderInfoLog(colorShader)
  //   //       );
  //   //       this.gl.deleteShader(colorShader);
  //   //       return;
  //   //     }

  //   //     const shaderProgram = this.gl.createProgram();
  //   //     if (shaderProgram == null) {
  //   //       throw new Error('Failed to create shader program.');
  //   //     }

  //   //     this.gl.attachShader(shaderProgram, vertexShader);
  //   //     this.gl.attachShader(shaderProgram, colorShader);

  //   //     // Bind attribute locations before linking the program
  //   //     this.gl.bindAttribLocation(shaderProgram, 0, 'a_position');

  //   //     this.gl.linkProgram(shaderProgram);
  //   //     this.shaderProgram = shaderProgram;

  //   //     const uViewMatrixLocation = this.gl.getUniformLocation(
  //   //       shaderProgram,
  //   //       'u_modelViewMatrix'
  //   //     );
  //   //     if (uViewMatrixLocation == null) {
  //   //       throw new Error('Failed to retrieve view matrix location.');
  //   //     }
  //   //     this.uViewMatrixLocation = uViewMatrixLocation;

  //   //     const uUseTextureLocation = this.gl.getUniformLocation(
  //   //       shaderProgram,
  //   //       'u_useTexture'
  //   //     );
  //   //     if (uUseTextureLocation == null) {
  //   //       throw new Error('Failed to retrieve use texture flag location.');
  //   //     }
  //   //     this.uUseTexture = uUseTextureLocation;
  //   //   }

  //   createAttrib(name: string): AttribSetter {
  //     if (this.shaderProgram == null) {
  //       throw new Error('Failed to retrieve shader program.');
  //     }
  //     const gl = this.gl;
  //     const loc = gl.getAttribLocation(this.shaderProgram, name);
  //     const buf = gl.createBuffer();
  //     return (v: BufferAttribute) => {
  //       gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  //       gl.enableVertexAttribArray(loc);
  //       gl.bufferData(gl.ARRAY_BUFFER, v.data, gl.STATIC_DRAW);
  //       gl.vertexAttribPointer(
  //         loc,
  //         v.size,
  //         v.dtype,
  //         v.normalize,
  //         v.stride * v.data.BYTES_PER_ELEMENT,
  //         v.offset
  //       );
  //     };
  //   }

  //   attachAttribSetter(attribBuffer: BufferAttribute, name: string) {
  //     if (this.shaderProgram == null) {
  //       throw new Error('Failed to retrieve shader program.');
  //     }
  //     const gl = this.gl;
  //     const loc = gl.getAttribLocation(this.shaderProgram, name);

  //     console.log('loc ', loc);
  //     const buf = gl.createBuffer();
  //     const attribSetter = (v: BufferAttribute) => {
  //       gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  //       gl.enableVertexAttribArray(loc);
  //       if (v.isDirty) {
  //         console.log('a');
  //         gl.bufferData(gl.ARRAY_BUFFER, v.data, gl.STATIC_DRAW);
  //         v.consume();
  //       }
  //       gl.vertexAttribPointer(
  //         loc,
  //         v.size,
  //         v.dtype,
  //         v.normalize,
  //         v.stride * v.data.BYTES_PER_ELEMENT,
  //         v.offset
  //       );
  //     };

  //     attribBuffer.attribSetter = attribSetter;
  //   }

  //   getAttribSetters() {
  //     const gl = this.gl;
  //     if (this.shaderProgram == null) {
  //       throw new Error('Failed to retrieve shader program.');
  //     }
  //     const attribSetters: { [name: string]: AttribSetter } = {};
  //     const numAttribs = gl.getProgramParameter(
  //       this.shaderProgram,
  //       gl.ACTIVE_ATTRIBUTES
  //     );
  //     for (let i = 0; i < numAttribs; i++) {
  //       const info = gl.getActiveAttrib(this.shaderProgram, i);
  //       if (!info) break;
  //       attribSetters[info.name] = this.createAttrib(info.name);
  //     }

  //     this.attribSetters = attribSetters;
  //   }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  //   render(scene: Scene) {}

  //   draw(mesh: Mesh) {}

  // draw
  // const gl = this.gl;
  // gl.useProgram(this.shaderProgram);
  // // this.attribSetters["position"](bufferGeometry.attributes["position"]);
  // bufferGeometry.attributes['position'].attribSetter(
  //   bufferGeometry.attributes['position']
  // );
  // const identity = new Matrix4().identity();
  // const color = new Float32Array([1, 0, 0, 1]); // Set the color to red
  // gl.uniform4fv(this.uColor, color);
  // gl.uniform1i(this.uUseTexture, 0); // Indicate that no texture is being used
  // if (bufferGeometry.indices) {
  //   const eleBuf = gl.createBuffer();
  //   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eleBuf);
  //   gl.bufferData(
  //     gl.ELEMENT_ARRAY_BUFFER,
  //     bufferGeometry.indices.data,
  //     gl.STATIC_DRAW
  //   );
  //   this.gl.drawElements(
  //     this.gl.TRIANGLES,
  //     bufferGeometry.indices.count,
  //     this.gl.UNSIGNED_SHORT,
  //     bufferGeometry.indices.offset
  //   );
  // } else {
  //   this.gl.drawArrays(
  //     this.gl.TRIANGLES,
  //     0,
  //     bufferGeometry.attributes['position'].count
  //   );
  // }

  // destroy() {
  //     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  //     this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
  //     this.meshes.forEach(mesh => {
  //         this.gl.deleteBuffer(mesh.vertexBuffer);
  //         mesh.elementBuffer && this.gl.deleteBuffer(mesh.elementBuffer);
  //     });
  // }
}
