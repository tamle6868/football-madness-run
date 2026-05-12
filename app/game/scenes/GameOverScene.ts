import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants";
import type { CupRunData } from "../config/cup";

interface GameOverData extends CupRunData {
  score: number;
  distance: number;
  coins: number;
  best: number;
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  create(data: GameOverData) {
    // Dim background
    const dim = this.add.graphics();
    dim.fillStyle(0x000000, 0.65);
    dim.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Modal panel
    const panelX = GAME_WIDTH / 2 - 320;
    const panelY = 100;
    const panel = this.add.graphics();
    panel.fillStyle(0x0c1432, 0.96);
    panel.fillRoundedRect(panelX, panelY, 640, 480, 20);
    panel.lineStyle(4, 0xffd23a, 0.9);
    panel.strokeRoundedRect(panelX, panelY, 640, 480, 20);

    // Header bar
    const hdr = this.add.graphics();
    hdr.fillStyle(0xff3845, 1);
    hdr.fillRoundedRect(panelX, panelY, 640, 70, {
      tl: 20,
      tr: 20,
      bl: 0,
      br: 0,
    });
    this.add
      .text(GAME_WIDTH / 2, panelY + 35, "GAME OVER", {
        fontFamily: "sans-serif",
        fontSize: "44px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#0b1020",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    const isNewBest = data.score >= data.best && data.score > 0;
    if (isNewBest) {
      this.add
        .text(GAME_WIDTH / 2, panelY + 92, "NEW BEST SCORE", {
          fontFamily: "sans-serif",
          fontSize: "20px",
          fontStyle: "bold",
          color: "#ffd23a",
        })
        .setOrigin(0.5);
    }

    // Stats grid
    const statY = panelY + 140;
    const statW = 200;
    const stats = [
      {
        label: "DISTANCE",
        value: `${data.distance}M`,
        color: "#a0d0ff",
      },
      {
        label: "SCORE",
        value: Math.floor(data.score).toLocaleString("en-US"),
        color: "#ffd23a",
      },
      { label: "COINS", value: data.coins.toString(), color: "#ffd23a" },
    ];
    stats.forEach((s, i) => {
      const cx = panelX + 40 + i * (statW + 20);
      const card = this.add.graphics();
      card.fillStyle(0x1a2348, 1);
      card.fillRoundedRect(cx, statY, statW, 100, 12);
      card.lineStyle(2, 0x6a8aff, 0.4);
      card.strokeRoundedRect(cx, statY, statW, 100, 12);
      this.add
        .text(cx + statW / 2, statY + 18, s.label, {
          fontFamily: "sans-serif",
          fontSize: "14px",
          color: "#a0d0ff",
          fontStyle: "bold",
        })
        .setOrigin(0.5);
      this.add
        .text(cx + statW / 2, statY + 58, s.value, {
          fontFamily: "sans-serif",
          fontSize: "32px",
          color: s.color,
          fontStyle: "bold",
        })
        .setOrigin(0.5);
    });

    // Best score line
    this.add
      .text(GAME_WIDTH / 2, statY + 130, `BEST: ${data.best.toLocaleString("en-US")}`, {
        fontFamily: "sans-serif",
        fontSize: "22px",
        color: "#ffd23a",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Buttons
    const btnY = panelY + 400;

    const retryBtn = this.makeButton(
      GAME_WIDTH / 2 - 130,
      btnY,
      240,
      60,
      "RETRY",
      0x32d264,
      () => {
        this.scene.start("CupRouteScene", {
          characterId: data.characterId,
          stageId: "group",
          score: 0,
          coins: 0,
          totalDistance: 0,
        });
      }
    );
    void retryBtn;

    const menuBtn = this.makeButton(
      GAME_WIDTH / 2 + 130,
      btnY,
      200,
      60,
      "MAIN MENU",
      0x1d56c2,
      () => {
        this.scene.start("MainMenuScene");
      }
    );
    void menuBtn;

    // Tip / parody flavor
    const tips = [
      "VAR ruined your career.",
      "FOOFA bought your moment.",
      "Twitter never sleeps.",
      "An Injury Card stops legends.",
      "The Globe Cup awaits, champion.",
    ];
    const tip = Phaser.Utils.Array.GetRandom(tips);
    this.add
      .text(GAME_WIDTH / 2, panelY + 480, tip, {
        fontFamily: "sans-serif",
        fontSize: "16px",
        color: "#a0d0ff",
        fontStyle: "italic",
      })
      .setOrigin(0.5);

    // Keyboard shortcut: ENTER to retry (avoid SPACE which is the in-game jump)
    let canTrigger = false;
    this.time.delayedCall(400, () => {
      canTrigger = true;
    });
    const onEnter = () => {
      if (!canTrigger) return;
      this.scene.start("CupRouteScene", {
        characterId: data.characterId,
        stageId: "group",
        score: 0,
        coins: 0,
        totalDistance: 0,
      });
    };
    this.input.keyboard?.once("keydown-ENTER", onEnter);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.off("keydown-ENTER", onEnter);
    });
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
        fontSize: "26px",
        fontStyle: "bold",
        color: "#0b1020",
      })
      .setOrigin(0.5);

    const zone = this.add
      .zone(cx, cy, w, h)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    zone.on("pointerover", () => draw(Phaser.Display.Color.IntegerToColor(color).brighten(20).color));
    zone.on("pointerout", () => draw(color));
    zone.on("pointerdown", () => {
      this.tweens.add({
        targets: txt,
        scale: 0.9,
        duration: 80,
        yoyo: true,
        onComplete: onClick,
      });
    });
    return { g, txt, zone };
  }
}
