import { ShaderAttribute } from '../../constants/shader';
import { Vector4 } from '../../core/math/vector/vector4';

export default class ShaderMaterial {
  public readonly vertexShaderSource: string;
  public readonly fragmentShaderSource: string;
  private color: Vector4;
  private texture: WebGLTexture | null;
  private useTexture: boolean;
  private attributes: { [name: string]: any } = {};

  constructor(vertexShaderSource: string, fragmentShaderSource: string) {
    this.vertexShaderSource = vertexShaderSource;
    this.fragmentShaderSource = fragmentShaderSource;
    this.color = new Vector4(1, 0, 0, 1);
    this.texture = null;
    this.useTexture = false;
  }

  setColor(r: number, g: number, b: number, a: number = 1) {
    this.color.set([r, g, b, a]);
  }

  setTexture(texture: WebGLTexture) {
    this.texture = texture;
    this.useTexture = true;
  }

  getColor(): Vector4 {
    return this.color;
  }

  getTexture(): WebGLTexture | null {
    return this.texture;
  }

  isUsingTexture(): boolean {
    return this.useTexture;
  }

  setAttribute(name: ShaderAttribute, value: any) {
    this.attributes[name] = value;
  }

  getAttribute(name: ShaderAttribute) {
    return this.attributes[name];
  }
}
