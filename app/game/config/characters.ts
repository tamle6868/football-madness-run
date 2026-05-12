export type CharacterId =
  | "ronaldo"
  | "messi"
  | "neymar"
  | "mbappe"
  | "haaland"
  | "zlatan";

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

export const DEFAULT_CHARACTER_ID: CharacterId = "ronaldo";

export const CHARACTERS: CharacterConfig[] = [
  {
    id: "ronaldo",
    name: "Ronaldo",
    shortName: "CR7",
    status: "available",
    accent: 0x32d264,
    accentHex: "#32d264",
    passiveName: "Pressure Battery",
    passiveText: "Coins fill Mad Meter 20% faster.",
    superName: "SIUUUU Dash",
    superText: "Blast forward and smash hazards for a short burst.",
    madGainMultiplier: 1.2,
    superDurationMultiplier: 1.1,
    unlockText: "Ready",
  },
  {
    id: "messi",
    name: "Messi",
    shortName: "M10",
    status: "locked",
    accent: 0x8f65ff,
    accentHex: "#8f65ff",
    passiveName: "Tiny Gaps",
    passiveText: "Slightly smaller hitbox and smoother landings.",
    superName: "M Magic",
    superText: "Slow time and glide through chaos.",
    madGainMultiplier: 1,
    superDurationMultiplier: 1,
    unlockText: "Asset pending",
  },
  {
    id: "neymar",
    name: "Neymar",
    shortName: "NEY",
    status: "locked",
    accent: 0xffd23a,
    accentHex: "#ffd23a",
    passiveName: "Fake Foul",
    passiveText: "Survive one hit by selling the contact.",
    superName: "Flip Mode",
    superText: "Flip over every ground hazard with style.",
    madGainMultiplier: 1,
    superDurationMultiplier: 1,
    unlockText: "Asset pending",
  },
  {
    id: "mbappe",
    name: "Mbappe",
    shortName: "KM7",
    status: "locked",
    accent: 0x18c8ff,
    accentHex: "#18c8ff",
    passiveName: "Vibe Check",
    passiveText: "Starts faster and pulls coins from farther away.",
    superName: "Speed Burst",
    superText: "Turn the pitch into a blue streak.",
    madGainMultiplier: 1,
    superDurationMultiplier: 1,
    unlockText: "Asset pending",
  },
  {
    id: "haaland",
    name: "Haaland",
    shortName: "H9",
    status: "locked",
    accent: 0xff9a3c,
    accentHex: "#ff9a3c",
    passiveName: "Power Body",
    passiveText: "Absorbs one heavy collision each cup run.",
    superName: "Power Run",
    superText: "Run through big hazards, but turning is harder.",
    madGainMultiplier: 1,
    superDurationMultiplier: 1,
    unlockText: "Asset pending",
  },
  {
    id: "zlatan",
    name: "Zlatan",
    shortName: "ZLA",
    status: "locked",
    accent: 0xffffff,
    accentHex: "#ffffff",
    passiveName: "I Am Height",
    passiveText: "Higher jumps and slower fall speed.",
    superName: "Zlatan Mode",
    superText: "Grow huge and stomp the final chaos.",
    madGainMultiplier: 1,
    superDurationMultiplier: 1,
    unlockText: "Asset pending",
  },
];

export function getCharacter(id?: string): CharacterConfig {
  return (
    CHARACTERS.find((character) => character.id === id) ??
    CHARACTERS.find((character) => character.id === DEFAULT_CHARACTER_ID)!
  );
}
