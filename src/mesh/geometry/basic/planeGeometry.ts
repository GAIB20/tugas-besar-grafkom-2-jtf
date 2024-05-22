import { BufferAttribute } from '../bufferAttribute';
import { BufferGeometry } from '../bufferGeometry';

export class PlaneGeometry extends BufferGeometry {
  constructor(width = 1, height = 1) {
    super();
    const hw = width / 2,
      hh = height / 2;
    const vertices = new Float32Array([
      -hw,
      -hh,
      0, // bottom left corner
      hw,
      -hh,
      0, // bottom right corner
      hw,
      hh,
      0, // top right corner
      -hw,
      hh,
      0, // top left corner
      -hw,
      -hh,
      0, // bottom left corner
      hw,
      hh,
      0 // top right corner
    ]);
    this.setAttribute('position', new BufferAttribute(vertices, 3));
    this.calculateNormals();

    const textureCoordinates = [
      // Front
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0,
    ];
    this.setAttribute(
      'uv',
      new BufferAttribute(new Float32Array(textureCoordinates), 2)
    );
    this.calculateTangent();
  }
}
