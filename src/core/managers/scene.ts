import { BoxGeometry } from '../../mesh/geometry/basic/boxGeometry';
import { PlaneGeometry } from '../../mesh/geometry/basic/planeGeometry';
import { HollowBox } from '../../mesh/geometry/hollow/HollowBox';
import BasicMaterial from '../../mesh/material/basic/BasicMaterial';
import { Mesh } from '../mesh';
import { Object3D } from '../object3D';
import { Scene } from '../scene';
import { IMesh, IObject3D } from '../interface';
import PersonJSON from '../../../test-data/articulated-model/person.json';
import { Model } from '../../constants/model';

export class SceneManager {
  scene: Scene;
  private person: Scene;
  private sceneA: Scene;
  private sceneB: Scene;
  private sceneC: Scene;
  private sceneD: Scene;
  private sceneE: Scene;

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

    // Hollow
    this.sceneD = new Scene().add(
      new Mesh(new HollowBox(400, 200, 200), new BasicMaterial())
    );

    // Articulated: Person
    const head = new Mesh(new BoxGeometry(50, 50, 50), new BasicMaterial());
    head.name = 'Head';
    head.position.y = 150;

    const body = new Mesh(new BoxGeometry(200, 250, 50), new BasicMaterial());
    body.name = 'Body';

    const leftShoulder = new Mesh(
      new BoxGeometry(50, 25, 50),
      new BasicMaterial()
    );
    leftShoulder.name = 'LeftShoulder';
    leftShoulder.position.x = -125;
    leftShoulder.position.y = 90;

    const leftArm = new Mesh(new BoxGeometry(25, 150, 50), new BasicMaterial());
    leftArm.name = 'LeftArm';
    leftArm.position.x = -12.5;
    leftArm.position.y = -87.5;

    const rightShoulder = new Mesh(
      new BoxGeometry(50, 25, 50),
      new BasicMaterial()
    );
    rightShoulder.name = 'LeftShoulder';
    rightShoulder.position.x = 125;
    rightShoulder.position.y = 90;

    const rightArm = new Mesh(
      new BoxGeometry(25, 150, 50),
      new BasicMaterial()
    );
    rightArm.name = 'RightArm';
    rightArm.position.x = 12.5;
    rightArm.position.y = -87.5;

    const leftFoot = new Mesh(
      new BoxGeometry(30, 200, 50),
      new BasicMaterial()
    );
    leftFoot.name = 'LeftFoot';
    leftFoot.position.x = -40;
    leftFoot.position.y = -200;

    const rightFoot = new Mesh(
      new BoxGeometry(30, 200, 50),
      new BasicMaterial()
    );
    rightFoot.name = 'RightFoot';
    rightFoot.position.x = 40;
    rightFoot.position.y = -200;

    leftShoulder.add(leftArm);
    rightShoulder.add(rightArm);
    body
      .add(head)
      .add(leftShoulder)
      .add(rightShoulder)
      .add(leftFoot)
      .add(rightFoot);

    this.sceneE = new Scene().add(body);
    this.sceneE.name = 'Person';

    // Articulated Person: from JSON
    this.person = SceneManager.loadJSON(PersonJSON);

    this.scene = this.person;
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
    if (newScene == Model.Person) {
      this.scene = this.person;
    } else if (newScene == 'A') {
      this.scene = this.sceneA;
    } else if (newScene == 'B') {
      this.scene = this.sceneB;
    } else if (newScene == 'C') {
      this.scene = this.sceneC;
    } else if (newScene == 'D') {
      this.scene = this.sceneD;
    } else if (newScene == 'E') {
      this.scene = this.sceneE;
    }

    this.setSelectedMeshOnScene();
  }

  setSelectedMesh(mesh: Mesh) {
    this.selectedMesh = mesh;
  }

  static loadJSON(object: IObject3D): Object3D {
    switch (object.type) {
      case 'scene':
        const scene = new Scene();
        scene.fromJSON(object);

        object.children.forEach((child: IObject3D) => {
          scene.add(SceneManager.loadJSON(child));
        });

        return scene;
      case 'mesh':
        const meshObject = object as IMesh;

        const mesh = new Mesh(
          new BoxGeometry(
            meshObject.geometry.width,
            meshObject.geometry.height,
            meshObject.geometry.depth
          ),
          new BasicMaterial()
        );
        mesh.fromJSON(object);

        object.children.forEach((child: IObject3D) => {
          mesh.add(SceneManager.loadJSON(child));
        });

        return mesh;
      default:
        throw new Error(`Unsupported object type: ${object.type}`);
    }
  }
}
