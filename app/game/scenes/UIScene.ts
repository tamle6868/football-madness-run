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
  private superBtnGlow!: Phaser.GameObjects.Image;
  private superBtnReady = false;
  private routeNodes: Phaser.GameObjects.Graphics[] = [];
  private routeFill!: Phaser.GameObjects.Graphics;
  private routeProgress = 0;
  private shieldInventory = 1;
  private magnetInventory = 2;
  private shieldText!: Phaser.GameObjects.Text;
  private magnetText!: Phaser.GameObjects.Text;
  private dailyBarX = 0;
  private dailyBarY = 0;
  private dailyBarW = 0;
  private surviveBar!: Phaser.GameObjects.Graphics;
  private surviveBarX = 0;
  private surviveBarW = 0;
  private surviveText!: Phaser.GameObjects.Text;
  private survivePct = 0;

  constructor() {
    super("UIScene");
  }

  create() {
    // ---------- TOP BAR ----------
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

    const checkpoints = 5;
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
        g.fillStyle(0x32d264, 1);
        g.fillCircle(cx, routeY, 8);
        this.drawRouteIcon(g, cx, routeY, "runner");
      } else if (isLast) {
        g.fillStyle(0xffd23a, 1);
        g.fillCircle(cx, routeY, 8);
        this.drawRouteIcon(g, cx, routeY, "trophy");
      } else if (i === 2) {
        this.drawRouteIcon(g, cx, routeY, "ball");
      } else {
        this.drawRouteIcon(g, cx, routeY, "coin");
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
    this.time.addEvent({
      delay: 110,
      loop: true,
      callback: () => {
        const f = Math.floor(this.time.now / 110) % 6;
        coinIcon.setTexture(`coin-${f}`);
      },
    });
    this.coinsText = this.add
      .text(GAME_WIDTH - 220, 24, "0", {
        fontFamily: "sans-serif",
        fontSize: "26px",
        color: "#ffd23a",
        fontStyle: "bold",
      })
      .setOrigin(0, 0);

    // Pause button
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

    // ---------- "SURVIVE THE MADNESS" panel (top-right, before pause) ----------
    const survPanelX = GAME_WIDTH - 260;
    const survPanelW = 160;
    const survPanel = this.add.graphics();
    survPanel.fillStyle(0x0c1432, 0.85);
    survPanel.fillRoundedRect(survPanelX, 14, survPanelW, 52, 8);
    survPanel.lineStyle(2, 0x6a8aff, 0.4);
    survPanel.strokeRoundedRect(survPanelX, 14, survPanelW, 52, 8);
    this.add
      .text(survPanelX + survPanelW / 2, 22, "SURVIVE THE MADNESS", {
        fontFamily: "sans-serif",
        fontSize: "10px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);
    const survBarX = survPanelX + 12;
    const survBarW = survPanelW - 24;
    survPanel.fillStyle(0x000000, 0.6);
    survPanel.fillRoundedRect(survBarX, 40, survBarW, 10, 4);
    this.surviveBar = this.add.graphics();
    this.surviveBarX = survBarX;
    this.surviveBarW = survBarW;
    this.surviveText = this.add
      .text(survPanelX + survPanelW - 10, 42, "0%", {
        fontFamily: "sans-serif",
        fontSize: "9px",
        color: "#ffd23a",
        fontStyle: "bold",
      })
      .setOrigin(1, 0);

    // ---------- BOTTOM BAR ----------
    const bottomY = GAME_HEIGHT - 96;
    const bottomH = 96;
    const bottomPanel2 = this.add.graphics();
    bottomPanel2.fillStyle(0x000000, 0.5);
    bottomPanel2.fillRect(0, bottomY, GAME_WIDTH, bottomH);

    // Slide button (fixed left)
    const slideBtn = this.add
      .image(72, bottomY + 38, "btn-slide")
      .setScale(0.68)
      .setInteractive({ useHandCursor: true });
    this.add
      .text(72, bottomY + 64, "SLIDE", {
        fontFamily: "sans-serif",
        fontSize: "12px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.bindButton(slideBtn, () => this.game.events.emit("ui:slide"));
    this.bindTouchZone(72, bottomY + 38, 98, 78, slideBtn, () =>
      this.game.events.emit("ui:slide")
    );

    // Jump button (fixed left)
    const jumpBtn = this.add
      .image(150, bottomY + 38, "btn-jump")
      .setScale(0.68)
      .setInteractive({ useHandCursor: true });
    this.add
      .text(150, bottomY + 64, "JUMP", {
        fontFamily: "sans-serif",
        fontSize: "12px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.bindButton(jumpBtn, () => this.game.events.emit("ui:jump"));
    this.bindTouchZone(150, bottomY + 38, 98, 78, jumpBtn, () =>
      this.game.events.emit("ui:jump")
    );

    // ---- Responsive middle panels ----
    const midLeftEdge = 200;
    const midRightEdge = GAME_WIDTH - 150;
    const midSpace = midRightEdge - midLeftEdge;
    const panelGap = 12;

    const dcW = Math.round(midSpace * 0.34);
    const mmW = Math.round(midSpace * 0.36);
    const boostsW = Math.round(midSpace * 0.24);
    const totalPanelsW = dcW + mmW + boostsW + panelGap * 2;
    const panelStartX = midLeftEdge + (midSpace - totalPanelsW) / 2;

    const dcX = panelStartX;
    const mmX = dcX + dcW + panelGap;
    const boostsX = mmX + mmW + panelGap;

    // --- Daily Challenge panel ---
    const dcPanel = this.add.image(dcX + dcW / 2, bottomY + 40, "panel");
    dcPanel.setDisplaySize(dcW, 58);

    const calG = this.add.graphics();
    calG.fillStyle(0xffffff, 1);
    calG.fillRoundedRect(dcX + 12, bottomY + 15, 30, 32, 4);
    calG.fillStyle(0xff3845, 1);
    calG.fillRect(dcX + 12, bottomY + 15, 30, 11);
    calG.fillStyle(0x0b1020, 1);
    calG.fillRect(dcX + 18, bottomY + 12, 3, 7);
    calG.fillRect(dcX + 33, bottomY + 12, 3, 7);
    this.add
      .text(dcX + 27, bottomY + 36, "7", {
        fontFamily: "sans-serif",
        fontSize: "17px",
        fontStyle: "bold",
        color: "#0b1020",
      })
      .setOrigin(0.5);

    this.add.text(dcX + 52, bottomY + 13, "DAILY CHALLENGE", {
      fontFamily: "sans-serif",
      fontSize: "10px",
      color: "#ffd23a",
      fontStyle: "bold",
    });
    this.add.text(dcX + 52, bottomY + 27, "Survive 1000m\nWithout Hitting VAR", {
      fontFamily: "sans-serif",
      fontSize: "9px",
      color: "#ffffff",
      lineSpacing: 1,
    });
    this.add.image(dcX + dcW - 40, bottomY + 22, "coin-0").setScale(0.28);
    this.add.text(dcX + dcW - 27, bottomY + 16, "500", {
      fontFamily: "sans-serif",
      fontSize: "13px",
      color: "#ffd23a",
      fontStyle: "bold",
    });

    const dailyBarBg = this.add.graphics();
    dailyBarBg.fillStyle(0x000000, 0.6);
    this.dailyBarX = dcX + 12;
    this.dailyBarY = bottomY + 52;
    this.dailyBarW = dcW - 24;
    dailyBarBg.fillRoundedRect(this.dailyBarX, this.dailyBarY, this.dailyBarW, 6, 3);
    this.dailyBar = this.add.graphics();
    this.dailyText = this.add
      .text(dcX + dcW - 12, bottomY + 50, "0/1000", {
        fontFamily: "sans-serif",
        fontSize: "9px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(1, 0);

    // --- Mad Meter panel ---
    const mmPanel = this.add.image(mmX + mmW / 2, bottomY + 40, "panel");
    mmPanel.setDisplaySize(mmW, 58);
    this.add
      .text(mmX + mmW / 2, bottomY + 11, "MAD METER", {
        fontFamily: "sans-serif",
        fontSize: "13px",
        color: "#32d264",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);
    const mmBgG = this.add.graphics();
    mmBgG.fillStyle(0x000000, 0.6);
    mmBgG.fillRoundedRect(mmX + 16, bottomY + 30, mmW - 64, 16, 4);
    this.madBar = this.add.graphics();
    const avatarG = this.add.graphics();
    avatarG.fillStyle(0xf2c4a0, 1);
    avatarG.fillCircle(mmX + mmW - 27, bottomY + 38, 13);
    avatarG.fillStyle(0x2a1a0c, 1);
    avatarG.beginPath();
    avatarG.arc(mmX + mmW - 27, bottomY + 29, 13, Math.PI, 0);
    avatarG.fillPath();
    avatarG.fillStyle(0x0b1020, 1);
    avatarG.fillCircle(mmX + mmW - 31, bottomY + 38, 1.5);
    avatarG.fillCircle(mmX + mmW - 23, bottomY + 38, 1.5);

    // --- Boosts panel ---
    const boostsPanel = this.add.image(boostsX + boostsW / 2, bottomY + 40, "panel");
    boostsPanel.setDisplaySize(boostsW, 58);
    this.add
      .text(boostsX + boostsW / 2, bottomY + 11, "BOOSTS", {
        fontFamily: "sans-serif",
        fontSize: "12px",
        color: "#a0d0ff",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);
    const magnetBtn = this.add
      .image(boostsX + boostsW * 0.32, bottomY + 39, "boost-magnet")
      .setScale(0.5)
      .setInteractive({ useHandCursor: true });
    this.magnetText = this.add
      .text(boostsX + boostsW * 0.32 + 10, bottomY + 50, "2", {
        fontFamily: "sans-serif",
        fontSize: "10px",
        fontStyle: "bold",
        color: "#0b1020",
        backgroundColor: "#ffd23a",
        padding: { x: 4, y: 1 },
      })
      .setOrigin(0.5);
    this.bindButton(magnetBtn, () => this.useMagnet());

    const shieldBtn = this.add
      .image(boostsX + boostsW * 0.68, bottomY + 39, "boost-shield")
      .setScale(0.5)
      .setInteractive({ useHandCursor: true });
    this.shieldText = this.add
      .text(boostsX + boostsW * 0.68 + 10, bottomY + 50, "1", {
        fontFamily: "sans-serif",
        fontSize: "10px",
        fontStyle: "bold",
        color: "#0b1020",
        backgroundColor: "#ffd23a",
        padding: { x: 4, y: 1 },
      })
      .setOrigin(0.5);
    this.bindButton(shieldBtn, () => this.useShield());

    // --- SUPER button (fixed right) ---
    this.superBtnGlow = this.add
      .image(GAME_WIDTH - 76, bottomY + 36, "btn-super")
      .setScale(0.58)
      .setInteractive({ useHandCursor: true });
    this.add
      .text(GAME_WIDTH - 76, bottomY + 62, "SUPER", {
        fontFamily: "sans-serif",
        fontSize: "13px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.add
      .text(GAME_WIDTH - 76, bottomY + 77, "HOLD TO RUN", {
        fontFamily: "sans-serif",
        fontSize: "8px",
        color: "#a0d0ff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.bindButton(this.superBtnGlow, () => this.game.events.emit("ui:super"));
    this.bindTouchZone(
      GAME_WIDTH - 76,
      bottomY + 40,
      110,
      84,
      this.superBtnGlow,
      () => this.game.events.emit("ui:super")
    );

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
        this.routeProgress = (m % 2000) / 2000;
        this.survivePct = Math.min(100, (m / 2000) * 100);
        this.redrawSurvive();
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
    this.redrawSurvive();
    this.redrawProgress();
  }

  private drawRouteIcon(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    icon: "runner" | "coin" | "ball" | "trophy"
  ) {
    if (icon === "runner") {
      g.fillStyle(0xffffff, 1);
      g.fillCircle(x - 3, y - 7, 3);
      g.lineStyle(2, 0xffffff, 1);
      g.lineBetween(x - 1, y - 4, x + 4, y + 1);
      g.lineBetween(x + 4, y + 1, x - 4, y + 6);
      g.lineBetween(x + 4, y + 1, x + 8, y + 6);
      return;
    }

    if (icon === "ball") {
      g.fillStyle(0xffffff, 1);
      g.fillCircle(x, y, 7);
      g.fillStyle(0x0b1020, 1);
      g.fillCircle(x, y, 2.5);
      g.fillCircle(x - 5, y - 3, 2);
      g.fillCircle(x + 5, y - 3, 2);
      g.fillCircle(x - 3, y + 5, 2);
      g.fillCircle(x + 4, y + 4, 2);
      return;
    }

    if (icon === "trophy") {
      g.fillStyle(0x0b1020, 1);
      g.fillRoundedRect(x - 5, y - 7, 10, 10, 2);
      g.fillRect(x - 2, y + 2, 4, 5);
      g.fillRect(x - 7, y + 7, 14, 2);
      g.lineStyle(2, 0x0b1020, 1);
      g.strokeCircle(x - 7, y - 2, 4);
      g.strokeCircle(x + 7, y - 2, 4);
      return;
    }

    g.fillStyle(0xffd23a, 1);
    g.fillCircle(x, y, 5);
    g.lineStyle(2, 0x0b1020, 0.8);
    g.strokeCircle(x, y, 5);
  }

  private redrawMad(mmX: number, bottomY: number, mmW: number) {
    this.madBar.clear();
    const w = (mmW - 60) * (this.madPct / 100);
    if (w > 0) {
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
          bottomY + 32,
          segW - 2,
          12,
          2
        );
      }
    }
  }

  private redrawSurvive() {
    this.surviveBar.clear();
    const fillW = this.surviveBarW * (this.survivePct / 100);
    if (fillW > 0) {
      const color = this.survivePct > 50 ? 0x32d264 : 0xffd23a;
      this.surviveBar.fillStyle(color, 1);
      this.surviveBar.fillRoundedRect(this.surviveBarX, 40, fillW, 10, 4);
    }
    this.surviveText.setText(`${Math.floor(this.survivePct)}%`);
  }

  private redrawProgress() {
    // Daily bar
    this.dailyBar.clear();
    const dcBarW = this.dailyBarW * this.dailyPct;
    if (dcBarW > 0) {
      this.dailyBar.fillStyle(0x32d264, 1);
      this.dailyBar.fillRoundedRect(
        this.dailyBarX,
        this.dailyBarY,
        dcBarW,
        6,
        3
      );
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

  private bindTouchZone(
    x: number,
    y: number,
    w: number,
    h: number,
    visual: Phaser.GameObjects.Image,
    cb: () => void
  ) {
    this.add
      .zone(x, y, w, h)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.tweens.add({
          targets: visual,
          scale: visual.scale * 0.92,
          duration: 70,
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
