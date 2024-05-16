import ShaderMaterial from '../../mesh/material/ShaderMaterial';
import BasicMaterial from '../../mesh/material/basic/BasicMaterial';
import PhongMaterial from '../../mesh/material/phong/phongMaterial';
import { RGB } from '../interface';
import { Mesh } from '../mesh';
import { Object3D } from '../object3D';

export class ShaderManager {
  shader: ShaderMaterial;
  private basicMaterial: BasicMaterial;
  private phongMaterial: PhongMaterial;

  constructor() {
    this.basicMaterial = new BasicMaterial();
    this.phongMaterial = new PhongMaterial();
    this.shader = this.phongMaterial;
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

  static changeMaterial(node: Object3D, newMaterial: string) {
    if (node instanceof Mesh) {
      let material;
      if (newMaterial == 'basic') {
        material = new BasicMaterial();
      } else {
        material = new PhongMaterial();
      }
      node.material = material;
    }

    node.children.forEach((child: Object3D) => {
      ShaderManager.changeMaterial(child, newMaterial);
    });
  }

  static changeDiffuseColor(node: Object3D, newColor: RGB) {
    if (node instanceof Mesh) {
      node.material.setColor(newColor.r, newColor.g, newColor.b);
    }

    node.children.forEach((child: Object3D) => {
      ShaderManager.changeDiffuseColor(child, newColor);
    });
  }
}
