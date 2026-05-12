import * as Phaser from "phaser";
import { getCharacter } from "../config/characters";
import {
  getCupStage,
  normalizeRunPerks,
  type CupStageResultData,
  type RunPerks,
} from "../config/cup";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants";

interface PerkChoice {
  title: string;
  text: string;
  apply: (perks: RunPerks) => RunPerks;
}

const PERK_CHOICES: PerkChoice[] = [
  {
    title: "EXTRA SHIELD",
    text: "Start the next stage with one more shield.",
    apply: (perks) => ({ ...perks, shieldBonus: perks.shieldBonus + 1 }),
  },
  {
    title: "COIN MAGNET",
    text: "Add one more magnet boost to your inventory.",
    apply: (perks) => ({ ...perks, magnetBonus: perks.magnetBonus + 1 }),
  },
  {
    title: "MAD BOOST",
    text: "Mad Meter fills 10% faster for the rest of the cup.",
    apply: (perks) => ({ ...perks, madFillBonus: perks.madFillBonus + 0.1 }),
  },
];

export class StageCompleteScene extends Phaser.Scene {
  private result!: CupStageResultData;

  constructor() {
    super("StageCompleteScene");
  }

  init(data: CupStageResultData) {
    this.result = data;
  }

  create() {
    const stage = getCupStage(this.result.stageId);
    const character = getCharacter(this.result.characterId);
    const perks = normalizeRunPerks(this.result.perks);

    const dim = this.add.graphics();
    dim.fillStyle(0x000000, 0.72);
    dim.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const panel = this.add.graphics();
    panel.fillStyle(0x0c1432, 0.96);
    panel.fillRoundedRect(120, 76, 1040, 560, 18);
    panel.lineStyle(4, stage.accent, 0.85);
    panel.strokeRoundedRect(120, 76, 1040, 560, 18);

    this.add
      .text(GAME_WIDTH / 2, 128, `${stage.title.toUpperCase()} CLEARED`, {
        fontFamily: "sans-serif",
        fontSize: "44px",
        fontStyle: "bold",
        color: stage.accentHex,
        stroke: "#0b1020",
        strokeThickness: 8,
      })
      .setOrigin(0.5);
    this.add
      .text(GAME_WIDTH / 2, 176, `${character.name} survived ${stage.bossName}. Choose a perk.`, {
        fontFamily: "sans-serif",
        fontSize: "20px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const stats = [
      ["STAGE", `${this.result.distance}M`],
      ["SCORE", `${this.result.score ?? 0}`],
      ["COINS", `${this.result.coins ?? 0}`],
      ["TOTAL", `${this.result.totalDistance ?? 0}M`],
    ];
    stats.forEach(([label, value], index) => {
      const x = 210 + index * 220;
      const card = this.add.graphics();
      card.fillStyle(0x17244f, 0.9);
      card.fillRoundedRect(x, 220, 180, 86, 10);
      card.lineStyle(2, 0x6a8aff, 0.45);
      card.strokeRoundedRect(x, 220, 180, 86, 10);
      this.add
        .text(x + 90, 242, label, {
          fontFamily: "sans-serif",
          fontSize: "14px",
          fontStyle: "bold",
          color: "#a0d0ff",
        })
        .setOrigin(0.5);
      this.add
        .text(x + 90, 274, value, {
          fontFamily: "sans-serif",
          fontSize: "28px",
          fontStyle: "bold",
          color: "#ffd23a",
        })
        .setOrigin(0.5);
    });

    PERK_CHOICES.forEach((choice, index) => {
      const x = 210 + index * 300;
      this.drawPerkCard(x, 354, 260, 150, choice, () => {
        const nextPerks = choice.apply(perks);
        this.scene.start("CupRouteScene", {
          characterId: this.result.characterId,
          stageId: this.result.nextStageId,
          perks: nextPerks,
          score: this.result.score,
          coins: this.result.coins,
          totalDistance: this.result.totalDistance,
        });
      });
    });

    this.add
      .text(GAME_WIDTH / 2, 570, "Perks stack until the Final.", {
        fontFamily: "sans-serif",
        fontSize: "16px",
        color: "#a0d0ff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
  }

  private drawPerkCard(
    x: number,
    y: number,
    w: number,
    h: number,
    choice: PerkChoice,
    onPick: () => void
  ) {
    const g = this.add.graphics();
    const draw = (hover = false) => {
      g.clear();
      g.fillStyle(hover ? 0x20386f : 0x111a3a, 0.96);
      g.fillRoundedRect(x, y, w, h, 12);
      g.lineStyle(3, hover ? 0xffd23a : 0x6a8aff, hover ? 0.95 : 0.55);
      g.strokeRoundedRect(x, y, w, h, 12);
    };
    draw();

    this.add
      .text(x + w / 2, y + 34, choice.title, {
        fontFamily: "sans-serif",
        fontSize: "22px",
        fontStyle: "bold",
        color: "#ffd23a",
      })
      .setOrigin(0.5);
    this.add
      .text(x + w / 2, y + 82, choice.text, {
        fontFamily: "sans-serif",
        fontSize: "15px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: w - 34 },
      })
      .setOrigin(0.5);
    this.add
      .text(x + w / 2, y + 124, "PICK", {
        fontFamily: "sans-serif",
        fontSize: "16px",
        fontStyle: "bold",
        color: "#32d264",
      })
      .setOrigin(0.5);

    this.add
      .zone(x + w / 2, y + h / 2, w, h)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => draw(true))
      .on("pointerout", () => draw(false))
      .on("pointerdown", onPick);
  }
}
