export type CharacterId =
  | "player-1"
  | "player-2"
  | "player-3"
  | "player-4"
  | "player-5"
  | "player-6";

export interface CharacterConfig {
  id: CharacterId;
  name: string;
  shortName: string;
  status: "available" | "locked";
  accent: number;
  accentHex: string;
  passiveName: string;
  passiveText: string;
  superName: string;
  superText: string;
  madGainMultiplier: number;
  superDurationMultiplier: number;
  unlockText: string;
}

export const DEFAULT_CHARACTER_ID: CharacterId = "player-1";

/**
 * Example character roster. Replace these with your own characters for the
 * game you are building. Each character must have:
 *  - a unique `id`
 *  - `status: "available"` to make it selectable from the menu
 *  - `passive*` and `super*` text shown in the character select panel
 *  - `madGainMultiplier` (how fast their Super meter fills)
 *  - `superDurationMultiplier` (how long their Super lasts)
 */
export const CHARACTERS: CharacterConfig[] = [
  {
    id: "player-1",
    name: "Striker",
    shortName: "STR",
    status: "available",
    accent: 0x32d264,
    accentHex: "#32d264",
    passiveName: "Adrenaline",
    passiveText: "Coins fill the Super Meter 20% faster.",
    superName: "Forward Dash",
    superText: "Blast forward and smash through obstacles.",
    madGainMultiplier: 1.2,
    superDurationMultiplier: 1.1,
    unlockText: "Ready",
  },
  {
    id: "player-2",
    name: "Trickster",
    shortName: "TRK",
    status: "locked",
    accent: 0x8f65ff,
    accentHex: "#8f65ff",
    passiveName: "Slippery",
    passiveText: "Smaller hitbox and softer landings.",
    superName: "Time Slow",
    superText: "Slow time and glide through obstacles.",
    madGainMultiplier: 1,
    superDurationMultiplier: 1,
    unlockText: "Coming soon",
  },
  {
    id: "player-3",
    name: "Acrobat",
    shortName: "ACR",
    status: "locked",
    accent: 0xffd23a,
    accentHex: "#ffd23a",
    passiveName: "Second Chance",
    passiveText: "Survive one hit per run.",
    superName: "Flip Mode",
    superText: "Flip over every ground obstacle.",
    madGainMultiplier: 1,
    superDurationMultiplier: 1,
    unlockText: "Coming soon",
  },
  {
    id: "player-4",
    name: "Sprinter",
    shortName: "SPR",
    status: "locked",
    accent: 0x18c8ff,
    accentHex: "#18c8ff",
    passiveName: "Magnet",
    passiveText: "Starts faster and pulls coins from farther.",
    superName: "Speed Burst",
    superText: "Turn the screen into a blue streak.",
    madGainMultiplier: 1,
    superDurationMultiplier: 1,
    unlockText: "Coming soon",
  },
  {
    id: "player-5",
    name: "Bruiser",
    shortName: "BRZ",
    status: "locked",
    accent: 0xff9a3c,
    accentHex: "#ff9a3c",
    passiveName: "Tough",
    passiveText: "Absorbs one heavy collision each run.",
    superName: "Power Run",
    superText: "Run through big obstacles. Turning is harder.",
    madGainMultiplier: 1,
    superDurationMultiplier: 1,
    unlockText: "Coming soon",
  },
  {
    id: "player-6",
    name: "Giant",
    shortName: "GNT",
    status: "locked",
    accent: 0xffffff,
    accentHex: "#ffffff",
    passiveName: "Tall",
    passiveText: "Higher jumps and slower fall speed.",
    superName: "Stomp Mode",
    superText: "Grow huge and stomp obstacles.",
    madGainMultiplier: 1,
    superDurationMultiplier: 1,
    unlockText: "Coming soon",
  },
];

export function getCharacter(id?: string): CharacterConfig {
  return (
    CHARACTERS.find((character) => character.id === id) ??
    CHARACTERS.find((character) => character.id === DEFAULT_CHARACTER_ID)!
  );
}
