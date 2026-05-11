import * as Phaser from "phaser";
import {
  DAILY_CHALLENGE_TARGET,
  GAME_HEIGHT,
  GAME_WIDTH,
} from "../constants";

export class UIScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;
  private bestText!: Phaser.GameObjects.Text;
  private distText!: Phaser.GameObjects.Text;
  private coinsText!: Phaser.GameObjects.Text;
  private madBar!: Phaser.GameObjects.Graphics;
  private madPct = 0;
  private dailyBar!: Phaser.GameObjects.Graphics;
  private dailyPct = 0;
  private dailyText!: Phaser.GameObjects.Text;
  private surviveBar!: Phaser.GameObjects.Graphics;
  private survivePct = 0;
  private superBtnGlow!: Phaser.GameObjects.Image;
  private superBtnReady = false;
  private routeNodes: Phaser.GameObjects.Graphics[] = [];
  private routeFill!: Phaser.GameObjects.Graphics;
  private routeProgress = 0;
  private shieldInventory = 1;
  private magnetInventory = 2;
  private shieldText!: Phaser.GameObjects.Text;
  private magnetText!: Phaser.GameObjects.Text;

  constructor() {
    super("UIScene");
  }

  create() {
    // ---------- TOP BAR ----------
    // Score panel: subtle gradient strip so HUD text stays readable
    // without darkening the stadium BG too much.
    const topPanel = this.add.graphics();
    topPanel.fillStyle(0x000000, 0.35);
    topPanel.fillRect(0, 0, GAME_WIDTH, 22);
    topPanel.fillStyle(0x000000, 0.22);
    topPanel.fillRect(0, 22, GAME_WIDTH, 60);
    topPanel.fillStyle(0x000000, 0.0);
    topPanel.fillRect(0, 82, GAME_WIDTH, 28);

    // Logo small (top-left)
    this.add.image(110, 60, "logo").setScale(0.32).setOrigin(0.5);

    // Score
    this.add.text(280, 16, "SCORE", {
      fontFamily: "sans-serif",
      fontSize: "16px",
      color: "#ffd23a",
      fontStyle: "bold",
    });
    this.scoreText = this.add.text(280, 36, "0", {
      fontFamily: "sans-serif",
      fontSize: "34px",
      color: "#ffffff",
      fontStyle: "bold",
    });
    const bestInit = Math.floor(Number(localStorage.getItem("fmr-best") ?? 0));
    this.bestText = this.add.text(280, 78, `BEST: ${bestInit.toLocaleString("en-US")}`, {
      fontFamily: "sans-serif",
      fontSize: "14px",
      color: "#a0d0ff",
      fontStyle: "bold",
    });

    // Event panel (route)
    this.add
      .text(GAME_WIDTH / 2, 12, "EVENT: WORLD CUP ROUTE", {
        fontFamily: "sans-serif",
        fontSize: "16px",
        color: "#ffd23a",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);

    // Route line
    const routeStartX = GAME_WIDTH / 2 - 200;
    const routeEndX = GAME_WIDTH / 2 + 200;
    const routeY = 44;
    const routeLine = this.add.graphics();
    routeLine.lineStyle(4, 0xffd23a, 0.7);
    routeLine.lineBetween(routeStartX + 6, routeY, routeEndX - 6, routeY);

    this.routeFill = this.add.graphics();

    const checkpoints = 6;
    for (let i = 0; i < checkpoints; i++) {
      const cx = routeStartX + (i / (checkpoints - 1)) * (routeEndX - routeStartX);
      const g = this.add.graphics();
      const isFirst = i === 0;
      const isLast = i === checkpoints - 1;
      g.fillStyle(0x0b1020, 1);
      g.fillCircle(cx, routeY, 12);
      g.lineStyle(2, 0xffd23a, 0.8);
      g.strokeCircle(cx, routeY, 12);
      if (isFirst) {
        // Runner icon
        g.fillStyle(0x32d264, 1);
        g.fillCircle(cx, routeY, 8);
      } else if (isLast) {
        g.fillStyle(0xffd23a, 1);
        g.fillCircle(cx, routeY, 8);
      }
      this.routeNodes.push(g);
    }
    // Distance text under route
    this.add
      .text(GAME_WIDTH / 2, 64, "DISTANCE", {
        fontFamily: "sans-serif",
        fontSize: "12px",
        color: "#a0d0ff",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);
    this.distText = this.add
      .text(GAME_WIDTH / 2, 80, "0M", {
        fontFamily: "sans-serif",
        fontSize: "26px",
        color: "#ffd23a",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);

    // Coins (top-right)
    const coinIcon = this.add.image(GAME_WIDTH - 240, 36, "coin-0").setScale(0.5);
    this.tweens.add({
      targets: coinIcon,
      scaleX: 0.1,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
    this.coinsText = this.add
      .text(GAME_WIDTH - 220, 24, "0", {
        fontFamily: "sans-serif",
        fontSize: "26px",
        color: "#ffd23a",
        fontStyle: "bold",
      })
      .setOrigin(0, 0);

    // Pause button (cosmetic for now)
    const pauseBtn = this.add.graphics();
    pauseBtn.fillStyle(0x0c1432, 0.85);
    pauseBtn.fillRoundedRect(GAME_WIDTH - 80, 16, 60, 50, 10);
    pauseBtn.lineStyle(2, 0x6a8aff, 0.6);
    pauseBtn.strokeRoundedRect(GAME_WIDTH - 80, 16, 60, 50, 10);
    this.add.rectangle(GAME_WIDTH - 56, 41, 6, 22, 0xffffff);
    this.add.rectangle(GAME_WIDTH - 44, 41, 6, 22, 0xffffff);
    this.add
      .zone(GAME_WIDTH - 50, 41, 60, 50)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        if (this.scene.isPaused("GameScene")) {
          this.scene.resume("GameScene");
        } else {
          this.scene.pause("GameScene");
        }
      });

    // Survive the Madness bar (top right area)
    const surviveX = GAME_WIDTH - 320;
    const surviveY = 80;
    this.add.text(surviveX, surviveY - 18, "SURVIVE THE MADNESS", {
      fontFamily: "sans-serif",
      fontSize: "12px",
      color: "#a0d0ff",
      fontStyle: "bold",
    });
    const surviveBg = this.add.graphics();
    surviveBg.fillStyle(0x0c1432, 0.9);
    surviveBg.fillRoundedRect(surviveX, surviveY, 220, 14, 6);
    surviveBg.lineStyle(1, 0x6a8aff, 0.5);
    surviveBg.strokeRoundedRect(surviveX, surviveY, 220, 14, 6);
    this.surviveBar = this.add.graphics();

    // ---------- BOTTOM BAR ----------
    const bottomY = GAME_HEIGHT - 100;
    const bottomPanel = this.add.graphics();
    bottomPanel.fillStyle(0x000000, 0.55);
    bottomPanel.fillRect(0, bottomY, GAME_WIDTH, 100);

    // Slide button
    const slideBtn = this.add
      .image(80, bottomY + 50, "btn-slide")
      .setScale(0.85)
      .setInteractive({ useHandCursor: true });
    this.add
      .text(80, bottomY + 95, "SLIDE", {
        fontFamily: "sans-serif",
        fontSize: "14px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.bindButton(slideBtn, () => this.game.events.emit("ui:slide"));

    // Jump button
    const jumpBtn = this.add
      .image(180, bottomY + 50, "btn-jump")
      .setScale(0.85)
      .setInteractive({ useHandCursor: true });
    this.add
      .text(180, bottomY + 95, "JUMP", {
        fontFamily: "sans-serif",
        fontSize: "14px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.bindButton(jumpBtn, () => this.game.events.emit("ui:jump"));

    // Daily Challenge panel
    const dcX = 250;
    const dcW = 280;
    const dcPanel = this.add.image(dcX + dcW / 2, bottomY + 50, "panel");
    dcPanel.setDisplaySize(dcW, 86);

    // Calendar icon
    const calG = this.add.graphics();
    calG.fillStyle(0xffffff, 1);
    calG.fillRoundedRect(dcX + 12, bottomY + 18, 36, 40, 4);
    calG.fillStyle(0xff3845, 1);
    calG.fillRect(dcX + 12, bottomY + 18, 36, 14);
    calG.fillStyle(0x0b1020, 1);
    calG.fillRect(dcX + 18, bottomY + 14, 4, 8);
    calG.fillRect(dcX + 38, bottomY + 14, 4, 8);
    this.add
      .text(dcX + 30, bottomY + 44, "7", {
        fontFamily: "sans-serif",
        fontSize: "20px",
        fontStyle: "bold",
        color: "#0b1020",
      })
      .setOrigin(0.5);

    this.add.text(dcX + 60, bottomY + 14, "DAILY CHALLENGE", {
      fontFamily: "sans-serif",
      fontSize: "12px",
      color: "#ffd23a",
      fontStyle: "bold",
    });
    this.add.text(dcX + 60, bottomY + 30, "Survive 1000m", {
      fontFamily: "sans-serif",
      fontSize: "12px",
      color: "#ffffff",
    });
    this.add.text(dcX + 60, bottomY + 44, "without hitting VAR", {
      fontFamily: "sans-serif",
      fontSize: "12px",
      color: "#ffffff",
    });
    // Reward
    this.add.image(dcX + 200, bottomY + 38, "coin-0").setScale(0.4);
    this.add.text(dcX + 215, bottomY + 30, "500", {
      fontFamily: "sans-serif",
      fontSize: "16px",
      color: "#ffd23a",
      fontStyle: "bold",
    });

    const dailyBarBg = this.add.graphics();
    dailyBarBg.fillStyle(0x000000, 0.6);
    dailyBarBg.fillRoundedRect(dcX + 12, bottomY + 70, dcW - 30, 8, 4);
    this.dailyBar = this.add.graphics();
    this.dailyText = this.add
      .text(dcX + dcW - 14, bottomY + 71, "0/1000", {
        fontFamily: "sans-serif",
        fontSize: "10px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(1, 0);

    // Mad Meter
    const mmX = 560;
    const mmW = 200;
    const mmPanel = this.add.image(mmX + mmW / 2, bottomY + 50, "panel");
    mmPanel.setDisplaySize(mmW, 86);
    this.add
      .text(mmX + mmW / 2, bottomY + 16, "MAD METER", {
        fontFamily: "sans-serif",
        fontSize: "14px",
        color: "#32d264",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);
    const mmBgG = this.add.graphics();
    mmBgG.fillStyle(0x000000, 0.6);
    mmBgG.fillRoundedRect(mmX + 14, bottomY + 38, mmW - 60, 20, 4);
    this.madBar = this.add.graphics();
    // Player face avatar at right of bar
    const avatarG = this.add.graphics();
    avatarG.fillStyle(0xf2c4a0, 1);
    avatarG.fillCircle(mmX + mmW - 26, bottomY + 48, 14);
    avatarG.fillStyle(0x2a1a0c, 1);
    avatarG.beginPath();
    avatarG.arc(mmX + mmW - 26, bottomY + 38, 14, Math.PI, 0);
    avatarG.fillPath();
    avatarG.fillStyle(0x0b1020, 1);
    avatarG.fillCircle(mmX + mmW - 30, bottomY + 48, 1.6);
    avatarG.fillCircle(mmX + mmW - 22, bottomY + 48, 1.6);

    this.add
      .text(mmX + mmW / 2 - 22, bottomY + 70, "Coins fill the meter", {
        fontFamily: "sans-serif",
        fontSize: "10px",
        color: "#a0d0ff",
      })
      .setOrigin(0.5, 0);

    // Boosts
    const boostsX = 800;
    const boostsW = 140;
    const boostsPanel = this.add.image(boostsX + boostsW / 2, bottomY + 50, "panel");
    boostsPanel.setDisplaySize(boostsW, 86);
    this.add
      .text(boostsX + boostsW / 2, bottomY + 16, "BOOSTS", {
        fontFamily: "sans-serif",
        fontSize: "14px",
        color: "#a0d0ff",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);
    const magnetBtn = this.add
      .image(boostsX + 38, bottomY + 56, "boost-magnet")
      .setScale(0.7)
      .setInteractive({ useHandCursor: true });
    this.magnetText = this.add
      .text(boostsX + 50, bottomY + 70, "2", {
        fontFamily: "sans-serif",
        fontSize: "12px",
        fontStyle: "bold",
        color: "#0b1020",
        backgroundColor: "#ffd23a",
        padding: { x: 4, y: 1 },
      })
      .setOrigin(0.5);
    this.bindButton(magnetBtn, () => this.useMagnet());

    const shieldBtn = this.add
      .image(boostsX + 100, bottomY + 56, "boost-shield")
      .setScale(0.7)
      .setInteractive({ useHandCursor: true });
    this.shieldText = this.add
      .text(boostsX + 112, bottomY + 70, "1", {
        fontFamily: "sans-serif",
        fontSize: "12px",
        fontStyle: "bold",
        color: "#0b1020",
        backgroundColor: "#ffd23a",
        padding: { x: 4, y: 1 },
      })
      .setOrigin(0.5);
    this.bindButton(shieldBtn, () => this.useShield());

    // SUPER button
    this.superBtnGlow = this.add
      .image(GAME_WIDTH - 110, bottomY + 50, "btn-super")
      .setScale(1)
      .setInteractive({ useHandCursor: true });
    this.add
      .text(GAME_WIDTH - 110, bottomY + 88, "SUPER", {
        fontFamily: "sans-serif",
        fontSize: "16px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.add
      .text(GAME_WIDTH - 110, bottomY + 105, "HOLD TO RUN", {
        fontFamily: "sans-serif",
        fontSize: "10px",
        color: "#a0d0ff",
      })
      .setOrigin(0.5);

    this.bindButton(this.superBtnGlow, () => this.game.events.emit("ui:super"));

    // ---------- HUD events ----------
    this.game.events.on(
      "hud:score",
      (score: number, best: number) => {
        this.scoreText.setText(Math.floor(score).toLocaleString("en-US"));
        this.bestText.setText(`BEST: ${Math.floor(best).toLocaleString("en-US")}`);
      },
      this
    );
    this.game.events.on(
      "hud:distance",
      (m: number) => {
        this.distText.setText(`${Math.floor(m)}M`);
        this.routeProgress = Math.min(1, m / 2000);
        this.survivePct = Math.min(1, m / 2000);
        this.redrawProgress();
      },
      this
    );
    this.game.events.on(
      "hud:coins",
      (coins: number) => {
        this.coinsText.setText(coins.toString());
      },
      this
    );
    this.game.events.on(
      "hud:mad",
      (pct: number) => {
        this.madPct = pct;
        this.redrawMad(mmX, bottomY, mmW);
        const wasReady = this.superBtnReady;
        this.superBtnReady = pct >= 100;
        if (this.superBtnReady && !wasReady) {
          this.tweens.add({
            targets: this.superBtnGlow,
            scale: { from: 1.0, to: 1.12 },
            duration: 380,
            yoyo: true,
            repeat: -1,
            ease: "Sine.inOut",
          });
        } else if (!this.superBtnReady && wasReady) {
          this.tweens.killTweensOf(this.superBtnGlow);
          this.superBtnGlow.setScale(1);
        }
      },
      this
    );
    this.game.events.on(
      "hud:daily",
      (val: number) => {
        const v = Math.min(DAILY_CHALLENGE_TARGET, val);
        this.dailyPct = v / DAILY_CHALLENGE_TARGET;
        this.dailyText.setText(`${v}/${DAILY_CHALLENGE_TARGET}`);
        this.redrawProgress();
      },
      this
    );
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.removeAllListeners("hud:score");
      this.game.events.removeAllListeners("hud:distance");
      this.game.events.removeAllListeners("hud:coins");
      this.game.events.removeAllListeners("hud:mad");
      this.game.events.removeAllListeners("hud:daily");
    });

    // Initial draws
    this.redrawMad(mmX, bottomY, mmW);
    this.redrawProgress();
  }

  private redrawMad(mmX: number, bottomY: number, mmW: number) {
    this.madBar.clear();
    const w = (mmW - 60) * (this.madPct / 100);
    if (w > 0) {
      // segmented gradient effect
      const segments = 16;
      const segW = (mmW - 60) / segments;
      const filled = Math.floor((mmW - 60 - segW) * (this.madPct / 100) / segW) + 1;
      for (let i = 0; i < filled; i++) {
        const ratio = i / segments;
        let color = 0x32d264;
        if (ratio > 0.6) color = 0xffd23a;
        if (ratio > 0.85) color = 0xff3845;
        this.madBar.fillStyle(color, 1);
        this.madBar.fillRoundedRect(
          mmX + 16 + i * segW,
          bottomY + 40,
          segW - 2,
          16,
          2
        );
      }
    }
  }

  private redrawProgress() {
    // Survive bar
    this.surviveBar.clear();
    const surviveX = GAME_WIDTH - 320;
    const surviveY = 80;
    const w = 220 * this.survivePct;
    if (w > 0) {
      this.surviveBar.fillStyle(0xffd23a, 1);
      this.surviveBar.fillRoundedRect(surviveX + 2, surviveY + 2, w - 4, 10, 4);
    }
    this.add
      .text(surviveX + 220 - 6, surviveY - 1, `${Math.floor(this.survivePct * 100)}%`, {
        fontFamily: "sans-serif",
        fontSize: "10px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(1, 0)
      .setName("survivePct")
      .setDepth(20);
    // Remove old
    const old = this.children.getByName("survivePctOld");
    if (old) old.destroy();

    // Daily bar
    this.dailyBar.clear();
    const dcX = 250;
    const dcW = 280;
    const bottomY = GAME_HEIGHT - 100;
    const dcBarW = (dcW - 30) * this.dailyPct;
    if (dcBarW > 0) {
      this.dailyBar.fillStyle(0x32d264, 1);
      this.dailyBar.fillRoundedRect(dcX + 12, bottomY + 70, dcBarW, 8, 4);
    }

    // Route fill
    this.routeFill.clear();
    const routeStartX = GAME_WIDTH / 2 - 200;
    const routeEndX = GAME_WIDTH / 2 + 200;
    const fillW = (routeEndX - routeStartX) * this.routeProgress;
    this.routeFill.fillStyle(0xffd23a, 1);
    this.routeFill.fillRect(routeStartX, 42, fillW, 4);
  }

  private bindButton(
    obj: Phaser.GameObjects.Image,
    cb: () => void
  ) {
    obj.on("pointerdown", () => {
      this.tweens.add({
        targets: obj,
        scale: obj.scale * 0.9,
        duration: 80,
        yoyo: true,
      });
      cb();
    });
  }

  private useMagnet() {
    if (this.magnetInventory <= 0) return;
    this.magnetInventory--;
    this.magnetText.setText(this.magnetInventory.toString());
    this.game.events.emit("ui:magnet", 6000);
  }

  private useShield() {
    if (this.shieldInventory <= 0) return;
    this.shieldInventory--;
    this.shieldText.setText(this.shieldInventory.toString());
    this.game.events.emit("ui:grant-shield");
  }
}
