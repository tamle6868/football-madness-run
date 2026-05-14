import * as Phaser from "phaser";
import { commitCanvasAsTexture } from "./utils";

const PW = 120;
const PH = 160;

type Pose = "run1" | "run2" | "run3" | "run4" | "jump" | "slide";

interface KitColors {
  outline: string;
  skin: string;
  skinShade: string;
  hair: string;
  jersey: string;
  jerseyLight: string;
  jerseyShade: string;
  shorts: string;
  shortsShade: string;
  sock: string;
  sockBand: string;
  shoe: string;
  shoeShade: string;
}

interface StandingPose {
  bodyTilt: number;
  bodyY: number;
  armBack: number;
  armFront: number;
  legBack: number;
  legFront: number;
  headTilt: number;
  mouth: "shout" | "focus";
}

const BASE_COLORS: KitColors = {
  outline: "#07101f",
  skin: "#f2c4a0",
  skinShade: "#bd7f5c",
  hair: "#1b1208",
  jersey: "#ffd23a",
  jerseyLight: "#fff0a5",
  jerseyShade: "#c48b12",
  shorts: "#1644a8",
  shortsShade: "#0b245f",
  sock: "#ffd23a",
  sockBand: "#1644a8",
  shoe: "#32d264",
  shoeShade: "#106b2b",
};

const RUN_POSES: Record<Exclude<Pose, "slide">, StandingPose> = {
  run1: {
    bodyTilt: -0.12,
    bodyY: -2,
    armBack: -0.95,
    armFront: 0.65,
    legBack: 0.62,
    legFront: -0.7,
    headTilt: 0.04,
    mouth: "shout",
  },
  run2: {
    bodyTilt: -0.08,
    bodyY: 1,
    armBack: -0.35,
    armFront: 0.18,
    legBack: 0.18,
    legFront: -0.08,
    headTilt: 0.02,
    mouth: "focus",
  },
  run3: {
    bodyTilt: -0.12,
    bodyY: -2,
    armBack: 0.62,
    armFront: -0.9,
    legBack: -0.68,
    legFront: 0.62,
    headTilt: -0.04,
    mouth: "shout",
  },
  run4: {
    bodyTilt: -0.08,
    bodyY: 1,
    armBack: 0.18,
    armFront: -0.35,
    legBack: -0.08,
    legFront: 0.18,
    headTilt: -0.02,
    mouth: "focus",
  },
  jump: {
    bodyTilt: -0.22,
    bodyY: -10,
    armBack: -1.55,
    armFront: -0.45,
    legBack: 0.78,
    legFront: -0.95,
    headTilt: -0.06,
    mouth: "shout",
  },
};

function drawPlayer(ctx: CanvasRenderingContext2D, pose: Pose, flash = false) {
  const colors: KitColors = {
    ...BASE_COLORS,
    jersey: flash ? "#fff08a" : BASE_COLORS.jersey,
    jerseyLight: flash ? "#ffffff" : BASE_COLORS.jerseyLight,
  };

  ctx.save();
  ctx.translate(PW / 2, PH);

  if (flash) drawSuperStreaks(ctx);

  if (pose === "slide") {
    drawSlide(ctx, colors, flash);
    ctx.restore();
    return;
  }

  const p = RUN_POSES[pose];
  drawStandingPose(ctx, colors, p);
  ctx.restore();
}

function drawStandingPose(
  ctx: CanvasRenderingContext2D,
  c: KitColors,
  p: StandingPose
) {
  ctx.save();
  ctx.rotate(p.bodyTilt);
  ctx.translate(0, p.bodyY);

  drawLeg(ctx, -7, -66, p.legBack, c, 0.9, true);
  drawArm(ctx, -22, -110, p.armBack, c, 0.9, true);

  drawShorts(ctx, c);
  drawTorso(ctx, c);

  drawLeg(ctx, 8, -66, p.legFront, c, 1, false);
  drawArm(ctx, 23, -111, p.armFront, c, 1, false);
  drawHead(ctx, c, p.headTilt, p.mouth);

  ctx.restore();
}

function drawTorso(ctx: CanvasRenderingContext2D, c: KitColors) {
  const grad = ctx.createLinearGradient(-26, -122, 24, -70);
  grad.addColorStop(0, c.jerseyLight);
  grad.addColorStop(0.45, c.jersey);
  grad.addColorStop(1, c.jerseyShade);

  ctx.fillStyle = grad;
  ctx.strokeStyle = c.outline;
  ctx.lineWidth = 3;
  roundedPath(ctx, -27, -121, 54, 53, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#1644a8";
  ctx.beginPath();
  ctx.moveTo(-12, -119);
  ctx.lineTo(0, -105);
  ctx.lineTo(12, -119);
  ctx.lineTo(4, -119);
  ctx.lineTo(0, -113);
  ctx.lineTo(-4, -119);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.22)";
  roundedPath(ctx, -21, -114, 10, 37, 5);
  ctx.fill();

  ctx.fillStyle = "#1644a8";
  ctx.font = "900 22px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("7", 8, -97);

  ctx.fillStyle = c.jerseyShade;
  roundedPath(ctx, -26, -76, 52, 8, 4);
  ctx.fill();
}

