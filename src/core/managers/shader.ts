import ShaderMaterial from '../../mesh/material/ShaderMaterial';
import BasicMaterial from '../../mesh/material/basic/BasicMaterial';
import PhongMaterial from '../../mesh/material/phong/PhongMaterial';
import { RGB } from '../interface';

export class ShaderManager {
  shader: ShaderMaterial;
  private basicMaterial: BasicMaterial;
  private phongMaterial: PhongMaterial;

  constructor() {
    this.basicMaterial = new BasicMaterial();
    this.phongMaterial = new PhongMaterial();
    this.shader = this.basicMaterial;
  }

  get() {
    return this.shader;
  }

  setMaterial(newMaterial: string) {
    if (newMaterial == 'basic') {
      this.shader = this.basicMaterial;
    } else {
      this.shader = this.phongMaterial;
    }
  }

  setColor(newColor: RGB) {
    this.shader.setColor(newColor.r, newColor.g, newColor.b);
  }
}
