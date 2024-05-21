import './style.css';
import { Tweakpane } from './components/tweakpane.ts';
import { WebGL } from './core/webgl.ts';
import { StateManager } from './core/managers/state.ts';
import { ShaderManager } from './core/managers/shader.ts';
import { CameraManager } from './core/managers/camera.ts';
import { SceneManager } from './core/managers/scene.ts';
import { SceneGraph } from './components/scenegraph.ts';
import { OrbitControls } from './core/control/orbit.ts';
import { AnimationManager } from './core/managers/animation.ts';

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
  const orbitControl = new OrbitControls(cameraManager.get(), canvas);
  const animationManager = new AnimationManager();

  const state = StateManager.getInstance(
    webGL,
    shaderManager,
    sceneManager,
    cameraManager,
    orbitControl,
    animationManager
  );

  const tweakpane = new Tweakpane();
  state.setTweakpane(tweakpane);

  const scenegraph = new SceneGraph();

  let lastFrameTime: number;

  function runAnim(currentTime?: number) {
    if (!currentTime) currentTime = 0;
    if (lastFrameTime === undefined) lastFrameTime = currentTime;
    const deltaSecond = (currentTime - lastFrameTime) / 1000;

    animationManager.animate(deltaSecond);
    webGL.draw(state.sceneManager.get(), state.cameraManager.get());

    lastFrameTime = currentTime;
    requestAnimationFrame(runAnim);
  }

  runAnim();
};
