import type { SpellEnum } from "../SpellEnum";
import Graphic = Phaser.GameObjects.Graphics;
import Zone = Phaser.GameObjects.Zone;
import Text = Phaser.GameObjects.Text;
import TimerEvent = Phaser.Time.TimerEvent;
import { GameScene } from "./GameScene";
import { CAST_BAR_HEIGHT, CAST_BAR_TOP_X, CAST_BAR_TOP_Y, CAST_BAR_WIDTH } from "../Constants";

export class CastingBar {
  private box: Graphic;
  private bar: Graphic;
  private textContainer: Zone;
  private text: Text;

  // Fade out callbacks
  private registerFadeOutEvent: () => void;
  private resetFadeOutEvent: () => void;
  // ----

  // Public
  constructor(scene: GameScene) {
    this.box = scene.add.graphics();
    this.bar = scene.add.graphics();
    this.textContainer = scene.add.zone(CAST_BAR_TOP_X, CAST_BAR_TOP_Y, CAST_BAR_WIDTH, CAST_BAR_HEIGHT);
    this.text = scene.add.text(0, 0, '');

    // Fade out setup
    const fadeOutEventConfig =  { // TODO implement actual fade out
      delay: 300, 
      callback: this.cleanUpBar
    };
    let fadeOutEvent: TimerEvent;

    this.registerFadeOutEvent = () => {
      fadeOutEvent = scene.time.addEvent(fadeOutEventConfig);
    };
    this.resetFadeOutEvent = () => {
      fadeOutEvent?.remove(true);
    };
  }

  startCasting = async (spellName: SpellEnum, duration: number) => {
    this.resetFadeOutEvent();

    // Draw the borders
    this.drawCastBarBox();
    Phaser.Display.Align.In.BottomCenter(this.text, this.textContainer); // Should be center, but zone calculates weird
    this.text.setColor('#ff00ff');

    // Cast
    this.text.setText(`Casting ${spellName}`);
    await this.drawCastBar(duration);
  }

  // Private
  private drawCastBarBox = () => {
    this.box.lineStyle(2, 0xffffff, 1);
    this.box.strokeRoundedRect(CAST_BAR_TOP_X, CAST_BAR_TOP_Y, CAST_BAR_WIDTH, CAST_BAR_HEIGHT, 32);
  }
  
  private drawCastBar = async (duration: number) => {
    let castingProgress = 0;

    this.bar.fillStyle(0xfffffe);

    while (castingProgress <= duration) {
      const currentProgress = castingProgress / duration;
      const visibleProgress = currentProgress > 1 ? 1 : currentProgress;
      this.bar.fillRect(CAST_BAR_TOP_X, CAST_BAR_TOP_Y, CAST_BAR_WIDTH * visibleProgress, CAST_BAR_HEIGHT);
      castingProgress += duration / 10;
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    
    this.registerFadeOutEvent();
  }

  private cleanUpBar = () => {
    this.box.clear();
    this.bar.clear();
    this.text.setText('');
  }
}