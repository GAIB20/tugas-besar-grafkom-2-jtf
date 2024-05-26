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
import { HollowTrapesium } from '../../mesh/geometry/hollow/HollowTrapesium';

export class SceneManager {
  scene: Scene;
  private person: Scene;
  private barney: Scene;
  private bunny: Scene;
  private hollowBox: Scene;
  private hollowTriangle: Scene;
  private hollowTrapesium: Scene;
  private box: Scene;
  private plane: Scene;

  selectedMesh: Object3D;
  //Binding New Object
  name = '';
  newObject = { x: 0, y: 0, z: 0 } as Coordinate;

  constructor() {
    // Articulated Person: from JSON
    this.person = SceneManager.loadJSON(PersonJSON);
    this.barney = SceneManager.loadJSON(BarneyJSON);
    this.bunny = SceneManager.loadJSON(BunnyJSON);

    // Hollow
    this.hollowBox = new Scene().add(
      new Mesh(new HollowBox(400, 200, 200), new BasicMaterial())
    );
    this.hollowBox.name = 'Hollow Box';

    this.hollowTriangle = new Scene().add(
      new Mesh(new HollowTriangle(400, 400, 200), new BasicMaterial())
    );
    this.hollowTriangle.name = 'Hollow Triangle';

    this.hollowTrapesium = new Scene().add(
      new Mesh(new HollowTrapesium(200, 400, 200), new BasicMaterial())
    );
    this.hollowTrapesium.name = 'Hollow Trapesium';

    // Box
    this.box = new Scene().add(
      new Mesh(new BoxGeometry(200, 200, 200), new BasicMaterial())
    );

    // Plane
    this.plane = new Scene().add(
      new Mesh(new PlaneGeometry(300, 300), new BasicMaterial())
    );

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
    switch (newScene) {
      case Model.Person:
        this.scene = this.person;
        break;
      case Model.Barney:
        this.scene = this.barney;
        break;
      case Model.Bunny:
        this.scene = this.bunny;
        break;
      case Model.HollowBox:
        this.scene = this.hollowBox;
        break;
      case Model.HollowTriangle:
        this.scene = this.hollowTriangle;
        break;
      case Model.HollowTrapesium:
        this.scene = this.hollowTrapesium;
        break;
      case Model.Box:
        this.scene = this.box;
        break;
      case Model.Plane:
        this.scene = this.plane;
        break;
      default:
        break;
    }

    this.setSelectedMeshOnScene();
  }

  setSelectedMesh(mesh: Mesh) {
    this.selectedMesh = mesh;
  }

  createObject() {
    const object = new Mesh(
      new BoxGeometry(this.newObject.x, this.newObject.y, this.newObject.z),
      new BasicMaterial()
    );
    object.name = this.name;
    console.log(this.selectedMesh.toJSON());
    this.selectedMesh.add(object);
    console.log(this.selectedMesh.toJSON());
  }

  removeObject() {
    this.selectedMesh.removeFromParent();
  }

  exportObject() {
    const json = JSON.stringify(this.selectedMesh.toJSON());
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = 'object.json';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  importObject(object: IObject3D) {
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
