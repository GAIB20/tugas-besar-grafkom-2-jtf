import { BoxGeometry } from '../../mesh/geometry/basic/boxGeometry';
import { PlaneGeometry } from '../../mesh/geometry/basic/planeGeometry';
import BasicMaterial from '../../mesh/material/basic/BasicMaterial';
import { Mesh } from '../mesh';
import { Object3D } from '../object3D';
import { Scene } from '../scene';

export class SceneManager {
  scene: Scene;
  private sceneA: Scene;
  private sceneB: Scene;
  private sceneC: Scene;

  selectedMesh: Object3D;

  constructor() {
    // Box
    this.sceneA = new Scene().add(
      new Mesh(new BoxGeometry(200, 200, 200), new BasicMaterial())
    );

    // Plane
    this.sceneB = new Scene().add(
      new Mesh(new PlaneGeometry(700, 700), new BasicMaterial())
    );

    // Box and Plane
    const boxMesh = new Mesh(
      new BoxGeometry(200, 200, 200),
      new BasicMaterial()
    );
    boxMesh.name = 'ParentBox';
    const box2Mesh = new Mesh(
      new BoxGeometry(150, 150, 150),
      new BasicMaterial()
    );
    box2Mesh.name = 'ChildBox';

    box2Mesh.position.y = 400;

    boxMesh.add(box2Mesh);

    boxMesh.position.x = 0;
    boxMesh.scale.x = 1.6;
    boxMesh.rotation.z = 90;
    this.sceneC = new Scene().add(boxMesh);

    this.scene = this.sceneA;
    this.selectedMesh = this.scene;
    this.setSelectedMeshOnScene();
  }

  get() {
    return this.scene;
  }

  setSelectedMeshOnScene() {
    for (let child of this.scene.children) {
      if (child instanceof Mesh) {
        this.selectedMesh = child;
        return;
      }
    }

    this.selectedMesh = this.scene;
  }

  setScene(newScene: string) {
    if (newScene == 'A') {
      this.scene = this.sceneA;
    } else if (newScene == 'B') {
      this.scene = this.sceneB;
    } else if (newScene == 'C') {
      this.scene = this.sceneC;
    }

    this.setSelectedMeshOnScene();
  }

  setSelectedMesh(mesh: Mesh) {
    this.selectedMesh = mesh;
  }
}
