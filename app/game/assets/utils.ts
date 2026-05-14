import * as Phaser from "phaser";

export type Tex = Phaser.GameObjects.Graphics;

export function makeCanvas(
  scene: Phaser.Scene,
  width: number,
  height: number
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const tex = scene.textures.createCanvas("__tmp_canvas_" + Math.random(), width, height);
  if (!tex) throw new Error("createCanvas failed");
  const canvas = tex.getCanvas();
  const ctx = tex.getContext();
  return { canvas, ctx };
}

export function commitCanvasAsTexture(
  scene: Phaser.Scene,
  key: string,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  width: number,
  height: number,
  /** When set, the canvas is created at width*displayScale × height*displayScale.
   *  The drawing context is pre-scaled so `draw` still uses original coordinates,
   *  but the resulting texture is at the exact display size — no GPU scaling needed. */
  displayScale?: number
) {
  if (scene.textures.exists(key)) {
    scene.textures.remove(key);
  }
  const s = displayScale ?? 1;
  const texW = Math.max(1, Math.round(width * s));
  const texH = Math.max(1, Math.round(height * s));
  const tex = scene.textures.createCanvas(key, texW, texH);
  if (!tex) throw new Error("createCanvas failed");
  const ctx = tex.getContext();
  ctx.imageSmoothingEnabled = true;
  if (s !== 1) {
    ctx.scale(s, s);
  }
  draw(ctx, width, height);
  tex.refresh();
  return tex;
}

export function rgb(hex: number, alpha = 1): string {
  const r = (hex >> 16) & 0xff;
  const g = (hex >> 8) & 0xff;
  const b = hex & 0xff;
  return `rgba(${r},${g},${b},${alpha})`;
}

export function roundedRect(
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
 * Deterministic pseudo-random — used so background patterns look the same on
 * every load (no blinking).
 */
export class Rand {
  private s: number;
  constructor(seed: number) {
    this.s = seed | 0 || 1;
  }
  next(): number {
    // mulberry32
    this.s = (this.s + 0x6d2b79f5) | 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(a: number, b: number): number {
    return a + this.next() * (b - a);
  }
  int(a: number, b: number): number {
    return Math.floor(this.range(a, b + 1));
  }
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
}
