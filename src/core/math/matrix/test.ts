import { Vector3 } from '../vector/vector3';
import { Vector4 } from '../vector/vector4';
import { Matrix3 } from './matrix3';
import { Matrix4 } from './matrix4';

export const TestMatrix = () => {
  const v3a = new Vector3(1, 2, 3);
  const v3b = new Vector3(0, 1, 4);
  const v3c = new Vector3(5, 6, 0);

  const v4a = new Vector4(1, 2, 3, 4);
  const v4b = new Vector4(5, 6, 0, 8);
  const v4c = new Vector4(9, 10, 11, 0);
  const v4d = new Vector4(0, 14, 15, 16);

  const m3 = new Matrix3(v3a, v3b, v3c);
  const m4 = new Matrix4(v4a, v4b, v4c, v4d);

  // Test Matrix3 methods
  console.log('Testing Matrix3 methods...');
  console.log('m3:', m3);
  console.log('m3.transpose():', m3.transpose());
  console.log('m3.determinant():', m3.determinant());
  console.log('m3.inverse():', m3.inverse());
  console.log('m3.toColumnMajorArray():', m3.toColumnMajorArray());

  // Test Matrix4 methods
  console.log('Testing Matrix4 methods...');
  console.log('m4:', m4);
  console.log('m4.transpose():', m4.transpose());
  console.log('m4.determinant():', m4.determinant());
  console.log('m4.inverse():', m4.inverse());
  console.log('m4.toColumnMajorArray():', m4.toColumnMajorArray());

  // Test multiplication
  console.log('Testing multiplication...');
  const m3b = new Matrix3(v3c, v3a, v3b);
  console.log('m3b:', m3b);
  console.log('m3.multiply(m3b):', m3.multiply(m3b));

  const m4b = new Matrix4(v4c, v4a, v4b, v4d);
  console.log('m4b:', m4b);
  console.log('m4.multiply(m4b):', m4.multiply(m4b));
};

/**
 * m3.determinant(): 0.9999999999999964
 * m3.inverse: (-24 | 18 | 5
                20 | -15 | -4
                -5 | 4 | 1)
 * m3.multiply: {{7, 13, 18}, {1, 6, 19}, {31, 42, 18}}
 *
 * m4.determinant: 3256.000000000001
 * m4.inverse: (0.314496 | 0.044226 | 0.0515971 | -0.100737
                -0.601966 | 0.0872236 | 0.0184275 | 0.10688
                0.289926 | -0.115479 | 0.031941 | -0.014742
                0.254914 | 0.031941 | -0.0460688 | -0.017199)
 * m4.multiply: {{26, 51, 146, 89}, {88, 174, 176, 342}, {77, 193, 129, 282}, {96, 152, 128, 432}}
 */
