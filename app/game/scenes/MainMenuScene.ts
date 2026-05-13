import * as Phaser from "phaser";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  GROUND_Y,
  STADIUM_TOP_Y,
  STADIUM_VISIBLE_HEIGHT,
} from "../constants";
import { addCleanCrowdBand } from "../visuals/stadiumBand";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  create() {
    const skyH = STADIUM_TOP_Y;
    const sky = this.add.image(GAME_WIDTH / 2, skyH / 2, "bg-sky");
    sky.setDisplaySize(GAME_WIDTH, skyH);

    const stadiumTop = STADIUM_TOP_Y;
    const stadiumH = STADIUM_VISIBLE_HEIGHT;
    const stadium = this.add.tileSprite(
      GAME_WIDTH / 2,
      stadiumTop + stadiumH / 2,
      GAME_WIDTH,
      stadiumH,
      "bg-stadium"
    );
    stadium.tilePositionX = 160;
    addCleanCrowdBand(this);

    const groundH = GAME_HEIGHT - GROUND_Y;
    const ground = this.add.tileSprite(
      GAME_WIDTH / 2,
      GROUND_Y + groundH / 2,
      GAME_WIDTH,
      groundH,
      "bg-ground"
    );
    ground.tileScaleY = groundH / 200;

    const logo = this.add.image(GAME_WIDTH / 2, 105, "logo").setScale(0.58);
    this.tweens.add({
      targets: logo,
      y: 102,
      duration: 1400,
      ease: "Sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    this.add.ellipse(200, GROUND_Y - 4, 110, 18, 0x000000, 0.32).setDepth(1);
    const player = this.add
      .image(200, GROUND_Y, "player-run1")
      .setOrigin(0.5, 1)
      .setScale(1.25)
      .setDepth(2);
    let frame = 0;
    this.time.addEvent({
      delay: 110,
      loop: true,
      callback: () => {
        frame = (frame + 1) % 4;
        player.setTexture(`player-run${frame + 1}`);
      },
    });

    const bubble = this.add
      .image(player.x + 40, player.y - 300, "speech-bubble")
      .setScale(0.8);
    const siuu = this.add
      .text(bubble.x, bubble.y - 14, "SIUUUU!", {
        fontFamily: "sans-serif",
        fontSize: "24px",
        fontStyle: "bold",
        color: "#0b1020",
      })
      .setOrigin(0.5);
    this.tweens.add({
      targets: [bubble, siuu],
      scale: { from: 0.95, to: 1.05 },
      duration: 600,
      ease: "Sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    const trophy = this.add
      .image(GAME_WIDTH - 170, GROUND_Y - 8, "trophy")
      .setOrigin(0.5, 1)
      .setScale(0.85);
    this.tweens.add({
      targets: trophy,
      y: trophy.y - 14,
      duration: 1200,
      ease: "Sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    this.add
      .text(GAME_WIDTH / 2, 230, "Run forever, dodge the madness, unleash your legend.", {
        fontFamily: "sans-serif",
        fontSize: "26px",
        color: "#fff8e0",
        fontStyle: "italic",
      })
      .setOrigin(0.5);

    const best = Number(localStorage.getItem("fmr-best") ?? 0);
    this.add
      .text(GAME_WIDTH / 2, 268, `BEST: ${best.toLocaleString("en-US")}`, {
        fontFamily: "sans-serif",
        fontSize: "22px",
        color: "#ffd23a",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const panelX = GAME_WIDTH / 2 - 280;
    const panelY = 305;
    const panel = this.add.graphics();
    panel.fillStyle(0x0c1432, 0.85);
    panel.fillRoundedRect(panelX, panelY, 560, 130, 12);
    panel.lineStyle(2, 0x6a8aff, 0.6);
    panel.strokeRoundedRect(panelX, panelY, 560, 130, 12);

    this.add
      .text(panelX + 280, panelY + 18, "HOW TO PLAY", {
        fontFamily: "sans-serif",
        fontSize: "20px",
        fontStyle: "bold",
        color: "#ffd23a",
      })
      .setOrigin(0.5, 0);

    const lines = [
      "Pick a legend with a unique Super skill",
      "Jump, slide, collect coins, fill the Mad Meter",
      "Use Super to destroy chaos and chase the high score",
    ];
    lines.forEach((line, i) => {
      this.add.text(panelX + 24, panelY + 50 + i * 22, line, {
        fontFamily: "sans-serif",
        fontSize: "16px",
        color: "#ffffff",
      });
    });

    const startBtnX = GAME_WIDTH / 2;
    const startBtnY = 495;
    const startBg = this.add.graphics();
    const drawStart = (color: number) => {
      startBg.clear();
      startBg.fillStyle(color, 1);
      startBg.fillRoundedRect(startBtnX - 130, startBtnY - 36, 260, 72, 16);
      startBg.lineStyle(4, 0x0b1020, 1);
      startBg.strokeRoundedRect(startBtnX - 130, startBtnY - 36, 260, 72, 16);
    };
    drawStart(0x32d264);
    const startTxt = this.add
      .text(startBtnX, startBtnY, "START RUN", {
        fontFamily: "sans-serif",
        fontSize: "36px",
        fontStyle: "bold",
        color: "#0b1020",
      })
      .setOrigin(0.5);

    const hit = this.add
      .zone(startBtnX, startBtnY, 260, 72)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    hit.on("pointerover", () => drawStart(0x4eea84));
    hit.on("pointerout", () => drawStart(0x32d264));
    hit.on("pointerdown", () => {
      drawStart(0x1ea24b);
      this.tweens.add({
        targets: startTxt,
        scale: 0.92,
        duration: 80,
        yoyo: true,
        onComplete: () => this.startGame(),
      });
    });

    const onEnter = () => this.startGame();
    if (this.input && this.input.keyboard) {
      this.input.keyboard.once("keydown-ENTER", onEnter);
    }
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.off("keydown-ENTER", onEnter);
    });

    const coinPositions = [
      { x: 80, y: 200 },
      { x: GAME_WIDTH - 80, y: 200 },
      { x: 80, y: 380 },
      { x: GAME_WIDTH - 80, y: 380 },
      { x: 70, y: 110 },
      { x: GAME_WIDTH - 70, y: 110 },
    ];
    for (const pos of coinPositions) {
      const c = this.add.image(pos.x, pos.y, "coin-0");
      c.setScale(0.32).setAlpha(0.5);
      this.tweens.add({
        targets: c,
        y: c.y - 14,
        duration: Phaser.Math.Between(900, 1600),
        ease: "Sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      this.time.addEvent({
        delay: 80,
        loop: true,
        callback: () => {
          const f = Math.floor(this.time.now / 110) % 6;
          c.setTexture(`coin-${f}`);
        },
      });
    }

    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 6000,
      repeat: -1,
      onUpdate: (tween) => {
        ground.tilePositionX = tween.getValue() * 680;
      },
    });
  }

  private startGame() {
    this.scene.start("CharacterSelectScene");
  }
}
