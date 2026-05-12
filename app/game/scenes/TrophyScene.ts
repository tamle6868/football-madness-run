import * as Phaser from "phaser";
import { getCharacter } from "../config/characters";
import { getCupStage, type CupStageResultData } from "../config/cup";
import { GAME_HEIGHT, GAME_WIDTH, GROUND_Y } from "../constants";

export class TrophyScene extends Phaser.Scene {
  private result!: CupStageResultData;
  private shareStatus!: Phaser.GameObjects.Text;

  constructor() {
    super("TrophyScene");
  }

  init(data: CupStageResultData) {
    this.result = data;
  }

  create() {
    const character = getCharacter(this.result.characterId);
    const stage = getCupStage(this.result.stageId);

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
    dim.fillStyle(0x000000, 0.34);
    dim.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.add
      .text(GAME_WIDTH / 2, 70, "WORLD CUP CHAMPION", {
        fontFamily: "sans-serif",
        fontSize: "54px",
        fontStyle: "bold",
        color: "#ffd23a",
        stroke: "#0b1020",
        strokeThickness: 9,
      })
      .setOrigin(0.5);
    this.add
      .text(GAME_WIDTH / 2, 124, `${character.name} survived the madness.`, {
        fontFamily: "sans-serif",
        fontSize: "24px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#0b1020",
        strokeThickness: 5,
      })
      .setOrigin(0.5);

    const player = this.add
      .image(420, GROUND_Y - 4, "player-super")
      .setOrigin(0.5, 1)
      .setScale(1.35)
      .setDepth(4);
    this.add.ellipse(420, GROUND_Y - 4, 130, 22, 0x000000, 0.36).setDepth(3);
    const trophy = this.add
      .image(700, GROUND_Y - 18, "trophy")
      .setOrigin(0.5, 1)
      .setScale(1.05)
      .setDepth(4);
    this.tweens.add({
      targets: trophy,
      y: trophy.y - 18,
      duration: 900,
      ease: "Sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    this.tweens.add({
      targets: player,
      y: player.y - 8,
      duration: 720,
      ease: "Sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    const card = this.add.graphics();
    card.fillStyle(0x0c1432, 0.92);
    card.fillRoundedRect(820, 220, 320, 240, 16);
    card.lineStyle(3, stage.accent, 0.85);
    card.strokeRoundedRect(820, 220, 320, 240, 16);
    this.add.text(850, 252, "SHARE CARD", {
      fontFamily: "sans-serif",
      fontSize: "24px",
      fontStyle: "bold",
      color: stage.accentHex,
    });
    this.add.text(850, 300, `Hero: ${character.name}`, {
      fontFamily: "sans-serif",
      fontSize: "17px",
      color: "#ffffff",
    });
    this.add.text(850, 330, `Score: ${this.result.score ?? 0}`, {
      fontFamily: "sans-serif",
      fontSize: "17px",
      color: "#ffffff",
    });
    this.add.text(850, 360, `Coins: ${this.result.coins ?? 0}`, {
      fontFamily: "sans-serif",
      fontSize: "17px",
      color: "#ffffff",
    });
    this.add.text(850, 390, `Route: ${this.result.totalDistance ?? 0}m`, {
      fontFamily: "sans-serif",
      fontSize: "17px",
      color: "#ffffff",
    });
    this.shareStatus = this.add
      .text(980, 430, "", {
        fontFamily: "sans-serif",
        fontSize: "14px",
        fontStyle: "bold",
        color: "#32d264",
      })
      .setOrigin(0.5);

    this.makeButton(490, 650, 210, 58, "PLAY AGAIN", 0x32d264, () => {
      this.scene.start("CharacterSelectScene");
    });
    this.makeButton(720, 650, 180, 58, "SHARE", 0xffd23a, () => this.shareResult());
    this.makeButton(930, 650, 190, 58, "MENU", 0x1d56c2, () => {
      this.scene.start("MainMenuScene");
    });

    this.cameras.main.flash(500, 255, 220, 80);
  }

  private async shareResult() {
    const character = getCharacter(this.result.characterId);
    const text = `${character.name} survived Football Madness Run and won the cup with ${
      this.result.score ?? 0
    } score.`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Football Madness Run",
          text,
          url: window.location.href,
        });
        this.shareStatus.setText("SHARED");
        return;
      }
      await navigator.clipboard?.writeText(`${text} ${window.location.href}`);
      this.shareStatus.setText("COPIED");
    } catch {
      this.shareStatus.setText("READY");
    }
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
        fontSize: "23px",
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
