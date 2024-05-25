import { ButtonApi, Pane } from 'tweakpane';
import { BindingApi } from '@tweakpane/core';
import { StateManager } from '../core/managers/state';
import { Model } from '../constants/model';
import { Ease } from '../constants/animation';
 




export class Tweakpane {
  pane: Pane;
  leftPane: Pane;
  state: StateManager;

  modelBinding: BindingApi;
  materialBinding: BindingApi;
  diffuseColorBinding: BindingApi;
  diffuseTextureBinding: BindingApi;
  specularColorBinding: BindingApi;
  specularTextureBinding: BindingApi;
  normalTextureBinding: BindingApi;
  parallaxTextureBinding: BindingApi;
  brightnessBinding: BindingApi;
  directionLightBinding: BindingApi;
  frameBinding: BindingApi;
  fpsBinding: BindingApi;
  playBtn: ButtonApi;
  pauseBtn: ButtonApi;
  reverseBtn: BindingApi;
  replayBtn: BindingApi;

  nextBtn: ButtonApi;
  prevBtn: ButtonApi;
  firstBtn: ButtonApi;
  lastBtn: ButtonApi;

  addLast: ButtonApi;
  addFirst: ButtonApi;
  deleteFrame: ButtonApi;
  swapFrameBefore: ButtonApi;
  swapFrameAfter: ButtonApi;
  saveFrame: ButtonApi;
  saveAnimation: ButtonApi;

  ease: BindingApi;

  projectionBinding: BindingApi;
  radiusBinding: BindingApi;
  coordinateBinding: BindingApi;

  resetCameraBtn: ButtonApi;

  // Left Pane
  translateBinding: BindingApi;
  rotateBinding: BindingApi;
  scaleBinding: BindingApi;

  objectBinding: BindingApi;
  newNameObject: BindingApi;
  newObjectBinding: BindingApi;
  addObject: ButtonApi;
  removeObject: ButtonApi;
  exportObject: ButtonApi;
  importObject: ButtonApi;

