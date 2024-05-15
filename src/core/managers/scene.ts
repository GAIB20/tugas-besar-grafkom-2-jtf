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
    const boxMesh = new Mesh(new BoxGeometry(200, 200, 200), material);
    const box2Mesh = new Mesh(new BoxGeometry(150, 150, 150), material);

    box2Mesh.position.y = 400;

    boxMesh.add(box2Mesh);

    boxMesh.position.x = 0;
    boxMesh.scale.x = 1.6;
    boxMesh.rotation.z = 90;
    this.sceneC = new Scene().add(boxMesh);

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
