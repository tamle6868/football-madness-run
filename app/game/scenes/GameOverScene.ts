import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants";
import type { CharacterId } from "../config/characters";

interface GameOverData {
  characterId?: CharacterId;
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
    // ── Dim overlay ─────────────────────────────────────────────
    const dim = this.add.graphics();
    dim.fillStyle(0x000000, 0.72);
    dim.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // ── Modal dimensions (centered, safe margins) ────────────────
    const MODAL_W = 660;
    const MODAL_H = 500;
    const panelX = GAME_WIDTH / 2 - MODAL_W / 2;
    const panelY = GAME_HEIGHT / 2 - MODAL_H / 2;

    // Drop shadow
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.4);
    shadow.fillRoundedRect(panelX + 8, panelY + 8, MODAL_W, MODAL_H, 22);

    // Panel body
    const panel = this.add.graphics();
    panel.fillStyle(0x0c1432, 0.97);
    panel.fillRoundedRect(panelX, panelY, MODAL_W, MODAL_H, 22);
    panel.lineStyle(3, 0xffd23a, 0.85);
    panel.strokeRoundedRect(panelX, panelY, MODAL_W, MODAL_H, 22);

    // Header bar
    const HDR_H = 72;
    const hdr = this.add.graphics();
    hdr.fillStyle(0xff3845, 1);
    hdr.fillRoundedRect(panelX, panelY, MODAL_W, HDR_H, { tl: 22, tr: 22, bl: 0, br: 0 });

    this.add
      .text(GAME_WIDTH / 2, panelY + HDR_H / 2, "GAME OVER", {
        fontFamily: "sans-serif",
        fontSize: "46px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#0b1020",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // ── NEW BEST badge ───────────────────────────────────────────
    const isNewBest = data.score >= data.best && data.score > 0;
    if (isNewBest) {
      const badgeG = this.add.graphics();
      badgeG.fillStyle(0xffd23a, 1);
      badgeG.fillRoundedRect(GAME_WIDTH / 2 - 120, panelY + HDR_H + 10, 240, 34, 8);
      this.add
        .text(GAME_WIDTH / 2, panelY + HDR_H + 27, "\uD83C\uDFC6 NEW BEST SCORE!", {
          fontFamily: "sans-serif",
          fontSize: "17px",
          fontStyle: "bold",
          color: "#0b1020",
        })
        .setOrigin(0.5);
    }

    // ── Stats cards ──────────────────────────────────────────────
    const CARD_W = 180;
    const CARD_H = 96;
    const CARD_GAP = 18;
    const CARD_TOP = panelY + HDR_H + (isNewBest ? 58 : 22);

    const stats = [
      { label: "DISTANCE", value: `${data.distance}M`, color: "#a0d0ff" },
      { label: "SCORE",    value: Math.floor(data.score).toLocaleString("en-US"), color: "#ffd23a" },
      { label: "COINS",    value: data.coins.toString(), color: "#32d264" },
    ];
    const totalCardsW = stats.length * CARD_W + (stats.length - 1) * CARD_GAP;
    const cardsStartX = GAME_WIDTH / 2 - totalCardsW / 2;

    stats.forEach((s, i) => {
      const cx = cardsStartX + i * (CARD_W + CARD_GAP);
      const card = this.add.graphics();
      card.fillStyle(0x1a2348, 1);
      card.fillRoundedRect(cx, CARD_TOP, CARD_W, CARD_H, 12);
      card.lineStyle(2, 0x6a8aff, 0.45);
      card.strokeRoundedRect(cx, CARD_TOP, CARD_W, CARD_H, 12);

      this.add
        .text(cx + CARD_W / 2, CARD_TOP + 18, s.label, {
          fontFamily: "sans-serif",
          fontSize: "14px",
          color: "#a0d0ff",
          fontStyle: "bold",
        })
        .setOrigin(0.5);

      this.add
        .text(cx + CARD_W / 2, CARD_TOP + 60, s.value, {
          fontFamily: "sans-serif",
          fontSize: "30px",
          color: s.color,
          fontStyle: "bold",
        })
        .setOrigin(0.5);
    });

    // ── Best score ───────────────────────────────────────────────
    const bestY = CARD_TOP + CARD_H + 20;
    this.add
      .text(GAME_WIDTH / 2, bestY, `BEST: ${Math.floor(data.best).toLocaleString("en-US")}`, {
        fontFamily: "sans-serif",
        fontSize: "22px",
        color: "#ffd23a",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // ── Divider ──────────────────────────────────────────────────
    const divY = bestY + 36;
    const divLine = this.add.graphics();
    divLine.lineStyle(1, 0x6a8aff, 0.3);
    divLine.lineBetween(panelX + 40, divY, panelX + MODAL_W - 40, divY);

    // ── Tip ──────────────────────────────────────────────────────
    const tips = [
      "So close! Try again.",
      "Almost had it.",
      "The high score is waiting.",
      "One more run.",
      "Beat your best.",
    ];
    this.add
      .text(GAME_WIDTH / 2, divY + 18, Phaser.Utils.Array.GetRandom(tips), {
        fontFamily: "sans-serif",
        fontSize: "15px",
        color: "#a0d0ff",
        fontStyle: "italic",
      })
      .setOrigin(0.5);

    // ── Buttons: always pinned to bottom with 24px margin ────────
    const BTN_H = 56;
    const BTN_W_RETRY = 230;
    const BTN_W_MENU  = 200;
    const BTN_GAP = 20;
    const totalBtnW = BTN_W_RETRY + BTN_GAP + BTN_W_MENU;
    const btnRowLeft = GAME_WIDTH / 2 - totalBtnW / 2;
    const btnCY = panelY + MODAL_H - BTN_H / 2 - 22;

    this.makeButton(
      btnRowLeft + BTN_W_RETRY / 2,
      btnCY,
      BTN_W_RETRY,
      BTN_H,
      "RETRY",
      0x32d264,
      () => {
        this.scene.start("GameScene", { characterId: data.characterId });
        this.scene.launch("UIScene");
      }
    );

    this.makeButton(
      btnRowLeft + BTN_W_RETRY + BTN_GAP + BTN_W_MENU / 2,
      btnCY,
      BTN_W_MENU,
      BTN_H,
      "MAIN MENU",
      0x1d56c2,
      () => {
        this.scene.start("MainMenuScene");
      }
    );

    // ── Fade-in entrance ─────────────────────────────────────────
    const modalObjs = this.children.list.filter((o) => o !== dim);
    for (const o of modalObjs) {
      const alphaObj = o as unknown as Phaser.GameObjects.Components.Alpha;
      if (typeof alphaObj.setAlpha === "function") {
        alphaObj.setAlpha(0);
      }
    }
    this.tweens.add({
      targets: modalObjs as Phaser.GameObjects.GameObject[],
      alpha: 1,
      duration: 280,
      ease: "Sine.easeOut",
    });

    // ── Keyboard: ENTER = retry ──────────────────────────────────
    let canTrigger = false;
    this.time.delayedCall(500, () => { canTrigger = true; });
    const onEnter = () => {
      if (!canTrigger) return;
      this.scene.start("GameScene", { characterId: data.characterId });
      this.scene.launch("UIScene");
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
      g.lineStyle(2, 0x0b1020, 0.5);
      g.strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, 14);
    };
    draw(color);

    const txt = this.add
      .text(cx, cy, label, {
        fontFamily: "sans-serif",
        fontSize: "24px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#0b1020",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    const zone = this.add
      .zone(cx, cy, w, h)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    zone.on("pointerover", () =>
      draw(Phaser.Display.Color.IntegerToColor(color).brighten(25).color)
    );
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
