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
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#070b19");
      grad.addColorStop(0.5, "#111b3d");
      grad.addColorStop(1, "#28366d");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const rand = new Rand(1337);

      // Distant pin lights — sparse so the sky reads as calm, not noisy.
      for (let i = 0; i < 22; i++) {
        const x = rand.range(0, w);
        const y = rand.range(0, h * 0.5);
        const r = rand.range(0.5, 1.2);
        ctx.fillStyle = `rgba(220,225,235,${rand.range(0.18, 0.42)})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Stadium floodlight bloom — only 3 lights, much softer halos so the
      // top of the screen does not flash bright white into the user's eyes.
      const lightXs = [240, 640, 1040];
      for (const cx of lightXs) {
        const cy = h * 0.3;
        const halo = ctx.createRadialGradient(cx, cy, 12, cx, cy, 200);
        halo.addColorStop(0, "rgba(220,225,200,0.28)");
        halo.addColorStop(0.35, "rgba(160,180,210,0.08)");
        halo.addColorStop(1, "rgba(60,80,140,0)");
        ctx.fillStyle = halo;
        ctx.fillRect(cx - 220, cy - 220, 440, 440);

        // Tiny lamp core — small dot instead of 4 stacked bright pixels.
        ctx.fillStyle = "rgba(255,250,220,0.55)";
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Confetti is the worst eye-strain offender — drop count drastically
      // and keep alpha low so it reads as ambient texture, not a snowstorm.
      const colors = ["#ffd23a", "#e8e8ee", "#ff9a3c", "#1d56c2"];
      for (let i = 0; i < 26; i++) {
        const x = rand.range(0, w);
        const y = rand.range(0, h * 0.78);
        const cw = rand.range(2, 4);
        const ch = rand.range(3, 6);
        ctx.fillStyle = rand.pick(colors);
        ctx.globalAlpha = rand.range(0.18, 0.36);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rand.range(0, Math.PI * 2));
        ctx.fillRect(-cw / 2, -ch / 2, cw, ch);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
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
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#171f48");
      bg.addColorStop(0.38, "#10183a");
      bg.addColorStop(1, "#070a18");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Curved roof and upper tier silhouette.
      ctx.fillStyle = "#080c20";
      ctx.beginPath();
      ctx.moveTo(0, h * 0.36);
      ctx.quadraticCurveTo(w / 2, h * 0.02, w, h * 0.36);
      ctx.lineTo(w, h * 0.55);
      ctx.quadraticCurveTo(w / 2, h * 0.18, 0, h * 0.55);
      ctx.closePath();
      ctx.fill();

      // Roof trusses.
      ctx.strokeStyle = "rgba(135,165,230,0.2)";
      ctx.lineWidth = 3;
      for (let x = -120; x < w + 120; x += 120) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 90, h * 0.32);
        ctx.stroke();
      }

      // Soft front-of-house beams — removed `lighter` blend mode (which
      // creates additive HDR-style blow-outs that hurt the eyes) and kept
      // the gradient very subtle.
      for (const cx of [320, 960]) {
        const beam = ctx.createLinearGradient(cx, h * 0.12, cx + 80, h);
        beam.addColorStop(0, "rgba(220,225,200,0.06)");
        beam.addColorStop(1, "rgba(220,225,200,0)");
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(cx - 36, h * 0.2);
        ctx.lineTo(cx + 74, h);
        ctx.lineTo(cx + 220, h);
        ctx.lineTo(cx + 36, h * 0.2);
        ctx.closePath();
        ctx.fill();
      }

      // Banner row: muted palette, no stroke, gives a flag-line silhouette
      // without flashing primary colours at the player.
      const bannerY = h * 0.38;
      const bannerH = 28;
      const banners = ["#274a8a", "#3a5a6a", "#2a3e6c", "#3c5070", "#314d80"];
      ctx.globalAlpha = 0.55;
      for (let x = -40, i = 0; x < w + 80; x += 98, i++) {
        ctx.fillStyle = banners[i % banners.length];
        ctx.beginPath();
        ctx.moveTo(x, bannerY);
        ctx.lineTo(x + 76, bannerY);
        ctx.lineTo(x + 38, bannerY + bannerH);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Crowd blocks: lower density + desaturated palette so the band
      // reads as "lots of people" instead of flashing pixel static.
      const rand = new Rand(424242);
      const crowdTop = h * 0.56;
      const crowdBottom = h * 0.93;
      const rowH = 16;
      const colors = ["#3a4a72", "#2b3a5e", "#4a5478", "#384768", "#2a3656", "#445080"];

      for (let y = crowdTop; y < crowdBottom; y += rowH) {
        ctx.fillStyle = y / rowH % 2 < 1 ? "rgba(255,255,255,0.018)" : "rgba(0,0,0,0.18)";
        ctx.fillRect(0, y, w, rowH);
      }

      for (let y = crowdTop + 6; y < crowdBottom; y += rowH) {
        for (let x = 0; x < w; x += 16) {
          if (rand.next() < 0.62) continue;
          const sw = rand.range(4, 7);
          const sh = rand.range(4, 6);
          ctx.globalAlpha = rand.range(0.28, 0.5);
          ctx.fillStyle = rand.pick(colors);
          ctx.fillRect(x + rand.range(-2, 2), y + rand.range(-2, 2), sw, sh);
        }
      }
      ctx.globalAlpha = 1;

      // Lower rail only — ad panels removed because their bright yellow
      // text was a major source of scrolling noise near the play area.
      ctx.fillStyle = "#070b1c";
      ctx.fillRect(0, h - 26, w, 26);
      ctx.strokeStyle = "rgba(40,60,110,0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, h - 26);
      ctx.lineTo(w, h - 26);
      ctx.stroke();

      const vignette = ctx.createLinearGradient(0, 0, 0, h);
      vignette.addColorStop(0, "rgba(0,0,0,0.12)");
      vignette.addColorStop(0.6, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.42)");
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
      const grassH = 46;
      const turf = ctx.createLinearGradient(0, 0, 0, grassH);
      turf.addColorStop(0, "#6bd95a");
      turf.addColorStop(0.42, "#3fa336");
      turf.addColorStop(1, "#1f6d24");
      ctx.fillStyle = turf;
      ctx.fillRect(0, 0, w, grassH);

      const rand = new Rand(7);
      for (let x = 0; x < w; x += 5) {
        const bh = rand.range(3, 9);
        ctx.strokeStyle = rand.next() > 0.5 ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.22)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, grassH);
        ctx.lineTo(x + rand.range(-2, 2), grassH - bh);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(0, 2, w, 2);
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, grassH - 3, w, 5);

      const earth = ctx.createLinearGradient(0, grassH, 0, h);
      earth.addColorStop(0, "#312011");
      earth.addColorStop(0.55, "#1d1208");
      earth.addColorStop(1, "#0c0603");
      ctx.fillStyle = earth;
      ctx.fillRect(0, grassH, w, h - grassH);

      ctx.strokeStyle = "rgba(0,0,0,0.42)";
      ctx.lineWidth = 1;
      const brickH = 28;
      const brickW = 86;
      for (let row = 0; row * brickH + grassH < h; row++) {
        const offset = row % 2 === 0 ? 0 : brickW / 2;
        const y = grassH + row * brickH;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
        for (let x = -offset; x < w; x += brickW) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + brickH);
          ctx.stroke();
        }
      }
    },
    GROUND_W,
    GROUND_H
  );
}
