import { BoxGeometry } from '../../mesh/geometry/basic/boxGeometry';
import { PlaneGeometry } from '../../mesh/geometry/basic/planeGeometry';
import { HollowBox } from '../../mesh/geometry/hollow/HollowBox';
import BasicMaterial from '../../mesh/material/basic/BasicMaterial';
import { Mesh } from '../mesh';
import { Object3D } from '../object3D';
import { Scene } from '../scene';
import { Coordinate, IAnimation, IMesh, IObject3D } from '../interface';
import PersonJSON from '../../../test-data/articulated-model/person.json';
import BarneyJSON from '../../../test-data/articulated-model/barney.json';
import BunnyJSON from '../../../test-data/articulated-model/bunny.json';
import { Model } from '../../constants/model';
import { HollowTriangle } from '../../mesh/geometry/hollow/HollowTriangle';

export class SceneManager {
  scene: Scene;
  private person: Scene;
  private barney: Scene;
  private bunny: Scene;
  private sceneA: Scene;
  private sceneB: Scene;
  private sceneC: Scene;
  private sceneD: Scene;
  private sceneE: Scene;
  private sceneF: Scene;
  selectedMesh: Object3D;
  //Binding New Object
  name = '';
  newObject = { x: 0, y: 0, z: 0 } as Coordinate;

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

    this.sceneF = new Scene().add(
      new Mesh(new HollowTriangle(400, 400, 200), new BasicMaterial())
    );

    this.sceneF.name = 'Hollow Triangle';

    const body = new Mesh(new BoxGeometry(200, 200, 200), new BasicMaterial());
    body.name = 'Body';

    const head = new Mesh(new BoxGeometry(150, 150, 50), new BasicMaterial());
    head.name = 'Head';
    head.position.y = 80;
    head.position.z += 120;

    const nose = new Mesh(new BoxGeometry(50, 50, 30), new BasicMaterial());
    nose.name = 'Nose';
    nose.position.z += 40;
    
    const earLeft = new Mesh(new BoxGeometry(30, 150, 30), new BasicMaterial());
    earLeft.name = 'Ear Left';
    earLeft.position.y = 125;
    earLeft.position.x = -44;
    earLeft.rotation.z = 24;

    const earRight = new Mesh(new BoxGeometry(30, 150, 30), new BasicMaterial());
    earRight.name = 'Ear Right';
    earRight.position.y = 125;
    earRight.position.x = 44;
    earRight.rotation.z = -24;

    head.add(nose)
        .add(earLeft)
        .add(earRight)

    const leftFrontLeg = new Mesh(new BoxGeometry(30, 150, 30), new BasicMaterial());
    leftFrontLeg.name = 'Left Front Leg';
    leftFrontLeg.position.x = -110;
    leftFrontLeg.position.y = -100;
    leftFrontLeg.position.z = 50;


    const leftBottomLeg = new Mesh(new BoxGeometry(30, 150, 30), new BasicMaterial());
    leftBottomLeg.name = 'Left Bottom Leg';
    leftBottomLeg.position.x = -110;
    leftBottomLeg.position.y = -100;
    leftBottomLeg.position.z = -50;


    const rightFrontLeg = new Mesh(new BoxGeometry(30, 150, 30), new BasicMaterial());
    rightFrontLeg.name = 'Right Front Leg';
    rightFrontLeg.position.x = 110;
    rightFrontLeg.position.y = -100;
    rightFrontLeg.position.z = 50;

    const rightBottomLeg = new Mesh(new BoxGeometry(30, 150, 30), new BasicMaterial());
    rightBottomLeg.name = 'Right Bottom Leg';
    rightBottomLeg.position.x = 110;
    rightBottomLeg.position.y = -100;
    rightBottomLeg.position.z = -50;

    const tail = new Mesh(new BoxGeometry(60, 60, 60), new BasicMaterial());
    tail.name = 'Tail';
    tail.position.z = -110

    body.add(head)
        .add(leftFrontLeg)
        .add(leftBottomLeg)
        .add(rightFrontLeg)
        .add(rightBottomLeg)
        .add(tail)

    // // Articulated: Bunny
    // this.bunny = new Scene().add(
    //   body
    // );
    // this.bunny.name = 'Bunny'; 

    // Articulated: Person
    // const neck = new Mesh(new BoxGeometry(50, 50, 50), new BasicMaterial());
    // neck.name = 'Neck';
    // neck.position.y = 150;

    // const head = new Mesh(new BoxGeometry(70, 70, 180), new BasicMaterial());
    // head.name = 'Head';
    // head.position.y = 40;
    // head.position.z += 60;

    // const jaw = new Mesh(new BoxGeometry(60, 20, 130), new BasicMaterial());
    // jaw.name = 'Jaw';
    // jaw.position.y = -40;
    // jaw.position.z += -10;
    // jaw.rotation.x += 30;

    // head.add(jaw);

    // console.log(head.toJSON)
    // const body = new Mesh(new BoxGeometry(200, 250, 100), new BasicMaterial());
    // body.name = 'Body';

