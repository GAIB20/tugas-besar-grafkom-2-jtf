import { IAnimationClip } from '../interface';
import PersonAnimation from '../../../test-data/articulated-model/person-animation.json';
import { Model } from '../../constants/model';
import { StateManager } from './state';
import { Object3D } from '../object3D';

export class AnimationManager {
  state?: StateManager;
  animation?: IAnimationClip;
  private personAnimation: IAnimationClip;

  fps: number = 30;

  status: string = '';
  frame: number = 0;

  play: boolean = false;
  reverse: boolean = false;
  replay: boolean = false;

  private deltaFrame: number = 0;

  constructor() {
    this.personAnimation = PersonAnimation;

    this.animation = this.personAnimation;
    this.resetStatus();
  }

  get() {
    return this.animation![this.frame];
  }

  animate(deltaSecond: number) {
    if (!this.play) return;
    if (!this.state) {
      this.state = StateManager.getInstance();
    }

    this.deltaFrame += deltaSecond * this.fps;
    if (this.deltaFrame < 1) return;

    if (!this.replay) {
      if (this.reverse) {
        if (this.frame == 0) {
          this.play = false;
          return;
        }
      } else {
        if (this.frame == this.getAnimationLength() - 1) {
          this.play = false;
          return;
        }
      }
    }

    this.onNext();
    this.deltaFrame %= 1;
  }

  private updateScene(node?: Object3D) {
    if (!node) return;

    if (this.animation && this.animation[this.frame][node.name]) {
      const animation = this.animation[this.frame][node.name];

      node.position.x = animation?.position?.x ?? node.position.x;
      node.position.y = animation?.position?.y ?? node.position.y;
      node.position.z = animation?.position?.z ?? node.position.z;

      node.rotation.x = animation?.rotation?.x ?? node.rotation.x;
      node.rotation.y = animation?.rotation?.y ?? node.rotation.y;
      node.rotation.z = animation?.rotation?.z ?? node.rotation.z;

      node.scale.x = animation?.scale?.x ?? node.scale.x;
      node.scale.y = animation?.scale?.y ?? node.scale.y;
      node.scale.z = animation?.scale?.z ?? node.scale.z;

      node.computeWorldMatrix();
    }

    node.children.forEach((child: Object3D) => {
      this.updateScene(child);
    });
  }

  updateStatus() {
    this.status = this.frame + 1 + ' of ' + this.getAnimationLength();
  }

  resetStatus() {
    this.frame = 0;
    this.play = false;
    this.reverse = false;
    this.replay = false;
    this.updateStatus();
  }

  setAnimation(model: string) {
    switch (model) {
      case Model.Person:
        this.animation = this.personAnimation;
        break;
      default:
        this.status = 'No Animation';
        this.animation = undefined;
        return;
    }

    if (!this.state) {
      this.state = StateManager.getInstance();
    }

    this.resetStatus();
  }

  onNext() {
    if (!this.state) {
      this.state = StateManager.getInstance();
    }

    if (this.reverse) {
      if (this.frame < 1) {
        this.frame = this.getAnimationLength() - 1;
      } else {
        this.frame -= 1;
      }
    } else {
      this.frame = (this.frame + 1) % this.getAnimationLength();
    }

    this.updateStatus();
    this.updateScene(this.state?.sceneManager.get());
    this.state?.setUIWithSelectedMeshData();
  }

  onPrev() {
    if (!this.state) {
      this.state = StateManager.getInstance();
    }

    if (!this.reverse) {
      if (this.frame < 1) {
        this.frame = this.getAnimationLength() - 1;
      } else {
        this.frame -= 1;
      }
    } else {
      this.frame = (this.frame + 1) % this.getAnimationLength();
    }

    this.updateStatus();
    this.updateScene(this.state?.sceneManager.get());
    this.state?.setUIWithSelectedMeshData();
  }

  onFirst() {
    if (!this.state) {
      this.state = StateManager.getInstance();
    }

    this.frame = 0;
    this.updateStatus();
    this.updateScene(this.state?.sceneManager.get());
    this.state?.setUIWithSelectedMeshData();
  }

  onLast() {
    if (!this.state) {
      this.state = StateManager.getInstance();
    }

    this.frame = this.getAnimationLength() - 1;
    this.updateStatus();
    this.updateScene(this.state?.sceneManager.get());
    this.state?.setUIWithSelectedMeshData();
  }

  getAnimationLength() {
    return this.animation ? this.animation.length : 0;
  }
}
