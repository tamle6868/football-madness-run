import * as Phaser from "phaser";
import { commitCanvasAsTexture } from "./utils";

function rounded(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outer: number,
  inner: number
) {
  let rot = Math.PI * 1.5;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outer);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
    rot += step;
  }
  ctx.closePath();
  ctx.fill();
}

function drawCoinPile(ctx: CanvasRenderingContext2D, cx: number, y: number) {
  const rows = [
    { count: 7, y: 0, r: 8 },
    { count: 5, y: -9, r: 8 },
    { count: 3, y: -18, r: 8 },
  ];
  for (const row of rows) {
    const start = cx - ((row.count - 1) * row.r * 1.12) / 2;
    for (let i = 0; i < row.count; i++) {
      const x = start + i * row.r * 1.12;
      const g = ctx.createRadialGradient(x - 2, y + row.y - 3, 1, x, y + row.y, row.r);
      g.addColorStop(0, "#fff7a8");
      g.addColorStop(0.55, "#ffc83a");
      g.addColorStop(1, "#8a4f08");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y + row.y, row.r, row.r * 0.72, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#3a2306";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}

export function createFifaCorruptionTexture(scene: Phaser.Scene) {
  const W = 190;
  const H = 230;
  commitCanvasAsTexture(
    scene,
    "obs-corruption",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      ctx.ellipse(w / 2, h - 10, 74, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      drawCoinPile(ctx, w / 2, h - 15);

      const bag = ctx.createLinearGradient(0, 52, 0, h);
      bag.addColorStop(0, "#f1c06b");
      bag.addColorStop(0.42, "#bd7f2a");
      bag.addColorStop(1, "#5d3510");
      ctx.fillStyle = bag;
      ctx.strokeStyle = "#211304";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(45, 87);
      ctx.quadraticCurveTo(18, 118, 17, 177);
      ctx.quadraticCurveTo(34, h - 25, w / 2, h - 27);
      ctx.quadraticCurveTo(w - 34, h - 25, w - 17, 177);
      ctx.quadraticCurveTo(w - 18, 118, w - 45, 87);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.beginPath();
      ctx.ellipse(68, 130, 16, 50, -0.18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#72501d";
      ctx.strokeStyle = "#211304";
      ctx.lineWidth = 4;
      rounded(ctx, 43, 68, w - 86, 28, 9);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#211304";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(48, 82);
      ctx.lineTo(w - 48, 82);
      ctx.stroke();

      ctx.fillStyle = "#7d5520";
      ctx.beginPath();
      ctx.moveTo(56, 70);
      ctx.lineTo(72, 46);
      ctx.lineTo(83, 70);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(w - 83, 70);
      ctx.lineTo(w - 72, 46);
      ctx.lineTo(w - 56, 70);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#4d2d0b";
      ctx.font = "900 58px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", w / 2, 126);
      ctx.font = "900 22px sans-serif";
      ctx.fillText("FOOFA", w / 2, 164);
      ctx.font = "900 18px sans-serif";
      ctx.fillText("CONTRACT", w / 2, 187);

      ctx.save();
      ctx.translate(w / 2 + 22, 35);
      ctx.fillStyle = "#0c1432";
      rounded(ctx, -18, -4, 36, 38, 8);
      ctx.fill();
      ctx.strokeStyle = "#050811";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#f0c49e";
      ctx.beginPath();
      ctx.ellipse(0, -13, 13, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#221104";
      ctx.beginPath();
      ctx.moveTo(-13, -19);
      ctx.quadraticCurveTo(0, -31, 13, -19);
      ctx.quadraticCurveTo(10, -8, -10, -8);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#32d264";
      rounded(ctx, -34, 7, 26, 14, 3);
      ctx.fill();
      ctx.fillStyle = "#083515";
      ctx.font = "900 10px sans-serif";
      ctx.fillText("$", -21, 17);
      ctx.restore();

      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#07101f";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w - 25, 24, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ff3845";
      ctx.beginPath();
      ctx.arc(w - 25, 24, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w - 31, 22);
      ctx.lineTo(w - 26, 19);
      ctx.moveTo(w - 24, 19);
      ctx.lineTo(w - 19, 22);
      ctx.moveTo(w - 30, 29);
      ctx.quadraticCurveTo(w - 25, 26, w - 20, 29);
      ctx.stroke();
    },
    W,
    H
  );
}

export function createInjuryCardTexture(scene: Phaser.Scene) {
  const W = 126;
  const H = 214;
  commitCanvasAsTexture(
    scene,
    "obs-injury",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      ctx.ellipse(w / 2, h - 7, 50, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      const frame = ctx.createLinearGradient(0, 0, w, h);
      frame.addColorStop(0, "#5fa6ff");
      frame.addColorStop(0.5, "#1649c9");
      frame.addColorStop(1, "#081b5c");
      ctx.fillStyle = frame;
      ctx.strokeStyle = "#04102e";
      ctx.lineWidth = 5;
      rounded(ctx, 8, 8, w - 16, h - 18, 12);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 2;
      rounded(ctx, 14, 15, w - 28, h - 32, 9);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 30px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("99", 35, 38);
      ctx.font = "900 13px sans-serif";
      ctx.fillText("INJURY", 37, 60);

      ctx.save();
      ctx.translate(w / 2 + 8, 108);
      ctx.fillStyle = "#f0b78f";
      ctx.strokeStyle = "#061126";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, -45, 15, 17, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#1f1208";
      ctx.beginPath();
      ctx.moveTo(-15, -51);
      ctx.quadraticCurveTo(0, -66, 16, -51);
      ctx.lineTo(13, -42);
      ctx.quadraticCurveTo(1, -48, -14, -42);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#ffd23a";
      rounded(ctx, -17, -30, 34, 46, 7);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#1644a8";
      ctx.font = "900 15px sans-serif";
      ctx.fillText("7", 1, -8);

      ctx.strokeStyle = "#061126";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-15, -24);
      ctx.lineTo(-29, -8);
      ctx.moveTo(15, -24);
      ctx.lineTo(29, -6);
      ctx.moveTo(-8, 16);
      ctx.lineTo(-18, 42);
      ctx.moveTo(8, 16);
      ctx.lineTo(28, 32);
      ctx.stroke();
      ctx.strokeStyle = "#ffd23a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-15, -24);
      ctx.lineTo(-29, -8);
      ctx.moveTo(15, -24);
      ctx.lineTo(29, -6);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(-6, -42, 3, 4, 0, 0, Math.PI * 2);
      ctx.ellipse(6, -42, 3, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#07101f";
      ctx.beginPath();
      ctx.arc(-6, -41, 1.5, 0, Math.PI * 2);
      ctx.arc(6, -41, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#3a0a14";
      ctx.beginPath();
      ctx.ellipse(1, -32, 5, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = "#ffd23a";
      drawStar(ctx, 27, 86, 5, 7, 3);
      drawStar(ctx, w - 23, 88, 5, 6, 3);

      ctx.fillStyle = "#ffffff";
      rounded(ctx, w / 2 - 18, h - 48, 36, 32, 5);
      ctx.fill();
      ctx.strokeStyle = "#061126";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#ff3845";
      ctx.fillRect(w / 2 - 4, h - 43, 8, 22);
      ctx.fillRect(w / 2 - 13, h - 34, 26, 7);
    },
    W,
    H
  );
}

export function createSocialMediaHateTexture(scene: Phaser.Scene) {
  const W = 170;
  const H = 166;
  commitCanvasAsTexture(
    scene,
    "obs-hate",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      ctx.ellipse(w / 2, h - 8, 63, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      const tiers = [
        { y: h - 27, rx: 63, ry: 18, top: "#ad6727", bot: "#4a240a" },
        { y: h - 60, rx: 51, ry: 17, top: "#8c4d1c", bot: "#3b1a06" },
        { y: h - 91, rx: 36, ry: 15, top: "#723813", bot: "#261003" },
      ];
      for (const tier of tiers) {
        const g = ctx.createLinearGradient(0, tier.y - tier.ry, 0, tier.y + tier.ry);
        g.addColorStop(0, tier.top);
        g.addColorStop(1, tier.bot);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(w / 2, tier.y, tier.rx, tier.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#1d0d03";
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.16)";
        ctx.beginPath();
        ctx.ellipse(w / 2 - 8, tier.y - 5, tier.rx * 0.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#2a1204";
      ctx.beginPath();
      ctx.moveTo(w / 2, h - 108);
      ctx.lineTo(w / 2 - 10, h - 90);
      ctx.lineTo(w / 2 + 10, h - 90);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(w / 2 - 14, h - 62, 5, 6, 0, 0, Math.PI * 2);
      ctx.ellipse(w / 2 + 14, h - 62, 5, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#07101f";
      ctx.beginPath();
      ctx.arc(w / 2 - 14, h - 61, 2, 0, Math.PI * 2);
      ctx.arc(w / 2 + 14, h - 61, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#170903";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w / 2, h - 44, 9, Math.PI * 1.12, Math.PI * 1.88);
      ctx.stroke();

      ctx.fillStyle = "#fff8e0";
      ctx.strokeStyle = "#07101f";
      ctx.lineWidth = 3;
      rounded(ctx, 39, h - 50, 92, 34, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#4a240a";
      ctx.font = "900 15px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SOCIAL", w / 2, h - 38);
      ctx.fillText("HATE", w / 2, h - 22);

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(30, 29, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ff3845";
      ctx.beginPath();
      ctx.moveTo(38, 41);
      ctx.lineTo(31, 41);
      ctx.lineTo(27, 49);
      ctx.lineTo(21, 49);
      ctx.lineTo(22, 38);
      ctx.lineTo(15, 38);
      ctx.lineTo(15, 23);
      ctx.lineTo(35, 23);
      ctx.lineTo(40, 28);
      ctx.lineTo(40, 37);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#07101f";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(w - 30, 23, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ffd23a";
      ctx.beginPath();
      ctx.moveTo(w - 30, 7);
      ctx.lineTo(w - 45, 32);
      ctx.lineTo(w - 15, 32);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#07101f";
      ctx.font = "900 17px sans-serif";
      ctx.fillText("!", w - 30, 25);
    },
    W,
    H
  );
}

export function createVarTexture(scene: Phaser.Scene) {
  const W = 166;
  const H = 220;
  commitCanvasAsTexture(
    scene,
    "obs-var",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      ctx.ellipse(w / 2, h - 8, 58, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#111827";
      ctx.fillRect(w / 2 - 5, 129, 10, 70);
      ctx.fillStyle = "#060913";
      rounded(ctx, w / 2 - 34, h - 18, 68, 12, 5);
      ctx.fill();

      ctx.fillStyle = "#050811";
      ctx.strokeStyle = "#3c465d";
      ctx.lineWidth = 5;
      rounded(ctx, 9, 16, w - 18, 125, 12);
      ctx.fill();
      ctx.stroke();

      const screen = ctx.createLinearGradient(0, 26, 0, 130);
      screen.addColorStop(0, "#1a2235");
      screen.addColorStop(0.52, "#0a0d14");
      screen.addColorStop(1, "#20283a");
      ctx.fillStyle = screen;
      rounded(ctx, 20, 28, w - 40, 94, 6);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.06)";
      for (let y = 31; y < 120; y += 5) {
        ctx.fillRect(22, y, w - 44, 1);
      }

      ctx.shadowColor = "#ff3845";
      ctx.shadowBlur = 16;
      ctx.fillStyle = "#ff3845";
      ctx.font = "900 48px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("VAR", w / 2, 74);
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#42dfff";
      rounded(ctx, 30, 91, 31, 22, 4);
      ctx.fill();
      ctx.fillStyle = "#07101f";
      rounded(ctx, 35, 96, 21, 12, 2);
      ctx.fill();

      ctx.fillStyle = "#f0b78f";
      ctx.beginPath();
      ctx.ellipse(w - 44, 102, 10, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1a1208";
      ctx.beginPath();
      ctx.arc(w - 44, 97, 10, Math.PI, 0);
      ctx.fill();

      ctx.fillStyle = "#ff3845";
      ctx.beginPath();
      ctx.arc(w - 30, 27, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 10px sans-serif";
      ctx.fillText("REVIEW", w / 2, 132);
    },
    W,
    H
  );
}

export function createDroneTexture(scene: Phaser.Scene) {
  const W = 220;
  const H = 120;
  commitCanvasAsTexture(
    scene,
    "obs-drone",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);

      const rotorY = 31;
      for (const x of [46, w - 46]) {
        const blur = ctx.createRadialGradient(x, rotorY, 4, x, rotorY, 45);
        blur.addColorStop(0, "rgba(255,255,255,0.7)");
        blur.addColorStop(0.45, "rgba(110,210,255,0.26)");
        blur.addColorStop(1, "rgba(110,210,255,0)");
        ctx.fillStyle = blur;
        ctx.beginPath();
        ctx.ellipse(x, rotorY, 45, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(255,255,255,0.85)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 36, rotorY);
        ctx.lineTo(x + 36, rotorY);
        ctx.moveTo(x, rotorY - 11);
        ctx.lineTo(x, rotorY + 11);
        ctx.stroke();
      }

      ctx.strokeStyle = "#07101f";
      ctx.lineWidth = 11;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(59, 58);
      ctx.lineTo(w / 2 - 37, 67);
      ctx.moveTo(w - 59, 58);
      ctx.lineTo(w / 2 + 37, 67);
      ctx.stroke();
      ctx.strokeStyle = "#6d8fe0";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(61, 58);
      ctx.lineTo(w / 2 - 37, 67);
      ctx.moveTo(w - 61, 58);
      ctx.lineTo(w / 2 + 37, 67);
      ctx.stroke();

      const body = ctx.createLinearGradient(0, 40, 0, h);
      body.addColorStop(0, "#d5eeff");
      body.addColorStop(0.4, "#3e6ce0");
      body.addColorStop(1, "#10204b");
      ctx.fillStyle = body;
      ctx.strokeStyle = "#07101f";
      ctx.lineWidth = 5;
      rounded(ctx, w / 2 - 50, 42, 100, 52, 15);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#061126";
      ctx.beginPath();
      ctx.arc(w / 2, 70, 19, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#42dfff";
      ctx.beginPath();
      ctx.arc(w / 2, 70, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffd23a";
      rounded(ctx, w / 2 - 35, 88, 70, 10, 4);
      ctx.fill();
      ctx.fillStyle = "#07101f";
      ctx.font = "900 10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SLIDE", w / 2, 93);

      for (const x of [w / 2 - 60, w / 2 + 60]) {
        ctx.fillStyle = "#ff3845";
        ctx.shadowColor = "#ff3845";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, 58, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    },
    W,
    H
  );
}

export function createCoinTextures(scene: Phaser.Scene) {
  const W = 72;
  const H = 72;
  const frames = 6;
  for (let f = 0; f < frames; f++) {
    const t = f / frames;
    const sx = Math.max(0.14, Math.abs(Math.cos(t * Math.PI * 2)));
    commitCanvasAsTexture(
      scene,
      `coin-${f}`,
      (ctx, w, h) => {
        ctx.clearRect(0, 0, w, h);
        const cx = w / 2;
        const cy = h / 2;
        const rx = (w / 2 - 5) * sx;
        const ry = h / 2 - 6;

        ctx.shadowColor = "rgba(255,210,58,0.9)";
        ctx.shadowBlur = 10;
        const g = ctx.createRadialGradient(cx - rx * 0.35, cy - ry * 0.35, 4, cx, cy, ry);
        g.addColorStop(0, "#fff7a8");
        g.addColorStop(0.45, "#ffc83a");
        g.addColorStop(0.78, "#d48713");
        g.addColorStop(1, "#6f4208");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = "#4a2b05";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.strokeStyle = "#fff1a3";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.max(2, rx - 7), ry - 7, 0, 0, Math.PI * 2);
        ctx.stroke();

        if (sx > 0.45) {
          ctx.fillStyle = "#6f4208";
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI * 2 * i) / 6 - Math.PI / 6;
            const x = cx + Math.cos(a) * ry * 0.24;
            const y = cy + Math.sin(a) * ry * 0.24;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = "#6f4208";
          ctx.lineWidth = 2;
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI * 2 * i) / 6;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(a) * ry * 0.32, cy + Math.sin(a) * ry * 0.32);
            ctx.lineTo(cx + Math.cos(a) * ry * 0.64, cy + Math.sin(a) * ry * 0.64);
            ctx.stroke();
          }
        }

        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.beginPath();
        ctx.ellipse(cx - rx * 0.38, cy - ry * 0.52, Math.max(2, rx * 0.28), ry * 0.13, -0.3, 0, Math.PI * 2);
        ctx.fill();
      },
      W,
      H
    );
  }
}

export function createTrophyTexture(scene: Phaser.Scene) {
  const W = 210;
  const H = 270;
  commitCanvasAsTexture(
    scene,
    "trophy",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.ellipse(w / 2, h - 12, 78, 11, 0, 0, Math.PI * 2);
      ctx.fill();

      const gold = ctx.createLinearGradient(0, 0, w, h);
      gold.addColorStop(0, "#fff7a8");
      gold.addColorStop(0.36, "#ffc83a");
      gold.addColorStop(0.68, "#b76d10");
      gold.addColorStop(1, "#5b3307");

      ctx.strokeStyle = "#4a2b05";
      ctx.lineWidth = 6;
      ctx.fillStyle = gold;
      ctx.beginPath();
      ctx.moveTo(49, 101);
      ctx.bezierCurveTo(11, 100, 9, 54, 45, 52);
      ctx.bezierCurveTo(41, 72, 45, 89, 62, 96);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w - 49, 101);
      ctx.bezierCurveTo(w - 11, 100, w - 9, 54, w - 45, 52);
      ctx.bezierCurveTo(w - 41, 72, w - 45, 89, w - 62, 96);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#1f1408";
      rounded(ctx, 32, h - 42, w - 64, 25, 6);
      ctx.fill();
      ctx.fillStyle = "#5b3307";
      rounded(ctx, 43, h - 62, w - 86, 22, 5);
      ctx.fill();
      ctx.fillStyle = gold;
      rounded(ctx, w / 2 - 20, h - 112, 40, 56, 8);
      ctx.fill();
      ctx.strokeStyle = "#4a2b05";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = gold;
      ctx.strokeStyle = "#4a2b05";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 62, 25);
      ctx.quadraticCurveTo(w / 2, 2, w / 2 + 62, 25);
      ctx.bezierCurveTo(w / 2 + 55, 108, w / 2 + 38, 149, w / 2 + 12, 164);
      ctx.lineTo(w / 2 - 12, 164);
      ctx.bezierCurveTo(w / 2 - 38, 149, w / 2 - 55, 108, w / 2 - 62, 25);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.ellipse(w / 2 - 25, 67, 15, 42, -0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#8b520e";
      ctx.beginPath();
      ctx.ellipse(w / 2 - 15, 65, 12, 9, -0.25, 0, Math.PI * 2);
      ctx.ellipse(w / 2 + 18, 95, 16, 11, 0.15, 0, Math.PI * 2);
      ctx.ellipse(w / 2 + 5, 46, 10, 6, 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(74,43,5,0.35)";
      ctx.lineWidth = 2;
      for (const y of [56, 86, 116]) {
        ctx.beginPath();
        ctx.ellipse(w / 2, y, 42, 10, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = "#174f23";
      rounded(ctx, 46, h - 73, w - 92, 18, 4);
      ctx.fill();
      ctx.fillStyle = "#fff8e0";
      ctx.font = "900 13px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("GLOBE CUP", w / 2, h - 64);
    },
    W,
    H
  );
}
