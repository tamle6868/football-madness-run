import * as Phaser from "phaser";
import { GAME_WIDTH, GROUND_Y } from "../constants";

/**
 * Minimal crowd band — just a dark strip with very faint color hints.
 * No individual "shirt" rectangles that create scrolling pixel noise.
 */
export function addCleanCrowdBand(
  scene: Phaser.Scene,
  topY = GROUND_Y - 128,
  bottomY = GROUND_Y - 14
) {
  const BAND_KEY = "__crowd_band";
  const height = bottomY - topY;

  if (!scene.textures.exists(BAND_KEY)) {
    const canvas = scene.textures.createCanvas(BAND_KEY, GAME_WIDTH, height);
    if (!canvas) return scene.add.graphics();
    const ctx = canvas.getContext();

    // Solid dark base — clean, no noise
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "rgba(8,14,30,0.95)");
    grad.addColorStop(0.5, "rgba(6,10,24,0.95)");
    grad.addColorStop(1, "rgba(4,8,18,0.98)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, GAME_WIDTH, height);

    // Subtle horizontal row lines
    ctx.strokeStyle = "rgba(40,60,120,0.15)";
    ctx.lineWidth = 1;
    for (let y = 8; y < height - 30; y += 14) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(GAME_WIDTH, y);
      ctx.stroke();
    }

    // Top rail highlight
    ctx.strokeStyle = "rgba(40,80,160,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.lineTo(GAME_WIDTH, 3);
    ctx.stroke();

    // Bottom ad strip
    ctx.fillStyle = "rgba(4,8,16,0.98)";
    ctx.fillRect(0, height - 22, GAME_WIDTH, 22);
    ctx.strokeStyle = "rgba(20,50,100,0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height - 22);
    ctx.lineTo(GAME_WIDTH, height - 22);
    ctx.stroke();

    // Very dim ad text — desaturated grey, low opacity, only every 480px.
    const ads = ["GAME ZONE", "RUN FAST", "GO BIG", "SUPER MODE"];
    ctx.fillStyle = "rgba(140,150,170,0.18)";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let x = 160, i = 0; x < GAME_WIDTH; x += 480, i++) {
      ctx.fillText(ads[i % ads.length], x, height - 11);
    }

    canvas.refresh();
  }

  const img = scene.add.image(GAME_WIDTH / 2, topY + height / 2, BAND_KEY);
  img.setOrigin(0.5);
  return img;
}
