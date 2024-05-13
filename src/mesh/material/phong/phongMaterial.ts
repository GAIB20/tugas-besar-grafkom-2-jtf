import ShaderMaterial from '../ShaderMaterial';
import VertexShader from './glsl/vert.glsl';
import FragmentShader from './glsl/frag.glsl';

export default class PhongMaterial extends ShaderMaterial {
  constructor() {
    // TODO: change glsl for phong
    super(VertexShader, FragmentShader);
  }
}
