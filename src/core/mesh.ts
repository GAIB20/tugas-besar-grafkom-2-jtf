import { BoxGeometry } from '../mesh/geometry/basic/boxGeometry';
import { BufferGeometry } from '../mesh/geometry/bufferGeometry';
import ShaderMaterial from '../mesh/material/shaderMaterial';
import { IBoxGeometry, IMesh } from './interface';
import { Object3D } from './object3D';

export class Mesh extends Object3D {
  geometry: BufferGeometry;
  material: ShaderMaterial;

  constructor(geometry: BufferGeometry, material: ShaderMaterial) {
    super();
    this.name = 'Mesh';
    this.type = 'mesh';
    this.geometry = geometry;
    this.material = material;
  }

  // Only works for BoxGeometry
  toJSON(): IMesh {
    let geometryJson: IBoxGeometry;

    if (this.geometry instanceof BoxGeometry) {
      geometryJson = (this.geometry as BoxGeometry).toJSON();
    } else {
      geometryJson = {
        width: 0,
        height: 0,
        depth: 0
      };
    }

    return {
      ...super.toJSON(),
      geometry: geometryJson
    };
  }
}
