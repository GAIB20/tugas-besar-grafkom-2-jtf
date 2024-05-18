import { IBoxGeometry } from '../../../core/interface';
import { BufferAttribute } from '../bufferAttribute';
import { BufferGeometry } from '../bufferGeometry';

export class BoxGeometry extends BufferGeometry {
  constructor(private width = 1, private height = 1, private depth = 1) {
    super();
    const hw = width / 2,
      hh = height / 2,
      hd = depth / 2;
    const vertices = new Float32Array([
      // Front face
      -hw,
      -hh,
      hd,
      hw,
      -hh,
      hd,
      hw,
      hh,
      hd,
      -hw,
      -hh,
      hd,
      hw,
      hh,
      hd,
      -hw,
      hh,
      hd,
      // Back face
      -hw,
      -hh,
      -hd,
      hw,
      hh,
      -hd,
      hw,
      -hh,
      -hd,
      -hw,
      -hh,
      -hd,
      -hw,
      hh,
      -hd,
      hw,
      hh,
      -hd,
      // Top face
      -hw,
      hh,
      -hd,
      -hw,
      hh,
      hd,
      hw,
      hh,
      hd,
      -hw,
      hh,
      -hd,
      hw,
      hh,
      hd,
      hw,
      hh,
      -hd,
      // Bottom face
      hw,
      -hh,
      hd,
      -hw,
      -hh,
      -hd,
      hw,
      -hh,
      -hd,
      -hw,
      -hh,
      hd,
      -hw,
      -hh,
      -hd,
      hw,
      -hh,
      hd,
      // Right face
      hw,
      -hh,
      -hd,
      hw,
      hh,
      hd,
      hw,
      -hh,
      hd,
      hw,
      -hh,
      -hd,
      hw,
      hh,
      -hd,
      hw,
      hh,
      hd,
      // Left face
      -hw,
      -hh,
      -hd,
      -hw,
      -hh,
      hd,
      -hw,
      hh,
      hd,
      -hw,
      -hh,
      -hd,
      -hw,
      hh,
      hd,
      -hw,
      hh,
      -hd
    ]);
    this.setAttribute('position', new BufferAttribute(vertices, 3));
    this.calculateNormals();
  }

  toJSON(): IBoxGeometry {
    return {
      width: this.width,
      height: this.height,
      depth: this.depth
    };
  }
}
