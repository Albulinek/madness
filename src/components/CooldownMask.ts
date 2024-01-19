// import type { Gcd } from "../Gcd";

// class CooldownMask extends Phaser.GameObjects.Graphics {
//     private gcd: Gcd;
//     private cooldownDuration: number;
//     private endTime: number;

//     constructor(scene: Phaser.Scene, gcd: Gcd) {
//         super(scene);
//         this.gcd = gcd;
//         this.cooldownDuration = gcd.BASE_GCD_LENGTH; // Assuming BASE_GCD_LENGTH is accessible
//         this.endTime = 0;

//         // Register the listener to GCD
//         this.gcd.registerListener(this.startCooldown.bind(this));

//         // Add this Graphics object to the scene
//         scene.add.existing(this);
//     }

//     startCooldown => (duration: number) {
//         this.cooldownDuration = duration;
//         this.endTime = this.scene.time.now + duration;
//         this.visible = true;
//     }

//     update() {
//         if (!this.visible) return;

//         const currentTime = this.scene.time.now;
//         if (currentTime >= this.endTime) {
//             this.visible = false;
//             this.clear();
//             return;
//         }

//         const elapsed = currentTime - (this.endTime - this.cooldownDuration);
//         const progress = elapsed / this.cooldownDuration;
//         const angle = progress * 2 * Math.PI;

//         this.clear();
//         this.fillStyle(0xffffff, 1);
//         this.slice(0, 0, 50, 0, angle, true); // Adjust position and size as needed
//         this.fillPath();
//     }
// }