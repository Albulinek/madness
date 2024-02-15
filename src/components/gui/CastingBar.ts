import type { SpellEnum } from "../../SpellEnum";
import Graphic = Phaser.GameObjects.Graphics;
import Container = Phaser.GameObjects.Container;
import Text = Phaser.GameObjects.Text;
import TimerEvent = Phaser.Time.TimerEvent;
import Sprite = Phaser.GameObjects.Sprite;
import GeometryMask = Phaser.Display.Masks.GeometryMask;
import { GameScene } from "../GameScene";
import { CAST_BAR_TOP_X, CAST_BAR_TOP_Y } from "../../Constants";
type TimerEventConfig = Phaser.Types.Time.TimerEventConfig;

export class CastingBar {
  private bar: Graphic;
  private castBarContainer: Container;
  private text: Text;

  // mask for gradient
  private blendSprite: Phaser.GameObjects.Sprite;

  // private spark: Phaser.GameObjects.Sprite;
  private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  private castbarBorder: Sprite;

  private isCasting: boolean = false;
  private isGcd: boolean = false;

  // Fade out callbacks
  private registerFadeOutEvent: () => void;
  private resetFadeOutEvent: () => void;
  // ----

  // Public
  constructor(scene: GameScene) {
    this.bar = scene.add.graphics();

    this.castbarBorder = scene.add.sprite(0, 0, 'castbar_border');
    this.castbarBorder.setVisible(false);

    // Create Particle Manager and Emitter
    this.particleEmitter = scene.add.particles(0, 0, 'castbar_spark',// Ensure this asset is loaded in preload
      {
        speedX: { min: 0, max: 10 },
        speedY: { min: -105, max: 105 },
        scale: { start: 1, end: 0 },
        blendMode: 'ADD',
        lifespan: 100,
        emitZone: { source: new Phaser.Geom.Rectangle(0, 0, 1, 1), type: 'edge', quantity: 1 },
        frequency: -1 // Don't emit automatically
      });

    
    this.blendSprite = scene.add.sprite(0, 0, 'castbar_fill_mask');
    this.blendSprite.setScale((this.castbarBorder.width - 50) / this.blendSprite.width, 16 / this.blendSprite.height);
    this.blendSprite.setBlendMode(2);


    this.text = scene.add.text(0, 0, '', { fontFamily: 'Friz Quadrata TT', fontSize: '14px', color: 'white' }).setOrigin(0.5, 0.5);
    this.text.setShadow(1, 1, 'black', 1, false, true)

    this.castBarContainer = scene.add.container(CAST_BAR_TOP_X, CAST_BAR_TOP_Y, [this.bar, this.blendSprite, this.castbarBorder, this.particleEmitter, this.text]); // order matters


    // Fade out setup
    const fadeOutEventConfig = {
      delay: 300,
      callback: this.cleanUpBar
    };

    let fadeOutEvent: TimerEvent;

    this.registerFadeOutEvent = () => {
      console.log('Registering fade out event')
      fadeOutEvent = scene.time.addEvent(fadeOutEventConfig);
    };

    this.resetFadeOutEvent = () => {
      fadeOutEvent?.remove(true);
    };
  }

  startCasting = async (spellName: SpellEnum, duration: number) => {
    if (this.isCasting) {
      console.log('Cannot cast now. Either casting or GCD is in progress.');
      return;
    }
    this.resetFadeOutEvent();
    [this.bar, this.text, this.castbarBorder].forEach(target => target.setAlpha(1));
    this.isCasting = true;
    this.resetFadeOutEvent();

    // Draw the borders
    this.drawCastBarBox();

    // Cast
    this.text.setText(spellName);
    this.renderCastBar(duration);
  }

  // Private
  private renderCastBar = (duration: number) => {
    const startTime = Date.now();
    const updateCastBar = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed < duration) {
        this.renderCastProgress(elapsed / duration)
        requestAnimationFrame(updateCastBar);
      } else {
        this.isCasting = false;
        this.registerFadeOutEvent();
      }
    };
    updateCastBar();
  }

  setGcd = (duration: number) => {
    this.isGcd = true;
  }

  clearGcd = () => {
    this.isGcd = false;
  }

  private renderCastProgress = (progress: number) => {
    this.bar.clear();
    this.bar.fillStyle(0xffd316);
    // in order to stack, original asset is 33px x margin, 26px y margin
    const currentBarWidth = Math.round((this.castbarBorder.width - 60) * progress);
    if (currentBarWidth>8){
    this.bar.fillRoundedRect(- this.castbarBorder.width / 2 + 30, -this.castbarBorder.height / 2 + 24, currentBarWidth, this.castbarBorder.height - 48, 8);
    }
    // Scale the mask sprite to cover the entire bar
    // this.maskSprite.setScale(currentBarWidth / this.maskSprite.width, (this.castbarBorder.height - 48) / this.maskSprite.height);

    // Update spark emitter position
    const barWidth = this.castbarBorder.width - 60;
    const sparkX = -this.castbarBorder.width / 2 + 30 + Math.round(barWidth * progress);
    if (progress > 0.02 && progress < 0.98) { //cull the glitches on edges
    this.particleEmitter.setPosition(sparkX, 0); // Adjust Y position as needed
    this.particleEmitter.emitParticle();
    }

  }

  private drawCastBarBox = () => {
    this.castbarBorder.setVisible(true);
  }

  private cleanUpBar = () => {
    if (!this.isCasting && !this.isGcd) {
      this.particleEmitter.stop();

      this.bar.scene.tweens.add({
        targets: [this.bar, this.text, this.castbarBorder],
        alpha: { from: 1, to: 0 },
        duration: 300,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          // Reset alpha for next use and clear graphics and text
          this.bar.clear();
          this.text.setText('');
          this.castbarBorder.setVisible(false);
          [this.bar, this.text, this.castbarBorder].forEach(target => target.setAlpha(1));
        }
      });
    }
  }
};