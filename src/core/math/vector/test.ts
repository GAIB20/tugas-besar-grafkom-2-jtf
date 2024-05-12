import { Vector3 } from './vector3';
import { Vector4 } from './vector4';

export const TestVector = () => {
  const v3a = new Vector3(1, 2, 3);
  const v3b = new Vector3(4, 5, 6);

  const v4a = new Vector4(1, 2, 3, 4);
  const v4b = new Vector4(5, 6, 7, 8);

  // Test Vector3 methods
  console.log('Testing Vector3 methods...');
  console.log('v3a.add(v3b):', v3a.add(v3b));
  console.log('v3a.subtract(v3b):', v3a.subtract(v3b));
  console.log('v3a.multiply(2):', v3a.multiply(2));
  console.log('v3a.dot(v3b):', v3a.dot(v3b));
  console.log('v3a.normalize():', v3a.normalize());
  console.log('v3a.cross(v3b):', v3a.cross(v3b));

  // Test Vector4 methods
  console.log('Testing Vector4 methods...');
  console.log('v4a.add(v4b):', v4a.add(v4b));
  console.log('v4a.subtract(v4b):', v4a.subtract(v4b));
  console.log('v4a.multiply(2):', v4a.multiply(2));
  console.log('v4a.dot(v4b):', v4a.dot(v4b));
  console.log('v4a.normalize():', v4a.normalize());
};

/**
 * v3.add: [5, 7, 9]
 * v3.substract: [-3, -3, -3]
 * v3.mul: [2, 4, 6]
 * v3.dot: 32
 * v3.normalize: [0.2672612419124244, 0.5345224838248488, 0.8017837257372732]
 * v3.cross: [-3, 6, -3]
 *
 * v4.add: [6, 8, 10, 12]
 * v4.substract: [-4, -4, -4, -4]
 * v4.mul: [2, 4, 6, 8]
 * v4.dot: 70
 */
