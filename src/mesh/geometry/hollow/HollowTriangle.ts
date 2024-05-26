import { BufferAttribute } from '../bufferAttribute';
import { BufferGeometry } from '../bufferGeometry';

export class HollowTriangle extends BufferGeometry {
  constructor(width = 1, height = 1, depth = 1) {
    super();
    const hw = width / 2,
      hh = height / 2,
      hd = depth / 2,
      sw = Math.min(width, height, depth) / 15;

    // prettier-ignore
    const vertices = new Float32Array([
        // Left Box
        // Front face
        -hw, -hh,  hd,   -hw+sw, -hh+sw,  hd,   0,  hh-sw,  hd,
        -hw, -hh,  hd,   0,  hh,  hd,  0,  hh-sw,  hd,
      
        // Back face
        -hw, -hh,  -hd,   -hw+sw, -hh+sw,  -hd,   0,  hh-sw,  -hd,
        -hw, -hh,  -hd,   0,  hh,  -hd,  0,  hh-sw,  -hd,
      
        // Top face
        0,  hh, hd,   0,  hh-sw,  hd,  0,  hh-sw,  -hd,
        0,  hh, hd,   0,  hh,  -hd,  0,  hh-sw, -hd,
      
        // Bottom face
        -hw+sw, -hh+sw,  hd,    -hw, -hh, -hd,       -hw+sw, -hh+sw, -hd,
        -hw, -hh,  hd,      -hw, -hh, -hd,      -hw+sw, -hh+sw,  hd,
      
        // Right face
        -hw+sw, -hh+sw,  hd,   -hw+sw, -hh+sw,  -hd,   0,  hh-sw,  hd,
        -hw+sw, -hh+sw,  hd,   0,  hh,  hd,  0,  hh-sw,  hd,
      
        // Left face
        -hw, -hh, -hd,  -hw, -hh,  hd,  0,  hh,  hd,
        -hw, -hh, -hd,  0,  hh,  hd,  0,  hh, -hd,

        // Right Box
        // Front face
        hw, -hh,  hd,   hw-sw, -hh+sw,  hd,   0,  hh-sw,  hd,
        hw, -hh,  hd,   0,  hh,  hd,  0,  hh-sw,  hd,
        
        // Back face
        hw, -hh,  -hd,   hw-sw, -hh+sw,  -hd,   0,  hh-sw,  -hd,
        hw, -hh,  -hd,   0,  hh,  -hd,  0,  hh-sw,  -hd,
        
        // Top face
        0,  hh, hd,   0,  hh-sw,  hd,  0,  hh-sw,  -hd,
        0,  hh, hd,   0,  hh,  -hd,  0,  hh-sw, -hd,
        
        // Bottom face
        hw-sw, -hh+sw,  hd,    hw, -hh, -hd,       hw-sw, -hh+sw, -hd,
        hw, -hh,  hd,      hw, -hh, -hd,      hw-sw, -hh+sw,  hd,
        
        // Left face
        hw, -hh, -hd,  hw, -hh,  hd,  0,  hh,  hd,
        hw, -hh, -hd,  0,  hh,  hd,  0,  hh, -hd,

        // Right face
        hw-sw, -hh+sw,  hd,   hw-sw, -hh+sw,  -hd,   0,  hh-sw,  hd,
        hw-sw, -hh+sw,  hd,   0,  hh,  hd,  0,  hh-sw,  hd,   

        // Bottom Box
        // Front face
        -hw, -hh,  hd,   hw, -hh,  hd,   hw-sw, -hh+sw,  hd,
        -hw, -hh,  hd,   hw-sw, -hh+sw,  hd,  -hw+sw, -hh+sw,  hd,
      
        // Back face
        -hw, -hh,  -hd,   hw, -hh,  -hd,   hw-sw, -hh+sw,  -hd,
        -hw, -hh,  -hd,   hw-sw, -hh+sw,  -hd,  -hw+sw, -hh+sw,  -hd,
      
        // Top face
        -hw+sw, -hh+sw, -hd,  -hw+sw, -hh+sw,  hd,  hw-sw, -hh+sw,  hd,
        -hw+sw, -hh+sw, -hd,  hw-sw, -hh+sw,  hd,  hw-sw, -hh+sw, -hd,
      
        // Bottom face
        hw, -hh,  hd,  -hw, -hh, -hd,  hw, -hh, -hd,
        -hw, -hh,  hd,  -hw, -hh, -hd,  hw, -hh,  hd,
      
        // Right face
        hw-sw, -hh+sw,  hd,    hw, -hh, -hd,       hw-sw, -hh+sw, -hd,
        hw, -hh,  hd,      hw, -hh, -hd,      hw-sw, -hh+sw,  hd,
      
        // Left face
        -hw+sw, -hh+sw,  hd,    -hw, -hh, -hd,       -hw+sw, -hh+sw, -hd,
        -hw, -hh,  hd,      -hw, -hh, -hd,      -hw+sw, -hh+sw,  hd,
      ]);
    this.setAttribute('position', new BufferAttribute(vertices, 3));
    this.calculateNormals();

    // prettier-ignore
    const textureCoordinates = new Float32Array([
      // Left Box
      // Front face
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  
      // Back face
      0.0, 0.0, 1.0, 1.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
  
      // Top face
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  
      // Bottom face
      1.0, 0.0, 0.0, 1.0, 1.0, 1.0,
      0.0, 0.0, 0.0, 1.0, 1.0, 0.0,
  
      // Right face
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
  
      // Left face
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  
      // Right Box
      // Front face
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  
      // Back face
      0.0, 0.0, 1.0, 1.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
  
      // Top face
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  
      // Bottom face
      1.0, 0.0, 0.0, 1.0, 1.0, 1.0,
      0.0, 0.0, 0.0, 1.0, 1.0, 0.0,
  
      // Right face
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  
      // Left face
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
  
      // Bottom Box
      // Front face
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  
      // Back face
      0.0, 0.0, 1.0, 1.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
  
      // Top face
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  
      // Bottom face
      1.0, 0.0, 0.0, 1.0, 1.0, 1.0,
      0.0, 0.0, 0.0, 1.0, 1.0, 0.0,
  
      // Right face
      1.0, 0.0, 1.0, 1.0, 0.0, 0.0,
      1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
  
      // Left face
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 1.0, 1.0, 0.0, 1.0
    ]);

    this.setAttribute('uv', new BufferAttribute(textureCoordinates, 2));
    this.calculateTangent();
  }
}