    // const tail = new Mesh(new BoxGeometry(100, 100, 200), new BasicMaterial());
    // tail.name = 'Tail';
    // tail.position.z = -70;
    // tail.position.y = -90;
    // tail.rotation.x -= 30;

    // const tailtip = new Mesh(new BoxGeometry(50, 50, 200), new BasicMaterial());
    // tailtip.name = 'Tail Tip';
    // tailtip.position.z = -150;
    // tailtip.position.y = 30;
    // tailtip.rotation.x = 30;

    // body.add(tail);
    // tail.add(tailtip);

    // const leftShoulder = new Mesh(
    //   new BoxGeometry(50, 25, 50),
    //   new BasicMaterial()
    // );
    // leftShoulder.name = 'LeftShoulder';
    // leftShoulder.position.x = -125;
    // leftShoulder.position.y = 90;

    // const leftArm = new Mesh(new BoxGeometry(25, 150, 50), new BasicMaterial());
    // leftArm.name = 'LeftArm';
    // leftArm.position.x = -12.5;
    // leftArm.position.y = -65.5;
    // leftArm.position.z = -30;
    // leftArm.rotation.x = 30;

    // const rightShoulder = new Mesh(
    //   new BoxGeometry(50, 25, 50),
    //   new BasicMaterial()
    // );
    // rightShoulder.name = 'RightShoulder';
    // rightShoulder.position.x = 125;
    // rightShoulder.position.y = 90;

    // const rightArm = new Mesh(
    //   new BoxGeometry(25, 150, 50),
    //   new BasicMaterial()
    // );
    // rightArm.name = 'RightArm';
    // rightArm.position.x = 12.5;
    // rightArm.position.y = -65.5;
    // rightArm.position.z = 30;
    // rightArm.rotation.x = -30;

    // const leftFoot = new Mesh(
    //   new BoxGeometry(30, 200, 50),
    //   new BasicMaterial()
    // );
    // leftFoot.name = 'LeftFoot';
    // leftFoot.position.x = -40;
    // leftFoot.position.y = -180;
    // leftFoot.position.z = 50;
    // leftFoot.rotation.x = -30;

    // const rightFoot = new Mesh(
    //   new BoxGeometry(30, 200, 50),
    //   new BasicMaterial()
    // );
    // rightFoot.name = 'RightFoot';
    // rightFoot.position.x = 40;
    // rightFoot.position.y = -180;
    // rightFoot.position.z = -50;
    // rightFoot.rotation.x = 30;

    // neck.add(head);
    // leftShoulder.add(leftArm);
    // rightShoulder.add(rightArm);
    // body
    //   .add(neck)
    //   .add(leftShoulder)
    //   .add(rightShoulder)
    //   .add(leftFoot)
    //   .add(rightFoot);


    this.sceneE = new Scene().add(
      new Mesh(new HollowTriangle(400, 400, 200), new BasicMaterial())
    );
    this.sceneE.name = 'Barney';
    // console.log(this.sceneE)
    // // this.sceneE.position.z = 25;

    // let animation = {};
    // SceneManager.toAnimation(this.sceneE, animation);
    // console.log(animation);

    // Articulated Person: from JSON
    this.person = SceneManager.loadJSON(PersonJSON);
    this.barney = SceneManager.loadJSON(BarneyJSON);
    this.bunny = SceneManager.loadJSON(BunnyJSON);

    this.scene = this.person;
    this.selectedMesh = this.scene;
    this.setSelectedMeshOnScene();

    console.log(this.scene);
    console.log(this.selectedMesh);
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
    } else if (newScene == Model.Barney) {
      this.scene = this.barney;
    } else if (newScene == Model.Bunny){
      this.scene = this.bunny;
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
    } else if (newScene == 'F') {
      this.scene = this.sceneF
    }

    this.setSelectedMeshOnScene();
  }

  setSelectedMesh(mesh: Mesh) {
    this.selectedMesh = mesh;
  }

  createObject(){
    const object = new Mesh(new BoxGeometry(this.newObject.x, this.newObject.y, this.newObject.z), new BasicMaterial());
    object.name = this.name;
    console.log(this.selectedMesh.toJSON())
    this.selectedMesh.add(object);
    console.log(this.selectedMesh.toJSON())
  }

  removeObject(){
    this.selectedMesh.removeFromParent()
  }

  exportObject(){

    const json = JSON.stringify(this.selectedMesh.toJSON());
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = 'object.json';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  importObject(object: IObject3D){
    const importedObject = SceneManager.loadJSON(object);
    console.log(importedObject);
    console.log(this.selectedMesh.name);
    this.selectedMesh.add(importedObject);
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

  static toAnimation(node: Object3D, animation: IAnimation) {
    if (node instanceof Scene || node instanceof Mesh) {
      animation[node.name] = {
        position: node.position.toJSON(),
        rotation: node.rotation.toJSON(),
        scale: node.scale.toJSON()
      };
    }

    node.children.forEach((child: Object3D) => {
      SceneManager.toAnimation(child, animation);
    });
  }
}
