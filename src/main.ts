import './style.css';
import { Tweakpane } from './components/tweakpane.ts';
import { WebGL } from './core/webgl.ts';
import { StateManager } from './core/state.ts';
import { TestMatrix } from './core/math/matrix/test.ts';
import { Scene } from './core/scene.ts';
import { OrthographicCamera } from './camera/OrthographicCamera.ts';
import { Mesh } from './core/mesh.ts';
import { BoxGeometry } from './mesh/geometry/boxGeometry.ts';
import BasicMaterial from './mesh/material/basic/BasicMaterial.ts';

document.addEventListener('DOMContentLoaded', function () {
  onMounted();
});

const onMounted = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (!canvas) return;

  // const gl = canvas.getContext('webgl');
  // if (!gl) return;

  const state = StateManager.getInstance();

  const webGL = new WebGL(canvas);
  state.setWebGL(webGL);

  const tweakpane = new Tweakpane();

  // Scene
  const scene = new Scene();

  const mesh = new Mesh(new BoxGeometry(200, 200, 200), new BasicMaterial());

  mesh.localMatrix = mesh.localMatrix.rotate(45, 45, 0);
  mesh.computeLocalMatrix();

  mesh.localMatrix = mesh.localMatrix.rotate(-45, -45, 0);
  mesh.computeLocalMatrix();

  scene.add(mesh);

  // Camera
  const camera = new OrthographicCamera(
    -canvas.clientWidth / 2,
    canvas.clientWidth / 2,
    canvas.clientHeight / 2,
    -canvas.clientHeight / 2,
    -500,
    500
  );

  console.log(camera);

  webGL.draw(scene, camera);
};
