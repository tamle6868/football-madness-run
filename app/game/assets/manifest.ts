export type ObstacleAvoidance = "jump" | "slide" | "both";

export type ObstacleKind =
  | "var"
  | "corruption"
  | "injury"
  | "hate"
  | "drone";

export interface ObstacleSpec {
  kind: ObstacleKind;
  textureKey: string;
  scale: number;
  /** Offset of bottom of sprite from GROUND_Y. Positive values float up. */
  liftOffset: number;
  /** Body width relative to source texture width. */
  bodyW: number;
  /** Body height relative to source texture height. */
  bodyH: number;
  /** Extra source-space vertical offset within sprite. */
  bodyOffsetY: number;
  /** Required avoidance action. */
  avoidance: ObstacleAvoidance;
  /** Distance in meters before this obstacle can appear. */
  minDistance: number;
  /** Weighted random spawn chance after minDistance. */
  weight: number;
  clearScore: number;
}

export const OBSTACLES: Record<ObstacleKind, ObstacleSpec> = {
  var: {
    kind: "var",
    textureKey: "obs-var",
    scale: 0.52,
    liftOffset: 0,
    bodyW: 0.58,
    bodyH: 0.9,
    bodyOffsetY: 0,
    avoidance: "both",
    minDistance: 0,
    weight: 28,
    clearScore: 25,
  },
  corruption: {
    kind: "corruption",
    textureKey: "obs-corruption",
    scale: 0.5,
    liftOffset: 0,
    bodyW: 0.58,
    bodyH: 0.82,
    bodyOffsetY: 10,
    avoidance: "jump",
    minDistance: 60,
    weight: 24,
    clearScore: 30,
  },
  injury: {
    kind: "injury",
    textureKey: "obs-injury",
    scale: 0.58,
    liftOffset: 0,
    bodyW: 0.72,
    bodyH: 0.9,
    bodyOffsetY: 0,
    avoidance: "jump",
    minDistance: 110,
    weight: 22,
    clearScore: 35,
  },
  hate: {
    kind: "hate",
    textureKey: "obs-hate",
    scale: 0.62,
    liftOffset: 0,
    bodyW: 0.7,
    bodyH: 0.58,
    bodyOffsetY: 18,
    avoidance: "jump",
    minDistance: 160,
    weight: 18,
    clearScore: 25,
  },
  drone: {
    kind: "drone",
    textureKey: "obs-drone",
    scale: 0.72,
    liftOffset: 58,
    bodyW: 0.76,
    bodyH: 0.45,
    bodyOffsetY: 36,
    avoidance: "slide",
    minDistance: 220,
    weight: 18,
    clearScore: 45,
  },
};

export const OBSTACLE_KINDS = Object.keys(OBSTACLES) as ObstacleKind[];

