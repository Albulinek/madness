import {VOIDFORM_INSANITY_DRAIN_INCREMENT, VOIDFORM_INSANITY_INIT_DRAIN} from "./Constants.ts";
import TimerEvent = Phaser.Time.TimerEvent;
import type {GameScene} from "./components/GameScene.tsx";
type TimerEventConfig = Phaser.Types.Time.TimerEventConfig;

// Types
type INSANITY_SETTER_CB = (val: number) => number;
type PURE_CB = () => void;
// ----

export class Voidform {
  private stacks: number = 0;

  private decreaseInsanity: INSANITY_SETTER_CB;
  private onExit: PURE_CB;
  private getCurrentInsanity: () => number;
  private registerVoidformEvent: PURE_CB = () => null;
  private killVoidformEvent: PURE_CB = () => null;
  private inVoidform: boolean = false;
  private onStackChange?: (val: number) => void;

  // Public
  constructor(decreaseInsanity: INSANITY_SETTER_CB, getCurrentInsanity: () => number, onExit?: PURE_CB) {
    this.decreaseInsanity = decreaseInsanity;
    this.onExit = onExit ? onExit : () => console.log('On exit not defined!');
    this.getCurrentInsanity = getCurrentInsanity;
  }

  registerTimeEventCallbacks(scene: GameScene) {
    const voidformEventConfig = {
      delay: 1000,
      loop: true,
      callback: this.voidformTick
    } as TimerEventConfig;
    let voidformEvent: TimerEvent;

    this.registerVoidformEvent = () => {
      voidformEvent = scene.time.addEvent(voidformEventConfig);
    };
    this.killVoidformEvent = () => {
      voidformEvent?.remove();
    };
  }

  enterVoidform = () => {
    if (this.inVoidform) {
      return console.log("Already in voidform!");
    }

    if (this.getCurrentInsanity() < 100) {
      return console.log("Not enough insanity!");
    }

    this.setStacks(1);
    this.inVoidform = true;
    this.registerVoidformEvent();
  }

  registerOnStackChangeCallback = (onStackChange: (stackCount: number) => void) => {
    this.onStackChange = onStackChange;
}

  // Private
  private voidformTick = () => {
    const nonStartingStacks = this.stacks > 1 ? this.stacks - 1 : 0; // Better safe than sorry
    const currentInsanity = this.decreaseInsanity(
      VOIDFORM_INSANITY_INIT_DRAIN + VOIDFORM_INSANITY_DRAIN_INCREMENT * nonStartingStacks
    );

    if (currentInsanity !== 0) {
      return this.setStacks(this.stacks + 1);
    }

    this.inVoidform = false;
    this.setStacks(0);
    this.killVoidformEvent();
    this.onExit();
  }

  setStacks = (val: number) => {
    this.stacks = val;
    this.onStackChange && this.onStackChange(val);
    return val;
  }
}