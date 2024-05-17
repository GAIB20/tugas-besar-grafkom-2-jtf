import { Tweakpane } from '../../components/tweakpane';
import { RGB, Coordinate } from '../interface';
import { Mesh } from '../mesh';
import { WebGL } from '../webgl';
import { CameraManager } from './camera';
import { SceneManager } from './scene';
import { ShaderManager } from './shader';

interface Listener {
  (data: any): void;
}

type EventName = 'sceneChange';

export class StateManager {
  private static instance: StateManager;
  private listeners: Map<EventName, Listener[]> = new Map();

  tweakpane?: Tweakpane;

  // Tweakpane Variables
  model = 'A';
  material = 'Basic';
  diffuseColor: RGB = { r: 255, g: 0, b: 0 };
  diffuseTexture = 'A';
  specularColor: RGB = { r: 255, g: 0, b: 0 };
  specularTexture = 'A';
  brightness = 32;
  directionLight = { x: 0, y: 0, z: 0 } as Coordinate
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

  // Variables
  webGL: WebGL;
  shaderManager: ShaderManager;
  sceneManager: SceneManager;
  cameraManager: CameraManager;

  isChangingUI: boolean = false;

  private constructor(
    webGL: WebGL | null = null,
    shaderManager: ShaderManager | null = null,
    sceneManager: SceneManager | null = null,
    cameraManager: CameraManager | null = null
  ) {
    if (
      webGL === null ||
      shaderManager === null ||
      sceneManager === null ||
      cameraManager === null
    ) {
      throw new Error('StateManager must be initialized with all managers');
    }

    this.webGL = webGL;
    this.shaderManager = shaderManager;
    this.sceneManager = sceneManager;
    this.cameraManager = cameraManager;

    //for emiter
    this.listeners = new Map();
  }

  public static getInstance(
    webGL: WebGL | null = null,
    shaderManager: ShaderManager | null = null,
    sceneManager: SceneManager | null = null,
    cameraManager: CameraManager | null = null
  ): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager(
        webGL,
        shaderManager,
        sceneManager,
        cameraManager
      );
    }
    return StateManager.instance;
  }

  // Emiter
  emit(eventName: EventName, data: any): void {
    const listeners = this.listeners.get(eventName);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }

  on(eventName: EventName, listener: Listener): void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)!.push(listener);
  }

  // Setter
  setTweakpane(tweakpane: Tweakpane) {
    this.tweakpane = tweakpane;
  }

  /**
   * Event Handlers
   */

  setUIWithSelectedMeshData() {
    const mesh = this.sceneManager.selectedMesh;

    if (!(mesh instanceof Mesh)) return;

    this.isChangingUI = true;

    const diffuseColor = mesh.material.getDiffuseColor().coords;
    this.diffuseColor.r = diffuseColor[0] * 255;
    this.diffuseColor.g = diffuseColor[1] * 255;
    this.diffuseColor.b = diffuseColor[2] * 255;
    this.tweakpane?.diffuseColorBinding.refresh();

    const specularColor = mesh.material.getSpecularColor().coords;
    this.specularColor.r = specularColor[0] * 255;
    this.specularColor.g = specularColor[1] * 255;
    this.specularColor.b = specularColor[2] * 255;
    this.tweakpane?.specularColorBinding.refresh();
    
    this.translate.x = mesh.position.x;
    this.translate.y = mesh.position.y;
    this.translate.z = mesh.position.z;
    this.tweakpane?.translateBinding.refresh();

    this.rotate.x = mesh.rotation.x;
    this.rotate.y = mesh.rotation.y;
    this.rotate.z = mesh.rotation.z;
    this.tweakpane?.rotateBinding.refresh();

    this.scale.x = mesh.scale.x;
    this.scale.y = mesh.scale.y;
    this.scale.z = mesh.scale.z;
    this.tweakpane?.scaleBinding.refresh();

    this.isChangingUI = false;
  }

  changeSelectedMesh(mesh: Mesh) {
    this.sceneManager.setSelectedMesh(mesh);
    this.setUIWithSelectedMeshData();
  }

  changeModel(newModel: string) {
    this.sceneManager.setScene(newModel);
    this.setUIWithSelectedMeshData();
    this.emit('sceneChange', this.sceneManager.get());
  }

  changeMaterial(newMaterial: string) {
    ShaderManager.changeMaterial(this.sceneManager.selectedMesh, newMaterial);
    // Set default params
  }

  changeDiffuseColor(newColor: RGB) {
    if (this.isChangingUI) return;

    ShaderManager.changeDiffuseColor(this.sceneManager.selectedMesh, newColor);
  }

  changeDiffuseTexture(newTexture: string) {
    console.log(newTexture);
  }

  changeSpecularColor(newColor: RGB) {
    console.log(newColor);

    ShaderManager.changeSpecularColor(this.sceneManager.selectedMesh, newColor);
  }

  changeBrightness(brightness: number) {
    ShaderManager.changeBrightness(this.sceneManager.selectedMesh, brightness);
  }

  changeDirLight(direction: Coordinate) {
    ShaderManager.changeDirectionLight(this.sceneManager.selectedMesh, direction);
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
    this.sceneManager.selectedMesh.position.x = newTranslate.x;
    this.sceneManager.selectedMesh.position.y = newTranslate.y;
    this.sceneManager.selectedMesh.position.z = newTranslate.z;

    this.sceneManager.selectedMesh.computeWorldMatrix();
  }

  onRotateChanged(newRotate: Coordinate) {
    this.sceneManager.selectedMesh.rotation.x = newRotate.x;
    this.sceneManager.selectedMesh.rotation.y = newRotate.y;
    this.sceneManager.selectedMesh.rotation.z = newRotate.z;

    this.sceneManager.selectedMesh.computeWorldMatrix();
  }

  onScaleChanged(newScale: Coordinate) {
    this.sceneManager.selectedMesh.scale.x = newScale.x;
    this.sceneManager.selectedMesh.scale.y = newScale.y;
    this.sceneManager.selectedMesh.scale.z = newScale.z;

    this.sceneManager.selectedMesh.computeWorldMatrix();
  }
}
