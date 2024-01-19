import type { ISpellButton } from "./ISpellButton.ts";
import { GameScene } from "../GameScene.tsx";

import BitmapMask = Phaser.Display.Masks.BitmapMask;

let NORMALIZED_WIDTH = 80;
let NORMALIZED_HEITH = 80;

export class VampiricTouchButton implements ISpellButton {
  private BASE_SPELL_CD_TIME: number = 4000; // TODO this might be extracted when haste is introduced
  private SPELL_NAME: string = 'Vampiric Touch';
  private onCd: boolean = false;

  // GUI stuff
  private button: Phaser.GameObjects.Sprite;
  private cooldownGraphics: Phaser.GameObjects.Graphics;
  private bitmapMask: BitmapMask;

  private container: Phaser.GameObjects.Container;

  private overlay: Phaser.GameObjects.Graphics;

  private hilite: Phaser.GameObjects.Sprite;

  private borders: Phaser.GameObjects.Sprite;


  // Public section
  constructor(scene: GameScene, event: () => void) {

    // TODO: rounded rectangle 4px radius
    // hover highlight 8px radius
    this.button = scene.add.sprite(0, 0, 'vt_spell') //.setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerup', event);
    if (!scene.keyOne) {
      throw "Key one not found";
    }
    scene.keyOne.on('down', event);
    this.button.setScale(NORMALIZED_WIDTH / this.button.width, NORMALIZED_HEITH / this.button.height);

    // Create the cooldown graphics
    this.cooldownGraphics = scene.make.graphics();
    this.cooldownGraphics.fillStyle(0xffffff); // Set color and alpha as needed
    // this.cooldownGraphics.setPosition(this.button.x, this.button.x);

    // Set the depth of elements within the container if needed
    this.cooldownGraphics.setDepth(1); // Ensure it's above the button

    // bitmask for cooldown
    this.bitmapMask = scene.add.bitmapMask(this.cooldownGraphics);

    this.hilite = scene.add.sprite(0, 0, 'default_hilite'); //.setOrigin(0, 0)
    this.hilite.setScale(NORMALIZED_WIDTH / this.hilite.width, NORMALIZED_HEITH / this.hilite.height);
    this.hilite.setVisible(false);

    this.button.on('pointerover', () => this.show(this.hilite));
    scene.keyOne.on('down', () => this.show(this.hilite));

    this.button.on('pointerout', () => this.hide(this.hilite));
    scene.keyOne.on('up', () => this.hide(this.hilite));

    this.overlay = scene.make.graphics();
    this.overlay.fillStyle(0x000000, 0.8);
    this.overlay.fillRect(- NORMALIZED_WIDTH /2 , -NORMALIZED_HEITH /2, NORMALIZED_WIDTH, NORMALIZED_HEITH);
    //this.overlay.setScale(NORMALIZED_WIDTH / this.button.width, NORMALIZED_HEITH / this.button.height);

    // borders
    this.borders = scene.add.sprite(0, 0, 'default_borders') //.setOrigin(0, 0);
    this.borders.setScale(NORMALIZED_WIDTH / this.borders.width + 0.1, NORMALIZED_HEITH / this.borders.height + 0.1);

    // Create a container and add the button, text, and graphics to it
    this.container = scene.add.container(400, 400, [this.button, this.borders, this.hilite]);

    // Order is important!
    // Create a Graphics object and draw a rounded rectangle
    const maskGraphics = scene.make.graphics();
    maskGraphics.fillStyle(0xffffff);
    maskGraphics.fillRoundedRect(this.container.x - NORMALIZED_WIDTH / 2, this.container.y - NORMALIZED_HEITH / 2, NORMALIZED_WIDTH, NORMALIZED_HEITH, 8);

    // Create a mask from the Graphics object and apply it to the sprite
    const mask = maskGraphics.createGeometryMask();
    this.button.setMask(mask);
  }

  hide = (sprite: Phaser.GameObjects.Sprite) => {
    sprite.setVisible(false);
  }

  show = (sprite: Phaser.GameObjects.Sprite) => {
    sprite.setVisible(true);
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

  private renderCd = async (duration: number) => {
    const startTime = Date.now();
    this.container.add(this.overlay);
    const updateCooldown = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        this.drawCooldown(elapsed / duration);
        requestAnimationFrame(updateCooldown);
      } else {
        this.container.remove(this.overlay);
      }
    };
    updateCooldown();
  };

  private drawCooldown(progress: number) {
    this.cooldownGraphics.clear();
    const radius = Math.min(NORMALIZED_WIDTH, NORMALIZED_HEITH);
    const angle = progress * Math.PI * 2 - Math.PI / 2;
    this.cooldownGraphics.slice(this.container.x, this.container.y, radius, angle, - Math.PI / 2, true);
    this.cooldownGraphics.fillPath();
    // replace the button's mask with the new one
    this.bitmapMask.bitmapMask = this.cooldownGraphics;
    this.bitmapMask.invertAlpha = true;
    this.overlay.setMask(this.bitmapMask);

  }
}