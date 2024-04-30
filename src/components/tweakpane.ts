import { ButtonApi, Pane } from 'tweakpane';
import { BindingApi } from '@tweakpane/core';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface Coordinate {
  x: number;
  y: number;
  z: number;
}

export class Tweakpane {
  pane: Pane;

  modelBinding: BindingApi;
  modelParams: {
    model: string;
  } = {
    model: 'A'
  };

  materialBinding: BindingApi;
  materialParams: {
    material: string;
  } = {
    material: 'Basic'
  };

  diffuseColorBinding: BindingApi;
  diffuseTextureBinding: BindingApi;
  diffuseParams: {
    color: RGB;
    texture: string;
  } = {
    color: {
      r: 255,
      g: 0,
      b: 0
    },
    texture: 'A'
  };

  specularColorBinding: BindingApi;
  specularTextureBinding: BindingApi;
  specularParams: {
    color: RGB;
    texture: string;
  } = {
    color: {
      r: 255,
      g: 0,
      b: 0
    },
    texture: 'A'
  };

  bumpTextureBinding: BindingApi;
  bumpParams: {
    texture: string;
  } = {
    texture: 'A'
  };

  frameBinding: BindingApi;
  frameParams: {
    frame: string;
  } = {
    frame: '1 of 10'
  };

  fpsBinding: BindingApi;
  fpsParams: {
    fps: string;
  } = {
    fps: '30'
  };

  controllerParams: {
    play: boolean;
    reverse: boolean;
    replay: boolean;
  } = {
    play: true,
    reverse: false,
    replay: false
  };
  playBtn: ButtonApi;
  pauseBtn: ButtonApi;
  reverseBtn: BindingApi;
  replayBtn: BindingApi;

  nextBtn: ButtonApi;
  prevBtn: ButtonApi;
  firstBtn: ButtonApi;
  lastBtn: ButtonApi;

  projectionBinding: BindingApi;
  projectionParams: {
    projection: string;
  } = {
    projection: 'Orthographic'
  };

  positionParams: {
    radius: number;
    coordinate: Coordinate;
  } = {
    radius: 1,
    coordinate: {
      x: 0,
      y: 0,
      z: 0
    }
  };
  radiusBinding: BindingApi;
  coordinateBinding: BindingApi;

  resetBtn: ButtonApi;

