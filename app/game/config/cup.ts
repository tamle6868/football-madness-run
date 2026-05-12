import type { CharacterId } from "./characters";

export type CupStageId = "group" | "r16" | "quarter" | "semi" | "final";

export interface CupStageConfig {
  id: CupStageId;
  index: number;
  title: string;
  shortTitle: string;
  targetMeters: number;
  theme: string;
  bossName: string;
  accent: number;
  accentHex: string;
}

export interface RunPerks {
  shieldBonus: number;
  magnetBonus: number;
  madFillBonus: number;
  scoreMultiplier: number;
}

export interface CupRunData {
  characterId?: CharacterId;
  stageId?: CupStageId;
  perks?: Partial<RunPerks>;
  score?: number;
  coins?: number;
  totalDistance?: number;
}

export interface CupStageResultData extends CupRunData {
  stageId: CupStageId;
  distance: number;
  stageScore: number;
  nextStageId?: CupStageId;
}

export const DEFAULT_STAGE_ID: CupStageId = "group";

export const CUP_STAGES: CupStageConfig[] = [
  {
    id: "group",
    index: 0,
    title: "Group Stage",
    shortTitle: "GROUP",
    targetMeters: 500,
    theme: "Warm-up chaos",
    bossName: "VAR Check",
    accent: 0x32d264,
    accentHex: "#32d264",
  },
  {
    id: "r16",
    index: 1,
    title: "Round of 16",
    shortTitle: "R16",
    targetMeters: 700,
    theme: "VAR pressure",
    bossName: "VAR Room",
    accent: 0x18c8ff,
    accentHex: "#18c8ff",
  },
  {
    id: "quarter",
    index: 2,
    title: "Quarter Final",
    shortTitle: "QF",
    targetMeters: 900,
    theme: "Money traps",
    bossName: "Saudi Contract",
    accent: 0xffd23a,
    accentHex: "#ffd23a",
  },
  {
    id: "semi",
    index: 3,
    title: "Semi Final",
    shortTitle: "SF",
    targetMeters: 1100,
    theme: "Social hate storm",
    bossName: "Comment Section",
    accent: 0xff3845,
    accentHex: "#ff3845",
  },
  {
    id: "final",
    index: 4,
    title: "Final",
    shortTitle: "FINAL",
    targetMeters: 1300,
    theme: "The madness boss",
    bossName: "Football Madness",
    accent: 0xff9a3c,
    accentHex: "#ff9a3c",
  },
];

export const DEFAULT_RUN_PERKS: RunPerks = {
  shieldBonus: 0,
  magnetBonus: 0,
  madFillBonus: 0,
  scoreMultiplier: 1,
};

export function getCupStage(id?: string): CupStageConfig {
  return (
    CUP_STAGES.find((stage) => stage.id === id) ??
    CUP_STAGES.find((stage) => stage.id === DEFAULT_STAGE_ID)!
  );
}

export function getNextStage(id: CupStageId): CupStageConfig | undefined {
  const current = getCupStage(id);
  return CUP_STAGES[current.index + 1];
}

export function normalizeRunPerks(perks?: Partial<RunPerks>): RunPerks {
  return {
    shieldBonus: perks?.shieldBonus ?? DEFAULT_RUN_PERKS.shieldBonus,
    magnetBonus: perks?.magnetBonus ?? DEFAULT_RUN_PERKS.magnetBonus,
    madFillBonus: perks?.madFillBonus ?? DEFAULT_RUN_PERKS.madFillBonus,
    scoreMultiplier: perks?.scoreMultiplier ?? DEFAULT_RUN_PERKS.scoreMultiplier,
  };
}
