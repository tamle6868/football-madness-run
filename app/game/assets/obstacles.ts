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

/**
 * FIFA Corruption: tan money bag with $ symbol + small parody figure.
 * Tall obstacle, jump over.
 */
export function createFifaCorruptionTexture(scene: Phaser.Scene) {
  const W = 180;
  const H = 220;
  commitCanvasAsTexture(
    scene,
    "obs-corruption",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);

      // Money bag base shadow
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.ellipse(w / 2, h - 8, 70, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Money bag body (rounded sack)
      const bagGrad = ctx.createLinearGradient(0, 60, 0, h);
      bagGrad.addColorStop(0, "#d8a35a");
      bagGrad.addColorStop(0.5, "#b07d34");
      bagGrad.addColorStop(1, "#5a3a14");
      ctx.fillStyle = bagGrad;
      ctx.beginPath();
      ctx.moveTo(20, 90);
      ctx.quadraticCurveTo(0, 200, 30, h - 14);
      ctx.lineTo(w - 30, h - 14);
      ctx.quadraticCurveTo(w, 200, w - 20, 90);
      ctx.closePath();
      ctx.fill();

      // Outline
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Bag tied top
      ctx.fillStyle = "#7a5520";
      rounded(ctx, 30, 70, w - 60, 30, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
      ctx.stroke();

      // String/cinch
      ctx.strokeStyle = "#3a2a14";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(40, 86);
      ctx.lineTo(w - 40, 86);
      ctx.stroke();

      // Folds at top
      ctx.fillStyle = "#7a5520";
      ctx.beginPath();
      ctx.moveTo(40, 70);
      ctx.lineTo(60, 50);
      ctx.lineTo(70, 70);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(w - 70, 70);
      ctx.lineTo(w - 60, 50);
      ctx.lineTo(w - 40, 70);
      ctx.closePath();
      ctx.fill();

      // $ symbol
      ctx.fillStyle = "#1a1208";
      ctx.font = "900 86px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", w / 2, h / 2 + 18);

      // Label "FIFA CORRUPTION"
      ctx.fillStyle = "#fff8e0";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("FOOFA", w / 2, h - 38);
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("CORRUPTION", w / 2, h - 22);

      // Small angry figure on top (parody Arab buyer)
      ctx.save();
      ctx.translate(w / 2, 30);
      // Robe
      ctx.fillStyle = "#f3eedd";
      ctx.beginPath();
      ctx.moveTo(-22, 30);
      ctx.lineTo(-26, 0);
      ctx.lineTo(26, 0);
      ctx.lineTo(22, 30);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Head
      ctx.fillStyle = "#e6c4a0";
      ctx.beginPath();
      ctx.ellipse(0, -10, 12, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Headdress (red checked keffiyeh)
      ctx.fillStyle = "#d63a3a";
      ctx.beginPath();
      ctx.moveTo(-16, -16);
      ctx.lineTo(0, -26);
      ctx.lineTo(16, -16);
      ctx.lineTo(14, -2);
      ctx.lineTo(-14, -2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-14, -14, 28, 2);
      ctx.fillRect(-14, -10, 28, 2);
      ctx.fillRect(-14, -6, 28, 2);
      // Beard
      ctx.fillStyle = "#1a1208";
      ctx.beginPath();
      ctx.moveTo(-10, -4);
      ctx.quadraticCurveTo(0, 8, 10, -4);
      ctx.closePath();
      ctx.fill();
      // Eyes
      ctx.fillStyle = "#0b1020";
      ctx.beginPath();
      ctx.arc(-4, -10, 1.6, 0, Math.PI * 2);
      ctx.arc(4, -10, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Angry emoji bubble
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(w - 22, 16, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ff3845";
      ctx.beginPath();
      ctx.arc(w - 22, 16, 9, 0, Math.PI * 2);
      ctx.fill();
      // Angry face
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(w - 27, 14);
      ctx.lineTo(w - 23, 12);
      ctx.moveTo(w - 21, 12);
      ctx.lineTo(w - 17, 14);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w - 22, 20, 2.2, Math.PI, 0);
      ctx.stroke();
    },
    W,
    H
  );
}

/**
 * Injury Card — blue FIFA-style player card with cross. Tall obstacle, jump.
 */
export function createInjuryCardTexture(scene: Phaser.Scene) {
  const W = 110;
  const H = 200;
  commitCanvasAsTexture(
    scene,
    "obs-injury",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      // Drop shadow
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.ellipse(w / 2, h - 4, 50, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Card frame
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#3b7eea");
      grad.addColorStop(0.55, "#1a4ab8");
      grad.addColorStop(1, "#0a2466");
      ctx.fillStyle = grad;
      rounded(ctx, 4, 6, w - 8, h - 14, 10);
      ctx.fill();
      ctx.strokeStyle = "#0a2466";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner border
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1.5;
      rounded(ctx, 8, 10, w - 16, h - 22, 8);
      ctx.stroke();

      // Rating "99"
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 26px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("99", 28, 36);
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("INJ", 28, 54);

      // Player figure (silhouette in pain — leg up, hands on head)
      ctx.save();
      ctx.translate(w / 2 + 8, 80);
      ctx.fillStyle = "#0a2466";
      // Head
      ctx.beginPath();
      ctx.arc(0, -28, 12, 0, Math.PI * 2);
      ctx.fill();
      // Body
      rounded(ctx, -14, -16, 28, 36, 6);
      ctx.fill();
      // Hands on head
      ctx.beginPath();
      ctx.arc(-12, -38, 5, 0, Math.PI * 2);
      ctx.arc(12, -38, 5, 0, Math.PI * 2);
      ctx.fill();
      // Arms up to head
      ctx.fillRect(-14, -36, 4, 24);
      ctx.fillRect(10, -36, 4, 24);
      // Leg held up (other one bent)
      rounded(ctx, -8, 18, 8, 24, 3);
      ctx.fill();
      rounded(ctx, 6, 14, 24, 8, 3);
      ctx.fill();
      ctx.restore();

      // Pain stars
      ctx.fillStyle = "#ffd23a";
      drawStar(ctx, 22, 80, 5, 6, 3);
      drawStar(ctx, w - 22, 92, 5, 6, 3);
      drawStar(ctx, w - 22, 60, 4, 4, 2);

      // Medical cross at bottom
      ctx.fillStyle = "#ffffff";
      rounded(ctx, w / 2 - 14, h - 50, 28, 28, 4);
      ctx.fill();
      ctx.fillStyle = "#ff3845";
      ctx.fillRect(w / 2 - 3, h - 46, 6, 20);
      ctx.fillRect(w / 2 - 11, h - 38, 22, 6);
    },
    W,
    H
  );
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outer: number,
  inner: number
) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outer);
  for (let i = 0; i < spikes; i++) {
    let x = cx + Math.cos(rot) * outer;
    let y = cy + Math.sin(rot) * outer;
    ctx.lineTo(x, y);
    rot += step;
    x = cx + Math.cos(rot) * inner;
    y = cy + Math.sin(rot) * inner;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outer);
  ctx.closePath();
  ctx.fill();
}

