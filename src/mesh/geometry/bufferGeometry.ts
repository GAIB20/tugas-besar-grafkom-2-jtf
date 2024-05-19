import { BufferAttribute } from './bufferAttribute';
import { Vector3 } from '../../core/math/vector/vector3';
import { Vector3Type } from '../../core/math/vector/vector.d';

export class BufferGeometry {
  private _attributes: { [name: string]: BufferAttribute };
  private _indices?: BufferAttribute;

  constructor() {
    this._attributes = {};
  }

  get attributes() {
    return this._attributes;
  }

  get indices() {
    return this._indices;
  }

  setIndices(indices: BufferAttribute) {
    this._indices = indices;
    return this;
  }

  removeIndices() {
    this._indices = undefined;
    return this;
  }

  setAttribute(name: string, attribute: BufferAttribute) {
    this._attributes[name] = attribute;
    return this;
  }

  getAttribute(name: string) {
    return this._attributes[name];
  }

  deleteAttribute(name: string) {
    delete this._attributes[name];
    return this;
  }

  getPosition(): BufferAttribute {
    return this.getAttribute('position');
  }

  getNormal() {
    return this.getAttribute('normal');
  }

  getUV() {
    return this.getAttribute('uv');
  }

  getTangent() {
    return this.getAttribute('tangent');
  }

  calculateNormals(forceNewAttribute = false) {
    const positionAttribute = this.getPosition();
    if (!positionAttribute) return;
    let normalAttribute = this.getNormal();
    if (forceNewAttribute || !normalAttribute)
      normalAttribute = new BufferAttribute(
        new Float32Array(positionAttribute.length),
        positionAttribute.size
      );

    // Assume the positions are ordered as triangle faces
    for (let i = 0; i < positionAttribute.count; i += 3) {
      const p0 = new Vector3(...(positionAttribute.get(i) as Vector3Type));
      const p1 = new Vector3(...(positionAttribute.get(i + 1) as Vector3Type));
      const p2 = new Vector3(...(positionAttribute.get(i + 2) as Vector3Type));

      const edge1 = p1.subtract(p0);
      const edge2 = p2.subtract(p0);

      const normal: Vector3 = edge1.cross(edge2).normalize() as Vector3;

      // Set the normal for each vertex in the face to the face normal
      for (let j = 0; j < 3; j++) {
        normalAttribute.set(i + j, [normal.x, normal.y, normal.z]);
      }
    }
    this.setAttribute('normal', normalAttribute);
  }

  calculateTangent() {
    const positionAttribute = this.getPosition();
    if (!positionAttribute) return;
    const uvAttribute = this.getUV();
    if (!uvAttribute) return;
    const tangentAttribute = new BufferAttribute(
      new Float32Array(positionAttribute.length),
      positionAttribute.size
    );

    // Assume the positions are ordered as triangle faces
    for (let i = 0; i < positionAttribute.count; i += 3) {
      const p0 = new Vector3(...(positionAttribute.get(i) as Vector3Type));
      const p1 = new Vector3(...(positionAttribute.get(i + 1) as Vector3Type));
      const p2 = new Vector3(...(positionAttribute.get(i + 2) as Vector3Type));

      const uv0 = new Vector3(...(uvAttribute.get(i) as Vector3Type));
      const uv1 = new Vector3(...(uvAttribute.get(i + 1) as Vector3Type));
      const uv2 = new Vector3(...(uvAttribute.get(i + 2) as Vector3Type));

      const edge1 = p1.subtract(p0) as Vector3;
      const edge2 = p2.subtract(p0) as Vector3;
      const dUV1 = uv1.subtract(uv0) as Vector3;
      const dUV2 = uv2.subtract(uv0) as Vector3;

      const tangent: Vector3 = new Vector3();

      const f = 1.0 / (dUV1.x * dUV2.y - dUV2.x * dUV1.y);

      tangent.x = f * (dUV2.y * edge1.x - dUV1.y * edge2.x);
      tangent.y = f * (dUV2.y * edge1.y - dUV1.y * edge2.y);
      tangent.z = f * (dUV2.y * edge1.z - dUV1.y * edge2.z);
      
      const normalizedTangent = new Vector3(tangent.x, tangent.y, tangent.z).normalize() as Vector3;


      // Set the tangent for each vertex in the face to the face tangent
      for (let j = 0; j < 3; j++) {
        tangentAttribute.set(i + j, [normalizedTangent.x, normalizedTangent.y, normalizedTangent.z]);
      }
    }
    this.setAttribute('tangent', tangentAttribute);
  }
}
