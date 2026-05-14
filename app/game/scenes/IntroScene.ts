import * as Phaser from "phaser";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  GROUND_Y,
  STADIUM_TOP_Y,
  STADIUM_VISIBLE_HEIGHT,
} from "../constants";


export class IntroScene extends Phaser.Scene {
  private skipped = false;

  constructor() {
    super("IntroScene");
  }

  create() {
    this.skipped = false;

    const skyH = STADIUM_TOP_Y;
    const sky = this.add.image(GAME_WIDTH / 2, skyH / 2, "bg-sky");
    sky.setDisplaySize(GAME_WIDTH, skyH);

    const stadium = this.add.tileSprite(
      GAME_WIDTH / 2,
      STADIUM_TOP_Y + STADIUM_VISIBLE_HEIGHT / 2,
      GAME_WIDTH,
      STADIUM_VISIBLE_HEIGHT,
      "bg-stadium"
    );
    stadium.tileScaleY = 1;
    stadium.tilePositionX = 160;

    const ground = this.add.tileSprite(
      GAME_WIDTH / 2,
      GROUND_Y + (GAME_HEIGHT - GROUND_Y) / 2,
      GAME_WIDTH,
      GAME_HEIGHT - GROUND_Y,
      "bg-ground"
    );
    ground.tileScaleY = (GAME_HEIGHT - GROUND_Y) / 200;

    // Subtle gradient at top only for text readability (no full-screen dim)
    const dim = this.add.graphics();
    dim.fillStyle(0x000000, 0.25);
    dim.fillRect(0, 0, GAME_WIDTH, 120);
    dim.fillStyle(0x000000, 0.12);
    dim.fillRect(0, 120, GAME_WIDTH, 80);

    const logo = this.add
      .image(GAME_WIDTH / 2, 115, "logo")
      .setScale(0.48)
      .setAlpha(0);

    const title = this.add
      .text(GAME_WIDTH / 2, 250, "FOOTBALL IS MAD.", {
        fontFamily: "sans-serif",
        fontSize: "64px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#0b1020",
        strokeThickness: 10,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const subtitle = this.add
      .text(GAME_WIDTH / 2, 312, "SURVIVE THE MEMES. CHASE THE HIGH SCORE.", {
        fontFamily: "sans-serif",
        fontSize: "32px",
        fontStyle: "bold",
        color: "#ffd23a",
        stroke: "#0b1020",
        strokeThickness: 7,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    const player = this.add
      .image(-140, GROUND_Y - 8, "player-run1")
      .setOrigin(0.5, 1)
      .setScale(1.18)
      .setDepth(5);
    this.add.ellipse(-140, GROUND_Y - 5, 94, 16, 0x000000, 0.35).setDepth(4);

    const varObs = this.add
      .image(GAME_WIDTH + 160, GROUND_Y, "obs-var")
      .setOrigin(0.5, 1)
      .setScale(0.55)
      .setDepth(5);
    const corruption = this.add
      .image(GAME_WIDTH + 360, GROUND_Y, "obs-corruption")
      .setOrigin(0.5, 1)
      .setScale(0.48)
      .setDepth(5);
    const hate = this.add
      .image(GAME_WIDTH + 560, GROUND_Y, "obs-hate")
      .setOrigin(0.5, 1)
      .setScale(0.62)
      .setDepth(5);
    const trophy = this.add
      .image(GAME_WIDTH + 820, GROUND_Y - 4, "trophy")
      .setOrigin(0.5, 1)
      .setScale(0.7)
      .setDepth(5);

    const speech = this.add.container(335, GROUND_Y - 220).setAlpha(0).setDepth(8);
    const bubble = this.add.image(0, 0, "speech-bubble").setScale(0.66);
    const siuuu = this.add
      .text(0, -10, "SIUUUU!", {
        fontFamily: "sans-serif",
        fontSize: "22px",
        fontStyle: "bold",
        color: "#0b1020",
      })
      .setOrigin(0.5);
    speech.add([bubble, siuuu]);

    let frame = 0;
    this.time.addEvent({
      delay: 105,
      loop: true,
      callback: () => {
        frame = (frame + 1) % 4;
        player.setTexture(`player-run${frame + 1}`);
      },
    });

    this.tweens.add({
      targets: [logo, title, subtitle],
      alpha: 1,
      duration: 700,
      ease: "Sine.out",
    });
    this.tweens.add({
      targets: title,
      y: 232,
      duration: 900,
      ease: "Back.out",
    });
    this.tweens.add({
      targets: subtitle,
      y: 306,
      duration: 900,
      ease: "Back.out",
      delay: 220,
    });
    this.tweens.add({
      targets: [player],
      x: 340,
      duration: 1700,
      ease: "Sine.inOut",
      delay: 900,
      onComplete: () => {
        player.setTexture("player-super");
        this.cameras.main.flash(160, 255, 240, 160);
        this.cameras.main.shake(120, 0.002);
        this.tweens.add({
          targets: speech,
          alpha: 1,
          scale: { from: 0.7, to: 1 },
          duration: 240,
          ease: "Back.out",
        });
      },
    });
    this.tweens.add({
      targets: [varObs, corruption, hate, trophy],
      x: "-=980",
      duration: 3600,
      ease: "Linear",
      delay: 950,
    });
    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 5200,
      onUpdate: (tween) => {
        const v = tween.getValue();
        stadium.tilePositionX = v * 260;
        ground.tilePositionX = v * 850;
      },
      onComplete: () => this.finish(),
    });

    const skip = this.makeButton(
      GAME_WIDTH - 108,
      48,
      150,
      46,
      "SKIP",
      0x1a2348,
      () => this.finish()
    );
    skip.g.setAlpha(0.92);

    this.time.delayedCall(6100, () => this.finish());
    this.input.keyboard?.once("keydown-SPACE", () => this.finish());
    this.input.keyboard?.once("keydown-ENTER", () => this.finish());
  }

  private finish() {
    if (this.skipped) return;
    this.skipped = true;
    this.scene.start("MainMenuScene");
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
      g.fillRoundedRect(cx - w / 2, cy - h / 2, w, h, 10);
      g.lineStyle(2, 0x6a8aff, 0.75);
      g.strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, 10);
    };
    draw(color);

    const txt = this.add
      .text(cx, cy, label, {
        fontFamily: "sans-serif",
        fontSize: "18px",
        fontStyle: "bold",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const zone = this.add
      .zone(cx, cy, w, h)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    zone.on("pointerover", () => draw(0x253a72));
    zone.on("pointerout", () => draw(color));
    zone.on("pointerdown", onClick);

    return { g, txt, zone };
  }
}
