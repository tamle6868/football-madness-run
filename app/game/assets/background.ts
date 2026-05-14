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

      // Two very dim floodlight halos — just enough to suggest a stadium
      // is somewhere up there, far from anything that flashes the user.
      for (const cx of [380, 900]) {
        const cy = h * 0.42;
        const halo = ctx.createRadialGradient(cx, cy, 24, cx, cy, 260);
        halo.addColorStop(0, "rgba(150,170,220,0.10)");
        halo.addColorStop(0.5, "rgba(90,120,180,0.03)");
        halo.addColorStop(1, "rgba(40,60,110,0)");
        ctx.fillStyle = halo;
        ctx.fillRect(cx - 280, cy - 280, 560, 560);
      }

      // NO confetti. NO flag bunting. NO bright light bulbs. Clean sky.
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

      // Stadium dome silhouette — solid black-ish curve so the eye sees
      // "we're inside a sports arena". One curve, not a flag bunting party.
      ctx.fillStyle = "#020410";
      ctx.beginPath();
      ctx.moveTo(0, h * 0.34);
      ctx.quadraticCurveTo(w / 2, h * 0.02, w, h * 0.34);
      ctx.lineTo(w, h * 0.56);
      ctx.quadraticCurveTo(w / 2, h * 0.22, 0, h * 0.56);
      ctx.closePath();
      ctx.fill();

      // Faint rim light along the inner edge of the dome — suggests stadium
      // lighting reflecting off the underside without any glare on the user.
      ctx.strokeStyle = "rgba(150,180,230,0.18)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.56);
      ctx.quadraticCurveTo(w / 2, h * 0.22, w, h * 0.56);
      ctx.stroke();

      // A second, thicker, much dimmer rim above for layered depth.
      ctx.strokeStyle = "rgba(110,140,200,0.10)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.34);
      ctx.quadraticCurveTo(w / 2, h * 0.02, w, h * 0.34);
      ctx.stroke();

      // Subtle roof trusses (vertical-ish posts diving into the dome) so the
      // structure reads as a real roof, not just a band of dark color.
      ctx.strokeStyle = "rgba(120,150,210,0.12)";
      ctx.lineWidth = 1.5;
      for (let i = 1; i < 8; i++) {
        const t = i / 8;
        const tx = t * w;
        // Approximate y on the inner dome curve at this x via quadratic.
        const innerY = h * 0.56 + (h * 0.22 - h * 0.56) * (1 - Math.pow(2 * t - 1, 2));
        const outerY = h * 0.34 + (h * 0.02 - h * 0.34) * (1 - Math.pow(2 * t - 1, 2));
        ctx.beginPath();
        ctx.moveTo(tx, outerY);
        ctx.lineTo(tx, innerY);
        ctx.stroke();
      }

      // Two small dim spotlight dots along the inner rim — they read as
      // "ceiling lights" without flashing the user. Alpha 0.18 max.
      for (const [tx, ty] of [
        [w * 0.32, h * 0.31],
        [w * 0.68, h * 0.31],
      ]) {
        const halo = ctx.createRadialGradient(tx, ty, 1, tx, ty, 28);
        halo.addColorStop(0, "rgba(200,215,245,0.18)");
        halo.addColorStop(0.5, "rgba(140,170,220,0.06)");
        halo.addColorStop(1, "rgba(80,110,180,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(tx, ty, 28, 0, Math.PI * 2);
        ctx.fill();
      }

      // Two very faint beams in normal (source-over) blend — never `lighter`,
      // which causes additive HDR-style blow-outs that hurt the eyes.
      for (const cx of [500, 1100]) {
        const beam = ctx.createLinearGradient(cx, h * 0.18, cx + 40, h);
        beam.addColorStop(0, "rgba(140,160,210,0.035)");
        beam.addColorStop(1, "rgba(120,150,200,0)");
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(cx - 20, h * 0.22);
        ctx.lineTo(cx + 40, h);
        ctx.lineTo(cx + 140, h);
        ctx.lineTo(cx + 20, h * 0.22);
        ctx.closePath();
        ctx.fill();
      }

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

      // Very sparse, very dim hints of crowd shirts (desaturated cool tones,
      // alpha <= 0.06) — far below the threshold where the eye registers
      // colour as motion when scrolling.
      const rand = new Rand(424242);
      const shirtColors = [
        "rgba(70,90,140,0.06)",
        "rgba(40,60,110,0.05)",
        "rgba(60,80,130,0.05)",
        "rgba(50,70,120,0.04)",
      ];
      for (let y = crowdTop + 8; y < crowdBottom - 12; y += 36) {
        for (let x = 0; x < w; x += 80) {
          if (rand.next() < 0.8) continue;
          ctx.fillStyle = rand.pick(shirtColors);
          ctx.fillRect(x + rand.range(-6, 6), y + rand.range(-2, 2), 24, 12);
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

      // No ad text on the stadium far layer — it competes for attention
      // with the close-up ad rail and adds visual noise.


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
