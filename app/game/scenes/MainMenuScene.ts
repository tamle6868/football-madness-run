import * as Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, GROUND_Y } from "../constants";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  create() {
    // Stadium covers full play area; sky tucks under top edge as a fade.
    const sky = this.add.image(GAME_WIDTH / 2, 80, "bg-sky");
    sky.setDisplaySize(GAME_WIDTH, 160);

    const stadiumTop = 0;
    const stadiumH = GROUND_Y - stadiumTop;
    const stadium = this.add.image(
      GAME_WIDTH / 2,
      stadiumTop + stadiumH / 2,
      "bg-stadium"
    );
    stadium.setDisplaySize(GAME_WIDTH, stadiumH);

    const groundH = GAME_HEIGHT - GROUND_Y;
    const ground = this.add.tileSprite(
      GAME_WIDTH / 2,
      GROUND_Y + groundH / 2,
      GAME_WIDTH,
      groundH,
      "bg-ground"
    );
    ground.tileScaleY = groundH / 96;

    // Logo
    const logo = this.add.image(GAME_WIDTH / 2, 110, "logo").setScale(0.65);
    this.tweens.add({
      targets: logo,
      y: 102,
      duration: 1400,
      ease: "Sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Player demo running in place — anchored bottom-left next to ground
    const player = this.add
      .image(200, GROUND_Y, "player-run1")
      .setOrigin(0.5, 1)
      .setScale(1.25);
    let frame = 0;
    this.time.addEvent({
      delay: 110,
      loop: true,
      callback: () => {
        frame = (frame + 1) % 4;
        player.setTexture(`player-run${frame + 1}`);
      },
    });

    // Speech bubble — kept left of the instructions so the menu stays readable.
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

    // Trophy demo
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

    // Title subline
    this.add
      .text(GAME_WIDTH / 2, 230, "Run, dodge VAR, lift the Globe Cup.", {
        fontFamily: "sans-serif",
        fontSize: "26px",
        color: "#fff8e0",
        fontStyle: "italic",
      })
      .setOrigin(0.5);

    // Best Score
    const best = Number(localStorage.getItem("fmr-best") ?? 0);
    this.add
      .text(GAME_WIDTH / 2, 268, `BEST: ${best.toLocaleString("en-US")}`, {
        fontFamily: "sans-serif",
        fontSize: "22px",
        color: "#ffd23a",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // How To Play panel
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
      "SPACE / ↑ / TAP JUMP — Jump over obstacles",
      "S / ↓ / TAP SLIDE — Slide under hate",
      "E / HOLD SUPER — SIUUU ultimate (when meter is full)",
    ];
    lines.forEach((line, i) => {
      this.add.text(panelX + 24, panelY + 50 + i * 22, line, {
        fontFamily: "sans-serif",
        fontSize: "16px",
        color: "#ffffff",
      });
    });

    // Start button
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
      .text(startBtnX, startBtnY, "START", {
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

    // ENTER also starts (avoid SPACE because it conflicts with in-game jump)
    const onEnter = () => this.startGame();
    if (this.input && this.input.keyboard) {
      this.input.keyboard.once("keydown-ENTER", onEnter);
    }
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.off("keydown-ENTER", onEnter);
    });

    // Subtle floating coins (in side gutters, not overlapping center panel)
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

    // Animate ground
    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 6000,
      repeat: -1,
      onUpdate: (tween) => {
        ground.tilePositionX = tween.getValue() * 1280;
      },
    });
  }

  private startGame() {
    this.scene.start("GameScene");
    this.scene.launch("UIScene");
  }
}
