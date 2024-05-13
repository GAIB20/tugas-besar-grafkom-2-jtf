import { BufferAttribute } from './BufferAttribute';
import { BufferGeometry } from './BufferGeometry';

export class PlaneGeometry extends BufferGeometry {
  constructor(width = 1, height = 1) {
    super();
    const hw = width / 2,
      hh = height / 2;
    const vertices = new Float32Array([
      -hw,
      0,
      -hh,
      hw,
      0,
      -hh,
      hw,
      0,
      hh,
      -hw,
      0,
      hh
    ]);
    const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
    this.setAttribute('position', new BufferAttribute(vertices, 3));
    this.setIndices(new BufferAttribute(indices, 1));
    this.calculateNormals();
  }
}