/**
 * Social Media Hate — brown poop pile with hate emoji bubbles.
 * Low obstacle: slide under (taller version); short version: jump.
 */
export function createSocialMediaHateTexture(scene: Phaser.Scene) {
  const W = 160;
  const H = 160;
  commitCanvasAsTexture(
    scene,
    "obs-hate",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.ellipse(w / 2, h - 6, 60, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Poop swirl (3 stacked tiers)
      const tiers = [
        { y: h - 20, rx: 64, ry: 18, top: "#9a5a26", bot: "#5a2e0e" },
        { y: h - 54, rx: 50, ry: 16, top: "#8a4a1e", bot: "#4a240a" },
        { y: h - 86, rx: 36, ry: 14, top: "#7a4018", bot: "#3a1c08" },
      ];
      for (const t of tiers) {
        const grad = ctx.createLinearGradient(0, t.y - t.ry, 0, t.y + t.ry);
        grad.addColorStop(0, t.top);
        grad.addColorStop(1, t.bot);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(w / 2, t.y, t.rx, t.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Highlight on each tier
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      for (const t of tiers) {
        ctx.beginPath();
        ctx.ellipse(w / 2 - 6, t.y - 4, t.rx * 0.6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Tip of poop
      ctx.fillStyle = "#3a1c08";
      ctx.beginPath();
      ctx.moveTo(w / 2, h - 100);
      ctx.lineTo(w / 2 - 6, h - 88);
      ctx.lineTo(w / 2 + 6, h - 88);
      ctx.closePath();
      ctx.fill();

      // Cute eyes (parody hate emoji)
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(w / 2 - 14, h - 56, 5, 6, 0, 0, Math.PI * 2);
      ctx.ellipse(w / 2 + 14, h - 56, 5, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0b1020";
      ctx.beginPath();
      ctx.arc(w / 2 - 14, h - 55, 2.2, 0, Math.PI * 2);
      ctx.arc(w / 2 + 14, h - 55, 2.2, 0, Math.PI * 2);
      ctx.fill();
      // Frown
      ctx.strokeStyle = "#1a0c08";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(w / 2, h - 38, 8, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();

      // Hate-comment bubble
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(28, 28, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Thumbs down
      ctx.fillStyle = "#ff3845";
      ctx.font = "900 18px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("👎", 28, 30);

      // Second bubble (poop emoji)
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(w - 28, 18, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#6b3a14";
      ctx.font = "900 16px sans-serif";
      ctx.fillText("💩", w - 28, 20);
    },
    W,
    H
  );
}

/**
 * VAR barrier — TV screen on stand showing red "VAR".
 * Tall obstacle (jump).
 */
export function createVarTexture(scene: Phaser.Scene) {
  const W = 150;
  const H = 220;
  commitCanvasAsTexture(
    scene,
    "obs-var",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      // Stand
      ctx.fillStyle = "#1a1c24";
      ctx.fillRect(w / 2 - 4, 130, 8, 70);
      ctx.fillStyle = "#0a0c14";
      rounded(ctx, w / 2 - 30, h - 14, 60, 10, 4);
      ctx.fill();
      ctx.strokeStyle = "#0a0c14";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Screen frame
      ctx.fillStyle = "#0a0c14";
      rounded(ctx, 6, 6, w - 12, 130, 10);
      ctx.fill();
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Screen inner (CRT glow)
      const sg = ctx.createLinearGradient(0, 0, 0, 130);
      sg.addColorStop(0, "#10131c");
      sg.addColorStop(1, "#1c2030");
      ctx.fillStyle = sg;
      rounded(ctx, 14, 14, w - 28, 114, 6);
      ctx.fill();

      // VAR text glowing red
      ctx.shadowColor = "#ff2a2a";
      ctx.shadowBlur = 18;
      ctx.fillStyle = "#ff3845";
      ctx.font = "900 56px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("VAR", w / 2, 74);
      ctx.shadowBlur = 0;

      // Scanlines
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      for (let y = 14; y < 128; y += 4) {
        ctx.fillRect(14, y, w - 28, 1);
      }

      // Red recording dot
      ctx.fillStyle = "#ff3845";
      ctx.beginPath();
      ctx.arc(w - 28, 24, 4, 0, Math.PI * 2);
      ctx.fill();

      // Brand label under screen
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("REVIEW", w / 2, 122);
    },
    W,
    H
  );
}

/**
 * Drone — flying slide-only obstacle. It sits above head height so a normal
 * run/jump into its body is dangerous, while a slide passes beneath.
 */
export function createDroneTexture(scene: Phaser.Scene) {
  const W = 220;
  const H = 120;
  commitCanvasAsTexture(
    scene,
    "obs-drone",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);

      // Rotor blur discs
      const rotorY = 32;
      const rotorXs = [46, w - 46];
      for (const x of rotorXs) {
        const blur = ctx.createRadialGradient(x, rotorY, 4, x, rotorY, 42);
        blur.addColorStop(0, "rgba(255,255,255,0.65)");
        blur.addColorStop(0.45, "rgba(160,210,255,0.22)");
        blur.addColorStop(1, "rgba(160,210,255,0)");
        ctx.fillStyle = blur;
        ctx.beginPath();
        ctx.ellipse(x, rotorY, 42, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(255,255,255,0.85)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - 34, rotorY);
        ctx.lineTo(x + 34, rotorY);
        ctx.moveTo(x, rotorY - 10);
        ctx.lineTo(x, rotorY + 10);
        ctx.stroke();
      }

      // Arms
      ctx.strokeStyle = "#0b1020";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(60, 58);
      ctx.lineTo(w / 2 - 34, 66);
      ctx.moveTo(w - 60, 58);
      ctx.lineTo(w / 2 + 34, 66);
      ctx.stroke();
      ctx.strokeStyle = "#5d7db8";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(62, 58);
      ctx.lineTo(w / 2 - 34, 66);
      ctx.moveTo(w - 62, 58);
      ctx.lineTo(w / 2 + 34, 66);
      ctx.stroke();

      // Body shell
      const bodyGrad = ctx.createLinearGradient(0, 40, 0, h);
      bodyGrad.addColorStop(0, "#a0d0ff");
      bodyGrad.addColorStop(0.4, "#365ea8");
      bodyGrad.addColorStop(1, "#10224e");
      ctx.fillStyle = bodyGrad;
      rounded(ctx, w / 2 - 48, 42, 96, 50, 14);
      ctx.fill();
      ctx.strokeStyle = "#061126";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Camera lens
      ctx.fillStyle = "#07101f";
      ctx.beginPath();
      ctx.arc(w / 2, 70, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#3cf2ff";
      ctx.beginPath();
      ctx.arc(w / 2, 70, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.beginPath();
      ctx.arc(w / 2 - 4, 66, 3, 0, Math.PI * 2);
      ctx.fill();

      // Warning stripe
      ctx.fillStyle = "#ffd23a";
      rounded(ctx, w / 2 - 32, 88, 64, 9, 4);
      ctx.fill();
      ctx.fillStyle = "#0b1020";
      ctx.font = "900 10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("LOW BRIDGE", w / 2, 93);

      // Red warning LEDs
      for (const x of [w / 2 - 58, w / 2 + 58]) {
        ctx.fillStyle = "#ff3845";
        ctx.shadowColor = "#ff3845";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, 58, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Small down arrows to visually teach slide.
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 0.86;
      for (const x of [w / 2 - 80, w / 2 + 80]) {
        ctx.beginPath();
        ctx.moveTo(x - 8, 98);
        ctx.lineTo(x + 8, 98);
        ctx.lineTo(x, 110);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
    W,
    H
  );
}

/**
 * Coin — gold disc with football pattern. We render 6 frames for spin.
 */
export function createCoinTextures(scene: Phaser.Scene) {
  const W = 64;
  const H = 64;
  const frames = 6;
  for (let f = 0; f < frames; f++) {
    const t = f / frames;
    const sx = Math.abs(Math.cos(t * Math.PI * 2));
    commitCanvasAsTexture(
      scene,
      `coin-${f}`,
      (ctx, w, h) => {
        ctx.clearRect(0, 0, w, h);
        const cx = w / 2;
        const cy = h / 2;
        const rx = (w / 2 - 4) * Math.max(0.15, sx);
        const ry = h / 2 - 4;

        const grad = ctx.createRadialGradient(cx - rx * 0.3, cy - ry * 0.3, 4, cx, cy, ry);
        grad.addColorStop(0, "#fff5b8");
        grad.addColorStop(0.5, "#ffc83a");
        grad.addColorStop(1, "#8a5a0a");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#5a3a08";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Football pattern (only when face is visible enough)
        if (sx > 0.5) {
          ctx.fillStyle = "#3a1f04";
          ctx.beginPath();
          ctx.arc(cx, cy, ry * 0.55, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#fff5b8";
          ctx.beginPath();
          ctx.arc(cx, cy, ry * 0.5, 0, Math.PI * 2);
          ctx.fill();

          // Hex panel
          ctx.fillStyle = "#3a1f04";
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI * 2 * i) / 6;
            const x = cx + Math.cos(a) * ry * 0.22;
            const y = cy + Math.sin(a) * ry * 0.22;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();

          // Surrounding small triangles
          ctx.fillStyle = "#3a1f04";
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI * 2 * i) / 6 + Math.PI / 6;
            const x = cx + Math.cos(a) * ry * 0.42;
            const y = cy + Math.sin(a) * ry * 0.42;
            ctx.beginPath();
            ctx.arc(x, y, ry * 0.07, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Highlight
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.beginPath();
        ctx.ellipse(cx - rx * 0.4, cy - ry * 0.5, rx * 0.3, ry * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
      },
      W,
      H
    );
  }
}

/**
 * Trophy — Globe Cup, the route's goal.
 */
export function createTrophyTexture(scene: Phaser.Scene) {
  const W = 200;
  const H = 260;
  commitCanvasAsTexture(
    scene,
    "trophy",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      // Base
      ctx.fillStyle = "#1a1208";
      rounded(ctx, 30, h - 40, w - 60, 26, 6);
      ctx.fill();
      ctx.fillStyle = "#3a2a14";
      rounded(ctx, 36, h - 56, w - 72, 18, 4);
      ctx.fill();

      // Stem
      const sg = ctx.createLinearGradient(0, 0, 0, h);
      sg.addColorStop(0, "#fff5b8");
      sg.addColorStop(0.5, "#ffc83a");
      sg.addColorStop(1, "#8a5a0a");
      ctx.fillStyle = sg;
      rounded(ctx, w / 2 - 14, h - 100, 28, 50, 6);
      ctx.fill();

      // Cup body — globe-like sphere
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2 - 10, 70, 80, 0, 0, Math.PI * 2);
      ctx.fillStyle = sg;
      ctx.fill();
      ctx.strokeStyle = "#5a3a08";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Continents (vague)
      ctx.fillStyle = "#5a3a08";
      ctx.beginPath();
      ctx.ellipse(w / 2 - 22, h / 2 - 22, 18, 12, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(w / 2 + 18, h / 2 + 10, 24, 16, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(w / 2 + 8, h / 2 - 30, 12, 8, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Latitude lines
      ctx.strokeStyle = "rgba(90,58,8,0.5)";
      ctx.lineWidth = 1;
      for (let i = -2; i <= 2; i++) {
        const ry = i * 25;
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2 - 10, 70, Math.max(4, 80 - Math.abs(ry)), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Highlight
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.ellipse(w / 2 - 24, h / 2 - 40, 18, 8, -0.4, 0, Math.PI * 2);
      ctx.fill();

      // Globe Cup label
      ctx.fillStyle = "#fff8e0";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("GLOBE CUP", w / 2, h - 18);
    },
    W,
    H
  );
}
