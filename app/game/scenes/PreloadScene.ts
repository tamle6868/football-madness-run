import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants";
import {
  createSkyTexture,
  createStadiumTexture,
} from "../assets/background";
import { createUITextures } from "../assets/ui";
import {
  COIN_SHEET,
  IMAGE_ASSETS,
  registerImageAliases,
} from "../assets/imageLoader";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    // Loading background + bar (drawn before any image loads)
    const bg = this.add.graphics();
    bg.fillStyle(0x0b1020, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const title = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, "LOADING ASSETS…", {
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
    this.load.on("complete", () => title.setText("BUILDING SCENE…"));

    // Real image assets
    for (const a of IMAGE_ASSETS) {
      this.load.image(a.key, a.path);
    }
    this.load.image(COIN_SHEET.key, COIN_SHEET.path);
  }

  create() {
    // Procedural sky (gradient + stars) — kept procedural since panorama HUD
    // overlaps the sky band heavily.
    createSkyTexture(this);

    // Stadium: prefer the real extracted image (bg-stadium-real). If not
    // present (asset missing), fall back to procedural drawn texture.
    if (this.textures.exists("bg-stadium-real")) {
      const realSrc = this.textures
        .get("bg-stadium-real")
        .getSourceImage() as HTMLImageElement;
      if (this.textures.exists("bg-stadium")) this.textures.remove("bg-stadium");
      this.textures.addImage("bg-stadium", realSrc);
    } else {
      createStadiumTexture(this);
    }

    // Procedural UI panels / buttons / auras / particle / speech bubble
    createUITextures(this);

    // Register aliases for loaded images (player, coin frames)
    registerImageAliases(this);

    this.time.delayedCall(120, () => {
      this.scene.start("MainMenuScene");
    });
  }
}
