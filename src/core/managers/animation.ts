import { IAnimationClip } from '../interface';
import PersonAnimation from '../../../test-data/articulated-model/person-animation.json';
import { Model } from '../../constants/model';
import { StateManager } from './state';
import { Object3D } from '../object3D';
import { SceneManager } from './scene';

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

  private getState() {
    if (!this.state) {
      this.state = StateManager.getInstance();
    }
  }

  animate(deltaSecond: number) {
    if (!this.play) return;
    this.getState();

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

  private updateAll() {
    this.updateStatus();
    this.updateScene(this.state?.sceneManager.get());
    this.state?.setUIWithSelectedMeshData();
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

    this.getState();

    this.resetStatus();
  }

  onNext() {
    this.getState();

    if (this.reverse) {
      if (this.frame < 1) {
        this.frame = this.getAnimationLength() - 1;
      } else {
        this.frame -= 1;
      }
    } else {
      this.frame = (this.frame + 1) % this.getAnimationLength();
    }

    this.updateAll();
  }

  onPrev() {
    this.getState();

    if (!this.reverse) {
      if (this.frame < 1) {
        this.frame = this.getAnimationLength() - 1;
      } else {
        this.frame -= 1;
      }
    } else {
      this.frame = (this.frame + 1) % this.getAnimationLength();
    }

    this.updateAll();
  }

  onFirst() {
    this.getState();

    this.frame = 0;
    this.updateAll();
  }

  onLast() {
    this.getState();

    this.frame = this.getAnimationLength() - 1;
    this.updateAll();
  }

  getAnimationLength() {
    return this.animation ? this.animation.length : 0;
  }

  private getCurrentAnimationClip() {
    this.getState();

    const currentScene = this.state?.sceneManager.get();

    if (!currentScene) return;

    let animation = {};
    SceneManager.toAnimation(currentScene, animation);
    console.log(animation);

    return animation;
  }

  addFirst() {
    if (!this.animation) return;

    const clip = this.getCurrentAnimationClip();
    if (!clip) return;

    this.animation?.unshift(clip);
    this.onFirst();
  }

  addLast() {
    if (!this.animation) return;

    const clip = this.getCurrentAnimationClip();
    if (!clip) return;

    this.animation?.push(clip);
    this.onLast();
  }

  deleteFrame() {
    if (!this.animation) return;

    this.animation.splice(this.frame, 1);
    if (this.frame >= this.getAnimationLength()) {
      this.frame = this.getAnimationLength() - 1;
    }

    this.updateAll();
  }

  swapFrameBefore() {
    if (!this.animation || this.frame <= 0) return;

    const temp = this.animation[this.frame];
    this.animation[this.frame] = this.animation[this.frame - 1];
    this.animation[this.frame - 1] = temp;
    this.frame--;
    this.updateAll();
  }

  swapFrameAfter() {
    if (!this.animation || this.frame >= this.animation.length - 1) return;

    const temp = this.animation[this.frame];
    this.animation[this.frame] = this.animation[this.frame + 1];
    this.animation[this.frame + 1] = temp;
    this.frame++;
    this.updateAll();
  }

  saveFrame() {
    if (!this.animation) return;

    const clip = this.getCurrentAnimationClip();
    if (!clip) return;

    this.animation[this.frame] = clip;
  }

  saveAnimation() {
    const json = JSON.stringify(this.animation);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = 'animation.json';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
