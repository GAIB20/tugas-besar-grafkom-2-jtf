import ShaderMaterial from '../ShaderMaterial';
import VertexShader from './glsl/vert.glsl';
import FragmentShader from './glsl/frag.glsl';

export default class BasicMaterial extends ShaderMaterial {
  constructor() {
    super(VertexShader, FragmentShader);
  }
}
