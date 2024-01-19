import type {ISpellButton} from "./ISpellButton.ts";
import {GameScene} from "../GameScene.tsx";
import {SpellEnum} from "../../SpellEnum.ts";

export class VampiricTouchButton implements ISpellButton {
  private BASE_SPELL_CD_TIME: number = 2000; // TODO this might be extracted when haste is introduced
  private onCd: boolean = false;

  // Public section
  constructor(scene: GameScene, onClick: () => void) {
    const button = scene.add.rectangle(400, 400, 200, 50, 0x0000ff)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', onClick);
    const buttonText = scene.add.text(400, 400, SpellEnum.VampiricTouch, { color: '#0f0' })
      .setOrigin(0.5, 0.5);
  }

  onTriggerGcd = (duration: number) => {
    this.doCd(duration);
  };

  onTriggerCd = () => {
    this.doCd(this.BASE_SPELL_CD_TIME);
  };

  // Private section

  private setOnCd = (val: boolean) => {
    this.onCd = val;
  };

  private doCd = async (duration: number) => {
    if (this.onCd) {
      throw "Is on cd error or something"; // TODO finish error handling
    }

    this.setOnCd(true);
    await this.renderCd(duration);
    this.setOnCd(false);
  }

  private renderCd = async(duration: number) => {
    // TODO implement animation
    console.log("Imagine the cd is running for: " + duration);
  };
}