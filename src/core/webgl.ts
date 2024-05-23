import { Camera } from '../camera/Camera';
import { ShaderAttribute } from '../constants/shader';
import { BufferAttribute } from '../mesh/geometry/bufferAttribute';
import ShaderMaterial from '../mesh/material/shaderMaterial';
import { Matrix4 } from './math/matrix/matrix4';
import { Vector4 } from './math/vector/vector4';
import { Mesh } from './mesh';
import { Object3D } from './object3D';

type AttribSetter = (v: BufferAttribute) => void;
type Texture = {texture: WebGLTexture | null, value: number, isDirty: boolean};

export class WebGL {
  gl: WebGLRenderingContext;
  shaderProgram: WebGLProgram | null;
  uViewMatrixLocation: WebGLUniformLocation | null;
  uColor: WebGLUniformLocation | null;
  normal: HTMLImageElement;
  diffuse: HTMLImageElement;
  specular: HTMLImageElement;
  parallax: HTMLImageElement;

  uUseTexture: WebGLUniformLocation | null;
  attribSetters: { [name: string]: AttribSetter } = {};

  shader: ShaderMaterial;

  positionBuffers: Map<string, WebGLBuffer> = new Map();
  normalBuffers: Map<string, WebGLBuffer> = new Map();
  tangentBuffers: Map<string, WebGLBuffer> = new Map();

  diffuseTexture: Texture | null = null;
  specularTexture: Texture | null = null;
  normalTexture: Texture | null = null;
  parallaxTexture: Texture | null = null;

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

    this.normal = new Image();
    this.normalTexture = {texture: this.gl.createTexture(), value: 0.0, isDirty: true};

    this.diffuse = new Image();
    this.diffuseTexture = {texture: this.gl.createTexture(), value: 0.0, isDirty: true};

    this.specular = new Image();
    this.specularTexture = {texture: this.gl.createTexture(), value: 0.0, isDirty: true};

    this.parallax = new Image();
    this.parallaxTexture = {texture: this.gl.createTexture(), value: 0.0, isDirty: true};