  constructor() {
    this.state = StateManager.getInstance();

    // Get tweakpane container
    const tweakpaneContainer = document.getElementById('tweakpane-container');
    const leftTweakpaneContainer = document.getElementById(
      'left-tweakpane-container'
    );

    // Initialize pane
    this.pane = new Pane({
      // @ts-ignore
      container: tweakpaneContainer
    });
    this.leftPane = new Pane({
      // @ts-ignore
      container: leftTweakpaneContainer
    });


    // Model
    const modelFolder = this.pane.addFolder({
      title: 'Model',
      expanded: true
    });

    // Model: Selector
    this.modelBinding = modelFolder
      .addBinding(this.state, 'model', {
        view: 'list',
        label: 'Model',
        options: [
          { text: 'Person', value: Model.Person },
          { text: 'Barney', value: Model.Barney },
          { text: 'Bunny', value: Model.Bunny },
          { text: 'A', value: 'A' },
          { text: 'B', value: 'B' },
          { text: 'C', value: 'C' },
          { text: 'D', value: 'D' },
          { text: 'E', value: 'E' },
          { text: 'F', value: 'F' },
          { text: 'G', value: 'G' },
        ],
        value: Model.Person
      })
      .on('change', (e) => {
        this.state.changeModel(e.value);
      });

    // Model: Material
    const materialFolder = modelFolder.addFolder({
      title: 'Material',
      expanded: true
    });
    this.materialBinding = materialFolder
      .addBinding(this.state, 'material', {
        view: 'list',
        label: 'Material',
        options: [
          { text: 'Basic', value: 'basic' },
          { text: 'Phong', value: 'phong' },
          { text: 'Reflective', value: 'reflective' },
        ]
      })
      .on('change', (e) => {
        this.state.changeMaterial(e.value);
      });

    // Material: Diffuse
    const diffuseFolder = modelFolder.addFolder({
      title: 'Diffuse',
      expanded: true
    });

    // Diffuse: Color
    this.diffuseColorBinding = diffuseFolder
      .addBinding(this.state, 'diffuseColor', {})
      .on('change', (e) => {
        this.state.changeDiffuseColor(e.value);
      });

    // Diffuse: Texture
    this.diffuseTextureBinding = diffuseFolder
      .addBinding(this.state, 'diffuseTexture', {
        view: 'list',
        label: 'Texture',
        options: [
          { text: 'No Texture', value: 'noTexture' },
          { text: 'Brick Wall', value: './test-data/textures/brick-wall/diffuse.png' },
          { text: 'Barrel', value: './test-data/textures/barrel/diffuse.png' }
        ],
        value: 'A'
      })
      .on('change', (e) => {
        this.state.changeDiffuseTexture(e.value);
      });

    // Material: Specular
    const specularFolder = modelFolder.addFolder({
      title: 'Specular',
      expanded: true
    });

    // Specular: Color
    this.specularColorBinding = specularFolder
      .addBinding(this.state, 'specularColor', {})
      .on('change', (e) => {
        this.state.changeSpecularColor(e.value);
      });

    // Specular: Texture
    this.specularTextureBinding = specularFolder
    .addBinding(this.state, 'specularTexture', {
      view: 'list',
      label: 'Specular',
      options: [
        { text: 'No Texture', value: 'noTexture' },
        { text: 'Brick Wall', value: './test-data/textures/brick-wall/specular.png' },
        { text: 'Barrel', value: './test-data/textures/barrel/specular.png' }
      ],
      value: 'A'
    })
    .on('change', (e) => {
      this.state.changeSpecularTexture(e.value);
    });

    const brightnessFolder = modelFolder.addFolder({
      title: 'Brightness',
      expanded: true
    });

    this.brightnessBinding = brightnessFolder
      .addBinding(this.state, 'brightness', {
        view: 'slider',
        label: 'brightness',
        min: 1,
        max: 128,
        value: 32
      })
      .on('change', (ev) => {
        this.state.changeBrightness(ev.value);
      });

    const directionLightFolder = modelFolder.addFolder({
      title: 'Position',
      expanded: true
    });

    this.directionLightBinding = directionLightFolder
      .addBinding(this.state.shaderManager.shader, 'directionLight', {
        x: { min: -10, max: 10, step: 0.1 },
        y: { min: -10, max: 10, step: 0.1 },
        z: { min: -10, max: 10, step: 0.1 }
      })
      .on('change', (ev) => {
        this.state.changeDirLight(ev.value);
      });

    // Material: Bump
    const bumpFolder = modelFolder.addFolder({
      title: 'Bump',
      expanded: true
    });

    // Bump: Texture
      this.normalTextureBinding = bumpFolder
      .addBinding(this.state, 'normalTexture', {
        view: 'list',
        label: 'Normal',
        options: [
          { text: 'No Texture', value: 'noTexture' },
          { text: 'Brick Wall', value: './test-data/textures/brick-wall/normal.png' },
          { text: 'Sofa', value: './test-data/textures/sofa/normal.png' }
        ],
        value: 'A'
      })
      .on('change', (e) => {
        this.state.changeNormalTexture(e.value);
      });

      this.parallaxTextureBinding = bumpFolder
      .addBinding(this.state, 'parallaxTexture', {
        view: 'list',
        label: 'Displacement',
        options: [
          { text: 'No Texture', value: 'noTexture' },
          { text: 'Brick Wall', value: './test-data/textures/brick-wall/parallax.png' },
          { text: 'Conblock', value: './test-data/textures/conblock/parallax.png' }
        ],
        value: 'A'
      })
      .on('change', (e) => {
        this.state.changeParallaxTexture(e.value);
      });

    // Model : Animation
    const animationFolder = modelFolder.addFolder({
      title: 'Animation',
      expanded: true
    });

    // Animation: Frame
    this.frameBinding = animationFolder.addBinding(
      this.state.animationManager,
      'status',
      {
        readonly: true
      }
    );

    // Animation: FPS
    this.fpsBinding = animationFolder.addBinding(
      this.state.animationManager,
      'fps',
      {
        readonly: true
      }
    );

    // Animation: Ease
    this.ease = animationFolder
      .addBinding(this.state.animationManager, 'ease', {
        view: 'list',
        label: 'Ease',
        options: [
          { text: Ease.Sine, value: Ease.Sine },
          { text: Ease.Quad, value: Ease.Quad },
          { text: Ease.Cubic, value: Ease.Cubic },
          { text: Ease.Quart, value: Ease.Quart },
          { text: Ease.Expo, value: Ease.Expo },
          { text: Ease.Circ, value: Ease.Circ }
        ],
        value: Ease.Sine
      })
      .on('change', (e) => {
        this.state.animationManager.changeEase(e.value);
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
        this.state.onPlay();
      });

    // Controller: Pause
    this.pauseBtn = controllerFolder
      .addButton({ title: 'Pause' })
      .on('click', () => {
        this.state.onPause();
      });

    // Controller: Reverse
    this.reverseBtn = controllerFolder.addBinding(
      this.state.animationManager,
      'reverse'
    );

    // Controller: Auto-replay
    this.replayBtn = controllerFolder.addBinding(
      this.state.animationManager,
      'replay'
    );

    // Controller: Next
    this.nextBtn = controllerFolder
      .addButton({ title: 'Next' })
      .on('click', () => {
        this.state.onNext();
      });

    // Controller: Previous
    this.prevBtn = controllerFolder
      .addButton({ title: 'Previous' })
      .on('click', () => {
        this.state.onPrev();
      });

    // Controller: First
    this.firstBtn = controllerFolder
      .addButton({ title: 'First' })
      .on('click', () => {
        this.state.onFirst();
      });

    // Controller: Last
    this.lastBtn = controllerFolder
      .addButton({ title: 'Last' })
      .on('click', () => {
        this.state.onLast();
      });

    // Animation: Editor
    const editorFolder = animationFolder.addFolder({
      title: 'Editor',
      expanded: true
    });

    this.addFirst = editorFolder
      .addButton({ title: 'Add First' })
      .on('click', () => {
        this.state.animationManager.addFirst();
      });

    this.addLast = editorFolder
      .addButton({ title: 'Add Last' })
      .on('click', () => {
        this.state.animationManager.addLast();
      });

    this.deleteFrame = editorFolder
      .addButton({ title: 'Delete Frame' })
      .on('click', () => {
        this.state.animationManager.deleteFrame();
      });

    this.swapFrameBefore = editorFolder
      .addButton({ title: 'Swap Frame Before' })
      .on('click', () => {
        this.state.animationManager.swapFrameBefore();
      });

    this.swapFrameAfter = editorFolder
      .addButton({ title: 'Swap Frame After' })
      .on('click', () => {
        this.state.animationManager.swapFrameAfter();
      });

    this.saveFrame = editorFolder
      .addButton({ title: 'Save Frame' })
      .on('click', () => {
        this.state.animationManager.saveFrame();
      });

    this.saveAnimation = editorFolder
      .addButton({ title: 'Save Animation' })
      .on('click', () => {
        this.state.animationManager.saveAnimation();
      });

    /**
     * Left Tweakpane
     */

    // Camera
    const cameraFolder = this.leftPane.addFolder({
      title: 'Camera',
      expanded: true
    });

    // Camera: Projection
    this.projectionBinding = cameraFolder
      .addBinding(this.state, 'projection', {
        view: 'list',
        label: 'Projection',
        options: [
          { text: 'Orthographic', value: 'orthographic' },
          { text: 'Oblique', value: 'oblique' },
          { text: 'Perspective', value: 'perspective' }
        ],
        value: 'orthographic'
      })
      .on('change', (e) => {
        this.state.changeProjection(e.value);
      });

    // Camera: Position
    const positionFolder = cameraFolder.addFolder({
      title: 'Position',
      expanded: true
    });

    // Position: Radius
    this.radiusBinding = positionFolder
      .addBinding(this.state.cameraPosition, 'radius', {
        view: 'slider',
        label: 'radius',
        min: 0.1,
        max: 3,
        value: 1
      })
      .on('change', (ev) => {
        console.log(ev.value);
        this.state.changeRadius(ev.value);
      });

    // Position: Coordinate
    this.coordinateBinding = positionFolder
      .addBinding(this.state.cameraPosition, 'coordinate', {})
      .on('change', (ev) => {
        this.state.changeCoordinate(ev.value);
      });

    // Camera: Reset
    this.resetCameraBtn = cameraFolder
      .addButton({ title: 'Reset' })
      .on('click', () => {
        this.state.onResetCamera();
      });

    const objectControllerFolder = this.leftPane.addFolder({
      title: 'Object Controller',
      expanded: true
    });

    this.objectBinding = objectControllerFolder.addBinding(
      this.state, 'status',{
        label: 'Object',
        readonly: true
      }
    )

    this.translateBinding = objectControllerFolder
      .addBinding(this.state, 'translate', {
        x: { min: -400, max: 400, step: 0.5 },
        y: { min: -400, max: 400, step: 0.5 },
        z: { min: -400, max: 400, step: 0.5 }
      })
      .on('change', (ev) => {
        this.state.onTranslateChanged(ev.value);
      });

    this.rotateBinding = objectControllerFolder
      .addBinding(this.state, 'rotate', {
        label: 'rotate(deg)'
      })
      .on('change', (ev) => {
        this.state.onRotateChanged(ev.value);
      });

    this.scaleBinding = objectControllerFolder
      .addBinding(this.state, 'scale', {
        x: { min: 0.1, max: 3, step: 0.05 },
        y: { min: 0.1, max: 3, step: 0.05 },
        z: { min: 0.1, max: 3, step: 0.05 }
      })
      .on('change', (ev) => {
        this.state.onScaleChanged(ev.value);
      });

    // Object Editor
    const objectEditorFolder = objectControllerFolder.addFolder({
      title : 'Object Editor',
      expanded : true,
    })

    this.newNameObject = objectEditorFolder.addBinding(
      this.state.sceneManager, 'name', {
        label: 'Name Object'
      }
    )

    this.newObjectBinding = objectEditorFolder.addBinding(
      this.state.sceneManager, 'newObject',{
        label: 'Size Object',
        x: { min: -400, max: 400, step: 0.5 },
        y: { min: -400, max: 400, step: 0.5 },
        z: { min: -400, max: 400, step: 0.5 }
      }
    )

    this.addObject = objectEditorFolder.addButton({ title: ' Add Object ' }).on('click',()=>{
      this.state.onCreate();
    })

    this.removeObject = objectEditorFolder.addButton({ title: ' Remove Object ' }).on('click',()=>{
      this.state.onRemove();
    })

    this.exportObject = objectEditorFolder.addButton({
      title : ' Export Object '
    }).on('click',()=>{
      this.state.onExport();
    })

    this.importObject = objectEditorFolder.addButton({
      title : ' Import Object '
    }).on('click',()=>{
      this.state.onImport();
    })




    
  }
}
