import { ShaderAttribute } from '../../constants/shader';
import { Vector3 } from '../../core/math/vector/vector3';
import { Vector4 } from '../../core/math/vector/vector4';

export default class ShaderMaterial {
  public readonly vertexShaderSource: string;
  public readonly fragmentShaderSource: string;
  private diffuseColor: Vector3;
  private specularColor: Vector3;
  directionLight: Vector3;

  private texture: WebGLTexture | null;
  private useTexture: boolean;
  private attributes: { [name: string]: any } = {};
  private brightness: number;

  constructor(vertexShaderSource: string, fragmentShaderSource: string) {
    this.vertexShaderSource = vertexShaderSource;
    this.fragmentShaderSource = fragmentShaderSource;
    this.diffuseColor = new Vector3(1, 0, 0);
    this.specularColor = new Vector3(1, 0, 0);
    this.brightness = 32;
    this.texture = null;
    this.useTexture = false;
    this.directionLight = new Vector3(0, 0, 1);

  }

  setDiffuseColor(r: number, g: number, b: number) {
    this.diffuseColor.set([r / 255, g / 255, b / 255]);
  }

  setSpecularColor(r: number, g: number, b: number) {
    this.specularColor.set([r / 255, g / 255, b / 255]);
  }

  setBrightness(brightness: number) {
    this.brightness = brightness;
  }

  setDirectionLight(x: number, y: number, z: number) {
    this.directionLight.set([x, y, z]);
  }

  setTexture(texture: WebGLTexture) {
    this.texture = texture;
    this.useTexture = true;
  }

  getDiffuseColor(): Vector3 {
    return this.diffuseColor;
  }

  getSpecularColor(): Vector3 {
    return this.specularColor;
  }

  getDirectionLight(): Vector3 {
    return this.directionLight;
  }

  getBrightness(): number {
    return this.brightness;
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