    this.createShaderProgram();
  }

  createTextureDiffuse(image: string) {
    this.diffuse.src = image;
    this.diffuse.onload = () => {
      this.diffuseTexture!.isDirty = true;
    }
  }

  enableTextureDiffuse(value: number) {
    this.diffuseTexture!.value = value;
  }

  disableTextureDiffuse() {
    this.diffuseTexture!.value = 0.0;
  }

  createTextureSpecular(image: string) {
    this.specular.src = image;
    this.specular.onload = () => {
      this.specularTexture!.isDirty = true;
    }
  }

  enableTextureSpecular(value: number) {
    this.specularTexture!.value = value;
  }

  disableTextureSpecular() {
    this.specularTexture!.value = 0.0;
  }

  createTextureNormal(image: string) {
    this.normal.src = image;
    this.normal.onload = () => {
      this.normalTexture!.isDirty = true;
    }
  }

  disableTextureNormal() {
    this.normalTexture!.value = 0.0;
  }

  enableTextureNormal(value: number) {
    this.normalTexture!.value = value;
  }

  createTextureParallax(image: string) {
    this.parallax.src = image;
    this.parallax.onload = () => {
      this.parallaxTexture!.isDirty = true;
    }
  }

  enableTextureParallax(value: number) {
    this.parallaxTexture!.value = value;
  }

  disableTextureParallax() {
    this.parallaxTexture!.value = 0.0;
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
      if (this.shader.constructor !== node.material.constructor) {
        this.shader = node.material;
        this.createShaderProgram();
      }
      this.gl.useProgram(this.shaderProgram);

      // Bind the geometry
      if (!this.positionBuffers.has(node.name)) {
        const buffer = this.gl.createBuffer();
        if (buffer) {
          this.positionBuffers.set(node.name, buffer);
        } else {
          console.error('Failed to create buffer');
          return;
        }
      }
      const positionBuffer = this.positionBuffers.get(node.name);
      if (positionBuffer) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(
          this.gl.ARRAY_BUFFER,
          new Float32Array(node.geometry.getPosition().data),
          this.gl.STATIC_DRAW
        );
      }

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
      if (!this.normalBuffers.has(node.name)) {
        const buffer = this.gl.createBuffer();
        if (buffer) {
          this.normalBuffers.set(node.name, buffer);
        } else {
          console.error('Failed to create buffer');
          return;
        }
      }
      const normalBuffer = this.normalBuffers.get(node.name);
      if (normalBuffer) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
        this.gl.bufferData(
          this.gl.ARRAY_BUFFER,
          new Float32Array(node.geometry.getNormal().data),
          this.gl.STATIC_DRAW
        );
      }

      const normalAttributeLocation = this.gl.getAttribLocation(
        this.shaderProgram,
        ShaderAttribute.Normal
      );

      if (normalAttributeLocation != -1) {
        this.gl.enableVertexAttribArray(normalAttributeLocation);
        this.gl.vertexAttribPointer(
          normalAttributeLocation,
          node.geometry.getNormal().size,
          this.gl.FLOAT,
          false,
          0,
          0
        );
      }

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
        camera.position.rotate(camera.orbitRotation.x, camera.orbitRotation.y, camera.orbitRotation.z).coords
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

      const render = (image: any, texture: Texture | null) => {
        if (!this.tangentBuffers.has(node.name)) {
          const buffer = this.gl.createBuffer();
          if (buffer) {
            this.tangentBuffers.set(node.name, buffer);
          } else {
            console.error('Failed to create buffer');
            return;
          }
        }
        const tangentBuffer = this.tangentBuffers.get(node.name);
        if (tangentBuffer) {
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, tangentBuffer);
          this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(node.geometry.getTangent().data),
            this.gl.STATIC_DRAW
          );
        }

        const tangentAttributeLocation = this.gl.getAttribLocation(
          this.shaderProgram!,
          ShaderAttribute.Tangent
        );

        if (tangentAttributeLocation != -1) {
          this.gl.enableVertexAttribArray(tangentAttributeLocation);
          this.gl.vertexAttribPointer(
            tangentAttributeLocation,
            node.geometry.getTangent().size,
            this.gl.FLOAT,
            false,
            0,
            0
          );
        }
        // console.log(node.geometry.getTangent().data);

        const textBuf = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textBuf);
        const textAtLoc = this.gl.getAttribLocation(
          this.shaderProgram!,
          ShaderAttribute.TexCoord
        );
        this.gl.bufferData(
          this.gl.ARRAY_BUFFER,
          new Float32Array(node.geometry.getUV().data),
          this.gl.STATIC_DRAW
        );
        this.gl.enableVertexAttribArray(textAtLoc);
        this.gl.vertexAttribPointer(textAtLoc, 2, this.gl.FLOAT, false, 0, 0);

        if(!texture?.texture) return;
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture?.texture);

        this.gl.texParameteri(
          this.gl.TEXTURE_2D,
          this.gl.TEXTURE_WRAP_S,
          this.gl.CLAMP_TO_EDGE
        );
        this.gl.texParameteri(
          this.gl.TEXTURE_2D,
          this.gl.TEXTURE_WRAP_T,
          this.gl.CLAMP_TO_EDGE
        );
        this.gl.texParameteri(
          this.gl.TEXTURE_2D,
          this.gl.TEXTURE_MIN_FILTER,
          this.gl.NEAREST
        );
        this.gl.texParameteri(
          this.gl.TEXTURE_2D,
          this.gl.TEXTURE_MAG_FILTER,
          this.gl.NEAREST
        );

        if(texture?.isDirty) {
          this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            image
          );
          texture.isDirty = false;
        }
      };

      const gl = this.gl;
      const diffLoc = this.gl.getUniformLocation(
        this.shaderProgram,
        ShaderAttribute.UseDiffuseTexture
      );
      const specLoc = this.gl.getUniformLocation(
        this.shaderProgram,
        ShaderAttribute.UseSpecularTexture
      );
      const normLoc = this.gl.getUniformLocation(
        this.shaderProgram,
        ShaderAttribute.UseNormalTexture
      );
      const paraLoc = this.gl.getUniformLocation(
        this.shaderProgram,
        ShaderAttribute.UseParallaxTexture
      );

      
      if (!this.diffuseTexture?.texture) {
        this.diffuseTexture = {texture: this.gl.createTexture(), value: 0.0, isDirty: true};
      }
      gl.activeTexture(gl.TEXTURE0);
      render(this.diffuse, this.diffuseTexture);
      gl.uniform1f(diffLoc, this.diffuseTexture.value);
      gl.uniform1i(
        gl.getUniformLocation(
          this.shaderProgram,
          ShaderAttribute.DiffuseTexture
        ),
        0
      );

      
      if (!this.specularTexture?.texture) {
        this.specularTexture = {texture: this.gl.createTexture(), value: 0.0, isDirty: true};
      }
      gl.activeTexture(gl.TEXTURE1);
      render(this.specular, this.specularTexture);
      gl.uniform1f(specLoc, this.specularTexture.value);
      gl.uniform1i(
        gl.getUniformLocation(
          this.shaderProgram,
          ShaderAttribute.SpecularTexture
        ),
        1
      );

      
      if (!this.normalTexture?.texture) {
        this.normalTexture = {texture: this.gl.createTexture(), value: 0.0, isDirty: true};
      }
      gl.activeTexture(gl.TEXTURE2);
      render(this.normal, this.normalTexture);
      gl.uniform1f(normLoc, this.normalTexture.value);
      gl.uniform1i(
        gl.getUniformLocation(
          this.shaderProgram,
          ShaderAttribute.NormalTexture
        ),
        2
      );

      
      if (!this.parallaxTexture?.texture) {
        this.parallaxTexture = {texture: this.gl.createTexture(), value: 0.0, isDirty: true};
      }
      gl.activeTexture(gl.TEXTURE3);
      render(this.parallax, this.parallaxTexture);
      gl.uniform1f(paraLoc, this.parallaxTexture.value);
      gl.uniform1i(
        gl.getUniformLocation(
          this.shaderProgram,
          ShaderAttribute.ParallaxTexture
        ),
        3
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

  // draw(node: Object3D, camera: Camera) {
  //   this.gl.enable(this.gl.DEPTH_TEST);
  //   if (node instanceof Mesh) {
  //     if (this.shader.constructor !== node.material.constructor) {
  //       this.shader = node.material;
  //       this.createShaderProgram();
  //     }
  //     this.gl.useProgram(this.shaderProgram);

  //     // Bind the geometry
  //     const positionBuffer = this.gl.createBuffer();
  //     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
  //     this.gl.bufferData(
  //       this.gl.ARRAY_BUFFER,
  //       new Float32Array(node.geometry.getPosition().data),
  //       this.gl.STATIC_DRAW
  //     );

  //     // Tell WebGL how to interpret the vertex data
  //     if (!this.shaderProgram) return;
  //     const positionAttributeLocation = this.gl.getAttribLocation(
  //       this.shaderProgram,
  //       ShaderAttribute.Position
  //     );

  //     this.gl.enableVertexAttribArray(positionAttributeLocation);
  //     this.gl.vertexAttribPointer(
  //       positionAttributeLocation,
  //       node.geometry.getPosition().size,
  //       this.gl.FLOAT,
  //       false,
  //       0,
  //       0
  //     );

  //     // Bind the geometry
  //     node.geometry.calculateNormals();
  //     const normalBuffer = this.gl.createBuffer();
  //     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
  //     this.gl.bufferData(
  //       this.gl.ARRAY_BUFFER,
  //       new Float32Array(node.geometry.getNormal().data),
  //       this.gl.STATIC_DRAW
  //     );

  //     const normalAttributeLocation = this.gl.getAttribLocation(
  //       this.shaderProgram,
  //       ShaderAttribute.Normal
  //     );

  //     if (normalAttributeLocation != -1) {
  //       this.gl.enableVertexAttribArray(normalAttributeLocation);
  //       this.gl.vertexAttribPointer(
  //         normalAttributeLocation,
  //         node.geometry.getNormal().size,
  //         this.gl.FLOAT,
  //         false,
  //         0,
  //         0
  //       );
  //     }

  //     // Set the uniforms
  //     const viewProjectionMatrix = camera.viewProjectionMatrix.flatten();
  //     const worldMatrix = node.worldMatrix.flatten();

  //     const diffColor = this.shader.getDiffuseColor().coords;
  //     const specColor = this.shader.getSpecularColor().coords;

  //     this.gl.uniformMatrix4fv(
  //       this.gl.getUniformLocation(
  //         this.shaderProgram,
  //         ShaderAttribute.WorldMatrix
  //       ),
  //       false,
  //       worldMatrix
  //     );
  //     this.gl.uniformMatrix4fv(
  //       this.gl.getUniformLocation(
  //         this.shaderProgram,
  //         ShaderAttribute.ViewProjectionMatrix
  //       ),
  //       false,
  //       viewProjectionMatrix
  //     );
  //     this.gl.uniform3fv(
  //       this.gl.getUniformLocation(
  //         this.shaderProgram,
  //         ShaderAttribute.DiffuseColor
  //       ),
  //       diffColor
  //     );
  //     this.gl.uniform3fv(
  //       this.gl.getUniformLocation(
  //         this.shaderProgram,
  //         ShaderAttribute.SpecularColor
  //       ),
  //       specColor
  //     );
  //     this.gl.uniform3fv(
  //       this.gl.getUniformLocation(
  //         this.shaderProgram,
  //         ShaderAttribute.ViewPosition
  //       ),
  //       [camera.position.x, camera.position.y, camera.position.z]
  //     );
  //     this.gl.uniform1f(
  //       this.gl.getUniformLocation(
  //         this.shaderProgram,
  //         ShaderAttribute.Brightness
  //       ),
  //       this.shader.getBrightness()
  //     );
  //     this.gl.uniform3fv(
  //       this.gl.getUniformLocation(
  //         this.shaderProgram,
  //         ShaderAttribute.DirectionLight
  //       ),
  //       this.shader.getDirectionLight().coords
  //     );

  //     const render = (normal: any) => {
  //       const textureCoordinates = [
  //         // Front
  //         0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0,
  //         // Back
  //         0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0,
  //         // Top
  //         0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0,
  //         // Bottom
  //         0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0,
  //         // Right
  //         0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0,
  //         // Left
  //         0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0
  //       ];

  //       const textBuf = this.gl.createBuffer();
  //       this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textBuf);
  //       const textAtLoc = this.gl.getAttribLocation(
  //         this.shaderProgram!,
  //         ShaderAttribute.TexCoord
  //       );
  //       this.gl.bufferData(
  //         this.gl.ARRAY_BUFFER,
  //         new Float32Array(textureCoordinates),
  //         this.gl.STATIC_DRAW
  //       );
  //       this.gl.enableVertexAttribArray(textAtLoc);
  //       this.gl.vertexAttribPointer(textAtLoc, 2, this.gl.FLOAT, false, 0, 0);

  //       const texture = this.gl.createTexture();
  //       this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

  //       this.gl.texParameteri(
  //         this.gl.TEXTURE_2D,
  //         this.gl.TEXTURE_WRAP_S,
  //         this.gl.CLAMP_TO_EDGE
  //       );
  //       this.gl.texParameteri(
  //         this.gl.TEXTURE_2D,
  //         this.gl.TEXTURE_WRAP_T,
  //         this.gl.CLAMP_TO_EDGE
  //       );
  //       this.gl.texParameteri(
  //         this.gl.TEXTURE_2D,
  //         this.gl.TEXTURE_MIN_FILTER,
  //         this.gl.NEAREST
  //       );
  //       this.gl.texParameteri(
  //         this.gl.TEXTURE_2D,
  //         this.gl.TEXTURE_MAG_FILTER,
  //         this.gl.NEAREST
  //       );

  //       this.gl.texImage2D(
  //         this.gl.TEXTURE_2D,
  //         0,
  //         this.gl.RGBA,
  //         this.gl.RGBA,
  //         this.gl.UNSIGNED_BYTE,
  //         normal
  //       );
  //     };

  //     const gl = this.gl;
  //     const boolLoc = this.gl.getUniformLocation(
  //       this.shaderProgram,
  //       ShaderAttribute.UseDiffuseTexture
  //     );
  //     const specLoc = this.gl.getUniformLocation(
  //       this.shaderProgram,
  //       ShaderAttribute.UseSpecularTexture
  //     );

  //     gl.uniform1f(boolLoc, 1.0);
  //     gl.activeTexture(gl.TEXTURE0);
  //     render(this.diffuse);
  //     gl.uniform1i(
  //       gl.getUniformLocation(
  //         this.shaderProgram,
  //         ShaderAttribute.DiffuseTexture
  //       ),
  //       0
  //     );

  //     gl.uniform1f(specLoc, 1.0);

  //     gl.activeTexture(gl.TEXTURE1);
  //     render(this.specular);
  //     // Draw the geometry
  //     this.gl.drawArrays(
  //       this.gl.TRIANGLES,
  //       0,
  //       node.geometry.getPosition().count
  //     );
  //     gl.uniform1i(
  //       gl.getUniformLocation(
  //         this.shaderProgram,
  //         ShaderAttribute.SpecularTexture
  //       ),
  //       1
  //     );
  //   }

  //   node.children.forEach((child: Object3D) => {
  //     this.draw(child, camera);
  //   });
  // }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}
