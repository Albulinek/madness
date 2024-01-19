import {VOIDFORM_INSANITY_DRAIN_INCREMENT, VOIDFORM_INSANITY_INIT_DRAIN} from "../Constants.ts";
import TimerEvent = Phaser.Time.TimerEvent;
import type {GameScene} from "./GameScene.tsx";
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

    this.inVoidform = true;
    this.registerVoidformEvent();
  }



  // Private
  private voidformTick = () => {
    const currentInsanity = this.decreaseInsanity(
      VOIDFORM_INSANITY_INIT_DRAIN + VOIDFORM_INSANITY_DRAIN_INCREMENT * this.stacks
    );

    if (currentInsanity !== 0) {
      return this.stacks++;
    }

    this.inVoidform = false;
    this.stacks = 0;
    this.killVoidformEvent();
    this.onExit();
  }
}