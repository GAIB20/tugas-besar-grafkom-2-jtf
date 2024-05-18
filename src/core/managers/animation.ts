import { IAnimationClip } from '../interface';
import PersonAnimation from '../../../test-data/articulated-model/person-animation.json';
import { Model } from '../../constants/model';
import { StateManager } from './state';

export class AnimationManager {
  state?: StateManager;
  animation: IAnimationClip;
  private personAnimation: IAnimationClip;

  fps: number = 30;

  status: string = '';
  frame: number = 1;

  play: boolean = false;
  reverse: boolean = false;
  replay: boolean = false;

  constructor() {
    this.personAnimation = PersonAnimation;

    this.animation = this.personAnimation;
    this.resetStatus();
  }

  resetStatus() {
    this.status = this.frame + ' of ' + this.animation.length;
    this.frame = 1;
    this.play = false;
    this.reverse = false;
    this.replay = false;
  }

  setAnimation(scene: string) {
    switch (scene) {
      case Model.Person:
        this.animation = this.personAnimation;
        break;
      default:
        this.status = 'No Animation';
        return;
    }

    this.resetStatus();
  }

  onNext() {
    console.log('Next');
  }

  onPrev() {
    console.log('Prev');
  }

  onFirst() {
    console.log('First');
  }

  onLast() {
    console.log('Last');
  }
}
