import { Object3D } from './object3D';

export class Scene extends Object3D {
  constructor() {
    super();
    this.name = 'Scene';
    this.type = 'scene';
  }
}
