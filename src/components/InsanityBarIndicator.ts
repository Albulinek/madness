import Text = Phaser.GameObjects.Text;
import type {GameScene} from "./GameScene.tsx";

export class InsanityBarIndicator {
  private button: Text;

  // Public
  constructor(scene: GameScene) {
    this.button = scene.add.text(100, 300, 'Insanity: 0', { color: 'yellow'});
  }

  updateBarIndicator = (val: number) => {
    console.log("Updating insanity with: " + val);
    this.button?.setText(`Insanity: ${val}`);
  }
}