// --- Canvas size ---------------------------------------------------------
// The base canvas is 16:9. On viewports wider than 16:9 (most modern
// phones in landscape) we widen the canvas slightly so the gameplay area
// extends into the side margins; HUD elements stay inside `SAFE_ZONE`.
const isClient = typeof window !== "undefined";
const aspect = isClient ? window.innerWidth / window.innerHeight : 16 / 9;
const safeAspect = Math.max(16 / 9, Math.min(aspect, 24 / 9));

export const GAME_HEIGHT = 720;
export const GAME_WIDTH = Math.round(GAME_HEIGHT * safeAspect);

// --- Safe zone -----------------------------------------------------------
// All HUD / menu / button elements should be positioned inside this zone
// so they remain visible when the game runs in Phaser.Scale.ENVELOP mode
// on ultra-wide viewports (mobile landscape, ultrawide monitors).
//
// Example: place a top-left HUD element at (SAFE_ZONE.left + padding,
// SAFE_ZONE.top + padding) instead of (0, 0).
const SAFE_PAD_RATIO = 0.075;
export const SAFE_ZONE = {
  left: Math.round(GAME_WIDTH * SAFE_PAD_RATIO),
  right: Math.round(GAME_WIDTH * (1 - SAFE_PAD_RATIO)),
  top: 0,
  bottom: GAME_HEIGHT,
  centerX: Math.round(GAME_WIDTH / 2),
  centerY: Math.round(GAME_HEIGHT / 2),
};

// --- Gameplay tuning -----------------------------------------------------
export const GROUND_Y = 600;
export const STADIUM_VISIBLE_HEIGHT = 360;
export const STADIUM_TOP_Y = GROUND_Y - STADIUM_VISIBLE_HEIGHT;
export const PLAYER_X = 220;

export const GRAVITY = 2200;
export const JUMP_VELOCITY = -900;
export const SLIDE_DURATION = 650;

export const BASE_SPEED = 280;
export const MAX_SPEED = 520;
export const SPEED_RAMP = 3;

export const COIN_VALUE = 10;
export const COIN_DISTANCE_VALUE = 1;

export const SUPER_DURATION = 4500;
export const MAD_METER_FILL_PER_COIN = 8;
export const MAD_METER_DRAIN_DURING_SUPER = 35;

export const DAILY_CHALLENGE_TARGET = 1000;

// --- Color palette -------------------------------------------------------
export const COLORS = {
  skyTop: 0x1a2348,
  skyBottom: 0x4d5fb0,
  stadiumDark: 0x101633,
  stadiumMid: 0x1c264e,
  stadiumLight: 0x2a3568,
  grassTop: 0x4ea83a,
  grassMid: 0x3a8a2c,
  grassDark: 0x2a6620,
  earth: 0x2a1a10,
  earthDark: 0x1a0e08,
  goldLight: 0xffe277,
  gold: 0xffc83a,
  goldDark: 0xb27913,
  jerseyYellow: 0xffd23a,
  jerseyAccent: 0x1644a8,
  skin: 0xf2c4a0,
  skinDark: 0xb88565,
  hairDark: 0x2a1a0c,
  shoeGreen: 0x32d264,
  shoeAccent: 0x0a2a14,
  red: 0xff3845,
  white: 0xffffff,
  black: 0x000000,
  cardBlue: 0x1d56c2,
  cardBlueDark: 0x0a2660,
  poopBrown: 0x6b3a14,
  poopBrownLight: 0x9a5a26,
  moneyTan: 0xc89858,
  moneyTanDark: 0x6e4e22,
  varBlack: 0x111114,
  varScreen: 0x0a0a0a,
  varAccent: 0xff2a2a,
};

export const PALETTE_HEX = {
  goldLight: "#ffe277",
  gold: "#ffc83a",
  goldDark: "#b27913",
  red: "#ff3845",
  green: "#32d264",
  blue: "#1d56c2",
  white: "#ffffff",
};