  constructor() {
    // Get tweakpane container
    const tweakpaneContainer = document.getElementById('tweakpane-container');

    // Initialize pane
    this.pane = new Pane({
      // @ts-ignore
      container: tweakpaneContainer
    });

    // Model
    const modelFolder = this.pane.addFolder({
      title: 'Model',
      expanded: true
    });

    // Model: Selector
    this.modelBinding = modelFolder
      .addBinding(this.modelParams, 'model', {
        view: 'list',
        label: 'Model',
        options: [
          { text: 'A', value: 'A' },
          { text: 'B', value: 'B' },
          { text: 'C', value: 'C' }
        ],
        value: 'A'
      })
      .on('change', (e) => {
        this.changeModel(e.value);
      });

    // Model: Material
    const materialFolder = modelFolder.addFolder({
      title: 'Material',
      expanded: true
    });
    this.materialBinding = materialFolder
      .addBinding(this.materialParams, 'material', {
        view: 'list',
        label: 'Material',
        options: [
          { text: 'Basic', value: 'Basic' },
          { text: 'Phong', value: 'Phong' }
        ],
        value: 'Basic'
      })
      .on('change', (e) => {
        this.changeMaterial(e.value);
      });

    // Material: Diffuse
    const diffuseFolder = modelFolder.addFolder({
      title: 'Diffuse',
      expanded: true
    });

    // Diffuse: Color
    this.diffuseColorBinding = diffuseFolder
      .addBinding(this.diffuseParams, 'color', {
        picker: 'inline',
        expanded: true
      })
      .on('change', (e) => {
        this.changeDiffuseColor(e.value);
      });

    // Diffuse: Texture
    this.diffuseTextureBinding = diffuseFolder
      .addBinding(this.diffuseParams, 'texture', {
        view: 'list',
        label: 'Texture',
        options: [
          { text: 'A', value: 'A' },
          { text: 'B', value: 'B' }
        ],
        value: 'A'
      })
      .on('change', (e) => {
        this.changeDiffuseTexture(e.value);
      });

    // Material: Specular
    const specularFolder = modelFolder.addFolder({
      title: 'Specular',
      expanded: true
    });

    // Specular: Color
    this.specularColorBinding = specularFolder
      .addBinding(this.specularParams, 'color', {
        picker: 'inline',
        expanded: true
      })
      .on('change', (e) => {
        this.changeSpecularColor(e.value);
      });

    // Specular: Texture
    this.specularTextureBinding = specularFolder
      .addBinding(this.specularParams, 'texture', {
        view: 'list',
        label: 'Texture',
        options: [
          { text: 'A', value: 'A' },
          { text: 'B', value: 'B' }
        ],
        value: 'A'
      })
      .on('change', (e) => {
        this.changeSpecularTexture(e.value);
      });

    // Material: Bump
    const bumpFolder = modelFolder.addFolder({
      title: 'Bump',
      expanded: true
    });

    // Bump: Texture
    this.bumpTextureBinding = bumpFolder
      .addBinding(this.bumpParams, 'texture', {
        view: 'list',
        label: 'Texture',
        options: [
          { text: 'A', value: 'A' },
          { text: 'B', value: 'B' }
        ],
        value: 'A'
      })
      .on('change', (e) => {
        this.changeBumpTexture(e.value);
      });

    // Model : Animation
    const animationFolder = modelFolder.addFolder({
      title: 'Animation',
      expanded: true
    });

    // Animation: Frame
    this.frameBinding = animationFolder.addBinding(this.frameParams, 'frame', {
      readonly: true
    });

    // Animation: FPS
    this.fpsBinding = animationFolder.addBinding(this.fpsParams, 'fps', {
      readonly: true
    });

    // Animation: Controller
    const controllerFolder = animationFolder.addFolder({
      title: 'Controller',
      expanded: true
    });

    // Controller: Play
    this.playBtn = controllerFolder
      .addButton({ title: 'Play' })
      .on('click', () => {
        this.onPlay();
      });

    // Controller: Pause
    this.pauseBtn = controllerFolder
      .addButton({ title: 'Pause' })
      .on('click', () => {
        this.onPause();
      });

    // Controller: Reverse
    this.reverseBtn = controllerFolder
      .addBinding(this.controllerParams, 'reverse')
      .on('change', () => {
        this.onReverse();
      });

    // Controller: Auto-replay
    this.replayBtn = controllerFolder
      .addBinding(this.controllerParams, 'replay')
      .on('change', () => {
        this.onReplay();
      });

    // Controller: Next
    this.nextBtn = controllerFolder
      .addButton({ title: 'Next' })
      .on('click', () => {
        this.onNext();
      });

    // Controller: Previous
    this.prevBtn = controllerFolder
      .addButton({ title: 'Previous' })
      .on('click', () => {
        this.onPrev();
      });

    // Controller: First
    this.firstBtn = controllerFolder
      .addButton({ title: 'First' })
      .on('click', () => {
        this.onFirst();
      });

    // Controller: Last
    this.lastBtn = controllerFolder
      .addButton({ title: 'Last' })
      .on('click', () => {
        this.onLast();
      });

    // Camera
    const cameraFolder = this.pane.addFolder({
      title: 'Camera',
      expanded: true
    });

    // Camera: Projection
    this.projectionBinding = cameraFolder
      .addBinding(this.projectionParams, 'projection', {
        view: 'list',
        label: 'Projection',
        options: [
          { text: 'Orthographic', value: 'Orthographic' },
          { text: 'Oblique', value: 'Oblique' },
          { text: 'Perspective', value: 'Perspective' }
        ],
        value: 'Orthographic'
      })
      .on('change', (e) => {
        this.changeProjection(e.value);
      });

    // Camera: Position
    const positionFolder = cameraFolder.addFolder({
      title: 'Position',
      expanded: true
    });

    // Position: Radius
    this.radiusBinding = positionFolder
      .addBinding(this.positionParams, 'radius', {
        view: 'slider',
        label: 'radius',
        min: 0.1,
        max: 3,
        value: 1
      })
      .on('change', (ev) => {
        this.changeRadius(ev.value);
      });

    // Position: Coordinate
    this.coordinateBinding = positionFolder
      .addBinding(this.positionParams, 'coordinate', {})
      .on('change', (ev) => {
        this.changeCoordinate(ev.value);
      });

    // Camera: Reset
    this.resetBtn = cameraFolder
      .addButton({ title: 'Reset' })
      .on('click', () => {
        this.onReset();
      });
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
    this.controllerParams.play = true;
  }

  onPause() {
    console.log('Pause');
    this.controllerParams.play = false;
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

  onReset() {
    console.log('Reset');
  }
}
