import ShaderMaterial from '../mesh/material/ShaderMaterial';
import BasicMaterial from '../mesh/material/basic/BasicMaterial';
import PhongMaterial from '../mesh/material/phong/PhongMaterial';
import { RGB, Coordinate } from './interface';
import { WebGL } from './webgl';

export class StateManager {
  private static instance: StateManager;

  // Tweakpane Variables
  model = 'A';
  material = 'Basic';
  diffuseColor: RGB = { r: 255, g: 0, b: 0 };
  diffuseTexture = 'A';
  specularColor: RGB = { r: 255, g: 0, b: 0 };
  specularTexture = 'A';
  bumpTexture = 'A';
  frame = '1 of 10';
  fps = '30';
  controller = { play: true, reverse: false, replay: false };
  projection = 'Orthographic';
  cameraPosition = {
    radius: 1,
    coordinate: { x: 0, y: 0, z: 0 } as Coordinate
  };

  translate = { x: 0, y: 0, z: 0 } as Coordinate;
  rotate = { x: 0, y: 0, z: 0 } as Coordinate;
  scale = { x: 1, y: 1, z: 1 } as Coordinate;

  // State Variables
  private currentTranslate = { x: 0, y: 0, z: 0 } as Coordinate;
  private currentRotate = { x: 0, y: 0, z: 0 } as Coordinate;
  private currentScale = { x: 1, y: 1, z: 1 } as Coordinate;

  // WebGL
  private webGL: WebGL | undefined;

  // Shader Material
  shader: ShaderMaterial;
  private basicMaterial: BasicMaterial;
  private phongMaterial: PhongMaterial;

  private constructor() {
    this.basicMaterial = new BasicMaterial();
    this.phongMaterial = new PhongMaterial();
    this.shader = this.basicMaterial;
  }

  public static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  setWebGL(webGL: WebGL) {
    this.webGL = webGL;
  }

  changeModel(newModel: string) {
    console.log(newModel);
  }

  changeMaterial(newMaterial: string) {
    console.log(newMaterial);

    if (newMaterial == 'basic') {
      this.shader = this.basicMaterial;
    } else {
      this.shader = this.phongMaterial;
    }
  }

  changeDiffuseColor(newColor: RGB) {
    console.log(newColor);

    this.shader.setColor(newColor.r, newColor.g, newColor.b);
  }

  changeDiffuseTexture(newTexture: string) {
    console.log(newTexture);
  }

  changeSpecularColor(newColor: RGB) {
    console.log(newColor);
  }

  changeSpecularTexture(newTexture: string) {
    console.log(newTexture);
  }

  changeBumpTexture(newTexture: string) {
    console.log(newTexture);
  }

  onPlay() {
    console.log('play');
    this.controller.play = true;
  }

  onPause() {
    console.log('Pause');
    this.controller.play = false;
  }

  onReverse() {
    console.log('Reverse');
  }

  onReplay() {
    console.log('Replay');
  }

  onNext() {
    console.log('Next');
  }

  onPrev() {
    console.log('Prev');
  }

  onFirst() {
    console.log('First');
  }

  onLast() {
    console.log('Last');
  }

  changeProjection(newProjection: string) {
    console.log(newProjection);
  }

  changeRadius(newRadius: number) {
    console.log(newRadius);
  }

  changeCoordinate(newCoordinate: Coordinate) {
    console.log(newCoordinate);
  }

  onResetCamera() {
    console.log('Reset Camera');
  }

  onTranslateChanged(newTranslate: Coordinate) {
    const dX = newTranslate.x - this.currentTranslate.x;
    const dY = newTranslate.y - this.currentTranslate.y;
    const dZ = newTranslate.z - this.currentTranslate.z;

    // Translate Matrix
    console.log(newTranslate);
    console.log(this.currentTranslate);
    console.log(dX, dY, dZ);

    this.currentTranslate = { ...newTranslate };
  }

  onRotateChanged(newRotate: Coordinate) {
    const dX = newRotate.x - this.currentRotate.x;
    const dY = newRotate.y - this.currentRotate.y;
    const dZ = newRotate.z - this.currentRotate.z;

    // Rotate Matrix
    console.log(newRotate);
    console.log(dX, dY, dZ);

    this.currentRotate = { ...newRotate };
  }

  onScaleChanged(newScale: Coordinate) {
    const dX = newScale.x / this.currentScale.x;
    const dY = newScale.y / this.currentScale.y;
    const dZ = newScale.z / this.currentScale.z;

    // Scale Matrix
    console.log(newScale);
    console.log(dX, dY, dZ);

    this.currentScale = { ...newScale };
  }
}
