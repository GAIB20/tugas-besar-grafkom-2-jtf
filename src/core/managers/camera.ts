import { Camera } from '../../camera/Camera';
import { ObliqueCamera } from '../../camera/ObliqueCamera';
import { OrthographicCamera } from '../../camera/OrthographicCamera';
import { PerspectiveCamera } from '../../camera/PerspectiveCamera';

export class CameraManager {
  camera: Camera;
  private orthographicCamera: OrthographicCamera;
  private obliqueCamera : ObliqueCamera;
  private perspectiveCamera : PerspectiveCamera;

  constructor(canvas: HTMLCanvasElement) {
    this.orthographicCamera = new OrthographicCamera(
      -canvas.clientWidth / 2,
      canvas.clientWidth / 2,
      -canvas.clientHeight / 2,
      canvas.clientHeight / 2,
      -500,
      500
    );

    this.obliqueCamera = new ObliqueCamera(
      -canvas.clientWidth / 2,
      canvas.clientWidth / 2,
      -canvas.clientHeight / 2,
      canvas.clientHeight / 2,
      -500,
      500,
      45,
    );

    this.perspectiveCamera = new PerspectiveCamera(
      60,
      0.01,
      canvas.clientWidth / canvas.clientHeight,
      999,
    )

    this.camera = this.orthographicCamera;
  }

  get() {
    return this.camera;
  }

  setCamera(newCamera: string) {
    if (newCamera == 'orthographic') {
      this.camera = this.orthographicCamera;
    }else if(newCamera == 'oblique'){
      this.camera = this.obliqueCamera;
    }else if(newCamera == 'perspective'){
      this.camera = this.perspectiveCamera;
    }
  }

  zoomCamera(delta: number){
    this.camera.zoom = delta;
    this.camera.computeProjectionMatrix();
  }

  resetCamera(){
    
  }
}
