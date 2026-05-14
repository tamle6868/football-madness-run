import * as Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "./constants";
import { BootScene } from "./scenes/BootScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { IntroScene } from "./scenes/IntroScene";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { CharacterSelectScene } from "./scenes/CharacterSelectScene";
import { GameScene } from "./scenes/GameScene";
import { UIScene } from "./scenes/UIScene";
import { GameOverScene } from "./scenes/GameOverScene";

/**
 * Picks a Phaser scale mode appropriate for the current viewport.
 *
 * Why this matters:
 *   - FIT mode preserves the 16:9 canvas aspect ratio. On modern phones in
 *     landscape (often 19.5:9 or 21:9) it leaves visible black bars on the
 *     left and right of the canvas.
 *   - ENVELOP mode fills the viewport completely but crops the canvas, which
 *     hides HUD elements positioned near the edges on wider screens.
 *
 * Strategy:
 *   - On viewports whose aspect ratio is close to the canvas (within 12%),
 *     use FIT so PC players see the full canvas with minimal letterboxing.
 *   - On viewports significantly wider than 16:9 (typical mobile landscape),
 *     use ENVELOP so the game fills the screen. HUD elements should be
 *     placed inside a `safeZone` (see `app/game/constants.ts`) so they
 *     remain visible even when the edges are cropped.
 */
function pickScaleMode(): number {
  if (typeof window === "undefined") return Phaser.Scale.FIT;
  const aspect = window.innerWidth / window.innerHeight;
  const canvasAspect = GAME_WIDTH / GAME_HEIGHT;
  const ratio = aspect / canvasAspect;
  if (ratio > 1.12) return Phaser.Scale.ENVELOP;
  return Phaser.Scale.FIT;
}

export function createGame(parent: HTMLElement): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: "#0b1020",
    scale: {
      mode: pickScaleMode(),
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    render: {
      pixelArt: false,
      roundPixels: true,
      antialias: true,
    },
    fps: {
      target: 60,
      forceSetTimeOut: false,
    },
    scene: [
      BootScene,
      PreloadScene,
      IntroScene,
      MainMenuScene,
      CharacterSelectScene,
      GameScene,
      UIScene,
      GameOverScene,
    ],
  };

  return new Phaser.Game(config);
}
