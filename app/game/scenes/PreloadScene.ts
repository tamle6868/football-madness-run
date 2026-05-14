import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants";
import { createUITextures } from "../assets/ui";
import { createDroneTexture } from "../assets/obstacles";
import {
  createGroundTexture,
  createSkyTexture,
  createStadiumTexture,
} from "../assets/background";

/**
 * PreloadScene loads PNG artwork for everything that has a file in
 * public/assets/user/ and only falls back to procedural generation
 * for UI elements (buttons, auras) and the drone obstacle which has
 * no PNG equivalent.
 *
 * To eliminate blur from GPU downscaling, PNGs that are displayed at
 * a smaller size than their native resolution are pre-resized at load
 * time by drawing them onto a smaller CanvasTexture. This means the
 * runtime sprite uses scale=1 with a texture that is already at the
 * exact pixel size it will be rendered at.
 */
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

    const v = "v2";

    // --- Backgrounds ---
    // Calm procedural BGs (dark sky + dim stadium + clean ground) are
    // generated in create() via createSkyTexture/createStadiumTexture/
    // createGroundTexture. The raster PNGs in /assets/user/bg_*.png have
    // confetti, flag bunting and bright floodlights baked in as pixels,
    // which is what was causing the eye-strain on production, so we no
    // longer load them.

    // --- Logo (displayed at native size) ---
    this.load.image("logo", `/assets/user/logo_full.png?v=${v}`);

    // --- Player sprites (will be pre-resized in create()) ---
    this.load.image("_raw_player-run1", `/assets/user/player_run_1.png?v=${v}`);
    this.load.image("_raw_player-run2", `/assets/user/player_run_2.png?v=${v}`);
    this.load.image("_raw_player-run3", `/assets/user/player_run_3.png?v=${v}`);
    this.load.image("_raw_player-run4", `/assets/user/player_run_4.png?v=${v}`);
    this.load.image("_raw_player-jump", `/assets/user/player_jump.png?v=${v}`);
    this.load.image("_raw_player-slide", `/assets/user/player_slide.png?v=${v}`);
    this.load.image("_raw_player-super", `/assets/user/player_super.png?v=${v}`);

    // --- Obstacles (will be pre-resized in create()) ---
    this.load.image("_raw_obs-var", `/assets/user/obs_var.png?v=${v}`);
    this.load.image("_raw_obs-corruption", `/assets/user/obs_corruption.png?v=${v}`);
    this.load.image("_raw_obs-injury", `/assets/user/obs_injury.png?v=${v}`);
    this.load.image("_raw_obs-hate", `/assets/user/obs_hate.png?v=${v}`);

    // --- Coins (will be pre-resized in create()) ---
    for (let i = 0; i < 6; i++) {
      this.load.image(`_raw_coin-${i}`, `/assets/user/coin_${i}.png?v=${v}`);
    }

    // --- Trophy ---
    this.load.image("_raw_trophy", `/assets/user/trophy_full.png?v=${v}`);
  }

  create() {
    // ---- Procedural calm backgrounds ----
    // Replace the noisy panorama PNGs (confetti / flag bunting / bright
    // floodlights baked in) with the dark, minimal procedural BG defined
    // in app/game/assets/background.ts.
    createSkyTexture(this);
    createStadiumTexture(this);
    createGroundTexture(this);

    // ---- Pre-resize all PNGs to their exact display size ----
    // This eliminates GPU scaling blur at runtime.

    // Player: 120x160 native, displayed at scale 1.0 → keep native size
    this.preResize("_raw_player-run1", "player-run1", 120, 160);
    this.preResize("_raw_player-run2", "player-run2", 120, 160);
    this.preResize("_raw_player-run3", "player-run3", 120, 160);
    this.preResize("_raw_player-run4", "player-run4", 120, 160);
    this.preResize("_raw_player-jump", "player-jump", 120, 160);
    this.preResize("_raw_player-slide", "player-slide", 120, 160);
    this.preResize("_raw_player-super", "player-super", 120, 160);

    // Obstacles: native size × manifest scale → exact display pixels
    // VAR: 166×220 × 0.52 = 86×114
    this.preResize("_raw_obs-var", "obs-var", 86, 114);
    // Corruption: 190×230 × 0.50 = 95×115
    this.preResize("_raw_obs-corruption", "obs-corruption", 95, 115);
    // Injury: 126×214 × 0.58 = 73×124
    this.preResize("_raw_obs-injury", "obs-injury", 73, 124);
    // Hate: 170×166 × 0.62 = 105×103
    this.preResize("_raw_obs-hate", "obs-hate", 105, 103);

    // Coins: 72×72 × 0.52 = 37×37
    for (let i = 0; i < 6; i++) {
      this.preResize(`_raw_coin-${i}`, `coin-${i}`, 37, 37);
    }

    // Trophy: 210×270 × 0.52 = 109×140
    this.preResize("_raw_trophy", "trophy", 109, 140);

    // ---- Procedural textures for things that have no PNG ----
    createUITextures(this);   // buttons, auras, speech bubble
    createDroneTexture(this); // drone obstacle (no PNG for it)

    this.time.delayedCall(120, () => {
      this.scene.start("IntroScene");
    });
  }

  /**
   * Draw a loaded PNG onto a CanvasTexture at the exact target size.
   * The resulting texture is displayed at scale=1, so NO GPU scaling
   * happens at runtime → razor sharp even when moving fast.
   */
  private preResize(
    rawKey: string,
    finalKey: string,
    targetW: number,
    targetH: number
  ) {
    if (!this.textures.exists(rawKey)) return;
    const source = this.textures.get(rawKey).getSourceImage() as HTMLImageElement;

    // If the source is already at the target size, just rename
    if (source.width === targetW && source.height === targetH) {
      // Can't rename in Phaser, so just use the raw key directly
      // by adding the final key pointing to the same data
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
    } else {
      // Draw at target size — this is the key step that eliminates blur
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
    }

    // Remove the raw texture to free memory
    this.textures.remove(rawKey);
  }
}
