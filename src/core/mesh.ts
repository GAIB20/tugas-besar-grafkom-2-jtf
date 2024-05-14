import { BufferGeometry } from '../mesh/geometry/bufferGeometry';
import ShaderMaterial from '../mesh/material/ShaderMaterial';
import { Object3D } from './object3D';

export class Mesh extends Object3D {
  geometry: BufferGeometry;
  material: ShaderMaterial;

  constructor(geometry: BufferGeometry, material: ShaderMaterial) {
    super();
    this.geometry = geometry;
    this.material = material;
  }
}
