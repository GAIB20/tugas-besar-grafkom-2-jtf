import ShaderMaterial from '../../mesh/material/shaderMaterial';
import BasicMaterial from '../../mesh/material/basic/BasicMaterial';
import PhongMaterial from '../../mesh/material/phong/phongMaterial';
import { Coordinate, RGB } from '../interface';
import { Mesh } from '../mesh';
import { Object3D } from '../object3D';
import ReflectiveMaterial from '../../mesh/material/reflective/reflectiveMaterial';

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

  setDiffuseColor(newColor: RGB) {
    this.shader.setDiffuseColor(newColor.r, newColor.g, newColor.b);
  }

  setSpecularColor(newColor: RGB) {
    this.shader.setSpecularColor(newColor.r, newColor.g, newColor.b);
  }

  static changeMaterial(node: Object3D, newMaterial: string) {
    if (node instanceof Mesh) {
      let material;
      if (newMaterial == 'basic') {
        material = new BasicMaterial();
      } else if (newMaterial == 'phong') {
        material = new PhongMaterial();
      } else {
        material = new ReflectiveMaterial();
      }
      node.material = material;
    }

    node.children.forEach((child: Object3D) => {
      ShaderManager.changeMaterial(child, newMaterial);
    });
  }

  static changeDiffuseColor(node: Object3D, newColor: RGB) {
    if (node instanceof Mesh) {
      node.material.setDiffuseColor(newColor.r, newColor.g, newColor.b);
    }

    node.children.forEach((child: Object3D) => {
      ShaderManager.changeDiffuseColor(child, newColor);
    });
  }

  static changeSpecularColor(node: Object3D, newColor: RGB) {
    if (node instanceof Mesh) {
      node.material.setSpecularColor(newColor.r, newColor.g, newColor.b);
    }

    node.children.forEach((child: Object3D) => {
      ShaderManager.changeSpecularColor(child, newColor);
    });
  }

  static changeDirectionLight(node: Object3D, newDirection: Coordinate) {
    if (node instanceof Mesh) {
      node.material.setDirectionLight(
        newDirection.x,
        newDirection.y,
        newDirection.z
      );
    }

    node.children.forEach((child: Object3D) => {
      ShaderManager.changeDirectionLight(child, newDirection);
    });
  }

  static changeBrightness(node: Object3D, brightness: number) {
    if (node instanceof Mesh) {
      node.material.setBrightness(brightness);
    }

    node.children.forEach((child: Object3D) => {
      ShaderManager.changeBrightness(child, brightness);
    });
  }
}
