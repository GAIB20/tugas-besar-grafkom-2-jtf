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
      -hw, -hh,  hd, // bottom left corner
      hw, -hh,  hd,// bottom right corner
      hw,  hh,  hd, // top right corner
     -hw,  hh,  hd, // top left corner
     -hw, -hh,  hd,  // bottom left corner
      hw,  hh,  hd,  // top right corner
 
     // Back face
     hw,  hh, -hd,  // top right corner
     hw, -hh, -hd,   // bottom right corner
     -hw, -hh, -hd,  // bottom left corner
      -hw,  hh, -hd,  // top left corner
      hw,  hh, -hd,  // top right corner
      -hw, -hh, -hd,  // bottom left corner
 
     // Left face
     -hw, -hh, -hd,  // bottom left corner
     -hw, -hh,  hd,  // bottom right corner
     -hw,  hh,  hd,  // top right corner
     -hw,  hh, -hd,  // top left corner
     -hw, -hh, -hd,  // bottom left corner
     -hw,  hh,  hd,  // top right corner
 
     // Right face
     hw,  hh,  hd,  // top right corner
     hw, -hh,  hd,  // bottom right corner
     hw, -hh, -hd,  // bottom left corner
     hw,  hh, -hd,   // top left corner
     hw,  hh,  hd,  // top right corner
     hw, -hh, -hd,  // bottom left corner
 
     // Top face
     -hw,  hh,  hd,  // bottom left corner
      hw,  hh,  hd,  // bottom right corner
      hw,  hh, -hd,  // top right corner
     -hw,  hh, -hd,  // top left corner
     -hw,  hh,  hd,  // bottom left corner
      hw,  hh, -hd,  // top right corner
 
     // Bottom face
     hw, -hh, -hd,  // top right corner
     hw, -hh,  hd,  // bottom right corner
     -hw, -hh,  hd,  // bottom left corner
     -hw, -hh, -hd,  // top left corner
      hw, -hh, -hd,  // top right corner
      -hw, -hh,  hd,  // bottom left corner
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
