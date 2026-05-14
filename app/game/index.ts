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

export function createGame(parent: HTMLElement): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: "#0b1020",
    scale: {
      mode: Phaser.Scale.FIT,
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
