import { BoxGeometry } from '../../mesh/geometry/boxGeometry';
import ShaderMaterial from '../../mesh/material/ShaderMaterial';
import { Mesh } from '../mesh';
import { Scene } from '../scene';

export class SceneManager {
  scene: Scene;
  private sceneA: Scene;
  private sceneB: Scene;
  private sceneC: Scene;

  constructor(material: ShaderMaterial) {
    this.sceneA = new Scene().add(
      new Mesh(new BoxGeometry(200, 200, 200), material)
    );
    this.sceneB = new Scene().add(
      new Mesh(new BoxGeometry(300, 300, 300), material)
    );
    this.sceneC = new Scene().add(
      new Mesh(new BoxGeometry(400, 400, 400), material)
    );
    this.scene = this.sceneA;
  }

  get() {
    return this.scene;
  }

  setScene(newScene: string) {
    if (newScene == 'A') {
      this.scene = this.sceneA;
    } else if (newScene == 'B') {
      this.scene = this.sceneB;
    } else if (newScene == 'C') {
      this.scene = this.sceneC;
    }
  }
}
