import { BufferAttribute } from '../bufferAttribute';
import { BufferGeometry } from '../bufferGeometry';

export class HollowBox extends BufferGeometry {
  constructor(width = 1, height = 1, depth = 1) {
    super();
    const hw = width / 2,
      hh = height / 2,
      hd = depth / 2,
      sw = Math.min(width, height, depth) / 20;

    // prettier-ignore
    const vertices = new Float32Array([
        // Left Box
        // Front face
        -hw, -hh,  hd,   -hw+sw, -hh,  hd,   -hw+sw,  hh,  hd,
        -hw, -hh,  hd,   -hw+sw,  hh,  hd,  -hw,  hh,  hd,
      
        // Back face
        -hw, -hh, -hd,  -hw+sw,  hh, -hd,  -hw+sw, -hh, -hd,
        -hw, -hh, -hd,  -hw,  hh, -hd,  -hw+sw,  hh, -hd,
      
        // Top face
        -hw,  hh, -hd,  -hw,  hh,  hd,  -hw+sw,  hh,  hd,
        -hw,  hh, -hd,  -hw+sw,  hh,  hd,  -hw+sw,  hh, -hd,
      
        // Bottom face
        -hw+sw, -hh,  hd,  -hw, -hh, -hd,  -hw+sw, -hh, -hd,
        -hw, -hh,  hd,  -hw, -hh, -hd,  -hw+sw, -hh,  hd,
      
        // Right face
        -hw+sw, -hh, -hd,  -hw+sw,  hh,  hd,  -hw+sw, -hh,  hd,
        -hw+sw, -hh, -hd,  -hw+sw,  hh, -hd,  -hw+sw,  hh,  hd,
      
        // Left face
        -hw, -hh, -hd,  -hw, -hh,  hd,  -hw,  hh,  hd,
        -hw, -hh, -hd,  -hw,  hh,  hd,  -hw,  hh, -hd,

        // Right Box
        // Front face
        hw-sw, -hh,  hd,   hw, -hh,  hd,   hw,  hh,  hd,
        hw-sw, -hh,  hd,   hw,  hh,  hd,  hw-sw,  hh,  hd,
      
        // Back face
        hw-sw, -hh, -hd,  hw,  hh, -hd,  hw, -hh, -hd,
        hw-sw, -hh, -hd,  hw-sw,  hh, -hd,  hw,  hh, -hd,
      
        // Top face
        hw-sw,  hh, -hd,  hw-sw,  hh,  hd,  hw,  hh,  hd,
        hw-sw,  hh, -hd,  hw,  hh,  hd,  hw,  hh, -hd,
      
        // Bottom face
        hw, -hh,  hd,  hw-sw, -hh, -hd,  hw, -hh, -hd,
        hw-sw, -hh,  hd,  hw-sw, -hh, -hd,  hw, -hh,  hd,
      
        // Right face
        hw, -hh, -hd,  hw,  hh,  hd,  hw, -hh,  hd,
        hw, -hh, -hd,  hw,  hh, -hd,  hw,  hh,  hd,
      
        // Left face
        hw-sw, -hh, -hd,  hw-sw, -hh,  hd,  hw-sw,  hh,  hd,
        hw-sw, -hh, -hd,  hw-sw,  hh,  hd,  hw-sw,  hh, -hd,

        // Top Box
        // Front face
        -hw, hh-sw,  hd,   hw, hh-sw,  hd,   hw,  hh,  hd,
        -hw, hh-sw,  hd,   hw,  hh,  hd,  -hw,  hh,  hd,
      
        // Back face
        -hw, hh-sw, -hd,  hw,  hh, -hd,  hw, hh-sw, -hd,
        -hw, hh-sw, -hd,  -hw,  hh, -hd,  hw,  hh, -hd,
      
        // Top face
        -hw,  hh, -hd,  -hw,  hh,  hd,  hw,  hh,  hd,
        -hw,  hh, -hd,  hw,  hh,  hd,  hw,  hh, -hd,
      
        // Bottom face
        hw, hh-sw,  hd,  -hw, hh-sw, -hd,  hw, hh-sw, -hd,
        -hw, hh-sw,  hd,  -hw, hh-sw, -hd,  hw, hh-sw,  hd,
      
        // Right face
        hw, hh-sw, -hd,  hw,  hh,  hd,  hw, hh-sw,  hd,
        hw, hh-sw, -hd,  hw,  hh, -hd,  hw,  hh,  hd,
      
        // Left face
        -hw, hh-sw, -hd,  -hw, hh-sw,  hd,  -hw,  hh,  hd,
        -hw, hh-sw, -hd,  -hw,  hh,  hd,  -hw,  hh, -hd,

        // Bottom Box
        // Front face
        -hw, -hh,  hd,   hw, -hh,  hd,   hw, -hh+sw,  hd,
        -hw, -hh,  hd,   hw, -hh+sw,  hd,  -hw, -hh+sw,  hd,
      
        // Back face
        -hw, -hh, -hd,  hw, -hh+sw, -hd,  hw, -hh, -hd,
        -hw, -hh, -hd,  -hw, -hh+sw, -hd,  hw, -hh+sw, -hd,
      
        // Top face
        -hw, -hh+sw, -hd,  -hw, -hh+sw,  hd,  hw, -hh+sw,  hd,
        -hw, -hh+sw, -hd,  hw, -hh+sw,  hd,  hw, -hh+sw, -hd,
      
        // Bottom face
        hw, -hh,  hd,  -hw, -hh, -hd,  hw, -hh, -hd,
        -hw, -hh,  hd,  -hw, -hh, -hd,  hw, -hh,  hd,
      
        // Right face
        hw, -hh, -hd,  hw, -hh+sw,  hd,  hw, -hh,  hd,
        hw, -hh, -hd,  hw, -hh+sw, -hd,  hw, -hh+sw,  hd,
      
        // Left face
        -hw, -hh, -hd,  -hw, -hh,  hd,  -hw, -hh+sw,  hd,
        -hw, -hh, -hd,  -hw, -hh+sw,  hd,  -hw, -hh+sw, -hd,
      ]);
    this.setAttribute('position', new BufferAttribute(vertices, 3));
    this.calculateNormals();
  }
}
