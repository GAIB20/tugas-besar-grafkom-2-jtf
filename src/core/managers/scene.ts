import { BoxGeometry } from '../../mesh/geometry/boxGeometry';
import { PlaneGeometry } from '../../mesh/geometry/planeGeometry';
import ShaderMaterial from '../../mesh/material/ShaderMaterial';
import { Mesh } from '../mesh';
import { Scene } from '../scene';

export class SceneManager {
  scene: Scene;
  private sceneA: Scene;
  private sceneB: Scene;
  private sceneC: Scene;

  constructor(material: ShaderMaterial) {
    // Box
    this.sceneA = new Scene().add(
      new Mesh(new BoxGeometry(200, 200, 200), material)
    );

    // Plane
    this.sceneB = new Scene().add(
      new Mesh(new PlaneGeometry(700, 700), material)
    );

    // Box and Plane
    this.sceneC = new Scene()
      .add(new Mesh(new BoxGeometry(400, 400, 400), material).add(new Mesh(new PlaneGeometry(700, 700), material)))
      .add(new Mesh(new PlaneGeometry(700, 700), material));

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
