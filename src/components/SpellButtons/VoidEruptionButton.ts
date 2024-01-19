import type {ISpellButton} from "./ISpellButton.ts";
import type {GameScene} from "../GameScene.tsx";
import {SpellEnum} from "../../SpellEnum.ts";

export class VoidEruptionButton implements ISpellButton {
  private BASE_SPELL_CD_TIME: number = 2000;
  private onCd: boolean = false;

  // Public
  constructor(scene: GameScene, onClick: () => void) {
    scene.add.rectangle(650, 400, 200, 50, 0x0000ff)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', onClick);
    scene.add.text(650, 400, SpellEnum.VoidEruption, { color: '#0f0' })
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