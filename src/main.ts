import './style.css';
import { Tweakpane } from './components/tweakpane.ts';
import { WebGL } from './core/webgl.ts';
import { StateManager } from './core/managers/state.ts';
import { ShaderManager } from './core/managers/shader.ts';
import { CameraManager } from './core/managers/camera.ts';
import { SceneManager } from './core/managers/scene.ts';
import { SceneGraph } from './components/scenegraph.ts';
import { OrbitControls } from './core/control/orbit.ts';

document.addEventListener('DOMContentLoaded', function () {
  onMounted();
});

const onMounted = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (!canvas) return;

  const shaderManager = new ShaderManager();
  const sceneManager = new SceneManager();
  const cameraManager = new CameraManager(canvas);
  const webGL = new WebGL(canvas, shaderManager.get());
  
  const state = StateManager.getInstance(
    webGL,
    shaderManager,
    sceneManager,
    cameraManager
  );
  const orbitControl = new OrbitControls(state.cameraManager.get(), canvas);

  const tweakpane = new Tweakpane();
  state.setTweakpane(tweakpane);

  const scenegraph = new SceneGraph();

  function render(time: number) {
    // TODO: Animation
    // time *= 0.001;
    // const deltaTime = time - lastTime;
    // lastTime = time;
    console.log(state.cameraManager.get().name)
    orbitControl.camera = state.cameraManager.get();
    orbitControl.update();
    webGL.draw(state.sceneManager.get(), state.cameraManager.get());

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
};
