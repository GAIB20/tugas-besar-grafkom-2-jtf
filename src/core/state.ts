import { RGB, Coordinate } from './interface';

export class StateManager {
  private static instance: StateManager;

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
  position = { radius: 1, coordinate: { x: 0, y: 0, z: 0 } as Coordinate };

  private constructor() {}

  public static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  changeModel(newModel: string) {
    console.log(newModel);
  }

  changeMaterial(newMaterial: string) {
    console.log(newMaterial);
  }

  changeDiffuseColor(newColor: RGB) {
    console.log(newColor);
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
}
