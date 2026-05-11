import * as Phaser from "phaser";
import { commitCanvasAsTexture } from "./utils";

const PW = 120;
const PH = 160;

type Pose = "run1" | "run2" | "run3" | "run4" | "jump" | "slide";

/**
 * Draws a chibi footballer in the given pose. Yellow #7 kit, blue accents,
 * green boots — generic parody, no logos.
 */
function drawPlayer(
  ctx: CanvasRenderingContext2D,
  pose: Pose,
  flash = false
) {
  ctx.save();
  ctx.translate(PW / 2, PH);

  const skin = "#f2c4a0";
  const skinShade = "#c08763";
  const hair = "#2a1a0c";
  const jersey = flash ? "#ffe277" : "#ffd23a";
  const jerseyShade = "#c89a1e";
  const shorts = "#1644a8";
  const shortsShade = "#0a2a6a";
  const sock = "#ffd23a";
  const sockBand = "#1644a8";
  const shoe = "#32d264";
  const shoeShade = "#1a6a2c";

  // Pose-driven offsets
  let bodyTilt = 0;
  let armBackAngle = 0;
  let armFrontAngle = 0;
  let legBackAngle = 0;
  let legFrontAngle = 0;
  let bodyY = 0;
  let isSliding = false;

  switch (pose) {
    case "run1":
      armBackAngle = -0.6;
      armFrontAngle = 0.7;
      legBackAngle = 0.6;
      legFrontAngle = -0.5;
      bodyTilt = -0.06;
      bodyY = -2;
      break;
    case "run2":
      armBackAngle = -0.2;
      armFrontAngle = 0.3;
      legBackAngle = 0.2;
      legFrontAngle = -0.05;
      bodyTilt = -0.08;
      bodyY = 0;
      break;
    case "run3":
      armBackAngle = 0.6;
      armFrontAngle = -0.7;
      legBackAngle = -0.5;
      legFrontAngle = 0.6;
      bodyTilt = -0.06;
      bodyY = -2;
      break;
    case "run4":
      armBackAngle = 0.2;
      armFrontAngle = -0.3;
      legBackAngle = -0.05;
      legFrontAngle = 0.2;
      bodyTilt = -0.08;
      bodyY = 0;
      break;
    case "jump":
      armBackAngle = -1.4;
      armFrontAngle = 1.2;
      legBackAngle = 0.7;
      legFrontAngle = -0.9;
      bodyTilt = -0.18;
      bodyY = -8;
      break;
    case "slide":
      isSliding = true;
      break;
  }

  if (isSliding) {
    drawSlide(ctx, {
      skin,
      skinShade,
      hair,
      jersey,
      jerseyShade,
      shorts,
      shortsShade,
      sock,
      sockBand,
      shoe,
      shoeShade,
    });
    ctx.restore();
    return;
  }

  ctx.rotate(bodyTilt);
  ctx.translate(0, bodyY);

  // BACK leg
  drawLeg(ctx, -2, -50, legBackAngle, sock, sockBand, shoe, shoeShade, 0.85);
  // BACK arm
  drawArm(ctx, -22, -110, armBackAngle, jersey, jerseyShade, skin, skinShade, 0.85);

  // Body / shorts
  ctx.fillStyle = shorts;
  roundedPath(ctx, -22, -75, 44, 28, 6);
  ctx.fill();
  ctx.fillStyle = shortsShade;
  roundedPath(ctx, -22, -55, 44, 8, 4);
  ctx.fill();

  // Jersey (torso)
  ctx.fillStyle = jersey;
  roundedPath(ctx, -26, -118, 52, 50, 10);
  ctx.fill();
  ctx.fillStyle = jerseyShade;
  roundedPath(ctx, -26, -78, 52, 8, 6);
  ctx.fill();

  // Jersey collar
  ctx.fillStyle = "#1644a8";
  ctx.beginPath();
  ctx.moveTo(-10, -118);
  ctx.lineTo(0, -106);
  ctx.lineTo(10, -118);
  ctx.closePath();
  ctx.fill();

  // Number 7 on chest
  ctx.fillStyle = "#1644a8";
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("7", 8, -98);

  // FRONT leg
  drawLeg(ctx, 6, -50, legFrontAngle, sock, sockBand, shoe, shoeShade, 1);
  // FRONT arm
  drawArm(ctx, 22, -110, armFrontAngle, jersey, jerseyShade, skin, skinShade, 1);

  // Head
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.ellipse(0, -136, 22, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  // Skin shading
  ctx.fillStyle = skinShade;
  ctx.beginPath();
  ctx.ellipse(-8, -130, 8, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair (slick back)
  ctx.fillStyle = hair;
  ctx.beginPath();
  ctx.moveTo(-22, -148);
  ctx.quadraticCurveTo(0, -168, 22, -148);
  ctx.quadraticCurveTo(20, -134, 16, -132);
  ctx.lineTo(-16, -132);
  ctx.quadraticCurveTo(-20, -134, -22, -148);
  ctx.closePath();
  ctx.fill();

  // Eyebrow (intense)
  ctx.fillStyle = hair;
  ctx.fillRect(2, -140, 12, 3);
  ctx.fillRect(-14, -140, 12, 3);

  // Eyes
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(-8, -134, 3, 4, 0, 0, Math.PI * 2);
  ctx.ellipse(8, -134, 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0b1020";
  ctx.beginPath();
  ctx.arc(-8, -133, 1.6, 0, Math.PI * 2);
  ctx.arc(8, -133, 1.6, 0, Math.PI * 2);
  ctx.fill();

  // Open mouth (yelling SIUUU)
  ctx.fillStyle = "#3a0a14";
  ctx.beginPath();
  ctx.ellipse(0, -120, 6, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-4, -123, 8, 2);

  // Outline (subtle)
  ctx.strokeStyle = "rgba(0,0,0,0.45)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(0, -136, 22, 24, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawSlide(
  ctx: CanvasRenderingContext2D,
  c: {
    skin: string;
    skinShade: string;
    hair: string;
    jersey: string;
    jerseyShade: string;
    shorts: string;
    shortsShade: string;
    sock: string;
    sockBand: string;
    shoe: string;
    shoeShade: string;
  }
) {
  // Drawn from feet baseline (translate already at bottom-center)
  ctx.save();
  ctx.translate(0, -16);
  ctx.rotate(-0.05);

  // Trail dust under slide
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.ellipse(-30 - i * 12, 6, 8 - i, 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Body (laid down, leaning forward)
  ctx.fillStyle = c.shorts;
  roundedPath(ctx, -10, -22, 40, 18, 8);
  ctx.fill();
  ctx.fillStyle = c.jersey;
  roundedPath(ctx, -50, -34, 60, 22, 8);
  ctx.fill();
  ctx.fillStyle = c.jerseyShade;
  roundedPath(ctx, -50, -18, 60, 4, 2);
  ctx.fill();

  // Number 7 on chest
  ctx.fillStyle = "#1644a8";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("7", -25, -25);

  // Front leg extended
  ctx.fillStyle = c.sock;
  roundedPath(ctx, 28, -16, 28, 12, 4);
  ctx.fill();
  ctx.fillStyle = c.shoe;
  roundedPath(ctx, 50, -18, 14, 16, 4);
  ctx.fill();
  // Back leg bent
  ctx.fillStyle = c.sock;
  roundedPath(ctx, 14, -10, 22, 10, 4);
  ctx.fill();
  ctx.fillStyle = c.shoe;
  roundedPath(ctx, 30, -12, 12, 12, 3);
  ctx.fill();

  // Front arm extended forward
  ctx.fillStyle = c.jersey;
  roundedPath(ctx, 8, -32, 26, 10, 4);
  ctx.fill();
  ctx.fillStyle = c.skin;
  ctx.beginPath();
  ctx.arc(36, -27, 5, 0, Math.PI * 2);
  ctx.fill();

  // Head (tilted)
  ctx.save();
  ctx.translate(-50, -36);
  ctx.rotate(-0.2);
  ctx.fillStyle = c.skin;
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 17, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = c.hair;
  ctx.beginPath();
  ctx.moveTo(-16, -8);
  ctx.quadraticCurveTo(0, -22, 16, -8);
  ctx.quadraticCurveTo(14, 2, 10, 4);
  ctx.lineTo(-10, 4);
  ctx.quadraticCurveTo(-14, 2, -16, -8);
  ctx.closePath();
  ctx.fill();
  // Eyes
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(-6, 2, 2.5, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(6, 2, 2.5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0b1020";
  ctx.beginPath();
  ctx.arc(-6, 3, 1.4, 0, Math.PI * 2);
  ctx.arc(6, 3, 1.4, 0, Math.PI * 2);
  ctx.fill();
  // Determined mouth
  ctx.strokeStyle = "#3a0a14";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-4, 9);
  ctx.lineTo(4, 9);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function drawArm(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  angle: number,
  jersey: string,
  jerseyShade: string,
  skin: string,
  _skinShade: string,
  scale = 1
) {
  ctx.save();
  ctx.translate(baseX, baseY);
  ctx.rotate(angle);
  ctx.fillStyle = jersey;
  roundedPath(ctx, -6 * scale, -2 * scale, 12 * scale, 28 * scale, 5);
  ctx.fill();
  ctx.fillStyle = jerseyShade;
  roundedPath(ctx, -6 * scale, 18 * scale, 12 * scale, 4 * scale, 2);
  ctx.fill();
  ctx.fillStyle = skin;
  roundedPath(ctx, -7 * scale, 22 * scale, 14 * scale, 22 * scale, 6);
  ctx.fill();
  // Hand
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(0, 46 * scale, 7 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawLeg(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  angle: number,
  sock: string,
  sockBand: string,
  shoe: string,
  shoeShade: string,
  scale = 1
) {
  ctx.save();
  ctx.translate(baseX, baseY);
  ctx.rotate(angle);
  // Thigh (shorts handled separately)
  // Sock
  ctx.fillStyle = sock;
  roundedPath(ctx, -8 * scale, 0, 16 * scale, 38 * scale, 5);
  ctx.fill();
  ctx.fillStyle = sockBand;
  ctx.fillRect(-8 * scale, 6 * scale, 16 * scale, 4 * scale);
  // Shoe
  ctx.fillStyle = shoe;
  roundedPath(ctx, -10 * scale, 36 * scale, 24 * scale, 12 * scale, 5);
  ctx.fill();
  ctx.fillStyle = shoeShade;
  roundedPath(ctx, -10 * scale, 44 * scale, 24 * scale, 4 * scale, 3);
  ctx.fill();
  // Cleats
  ctx.fillStyle = "#0b1020";
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(-8 * scale + i * 8 * scale, 47 * scale, 4 * scale, 2 * scale);
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
    commitCanvasAsTexture(
      scene,
      `player-${pose}`,
      (ctx, w, h) => {
        ctx.clearRect(0, 0, w, h);
        drawPlayer(ctx, pose);
      },
      PW,
      PH
    );
  }

  // Boost-flash variant for super run
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
