import * as Phaser from "phaser";
import { Rand } from "../assets/utils";
import { GAME_WIDTH, GROUND_Y } from "../constants";

/**
 * Renders the crowd band into a single cached texture instead of
 * drawing ~600 individual Graphics primitives each time the scene
 * is created. The resulting image is displayed as a TileSprite so
 * it can scroll with parallax at near-zero per-frame cost.
 */
export function addCleanCrowdBand(
  scene: Phaser.Scene,
  topY = GROUND_Y - 128,
  bottomY = GROUND_Y - 14
) {
  const BAND_KEY = "__crowd_band";
  const height = bottomY - topY;

  // Generate the texture once and cache it for the lifetime of the game.
  if (!scene.textures.exists(BAND_KEY)) {
    const canvas = scene.textures.createCanvas(BAND_KEY, GAME_WIDTH, height);
    if (!canvas) return scene.add.graphics(); // fallback
    const ctx = canvas.getContext();
    const rand = new Rand(93021);

    // Dark base
    ctx.fillStyle = "rgba(6,16,33,0.94)";
    ctx.fillRect(0, 0, GAME_WIDTH, height);

    // Row stripes
    for (let row = 0; row < 8; row++) {
      const y = 10 + row * 12;
      ctx.fillStyle = row % 2 === 0 ? "rgba(11,31,61,0.72)" : "rgba(7,22,47,0.72)";
      ctx.fillRect(0, y, GAME_WIDTH, 10);
    }

    // Crowd dots — desaturated palette and lower density to avoid
    // the "TV static" effect that made the original band painful to look at.
    const shirtColors = ["#3a4a72", "#445478", "#2b3656", "#586484", "#384a6c", "#2f3d60"];
    for (let y = 18; y < height - 26; y += 16) {
      for (let x = 0; x < GAME_WIDTH; x += 18) {
        if (rand.next() < 0.62) continue;
        const sw = rand.range(4, 7);
        const sh = rand.range(4, 6);
        ctx.globalAlpha = rand.range(0.28, 0.5);
        ctx.fillStyle = rand.pick(shirtColors);
        ctx.fillRect(
          x + rand.range(-2, 2),
          y + rand.range(-2, 2),
          sw,
          sh
        );
      }
    }
    ctx.globalAlpha = 1;

    // Top rail
    ctx.strokeStyle = "rgba(46,109,184,0.9)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.lineTo(GAME_WIDTH, 4);
    ctx.stroke();
    ctx.strokeStyle = "rgba(119,214,255,0.42)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(GAME_WIDTH, 10);
    ctx.stroke();

    // Bottom ad strip
    ctx.fillStyle = "rgba(6,16,33,0.98)";
    ctx.fillRect(0, height - 28, GAME_WIDTH, 28);
    ctx.strokeStyle = "rgba(20,60,122,0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height - 28);
    ctx.lineTo(GAME_WIDTH, height - 28);
    ctx.stroke();

    // Ad panels — muted typography (no saturated yellow) so they sit in
    // the background instead of competing with the player for attention.
    const ads = ["MADNESS RUN", "SIUUU ZONE", "NO VAR", "SUPER MODE"];
    for (let x = 42, i = 0; x < GAME_WIDTH; x += 320, i++) {
      ctx.fillStyle = i % 2 === 0 ? "rgba(16,32,68,0.85)" : "rgba(22,38,58,0.85)";
      ctx.fillRect(x, height - 24, 240, 18);
      ctx.fillStyle = "rgba(180,190,210,0.55)";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ads[i % ads.length], x + 120, height - 15);
    }

    canvas.refresh();
  }

  // Display as a simple image (single draw call)
  const img = scene.add.image(GAME_WIDTH / 2, topY + height / 2, BAND_KEY);
  img.setOrigin(0.5);

  return img;
}
