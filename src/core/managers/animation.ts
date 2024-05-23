import { IAnimationClip } from '../interface';
import PersonAnimation from '../../../test-data/articulated-model/person-animation.json';
import { Model } from '../../constants/model';
import { StateManager } from './state';
import { Object3D } from '../object3D';
import { SceneManager } from './scene';
import { Ease } from '../../constants/animation';

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

  ease: Ease = Ease.Sine;

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

    this.interpolateFrame(this.deltaFrame);
  }

  private updateScene(node?: Object3D, interpolatedProperties?: any) {
    if (!node) return;

    const animation =
      interpolatedProperties?.[node.name] ??
      this.animation?.[this.frame]?.[node.name];

    if (animation) {
      node.position.x = animation.position?.x ?? node.position.x;
      node.position.y = animation.position?.y ?? node.position.y;
      node.position.z = animation.position?.z ?? node.position.z;

      node.rotation.x = animation.rotation?.x ?? node.rotation.x;
      node.rotation.y = animation.rotation?.y ?? node.rotation.y;
      node.rotation.z = animation.rotation?.z ?? node.rotation.z;

      node.scale.x = animation.scale?.x ?? node.scale.x;
      node.scale.y = animation.scale?.y ?? node.scale.y;
      node.scale.z = animation.scale?.z ?? node.scale.z;

      node.computeWorldMatrix();
    }

    node.children.forEach((child: Object3D) => {
      this.updateScene(child, interpolatedProperties);
    });
  }

  updateStatus() {
    this.status = this.frame + 1 + ' of ' + this.getAnimationLength();
  }

  private updateAll(interpolatedProperties?: any) {
    this.updateStatus();
    this.updateScene(this.state?.sceneManager.get(), interpolatedProperties);
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

  private easeInOut(x: number) {
    switch (this.ease) {
      case Ease.Sine:
        return -(Math.cos(Math.PI * x) - 1) / 2;
      case Ease.Quad:
        return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      case Ease.Cubic:
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      case Ease.Quart:
        return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
      case Ease.Expo:
        return x === 0
          ? 0
          : x === 1
          ? 1
          : x < 0.5
          ? Math.pow(2, 20 * x - 10) / 2
          : (2 - Math.pow(2, -20 * x + 10)) / 2;
      case Ease.Circ:
        return x < 0.5
          ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
          : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
      default:
        return x;
    }
  }

  private interpolateFrame(t: number) {
    const nextFrame = this.reverse
      ? this.frame === 0
        ? this.getAnimationLength() - 1
        : this.frame - 1
      : (this.frame + 1) % this.getAnimationLength();
    const easeInOut = this.easeInOut(t);

    const interpolatedProperties: any = {};

    for (const key in this.animation![this.frame]) {
      if (
        this.animation![this.frame].hasOwnProperty(key) &&
        this.animation![nextFrame].hasOwnProperty(key)
      ) {
        const current = this.animation![this.frame][key];
        const next = this.animation![nextFrame][key];

        if (current && next) {
          interpolatedProperties[key] = {
            position: {
              x:
                (current.position?.x ?? 0) +
                ((next.position?.x ?? 0) - (current.position?.x ?? 0)) *
                  easeInOut,
              y:
                (current.position?.y ?? 0) +
                ((next.position?.y ?? 0) - (current.position?.y ?? 0)) *
                  easeInOut,
              z:
                (current.position?.z ?? 0) +
                ((next.position?.z ?? 0) - (current.position?.z ?? 0)) *
                  easeInOut
            },
            rotation: {
              x:
                (current.rotation?.x ?? 0) +
                ((next.rotation?.x ?? 0) - (current.rotation?.x ?? 0)) *
                  easeInOut,
              y:
                (current.rotation?.y ?? 0) +
                ((next.rotation?.y ?? 0) - (current.rotation?.y ?? 0)) *
                  easeInOut,
              z:
                (current.rotation?.z ?? 0) +
                ((next.rotation?.z ?? 0) - (current.rotation?.z ?? 0)) *
                  easeInOut
            },
            scale: {
              x:
                (current.scale?.x ?? 1) +
                ((next.scale?.x ?? 1) - (current.scale?.x ?? 1)) * easeInOut,
              y:
                (current.scale?.y ?? 1) +
                ((next.scale?.y ?? 1) - (current.scale?.y ?? 1)) * easeInOut,
              z:
                (current.scale?.z ?? 1) +
                ((next.scale?.z ?? 1) - (current.scale?.z ?? 1)) * easeInOut
            }
          };
        }
      }
    }

    this.updateAll(interpolatedProperties);

    // Go to next frame
    if (this.deltaFrame >= 1) {
      if (this.reverse) {
        if (this.frame < 1) {
          this.frame = this.getAnimationLength() - 1;
        } else {
          this.frame -= 1;
        }
      } else {
        this.frame = (this.frame + 1) % this.getAnimationLength();
      }
      this.deltaFrame = 0;
    }
  }

  changeEase(newEase: Ease) {
    this.ease = newEase;
  }
}
