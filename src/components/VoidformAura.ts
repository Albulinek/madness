import type {GameScene} from "./GameScene.tsx";
import Text = Phaser.GameObjects.Text;
import Graphics = Phaser.GameObjects.Graphics;

export class VoidformAura {
  private text: Text;
  private box: Graphics;
  private loaded: boolean = false;

  // Public
  constructor(scene: GameScene) {
    this.box = scene.add.graphics();
    // this.box.lineStyle(1, 0x0000ff);
    // this.box.strokeRect(600, 50, 100, 50);
    this.text = scene.add.text( 600, 50, 'Voidform', { color: '#0f0' })
      .setOrigin(0.5, 0.5);
    this.box.setVisible(false);
    this.text.setVisible(false);
  }

  updateStacks = (stackCount: number) => {
    if (stackCount === 0) {
      this.box.setVisible(false);
      this.text.setVisible(false);
      this.loaded = false;
    } else if (!this.loaded) {
      this.box.setVisible(true);
      this.text.setVisible(true);
      this.loaded = true;
    }
    this.text?.setText(`Voidform: ${stackCount}`);
  }
}