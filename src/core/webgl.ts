import { Camera } from '../camera/Camera';
import { ShaderAttribute } from '../constants/shader';
import { BufferAttribute } from '../mesh/geometry/bufferAttribute';
import ShaderMaterial from '../mesh/material/ShaderMaterial';
import { Mesh } from './mesh';
import { Object3D } from './object3D';

type AttribSetter = (v: BufferAttribute) => void;

export class WebGL {
  gl: WebGLRenderingContext;
  shaderProgram: WebGLProgram | null;
  uViewMatrixLocation: WebGLUniformLocation | null;
  uColor: WebGLUniformLocation | null;

  uUseTexture: WebGLUniformLocation | null;
  attribSetters: { [name: string]: AttribSetter } = {};

  shader: ShaderMaterial;

  constructor(canvas: HTMLCanvasElement, shader: ShaderMaterial) {
    const gl = canvas.getContext('webgl');
    if (!gl) throw new Error('err init gl');

    this.gl = gl;
    this.gl.viewport(0, 0, canvas.width, canvas.height);

    this.shaderProgram = null;
    this.uViewMatrixLocation = null;
    this.uColor = null;

    this.uUseTexture = null;

    this.shader = shader;
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

  draw(node: Object3D, camera: Camera) {
    this.gl.enable(this.gl.DEPTH_TEST);
    if (node instanceof Mesh) {
      this.shader = node.material;
      this.createShaderProgram();
      this.gl.useProgram(this.shaderProgram);

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

      // Bind the geometry
      node.geometry.calculateNormals();
      const normalBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array(node.geometry.getNormal().data),
        this.gl.STATIC_DRAW
      );

      const normalAttributeLocation = this.gl.getAttribLocation(
        this.shaderProgram,
        ShaderAttribute.Normal
      );

      this.gl.enableVertexAttribArray(normalAttributeLocation);
      this.gl.vertexAttribPointer(
        normalAttributeLocation,
        node.geometry.getNormal().size,
        this.gl.FLOAT,
        false,
        0,
        0
      );

      // Set the uniforms
      const viewProjectionMatrix = camera.viewProjectionMatrix.flatten();
      const worldMatrix = node.worldMatrix.flatten();

      const diffColor = this.shader.getDiffuseColor().coords;
      const specColor = this.shader.getSpecularColor().coords;

      this.gl.uniformMatrix4fv(
        this.gl.getUniformLocation(
          this.shaderProgram,
          ShaderAttribute.WorldMatrix
        ),
        false,
        worldMatrix
      );
      this.gl.uniformMatrix4fv(
        this.gl.getUniformLocation(
          this.shaderProgram,
          ShaderAttribute.ViewProjectionMatrix
        ),
        false,
        viewProjectionMatrix
      );
      this.gl.uniform3fv(
        this.gl.getUniformLocation(
          this.shaderProgram,
          ShaderAttribute.DiffuseColor
        ),
        diffColor
      );
      this.gl.uniform3fv(
        this.gl.getUniformLocation(
          this.shaderProgram,
          ShaderAttribute.SpecularColor
        ),
        specColor
      );
      this.gl.uniform3fv(
        this.gl.getUniformLocation(
          this.shaderProgram,
          ShaderAttribute.ViewPosition
        ),
        [camera.position.x, camera.position.y, camera.position.z]
      );
      this.gl.uniform1f(
        this.gl.getUniformLocation(
          this.shaderProgram,
          ShaderAttribute.Brightness
        ),
        this.shader.getBrightness()
      );
      this.gl.uniform3fv(
        this.gl.getUniformLocation(
          this.shaderProgram,
          ShaderAttribute.DirectionLight
        ),
        this.shader.getDirectionLight().coords
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

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}
