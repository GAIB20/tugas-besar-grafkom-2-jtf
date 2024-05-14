import { BufferAttribute } from './bufferAttribute';
import { BufferGeometry } from './bufferGeometry';

export class BoxGeometry extends BufferGeometry {
  constructor(width = 1, height = 1, depth = 1) {
    super();
    const hw = width / 2,
      hh = height / 2,
      hd = depth / 2;
    const vertices = new Float32Array([
      -hw,
      -hh,
      hd, // 1
      hw,
      -hh,
      hd, // 2
      hw,
      hh,
      hd, // 3
      -hw,
      hh,
      hd, // 4
      -hw,
      -hh,
      -hd, // 5
      hw,
      -hh,
      -hd, // 6
      hw,
      hh,
      -hd, // 7
      -hw,
      hh,
      -hd // 8
    ]);
    const indices = new Uint16Array([
      0,
      1,
      2,
      2,
      3,
      0, // 1
      4,
      5,
      6,
      6,
      7,
      4, // 2
      4,
      5,
      1,
      1,
      0,
      4, // 3
      7,
      6,
      2,
      2,
      3,
      7, // 4
      0,
      3,
      7,
      7,
      4,
      0, // 5
      1,
      5,
      6,
      6,
      2,
      1 //6
    ]);
    this.setAttribute('position', new BufferAttribute(vertices, 3));
    this.setIndices(new BufferAttribute(indices, 1));
    this.calculateNormals();
  }
}
