import * as Phaser from "phaser";

/**
 * Real PNG assets bundled in /public/assets. Loaded by PreloadScene.preload().
 * The keys here are the Phaser texture keys used at runtime.
 */
export const IMAGE_ASSETS: Array<{ key: string; path: string }> = [
  { key: "img-player", path: "/assets/player.png?v=14" },
  { key: "obs-var", path: "/assets/obs_var.png" },
  { key: "obs-corruption", path: "/assets/obs_corruption.png" },
  { key: "obs-injury", path: "/assets/obs_injury.png" },
  { key: "obs-hate", path: "/assets/obs_hate.png" },
  { key: "trophy", path: "/assets/trophy.png" },
  { key: "logo", path: "/assets/logo.png" },
  { key: "bg-ground", path: "/assets/bg_ground.png" },
  { key: "bg-stadium-real", path: "/assets/bg_stadium_real.png?v=14" },
];

export const COIN_SHEET = {
  key: "img-coin-sheet",
  path: "/assets/coin_sheet.png",
  frameWidth: 110,
  frameHeight: 140,
  frameCount: 6,
};

/**
 * After images load, register additional texture keys that the GameScene/MainMenu
 * already use (e.g. player-run1..4, player-jump, player-slide, player-super,
 * coin-0..5). These all alias the same source image / sheet frame.
 */
export function registerImageAliases(scene: Phaser.Scene) {
  // Player: alias single image to the 7 expected pose keys
  const playerSrc = scene.textures
    .get("img-player")
    .getSourceImage() as HTMLImageElement;
  const playerKeys = [
    "player-run1",
    "player-run2",
    "player-run3",
    "player-run4",
    "player-jump",
    "player-slide",
    "player-super",
  ];
  for (const k of playerKeys) {
    if (scene.textures.exists(k)) scene.textures.remove(k);
    scene.textures.addImage(k, playerSrc);
  }

  // Coin: split spritesheet into 6 individual texture keys (coin-0..5)
  const sheetSrc = scene.textures
    .get(COIN_SHEET.key)
    .getSourceImage() as HTMLImageElement;
  for (let i = 0; i < COIN_SHEET.frameCount; i++) {
    const key = `coin-${i}`;
    if (scene.textures.exists(key)) scene.textures.remove(key);
    const tex = scene.textures.createCanvas(
      key,
      COIN_SHEET.frameWidth,
      COIN_SHEET.frameHeight
    );
    if (!tex) continue;
    const ctx = tex.getContext();
    ctx.clearRect(0, 0, COIN_SHEET.frameWidth, COIN_SHEET.frameHeight);
    ctx.drawImage(
      sheetSrc,
      i * COIN_SHEET.frameWidth,
      0,
      COIN_SHEET.frameWidth,
      COIN_SHEET.frameHeight,
      0,
      0,
      COIN_SHEET.frameWidth,
      COIN_SHEET.frameHeight
    );
    tex.refresh();
  }
}
