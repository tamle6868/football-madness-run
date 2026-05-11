import * as Phaser from "phaser";
import { commitCanvasAsTexture, Rand } from "./utils";

const SKY_W = 1280;
const SKY_H = 360;

export function createSkyTexture(scene: Phaser.Scene) {
  commitCanvasAsTexture(
    scene,
    "bg-sky",
    (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#0b0f24");
      grad.addColorStop(0.45, "#1a2348");
      grad.addColorStop(1, "#3b4a8a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Stars / distant lights
      const rand = new Rand(1337);
      for (let i = 0; i < 80; i++) {
        const x = rand.range(0, w);
        const y = rand.range(0, h * 0.6);
        const r = rand.range(0.4, 1.6);
        ctx.fillStyle = `rgba(255,255,220,${rand.range(0.3, 0.9)})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Stadium lights / spotlights
      const lights = 6;
      for (let i = 0; i < lights; i++) {
        const cx = (w / lights) * (i + 0.5);
        const cy = h * 0.35;
        const grad2 = ctx.createRadialGradient(cx, cy, 8, cx, cy, 220);
        grad2.addColorStop(0, "rgba(255,255,200,0.55)");
        grad2.addColorStop(0.4, "rgba(255,255,200,0.12)");
        grad2.addColorStop(1, "rgba(255,255,200,0)");
        ctx.fillStyle = grad2;
        ctx.fillRect(cx - 240, cy - 240, 480, 480);

        // Light fixture
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Confetti drifting in air
      const colors = ["#ff3845", "#ffc83a", "#32d264", "#1d56c2", "#ffffff", "#ff9a3c"];
      for (let i = 0; i < 220; i++) {
        const x = rand.range(0, w);
        const y = rand.range(0, h);
        const cw = rand.range(2, 5);
        const ch = rand.range(3, 7);
        ctx.fillStyle = rand.pick(colors);
        ctx.globalAlpha = rand.range(0.4, 0.9);
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
  commitCanvasAsTexture(
    scene,
    "bg-stadium",
    (ctx, w, h) => {
      // Faded stadium tiers
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(20,28,72,0)");
      grad.addColorStop(0.3, "rgba(20,28,72,0.9)");
      grad.addColorStop(1, "rgba(8,10,26,1)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Stadium silhouette curve (bowl) — subtle dome on top
      ctx.fillStyle = "rgba(10,14,42,1)";
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h * 0.45);
      ctx.quadraticCurveTo(w / 2, h * 0.05, w, h * 0.45);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      // Crowd: pixel grid of colored dots, denser in the middle
      const rand = new Rand(424242);
      const crowdTop = h * 0.5;
      const crowdBottom = h * 0.95;
      const colors = [
        "#ffd23a",
        "#ff3845",
        "#ffffff",
        "#1d56c2",
        "#32d264",
        "#ff9a3c",
        "#9a4cff",
      ];
      const cols = 200;
      const rows = 22;
      const cellW = w / cols;
      const cellH = (crowdBottom - crowdTop) / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = c * cellW + rand.range(-cellW * 0.3, cellW * 0.3);
          const cy = crowdTop + r * cellH + rand.range(-cellH * 0.3, cellH * 0.3);
          if (rand.next() < 0.18) continue;
          const alpha = 0.5 + rand.range(0, 0.4);
          ctx.fillStyle = rand.pick(colors);
          ctx.globalAlpha = alpha;
          ctx.fillRect(cx, cy, cellW * 0.85, cellH * 0.6);
        }
      }
      ctx.globalAlpha = 1;

      // Bunting flags hanging from top
      const flagColors = [
        ["#ff3845", "#ffffff"],
        ["#1d56c2", "#ffd23a"],
        ["#32d264", "#ffffff"],
        ["#ff9a3c", "#1d56c2"],
        ["#ffffff", "#ff3845"],
        ["#ffd23a", "#1644a8"],
      ];
      const flagW = 56;
      const flagH = 38;
      const flagY = 60;
      // Hanging string
      ctx.strokeStyle = "rgba(0,0,0,0.55)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      const y = flagY - 12;
      ctx.moveTo(0, y);
      for (let x = 0; x < w; x += 80) {
        const cy = y + 12 + Math.sin(x * 0.07) * 6;
        ctx.lineTo(x, cy);
      }
      ctx.stroke();

      let fx = 8;
      let fIdx = 0;
      while (fx < w) {
        const fc = flagColors[fIdx % flagColors.length];
        // Flag pole/string
        // Two-tone flag
        ctx.fillStyle = fc[0];
        ctx.beginPath();
        ctx.moveTo(fx, flagY);
        ctx.lineTo(fx + flagW, flagY);
        ctx.lineTo(fx + flagW / 2, flagY + flagH);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = fc[1];
        ctx.beginPath();
        ctx.moveTo(fx + flagW * 0.2, flagY + 4);
        ctx.lineTo(fx + flagW * 0.8, flagY + 4);
        ctx.lineTo(fx + flagW / 2, flagY + flagH - 4);
        ctx.closePath();
        ctx.fill();

        fx += flagW + 8;
        fIdx++;
      }

      // Front row barrier
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, h - 18, w, 18);
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(0, h - 18, w, 3);
    },
    STADIUM_W,
    STADIUM_H
  );
}

const GROUND_W = 1280;
const GROUND_H = 200;

export function createGroundTexture(scene: Phaser.Scene) {
  commitCanvasAsTexture(
    scene,
    "bg-ground",
    (ctx, w, h) => {
      // Top grass band
      const grassH = 42;
      const grad = ctx.createLinearGradient(0, 0, 0, grassH);
      grad.addColorStop(0, "#5dc24a");
      grad.addColorStop(0.5, "#3a8a2c");
      grad.addColorStop(1, "#2a6620");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, grassH);

      // Grass blades on top edge
      const rand = new Rand(7);
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 4) {
        const bh = rand.range(2, 6);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + rand.range(-1, 1), -bh);
        ctx.stroke();
      }

      // Earth/dirt below
      const earthGrad = ctx.createLinearGradient(0, grassH, 0, h);
      earthGrad.addColorStop(0, "#3a2412");
      earthGrad.addColorStop(0.5, "#26160a");
      earthGrad.addColorStop(1, "#150a04");
      ctx.fillStyle = earthGrad;
      ctx.fillRect(0, grassH, w, h - grassH);

      // Brick pattern in earth
      ctx.strokeStyle = "rgba(0,0,0,0.4)";
      ctx.lineWidth = 1;
      const brickH = 26;
      const brickW = 80;
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

      // Top edge highlight
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(0, grassH, w, 2);
    },
    GROUND_W,
    GROUND_H
  );
}
