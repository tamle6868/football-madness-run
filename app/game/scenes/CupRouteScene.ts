import * as Phaser from "phaser";
import { getCharacter } from "../config/characters";
import {
  CUP_STAGES,
  DEFAULT_STAGE_ID,
  getCupStage,
  normalizeRunPerks,
  type CupRunData,
} from "../config/cup";
import { GAME_HEIGHT, GAME_WIDTH, GROUND_Y } from "../constants";

export class CupRouteScene extends Phaser.Scene {
  private runData: CupRunData = {};

  constructor() {
    super("CupRouteScene");
  }

  init(data: CupRunData) {
    this.runData = {
      characterId: data.characterId ?? "ronaldo",
      stageId: data.stageId ?? DEFAULT_STAGE_ID,
      perks: normalizeRunPerks(data.perks),
      score: data.score ?? 0,
      coins: data.coins ?? 0,
      totalDistance: data.totalDistance ?? 0,
    };
  }

  create() {
    const stage = getCupStage(this.runData.stageId);
    const character = getCharacter(this.runData.characterId);
    const perks = normalizeRunPerks(this.runData.perks);

    this.drawBackground();

    this.add.image(135, 72, "logo").setScale(0.28).setOrigin(0.5);
    this.add
      .text(GAME_WIDTH / 2, 58, "WORLD CUP ROUTE", {
        fontFamily: "sans-serif",
        fontSize: "48px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#0b1020",
        strokeThickness: 8,
      })
      .setOrigin(0.5);
    this.add
      .text(GAME_WIDTH / 2, 106, "Win five meme football rounds, then lift the cup.", {
        fontFamily: "sans-serif",
        fontSize: "18px",
        color: "#a0d0ff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const line = this.add.graphics();
    line.lineStyle(8, 0xffd23a, 0.55);
    line.lineBetween(150, 290, GAME_WIDTH - 150, 290);

    CUP_STAGES.forEach((cupStage) => {
      const x = 150 + (cupStage.index / (CUP_STAGES.length - 1)) * (GAME_WIDTH - 300);
      const unlocked = cupStage.index <= stage.index;
      const current = cupStage.id === stage.id;
      const node = this.add.graphics();
      node.fillStyle(current ? cupStage.accent : unlocked ? 0x13244d : 0x080c20, 1);
      node.fillCircle(x, 290, current ? 42 : 34);
      node.lineStyle(current ? 5 : 3, unlocked ? cupStage.accent : 0x435073, 0.95);
      node.strokeCircle(x, 290, current ? 42 : 34);
      node.fillStyle(0x0b1020, 0.45);
      node.fillCircle(x, 290, 22);

      this.add
        .text(x, 290, cupStage.shortTitle, {
          fontFamily: "sans-serif",
          fontSize: current ? "17px" : "14px",
          fontStyle: "bold",
          color: unlocked ? "#ffffff" : "#697899",
        })
        .setOrigin(0.5);
      this.add
        .text(x, 350, cupStage.title.toUpperCase(), {
          fontFamily: "sans-serif",
          fontSize: "15px",
          fontStyle: "bold",
          color: current ? cupStage.accentHex : unlocked ? "#a0d0ff" : "#697899",
          align: "center",
          wordWrap: { width: 150 },
        })
        .setOrigin(0.5);
      this.add
        .text(x, 382, `${cupStage.targetMeters}M`, {
          fontFamily: "sans-serif",
          fontSize: "15px",
          fontStyle: "bold",
          color: "#ffd23a",
        })
        .setOrigin(0.5);
    });

    const panel = this.add.graphics();
    panel.fillStyle(0x0c1432, 0.92);
    panel.fillRoundedRect(210, 430, 860, 136, 14);
    panel.lineStyle(3, stage.accent, 0.75);
    panel.strokeRoundedRect(210, 430, 860, 136, 14);
    panel.fillStyle(stage.accent, 0.18);
    panel.fillRoundedRect(230, 450, 180, 8, 4);

    this.add
      .text(250, 470, `${stage.title.toUpperCase()} - ${stage.theme}`, {
        fontFamily: "sans-serif",
        fontSize: "27px",
        fontStyle: "bold",
        color: stage.accentHex,
      })
      .setOrigin(0, 0.5);
    this.add.text(250, 512, `Boss pressure: ${stage.bossName}`, {
      fontFamily: "sans-serif",
      fontSize: "17px",
      color: "#ffffff",
    });
    this.add.text(610, 512, `Character: ${character.name} / ${character.superName}`, {
      fontFamily: "sans-serif",
      fontSize: "17px",
      color: "#ffffff",
    });
    this.add.text(
      250,
      540,
      `Run stats: ${this.runData.score ?? 0} score, ${this.runData.coins ?? 0} coins, ${
        this.runData.totalDistance ?? 0
      }m total`,
      {
        fontFamily: "sans-serif",
        fontSize: "15px",
        color: "#a0d0ff",
      }
    );
    this.add.text(
      610,
      540,
      `Perks: shield +${perks.shieldBonus}, magnet +${perks.magnetBonus}, mad +${Math.round(
        perks.madFillBonus * 100
      )}%`,
      {
        fontFamily: "sans-serif",
        fontSize: "15px",
        color: "#a0d0ff",
      }
    );

    this.makeButton(GAME_WIDTH / 2 - 120, 640, 230, 58, "START MATCH", 0x32d264, () => {
      this.scene.start("GameScene", this.runData);
      this.scene.launch("UIScene", this.runData);
    });
    this.makeButton(GAME_WIDTH / 2 + 140, 640, 190, 58, "CHARACTER", 0x1d56c2, () => {
      this.scene.start("CharacterSelectScene");
    });
  }

  private drawBackground() {
    const sky = this.add.image(GAME_WIDTH / 2, 80, "bg-sky");
    sky.setDisplaySize(GAME_WIDTH, 160);

    const stadium = this.add.image(GAME_WIDTH / 2, GROUND_Y / 2, "bg-stadium");
    stadium.setDisplaySize(GAME_WIDTH, GROUND_Y);

    const ground = this.add.tileSprite(
      GAME_WIDTH / 2,
      GROUND_Y + (GAME_HEIGHT - GROUND_Y) / 2,
      GAME_WIDTH,
      GAME_HEIGHT - GROUND_Y,
      "bg-ground"
    );
    ground.tileScaleY = (GAME_HEIGHT - GROUND_Y) / 200;

    const dim = this.add.graphics();
    dim.fillStyle(0x000000, 0.48);
    dim.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }

  private makeButton(
    cx: number,
    cy: number,
    w: number,
    h: number,
    label: string,
    color: number,
    onClick: () => void
  ) {
    const g = this.add.graphics();
    const draw = (c: number) => {
      g.clear();
      g.fillStyle(c, 1);
      g.fillRoundedRect(cx - w / 2, cy - h / 2, w, h, 14);
      g.lineStyle(3, 0x0b1020, 1);
      g.strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, 14);
    };
    draw(color);

    const txt = this.add
      .text(cx, cy, label, {
        fontFamily: "sans-serif",
        fontSize: "24px",
        fontStyle: "bold",
        color: "#0b1020",
      })
      .setOrigin(0.5);

    this.add
      .zone(cx, cy, w, h)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => draw(Phaser.Display.Color.IntegerToColor(color).brighten(20).color))
      .on("pointerout", () => draw(color))
      .on("pointerdown", () => {
        this.tweens.add({
          targets: txt,
          scale: 0.9,
          duration: 80,
          yoyo: true,
          onComplete: onClick,
        });
      });
  }
}
