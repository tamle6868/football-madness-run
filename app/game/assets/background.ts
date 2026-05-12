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

      // Distant pin lights.
      for (let i = 0; i < 55; i++) {
        const x = rand.range(0, w);
        const y = rand.range(0, h * 0.52);
        const r = rand.range(0.5, 1.4);
        ctx.fillStyle = `rgba(255,245,190,${rand.range(0.35, 0.9)})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Stadium floodlight bloom, kept broad and soft so the HUD remains legible.
      const lightXs = [120, 360, 640, 920, 1160];
      for (const cx of lightXs) {
        const cy = h * 0.32;
        const halo = ctx.createRadialGradient(cx, cy, 10, cx, cy, 230);
        halo.addColorStop(0, "rgba(255,255,230,0.72)");
        halo.addColorStop(0.32, "rgba(190,215,255,0.2)");
        halo.addColorStop(1, "rgba(80,110,180,0)");
        ctx.fillStyle = halo;
        ctx.fillRect(cx - 250, cy - 250, 500, 500);

        ctx.fillStyle = "rgba(255,255,245,0.95)";
        for (let j = 0; j < 4; j++) {
          ctx.beginPath();
          ctx.arc(cx - 18 + j * 12, cy, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Sparse celebration confetti.
      const colors = ["#ff3845", "#ffc83a", "#32d264", "#1d56c2", "#ffffff", "#ff9a3c"];
      for (let i = 0; i < 95; i++) {
        const x = rand.range(0, w);
        const y = rand.range(0, h * 0.86);
        const cw = rand.range(2, 5);
        const ch = rand.range(4, 8);
        ctx.fillStyle = rand.pick(colors);
        ctx.globalAlpha = rand.range(0.35, 0.8);
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

      // Front floodlight beams falling onto the pitch.
      ctx.globalCompositeOperation = "lighter";
      for (const cx of [240, 560, 920, 1260]) {
        const beam = ctx.createLinearGradient(cx, h * 0.12, cx + 80, h);
        beam.addColorStop(0, "rgba(255,255,230,0.2)");
        beam.addColorStop(1, "rgba(255,240,160,0)");
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(cx - 36, h * 0.2);
        ctx.lineTo(cx + 74, h);
        ctx.lineTo(cx + 220, h);
        ctx.lineTo(cx + 36, h * 0.2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // Banner row creates visual rhythm without noisy pixel static.
      const bannerY = h * 0.38;
      const bannerH = 34;
      const banners = ["#ff3845", "#ffd23a", "#1d56c2", "#32d264", "#ffffff", "#ff9a3c"];
      for (let x = -40, i = 0; x < w + 80; x += 82, i++) {
        ctx.fillStyle = banners[i % banners.length];
        ctx.beginPath();
        ctx.moveTo(x, bannerY);
        ctx.lineTo(x + 68, bannerY);
        ctx.lineTo(x + 34, bannerY + bannerH);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.55)";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Crowd blocks: larger cells and horizontal row shadows read cleaner on mobile.
      const rand = new Rand(424242);
      const crowdTop = h * 0.56;
      const crowdBottom = h * 0.93;
      const rowH = 13;
      const colors = ["#ffd23a", "#ff3845", "#e8edf8", "#1d56c2", "#32d264", "#ff9a3c", "#8f65ff"];

      for (let y = crowdTop; y < crowdBottom; y += rowH) {
        ctx.fillStyle = y / rowH % 2 < 1 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.16)";
        ctx.fillRect(0, y, w, rowH);
      }

      for (let y = crowdTop + 4; y < crowdBottom; y += rowH) {
        for (let x = 0; x < w; x += 10) {
          if (rand.next() < 0.34) continue;
          const sw = rand.range(4, 8);
          const sh = rand.range(4, 7);
          ctx.globalAlpha = rand.range(0.45, 0.88);
          ctx.fillStyle = rand.pick(colors);
          ctx.fillRect(x + rand.range(-2, 2), y + rand.range(-2, 2), sw, sh);
        }
      }
      ctx.globalAlpha = 1;

      // Lower rail and pitch-side advertising panels.
      ctx.fillStyle = "#060814";
      ctx.fillRect(0, h - 28, w, 28);
      const ads = ["MADNESS RUN", "WORLD ROUTE", "SUPER SPRINT", "VAR ZONE"];
      for (let x = 36, i = 0; x < w; x += 310, i++) {
        ctx.fillStyle = i % 2 === 0 ? "#10245c" : "#1b3a2a";
        ctx.fillRect(x, h - 24, 250, 18);
        ctx.fillStyle = "#ffd23a";
        ctx.font = "900 13px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(ads[i % ads.length], x + 125, h - 15);
      }

      const vignette = ctx.createLinearGradient(0, 0, 0, h);
      vignette.addColorStop(0, "rgba(0,0,0,0.08)");
      vignette.addColorStop(0.65, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.35)");
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
