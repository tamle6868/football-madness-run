import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants";
import { createUITextures } from "../assets/ui";
import {
  createFifaCorruptionTexture,
  createInjuryCardTexture,
  createSocialMediaHateTexture,
  createVarTexture,
  createDroneTexture,
  createCoinTextures,
  createTrophyTexture,
} from "../assets/obstacles";
import { createPlayerTextures } from "../assets/player";
import {
  createSkyTexture,
  createStadiumTexture,
  createGroundTexture,
} from "../assets/background";

/**
 * PreloadScene
 *
 * In the starter template every visual is generated procedurally with the
 * Canvas2D API and committed as a Phaser texture. This means the template
 * works out of the box with **zero external PNG/SFX assets**.
 *
 * When you have real artwork for your game, the typical pattern is:
 *   1. Add your PNG files under `public/assets/your-game/`
 *   2. Replace the corresponding `create*Texture(this)` call below with
 *      `this.load.image(<key>, "/assets/your-game/<file>.png")`.
 *   3. (Optional) For very-detail-heavy sprites that look blurry at
 *      runtime, pre-resize them in `create()` to their exact display size.
 *      See the `preResize()` helper at the bottom of this file.
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    const bg = this.add.graphics();
    bg.fillStyle(0x0b1020, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "LOADING...", {
        fontFamily: "sans-serif",
        fontSize: "28px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
  }

  create() {
    // --- Procedural texture generation --------------------------------------
    // Every texture used by gameplay scenes is produced here. Replace any
    // of these calls with `this.load.image(...)` when you have real art.

    createSkyTexture(this);
    createStadiumTexture(this);
    createGroundTexture(this);

    createPlayerTextures(this);
    createFifaCorruptionTexture(this);
    createInjuryCardTexture(this);
    createSocialMediaHateTexture(this);
    createVarTexture(this);
    createDroneTexture(this);

    createCoinTextures(this);
    createTrophyTexture(this);
    createUITextures(this);

    this.time.delayedCall(80, () => {
      this.scene.start("IntroScene");
    });
  }

  /**
   * Pre-resize a loaded PNG to its exact display size and store it under a
   * new texture key. Draws the source image onto a smaller CanvasTexture so
   * the GPU never has to scale it at runtime — this is what eliminates the
   * "blurry sprite while moving" effect on high-DPI screens.
   *
   * Usage (call from `create()` after `this.load.image("_raw_foo", ...)`):
   *   this.preResize("_raw_foo", "foo", 80, 80);
   */
  protected preResize(
    rawKey: string,
    finalKey: string,
    targetW: number,
    targetH: number
  ) {
    if (!this.textures.exists(rawKey)) return;
    const source = this.textures
      .get(rawKey)
      .getSourceImage() as HTMLImageElement;

    if (!this.textures.exists(finalKey)) {
      const canvas = this.textures.createCanvas(finalKey, targetW, targetH);
      if (canvas) {
        const ctx = canvas.getContext();
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(source, 0, 0, targetW, targetH);
        canvas.refresh();
      }
    }
    this.textures.remove(rawKey);
  }
}
