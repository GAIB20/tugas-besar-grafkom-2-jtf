import { ShaderAttribute } from '../../constants/shader';
import { Vector3 } from '../../core/math/vector/vector3';
import { Vector4 } from '../../core/math/vector/vector4';

export default class ShaderMaterial {
  public readonly vertexShaderSource: string;
  public readonly fragmentShaderSource: string;
  private color: Vector3;
  private texture: WebGLTexture | null;
  private useTexture: boolean;
  private attributes: { [name: string]: any } = {};

  constructor(vertexShaderSource: string, fragmentShaderSource: string) {
    this.vertexShaderSource = vertexShaderSource;
    this.fragmentShaderSource = fragmentShaderSource;
    this.color = new Vector3(1, 0, 0);
    this.texture = null;
    this.useTexture = false;
  }

  setColor(r: number, g: number, b: number) {
    this.color.set([r / 255, g / 255, b / 255]);
  }

  setTexture(texture: WebGLTexture) {
    this.texture = texture;
    this.useTexture = true;
  }

  getColor(): Vector3 {
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
