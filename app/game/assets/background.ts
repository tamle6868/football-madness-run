import * as Phaser from "phaser";
import { commitCanvasAsTexture, Rand } from "./utils";

const SKY_W = 1280;
const SKY_H = 360;

export function createSkyTexture(scene: Phaser.Scene) {
  if (scene.textures.exists("bg-sky")) return;

  commitCanvasAsTexture(
    scene,
    "bg-sky",
    (ctx, w, h) => {
      // Simple dark gradient — calm, non-distracting
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#050810");
      grad.addColorStop(0.5, "#0c1428");
      grad.addColorStop(1, "#1a2550");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // A handful of subtle stars — NOT confetti
      const rand = new Rand(1337);
      for (let i = 0; i < 30; i++) {
        const x = rand.range(0, w);
        const y = rand.range(0, h * 0.45);
        const r = rand.range(0.4, 1.0);
        ctx.fillStyle = `rgba(200,210,240,${rand.range(0.15, 0.4)})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Gentle, diffused floodlight glow — NOT harsh white dots.
      // Only 3 lights, very soft, low opacity.
      for (const cx of [280, 640, 1000]) {
        const cy = h * 0.38;
        const halo = ctx.createRadialGradient(cx, cy, 20, cx, cy, 280);
        halo.addColorStop(0, "rgba(180,200,255,0.18)");
        halo.addColorStop(0.5, "rgba(120,150,220,0.06)");
        halo.addColorStop(1, "rgba(60,80,140,0)");
        ctx.fillStyle = halo;
        ctx.fillRect(cx - 300, cy - 300, 600, 600);
      }

      // NO confetti. NO bright light bulbs. Clean sky.
    },
    SKY_W,
    SKY_H
  );
}

const STADIUM_W = 1600;
const STADIUM_H = 360;

export function createStadiumTexture(scene: Phaser.Scene) {
  if (scene.textures.exists("bg-stadium")) return;

  commitCanvasAsTexture(
    scene,
    "bg-stadium",
    (ctx, w, h) => {
      // Dark stadium base
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#0e1432");
      bg.addColorStop(0.4, "#0a1028");
      bg.addColorStop(1, "#060810");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Simple curved roof silhouette
      ctx.fillStyle = "#060a1a";
      ctx.beginPath();
      ctx.moveTo(0, h * 0.36);
      ctx.quadraticCurveTo(w / 2, h * 0.05, w, h * 0.36);
      ctx.lineTo(w, h * 0.52);
      ctx.quadraticCurveTo(w / 2, h * 0.2, 0, h * 0.52);
      ctx.closePath();
      ctx.fill();

      // Subtle roof trusses
      ctx.strokeStyle = "rgba(100,130,200,0.1)";
      ctx.lineWidth = 2;
      for (let x = -120; x < w + 120; x += 160) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 90, h * 0.3);
        ctx.stroke();
      }

      // Soft light beams — much more subtle
      ctx.globalCompositeOperation = "lighter";
      for (const cx of [400, 800, 1200]) {
        const beam = ctx.createLinearGradient(cx, h * 0.15, cx + 60, h);
        beam.addColorStop(0, "rgba(200,210,240,0.06)");
        beam.addColorStop(1, "rgba(180,200,230,0)");
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(cx - 30, h * 0.2);
        ctx.lineTo(cx + 60, h);
        ctx.lineTo(cx + 180, h);
        ctx.lineTo(cx + 30, h * 0.2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // Simplified crowd — just broad color bands, NO individual rectangles.
      // This eliminates the "pixel noise" that causes eye strain when scrolling.
      const crowdTop = h * 0.56;
      const crowdBottom = h * 0.92;
      const crowdH = crowdBottom - crowdTop;

      // A few solid dark bands to suggest rows of spectators
      const rowColors = [
        "rgba(18,28,60,0.9)",
        "rgba(12,20,48,0.9)",
        "rgba(16,24,55,0.9)",
        "rgba(10,18,42,0.9)",
      ];
      const bandH = crowdH / rowColors.length;
      for (let i = 0; i < rowColors.length; i++) {
        ctx.fillStyle = rowColors[i];
        ctx.fillRect(0, crowdTop + i * bandH, w, bandH);
      }

      // Sparse, large colored blocks — suggest crowd shirts without pixel noise
      const rand = new Rand(424242);
      const shirtColors = [
        "rgba(255,210,58,0.12)",
        "rgba(255,56,69,0.10)",
        "rgba(29,86,194,0.12)",
        "rgba(50,210,100,0.10)",
        "rgba(220,230,240,0.08)",
      ];
      for (let y = crowdTop + 6; y < crowdBottom - 10; y += 24) {
        for (let x = 0; x < w; x += 40) {
          if (rand.next() < 0.5) continue;
          ctx.fillStyle = rand.pick(shirtColors);
          ctx.fillRect(x + rand.range(-4, 4), y + rand.range(-2, 2), 28, 16);
        }
      }

      // Lower ad strip — darker, less contrast
      ctx.fillStyle = "#050810";
      ctx.fillRect(0, h - 24, w, 24);
      ctx.strokeStyle = "rgba(30,60,120,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h - 24);
      ctx.lineTo(w, h - 24);
      ctx.stroke();

      const ads = ["MADNESS RUN", "WORLD ROUTE", "SUPER SPRINT", "VAR ZONE"];
      for (let x = 50, i = 0; x < w; x += 380, i++) {
        ctx.fillStyle = "rgba(200,180,100,0.25)";
        ctx.font = "700 11px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(ads[i % ads.length], x + 100, h - 12);
      }

      // Overall darkening vignette
      const vignette = ctx.createLinearGradient(0, 0, 0, h);
      vignette.addColorStop(0, "rgba(0,0,0,0.15)");
      vignette.addColorStop(0.5, "rgba(0,0,0,0.05)");
      vignette.addColorStop(1, "rgba(0,0,0,0.4)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);
    },
    STADIUM_W,
    STADIUM_H
  );
}

const GROUND_W = 1280;
const GROUND_H = 200;

export function createGroundTexture(scene: Phaser.Scene) {
  if (scene.textures.exists("bg-ground")) return;

  commitCanvasAsTexture(
    scene,
    "bg-ground",
    (ctx, w, h) => {
      // Clean grass strip
      const grassH = 46;
      const turf = ctx.createLinearGradient(0, 0, 0, grassH);
      turf.addColorStop(0, "#4ab842");
      turf.addColorStop(0.5, "#358a2c");
      turf.addColorStop(1, "#1a5e1e");
      ctx.fillStyle = turf;
      ctx.fillRect(0, 0, w, grassH);

      // Subtle white pitch line
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(0, 2, w, 2);

      // Dark edge at grass bottom
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, grassH - 2, w, 3);

      // Simple earth below — solid dark, no brick pattern (reduces visual noise)
      const earth = ctx.createLinearGradient(0, grassH, 0, h);
      earth.addColorStop(0, "#2a1808");
      earth.addColorStop(0.6, "#180e04");
      earth.addColorStop(1, "#0a0602");
      ctx.fillStyle = earth;
      ctx.fillRect(0, grassH, w, h - grassH);

      // A few subtle horizontal lines instead of detailed brick pattern
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 1;
      for (let y = grassH + 30; y < h; y += 35) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    },
    GROUND_W,
    GROUND_H
  );
}
