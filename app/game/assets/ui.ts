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

/** Circular dark glass button used for Slide / Jump / Super. */
function drawCircleBtn(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  glow: string,
  drawIcon: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
) {
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - 6;

  // Outer glow
  const og = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r + 4);
  og.addColorStop(0, glow);
  og.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = og;
  ctx.fillRect(0, 0, w, h);

  // Body
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#243a72");
  grad.addColorStop(1, "#0c1432");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Inner ring
  ctx.strokeStyle = "rgba(120,160,255,0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 4, 0, Math.PI * 2);
  ctx.stroke();

  // Highlight
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.ellipse(cx, cy - r * 0.45, r * 0.7, r * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  drawIcon(ctx, w, h);
}

export function createUITextures(scene: Phaser.Scene) {
  // SLIDE button (down arrow)
  commitCanvasAsTexture(
    scene,
    "btn-slide",
    (ctx, w, h) => {
      drawCircleBtn(ctx, w, h, "rgba(80,140,255,0.4)", (c) => {
        c.fillStyle = "#ffffff";
        c.beginPath();
        c.moveTo(w / 2, h / 2 + 18);
        c.lineTo(w / 2 - 14, h / 2 - 4);
        c.lineTo(w / 2 - 6, h / 2 - 4);
        c.lineTo(w / 2 - 6, h / 2 - 18);
        c.lineTo(w / 2 + 6, h / 2 - 18);
        c.lineTo(w / 2 + 6, h / 2 - 4);
        c.lineTo(w / 2 + 14, h / 2 - 4);
        c.closePath();
        c.fill();
      });
    },
    140,
    140
  );

  // JUMP button (up arrow)
  commitCanvasAsTexture(
    scene,
    "btn-jump",
    (ctx, w, h) => {
      drawCircleBtn(ctx, w, h, "rgba(80,140,255,0.4)", (c) => {
        c.fillStyle = "#ffffff";
        c.beginPath();
        c.moveTo(w / 2, h / 2 - 18);
        c.lineTo(w / 2 - 14, h / 2 + 4);
        c.lineTo(w / 2 - 6, h / 2 + 4);
        c.lineTo(w / 2 - 6, h / 2 + 18);
        c.lineTo(w / 2 + 6, h / 2 + 18);
        c.lineTo(w / 2 + 6, h / 2 + 4);
        c.lineTo(w / 2 + 14, h / 2 + 4);
        c.closePath();
        c.fill();
      });
    },
    140,
    140
  );

  // SUPER button (running figure)
  commitCanvasAsTexture(
    scene,
    "btn-super",
    (ctx, w, h) => {
      drawCircleBtn(ctx, w, h, "rgba(80,180,255,0.7)", (c) => {
        c.save();
        c.translate(w / 2, h / 2);
        // Speed lines
        c.strokeStyle = "rgba(180,220,255,0.9)";
        c.lineWidth = 3;
        for (let i = -2; i <= 2; i++) {
          c.beginPath();
          c.moveTo(-26 + i * 2, -12 + i * 6);
          c.lineTo(-46, -12 + i * 6);
          c.stroke();
        }
        // Runner figure
        c.fillStyle = "#ffffff";
        c.beginPath();
        c.arc(8, -22, 7, 0, Math.PI * 2); // head
        c.fill();
        // Body
        c.beginPath();
        c.moveTo(0, -16);
        c.lineTo(14, -16);
        c.lineTo(20, 6);
        c.lineTo(8, 4);
        c.closePath();
        c.fill();
        // Front leg
        c.beginPath();
        c.moveTo(8, 4);
        c.lineTo(28, 18);
        c.lineTo(30, 22);
        c.lineTo(12, 14);
        c.closePath();
        c.fill();
        // Back leg
        c.beginPath();
        c.moveTo(2, -2);
        c.lineTo(-12, 18);
        c.lineTo(-6, 22);
        c.lineTo(8, 4);
        c.closePath();
        c.fill();
        // Arms
        c.beginPath();
        c.moveTo(8, -10);
        c.lineTo(-8, -2);
        c.lineTo(-4, 6);
        c.lineTo(12, -4);
        c.closePath();
        c.fill();
        c.beginPath();
        c.moveTo(14, -12);
        c.lineTo(28, -8);
        c.lineTo(24, 0);
        c.lineTo(12, -4);
        c.closePath();
        c.fill();
        c.restore();
      });
    },
    180,
    180
  );

  // Magnet boost
  commitCanvasAsTexture(
    scene,
    "boost-magnet",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      // U shape
      ctx.fillStyle = "#ff3845";
      ctx.beginPath();
      ctx.arc(0, 0, 22, Math.PI, 0, false);
      ctx.lineTo(22, 8);
      ctx.arc(0, 8, 14, 0, Math.PI, true);
      ctx.lineTo(-22, 0);
      ctx.closePath();
      ctx.fill();
      // Tips silver
      ctx.fillStyle = "#e0e0e0";
      ctx.fillRect(-26, -2, 12, 14);
      ctx.fillRect(14, -2, 12, 14);
      // Outline
      ctx.strokeStyle = "#0b1020";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 22, Math.PI, 0, false);
      ctx.lineTo(22, 8);
      ctx.arc(0, 8, 14, 0, Math.PI, true);
      ctx.lineTo(-22, 0);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    },
    72,
    72
  );

  // Shield boost
  commitCanvasAsTexture(
    scene,
    "boost-shield",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.fillStyle = "#3b7eea";
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(24, -16);
      ctx.lineTo(20, 14);
      ctx.lineTo(0, 28);
      ctx.lineTo(-20, 14);
      ctx.lineTo(-24, -16);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#0b1020";
      ctx.lineWidth = 2;
      ctx.stroke();
      // Inner cross
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-2, -16, 4, 24);
      ctx.fillRect(-10, -4, 20, 4);
      ctx.restore();
    },
    72,
    72
  );

  // Boots boost (x2)
  commitCanvasAsTexture(
    scene,
    "boost-boots",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.fillStyle = "#32d264";
      ctx.beginPath();
      ctx.moveTo(-22, -6);
      ctx.lineTo(10, -6);
      ctx.lineTo(20, 6);
      ctx.lineTo(20, 14);
      ctx.lineTo(-22, 14);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#0b1020";
      ctx.lineWidth = 2;
      ctx.stroke();
      // Cleats
      ctx.fillStyle = "#0b1020";
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(-18 + i * 9, 14, 4, 4);
      }
      // Lightning bolt
      ctx.fillStyle = "#ffd23a";
      ctx.beginPath();
      ctx.moveTo(-4, -22);
      ctx.lineTo(8, -22);
      ctx.lineTo(2, -10);
      ctx.lineTo(12, -10);
      ctx.lineTo(-2, 4);
      ctx.lineTo(2, -8);
      ctx.lineTo(-8, -8);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#0b1020";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    },
    72,
    72
  );

  // Speech bubble background ("STIUUUU!")
  commitCanvasAsTexture(
    scene,
    "speech-bubble",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#0b1020";
      ctx.lineWidth = 3;
      rounded(ctx, 6, 6, w - 12, h - 30, 14);
      ctx.fill();
      ctx.stroke();
      // Tail
      ctx.beginPath();
      ctx.moveTo(w / 2 - 14, h - 24);
      ctx.lineTo(w / 2 - 4, h - 6);
      ctx.lineTo(w / 2 + 6, h - 24);
      ctx.closePath();
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#0b1020";
      ctx.beginPath();
      ctx.moveTo(w / 2 - 14, h - 24);
      ctx.lineTo(w / 2 - 4, h - 6);
      ctx.lineTo(w / 2 + 6, h - 24);
      ctx.stroke();
    },
    180,
    80
  );

  // HUD panel background (rounded dark glass)
  commitCanvasAsTexture(
    scene,
    "panel",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(20,28,80,0.85)");
      grad.addColorStop(1, "rgba(8,12,40,0.9)");
      ctx.fillStyle = grad;
      rounded(ctx, 0, 0, w, h, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(120,160,255,0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    320,
    100
  );

  // Logo banner
  commitCanvasAsTexture(
    scene,
    "logo",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.translate(16, 6);
      ctx.fillStyle = "#07101f";
      ctx.strokeStyle = "#18c8ff";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(18, 24);
      ctx.lineTo(366, 8);
      ctx.lineTo(402, 52);
      ctx.lineTo(372, 104);
      ctx.lineTo(418, 112);
      ctx.lineTo(360, 218);
      ctx.lineTo(34, 224);
      ctx.lineTo(4, 178);
      ctx.lineTo(23, 122);
      ctx.lineTo(0, 84);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = "#0b1020";
      ctx.lineWidth = 12;
      ctx.stroke();
      ctx.restore();

      const drawText = (
        text: string,
        x: number,
        y: number,
        size: number,
        fillTop: string,
        fillBot: string,
        skew = -0.08
      ) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.transform(1, 0, skew, 1, 0, 0);
        ctx.font = `900 ${size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const grad = ctx.createLinearGradient(0, -size * 0.5, 0, size * 0.5);
        grad.addColorStop(0, fillTop);
        grad.addColorStop(1, fillBot);
        ctx.lineWidth = Math.max(7, size * 0.13);
        ctx.strokeStyle = "#0b1020";
        ctx.strokeText(text, 0, 0);
        ctx.lineWidth = Math.max(3, size * 0.05);
        ctx.strokeStyle = "#eaf7ff";
        if (text !== "MADNESS") ctx.strokeText(text, 0, 0);
        ctx.fillStyle = grad;
        ctx.fillText(text, 0, 0);
        ctx.restore();
      };

      drawText("FOOTBALL", 198, 58, 56, "#ffffff", "#a9dfff");
      drawText("MADNESS", 198, 120, 60, "#fff08a", "#ff9a1f", -0.11);
      drawText("RUN", 180, 182, 58, "#dff4ff", "#36c8ff");

      ctx.save();
      ctx.translate(390, 152);
      ctx.rotate(-0.16);
      const flame = ctx.createLinearGradient(-48, -48, 48, 48);
      flame.addColorStop(0, "#18c8ff");
      flame.addColorStop(0.5, "#1d56c2");
      flame.addColorStop(1, "#07101f");
      ctx.fillStyle = flame;
      ctx.beginPath();
      ctx.moveTo(-74, -24);
      ctx.lineTo(-24, -48);
      ctx.lineTo(-42, -15);
      ctx.lineTo(14, -34);
      ctx.lineTo(-8, -4);
      ctx.lineTo(58, 0);
      ctx.lineTo(4, 15);
      ctx.lineTo(36, 42);
      ctx.lineTo(-18, 28);
      ctx.lineTo(-58, 52);
      ctx.lineTo(-38, 18);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#07101f";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(32, 4, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#07101f";
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6 - Math.PI / 6;
        ctx.beginPath();
        ctx.moveTo(32, 4);
        ctx.lineTo(32 + Math.cos(a) * 30, 4 + Math.sin(a) * 30);
        ctx.stroke();
      }
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6 - Math.PI / 6;
        const x = 32 + Math.cos(a) * 13;
        const y = 4 + Math.sin(a) * 13;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#ff9a3c";
      ctx.beginPath();
      ctx.moveTo(58, -45);
      ctx.quadraticCurveTo(30, -15, 42, 12);
      ctx.quadraticCurveTo(50, 5, 52, 22);
      ctx.quadraticCurveTo(72, -4, 58, -45);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ffd23a";
      ctx.beginPath();
      ctx.moveTo(59, -22);
      ctx.quadraticCurveTo(47, 3, 55, 16);
      ctx.quadraticCurveTo(65, 1, 59, -22);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
    640,
    240
  );

  // Magnet aura ring (used during magnet boost)
  commitCanvasAsTexture(
    scene,
    "magnet-aura",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, w / 2);
      grad.addColorStop(0, "rgba(255,80,80,0)");
      grad.addColorStop(0.6, "rgba(255,80,80,0.18)");
      grad.addColorStop(0.95, "rgba(255,80,80,0.5)");
      grad.addColorStop(1, "rgba(255,80,80,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, w / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
    },
    300,
    300
  );

  // Shield aura ring
  commitCanvasAsTexture(
    scene,
    "shield-aura",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, w / 2);
      grad.addColorStop(0, "rgba(80,180,255,0)");
      grad.addColorStop(0.6, "rgba(80,180,255,0.2)");
      grad.addColorStop(0.95, "rgba(80,180,255,0.6)");
      grad.addColorStop(1, "rgba(80,180,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, w / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
    },
    220,
    220
  );

  // Super aura
  commitCanvasAsTexture(
    scene,
    "super-aura",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, w / 2);
      grad.addColorStop(0, "rgba(255,255,180,0.4)");
      grad.addColorStop(0.7, "rgba(255,180,40,0.35)");
      grad.addColorStop(1, "rgba(255,80,40,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, w / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
    },
    280,
    280
  );

  // Particle: spark
  commitCanvasAsTexture(
    scene,
    "particle-spark",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.5, "rgba(255,220,120,0.7)");
      grad.addColorStop(1, "rgba(255,80,40,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
      ctx.fill();
    },
    24,
    24
  );

  // Confetti piece
  commitCanvasAsTexture(
    scene,
    "particle-confetti",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    },
    6,
    10
  );
}
