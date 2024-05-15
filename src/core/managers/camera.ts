import { Camera } from '../../camera/Camera';
import { OrthographicCamera } from '../../camera/OrthographicCamera';

export class CameraManager {
  camera: Camera;
  private orthographicCamera: OrthographicCamera;

  constructor(canvas: HTMLCanvasElement) {
    this.orthographicCamera = new OrthographicCamera(
      -canvas.clientWidth / 2,
      canvas.clientWidth / 2,
      canvas.clientHeight / 2,
      -canvas.clientHeight / 2,
      -500,
      500
    );
    this.camera = this.orthographicCamera;
  }

  get() {
    return this.camera;
  }

  setCamera(newCamera: string) {
    if (newCamera == 'orthographic') {
      this.camera = this.orthographicCamera;
    }
  }
}
