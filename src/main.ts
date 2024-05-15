import './style.css';
import { Tweakpane } from './components/tweakpane.ts';
import { WebGL } from './core/webgl.ts';
import { StateManager } from './core/managers/state.ts';
import { ShaderManager } from './core/managers/shader.ts';
import { CameraManager } from './core/managers/camera.ts';
import { SceneManager } from './core/managers/scene.ts';
import { SceneGraph } from './components/scenegraph.ts';

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

  const tweakpane = new Tweakpane();
  const scenegraph = new SceneGraph();

  function render(time: number) {
    // TODO: Animation
    // time *= 0.001;
    // const deltaTime = time - lastTime;
    // lastTime = time;

    webGL.draw(state.sceneManager.get(), state.cameraManager.get());

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
};