function drawShorts(ctx: CanvasRenderingContext2D, c: KitColors) {
  ctx.fillStyle = c.shorts;
  ctx.strokeStyle = c.outline;
  ctx.lineWidth = 3;
  roundedPath(ctx, -24, -75, 48, 29, 7);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = c.shortsShade;
  roundedPath(ctx, -23, -56, 46, 10, 5);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -72);
  ctx.lineTo(0, -50);
  ctx.stroke();
}

function drawHead(
  ctx: CanvasRenderingContext2D,
  c: KitColors,
  tilt: number,
  mouth: StandingPose["mouth"]
) {
  ctx.save();
  ctx.translate(0, -136);
  ctx.rotate(tilt);

  ctx.fillStyle = c.skin;
  ctx.strokeStyle = c.outline;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = c.skinShade;
  ctx.globalAlpha = 0.45;
  ctx.beginPath();
  ctx.ellipse(-8, 6, 7, 12, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Ears.
  ctx.fillStyle = c.skin;
  ctx.strokeStyle = c.outline;
  ctx.lineWidth = 2;
  for (const x of [-22, 22]) {
    ctx.beginPath();
    ctx.ellipse(x, 1, 4, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Hair cap with a small forward quiff.
  ctx.fillStyle = c.hair;
  ctx.beginPath();
  ctx.moveTo(-23, -7);
  ctx.quadraticCurveTo(-13, -27, 7, -25);
  ctx.quadraticCurveTo(24, -23, 24, -5);
  ctx.quadraticCurveTo(12, -13, 0, -12);
  ctx.quadraticCurveTo(-12, -13, -23, -7);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#2a1a0c";
  ctx.beginPath();
  ctx.moveTo(-3, -22);
  ctx.quadraticCurveTo(11, -30, 18, -16);
  ctx.quadraticCurveTo(8, -20, -3, -16);
  ctx.closePath();
  ctx.fill();

  // Eyebrows.
  ctx.strokeStyle = c.hair;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-14, -2);
  ctx.lineTo(-4, -5);
  ctx.moveTo(4, -5);
  ctx.lineTo(14, -2);
  ctx.stroke();

  // Eyes.
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(-8, 2, 3.3, 4.2, 0, 0, Math.PI * 2);
  ctx.ellipse(8, 2, 3.3, 4.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = c.outline;
  ctx.beginPath();
  ctx.arc(-8, 3, 1.6, 0, Math.PI * 2);
  ctx.arc(8, 3, 1.6, 0, Math.PI * 2);
  ctx.fill();

  if (mouth === "shout") {
    ctx.fillStyle = "#3a0a14";
    ctx.beginPath();
    ctx.ellipse(1, 17, 6, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-4, 12, 9, 2);
  } else {
    ctx.strokeStyle = "#3a0a14";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-5, 15);
    ctx.quadraticCurveTo(0, 18, 6, 15);
    ctx.stroke();
  }

  ctx.restore();
}

function drawArm(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  angle: number,
  c: KitColors,
  scale: number,
  back: boolean
) {
  ctx.save();
  ctx.globalAlpha = back ? 0.9 : 1;
  ctx.translate(baseX, baseY);
  ctx.rotate(angle);

  ctx.fillStyle = c.jersey;
  ctx.strokeStyle = c.outline;
  ctx.lineWidth = 3;
  roundedPath(ctx, -7 * scale, -2 * scale, 14 * scale, 27 * scale, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = c.skin;
  ctx.strokeStyle = c.outline;
  roundedPath(ctx, -7 * scale, 20 * scale, 14 * scale, 23 * scale, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = c.skin;
  ctx.beginPath();
  ctx.arc(0, 45 * scale, 7 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawLeg(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  angle: number,
  c: KitColors,
  scale: number,
  back: boolean
) {
  ctx.save();
  ctx.globalAlpha = back ? 0.88 : 1;
  ctx.translate(baseX, baseY);
  ctx.rotate(angle);

  ctx.fillStyle = c.shorts;
  ctx.strokeStyle = c.outline;
  ctx.lineWidth = 3;
  roundedPath(ctx, -8 * scale, 0, 17 * scale, 24 * scale, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = c.sock;
  roundedPath(ctx, -7 * scale, 21 * scale, 15 * scale, 29 * scale, 5);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = c.sockBand;
  ctx.fillRect(-7 * scale, 25 * scale, 15 * scale, 4 * scale);

  ctx.fillStyle = c.shoe;
  ctx.strokeStyle = c.outline;
  roundedPath(ctx, -12 * scale, 45 * scale, 28 * scale, 13 * scale, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = c.shoeShade;
  roundedPath(ctx, -10 * scale, 53 * scale, 24 * scale, 4 * scale, 3);
  ctx.fill();

  ctx.fillStyle = c.outline;
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(-8 * scale + i * 8 * scale, 58 * scale, 4 * scale, 2 * scale);
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawSlide(ctx: CanvasRenderingContext2D, c: KitColors, flash: boolean) {
  ctx.save();
  ctx.translate(2, -14);
  ctx.rotate(-0.08);

  ctx.fillStyle = "rgba(255,255,255,0.42)";
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.ellipse(-38 - i * 10, 7 + i * 0.5, 10 - i, 2.4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (flash) {
    ctx.strokeStyle = "rgba(255,242,120,0.9)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-58, -38);
    ctx.lineTo(-84, -28);
    ctx.moveTo(-42, -8);
    ctx.lineTo(-80, 4);
    ctx.stroke();
  }

  // Back leg tucked.
  ctx.fillStyle = c.sock;
  ctx.strokeStyle = c.outline;
  ctx.lineWidth = 3;
  roundedPath(ctx, 11, -10, 28, 11, 5);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = c.shoe;
  roundedPath(ctx, 32, -13, 16, 13, 5);
  ctx.fill();
  ctx.stroke();

  // Extended front leg.
  ctx.fillStyle = c.sock;
  roundedPath(ctx, 28, -20, 34, 13, 5);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = c.shoe;
  roundedPath(ctx, 56, -23, 18, 15, 5);
  ctx.fill();
  ctx.stroke();

  // Body and shorts.
  ctx.fillStyle = c.shorts;
  roundedPath(ctx, -8, -25, 41, 20, 8);
  ctx.fill();
  ctx.stroke();

  const jerseyGrad = ctx.createLinearGradient(-54, -42, 8, -18);
  jerseyGrad.addColorStop(0, c.jerseyLight);
  jerseyGrad.addColorStop(0.5, c.jersey);
  jerseyGrad.addColorStop(1, c.jerseyShade);
  ctx.fillStyle = jerseyGrad;
  roundedPath(ctx, -54, -39, 64, 25, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#1644a8";
  ctx.font = "900 16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("7", -27, -28);

  // Lead arm.
  ctx.fillStyle = c.jersey;
  roundedPath(ctx, 4, -37, 29, 11, 5);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = c.skin;
  ctx.beginPath();
  ctx.arc(35, -31, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Head.
  ctx.save();
  ctx.translate(-53, -41);
  ctx.rotate(-0.12);
  ctx.fillStyle = c.skin;
  ctx.beginPath();
  ctx.ellipse(0, 0, 17, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = c.hair;
  ctx.beginPath();
  ctx.moveTo(-17, -7);
  ctx.quadraticCurveTo(0, -22, 18, -8);
  ctx.quadraticCurveTo(14, 3, 9, 5);
  ctx.lineTo(-10, 5);
  ctx.quadraticCurveTo(-14, 3, -17, -7);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(-6, 3, 2.8, 3.4, 0, 0, Math.PI * 2);
  ctx.ellipse(6, 3, 2.8, 3.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = c.outline;
  ctx.beginPath();
  ctx.arc(-6, 4, 1.3, 0, Math.PI * 2);
  ctx.arc(6, 4, 1.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#3a0a14";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-4, 11);
  ctx.lineTo(5, 11);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function drawSuperStreaks(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,242,120,0.85)";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (const y of [-116, -92, -68]) {
    ctx.beginPath();
    ctx.moveTo(-54, y);
    ctx.lineTo(-78, y + 10);
    ctx.stroke();
  }
  ctx.restore();
}

function roundedPath(
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

export function createPlayerTextures(scene: Phaser.Scene) {
  const poses: Pose[] = ["run1", "run2", "run3", "run4", "jump", "slide"];
  for (const pose of poses) {
    const key = `player-${pose}`;
    if (scene.textures.exists(key)) continue;

    commitCanvasAsTexture(
      scene,
      key,
      (ctx, w, h) => {
        ctx.clearRect(0, 0, w, h);
        drawPlayer(ctx, pose);
      },
      PW,
      PH
    );
  }

  if (scene.textures.exists("player-super")) return;

  commitCanvasAsTexture(
    scene,
    "player-super",
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      drawPlayer(ctx, "run2", true);
    },
    PW,
    PH
  );
}
