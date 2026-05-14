import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants";
import {
  createGroundTexture,
  createSkyTexture,
  createStadiumTexture,
} from "../assets/background";
import { createUITextures } from "../assets/ui";
import {
  createCoinTextures,
  createDroneTexture,
  createFifaCorruptionTexture,
  createInjuryCardTexture,
  createSocialMediaHateTexture,
  createTrophyTexture,
  createVarTexture,
} from "../assets/obstacles";
import { createPlayerTextures } from "../assets/player";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    const bg = this.add.graphics();
    bg.fillStyle(0x0b1020, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const title = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, "LOADING ASSETS...", {
        fontFamily: "sans-serif",
        fontSize: "28px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const barW = 480;
    const barH = 18;
    const barX = (GAME_WIDTH - barW) / 2;
    const barY = GAME_HEIGHT / 2 + 10;
    const barBg = this.add.graphics();
    barBg.fillStyle(0x1a2348, 1);
    barBg.fillRoundedRect(barX, barY, barW, barH, 8);
    const fill = this.add.graphics();

    this.load.on("progress", (p: number) => {
      fill.clear();
      fill.fillStyle(0xffd23a, 1);
      fill.fillRoundedRect(barX + 2, barY + 2, (barW - 4) * p, barH - 4, 6);
    });
    this.load.on("complete", () => title.setText("BUILDING SCENE..."));

    // Only load the logo PNG — all other textures are procedurally
    // generated below so they render at exact pixel sizes (no scaling
    // blur, no downscale artifacts, works perfectly at any speed).
    const userAssetVersion = "player-v1";
    this.load.image("logo", `/assets/user/logo_full.png?v=${userAssetVersion}`);
  }

  create() {
    // Procedural textures are rendered at their exact display dimensions.
    // This means setScale(0.52) on a 166×220 canvas draws at 86×114 pixels
    // natively — no GPU downscaling, no bilinear blur, razor-sharp at
    // any movement speed. This is why the Devin build looked crisp.
    createSkyTexture(this);
    createStadiumTexture(this);
    createGroundTexture(this);
    createUITextures(this);
    createPlayerTextures(this);
    createVarTexture(this);
    createFifaCorruptionTexture(this);
    createInjuryCardTexture(this);
    createSocialMediaHateTexture(this);
    createDroneTexture(this);
    createCoinTextures(this);
    createTrophyTexture(this);

    this.time.delayedCall(120, () => {
      this.scene.start("IntroScene");
    });
  }
}
