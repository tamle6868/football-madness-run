import * as Phaser from "phaser";
import {
  BASE_SPEED,
  COIN_VALUE,
  GAME_HEIGHT,
  GAME_WIDTH,
  GRAVITY,
  GROUND_Y,
  JUMP_VELOCITY,
  MAD_METER_DRAIN_DURING_SUPER,
  MAD_METER_FILL_PER_COIN,
  MAX_SPEED,
  PLAYER_X,
  SLIDE_DURATION,
  SPEED_RAMP,
  SUPER_DURATION,
} from "../constants";
import {
  OBSTACLE_KINDS,
  OBSTACLES,
  type ObstacleKind,
  type ObstacleSpec,
} from "../assets/manifest";
import { getCharacter, type CharacterConfig } from "../config/characters";
import {
  getCupStage,
  getNextStage,
  normalizeRunPerks,
  type CupRunData,
  type CupStageConfig,
  type RunPerks,
} from "../config/cup";

const PLAYER_RUN_SCALE = 1;

export class GameScene extends Phaser.Scene {
  private skyBg!: Phaser.GameObjects.TileSprite;
  private stadiumBg!: Phaser.GameObjects.TileSprite;
  private groundBg!: Phaser.GameObjects.TileSprite;

  private player!: Phaser.Physics.Arcade.Sprite;
  private playerShadow!: Phaser.GameObjects.Ellipse;
  private speech!: Phaser.GameObjects.Container;
  private superAura!: Phaser.GameObjects.Image;
  private shieldAura!: Phaser.GameObjects.Image;
  private magnetAura!: Phaser.GameObjects.Image;

  private obstacles!: Phaser.Physics.Arcade.Group;
  private coins!: Phaser.Physics.Arcade.Group;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyJump!: Phaser.Input.Keyboard.Key;
  private keySlide!: Phaser.Input.Keyboard.Key;
  private keySuper!: Phaser.Input.Keyboard.Key;
  private keyJumpAlt!: Phaser.Input.Keyboard.Key;
  private keySlideAlt!: Phaser.Input.Keyboard.Key;

  private speed = BASE_SPEED;
  private distance = 0;
  private score = 0;
  private coinsCollected = 0;
  private best = 0;
  private dailyChallengeProgress = 0;

  private sliding = false;
  private slideTimer = 0;

  private superActive = false;
  private superRemaining = 0;
  private madMeter = 0;

  private shieldCharges = 0;
  private magnetActive = false;
  private magnetRemaining = 0;

  private gameStarted = false;
  private gameOver = false;

  private runFrameTimer = 0;
  private runFrame = 0;

  private particles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private character!: CharacterConfig;
  private stage!: CupStageConfig;
  private perks!: RunPerks;
  private totalDistanceBefore = 0;
  private stageComplete = false;
  private bossWarningShown = false;

  constructor() {
    super("GameScene");
  }

  init(data: CupRunData = {}) {
    this.character = getCharacter(data.characterId);
    this.stage = getCupStage(data.stageId);
    this.perks = normalizeRunPerks(data.perks);
    this.totalDistanceBefore = data.totalDistance ?? 0;
    this.speed = BASE_SPEED + this.stage.index * 35;
    this.distance = 0;
    this.score = data.score ?? 0;
    this.coinsCollected = data.coins ?? 0;
    this.sliding = false;
    this.superActive = false;
    this.superRemaining = 0;
    this.madMeter = 0;
    this.shieldCharges = 1 + this.perks.shieldBonus;
    this.magnetActive = false;
    this.magnetRemaining = 0;
    this.gameStarted = false;
    this.gameOver = false;
    this.stageComplete = false;
    this.bossWarningShown = false;
    this.runFrameTimer = 0;
    this.runFrame = 0;
    this.dailyChallengeProgress = Number(
      localStorage.getItem("fmr-daily-progress") ?? 0
    );
    this.best = Number(localStorage.getItem("fmr-best") ?? 0);
  }

  create() {
    // Backgrounds (parallax)
    // Sky band sits behind stadium at the very top edge, mostly hidden.
    this.skyBg = this.add.tileSprite(
      GAME_WIDTH / 2,
      80,
      GAME_WIDTH,
      160,
      "bg-sky"
    );
    // Stadium fills the whole play area between top HUD and ground so the
    // real lights/flags/crowd form a continuous backdrop.
    const stadiumTop = 80;
    const stadiumH = GROUND_Y - stadiumTop;
    this.stadiumBg = this.add.tileSprite(
      GAME_WIDTH / 2,
      stadiumTop + stadiumH / 2,
      GAME_WIDTH,
      stadiumH,
      "bg-stadium"
    );
    const stadiumTex = this.textures.get("bg-stadium").getSourceImage();
    const stadiumNativeH =
      stadiumTex && "height" in stadiumTex ? (stadiumTex as { height: number }).height : stadiumH;
    this.stadiumBg.tileScaleY = stadiumH / stadiumNativeH;
    // Ground tile: grass top, dirt bottom. Place so the grass strip aligns
    // with GROUND_Y and scale the source art into the visible band.
    const groundH = GAME_HEIGHT - GROUND_Y;
    this.groundBg = this.add.tileSprite(
      GAME_WIDTH / 2,
      GROUND_Y + groundH / 2,
      GAME_WIDTH,
      groundH,
      "bg-ground"
    );
    this.groundBg.tileScaleY = groundH / 200;

    // Auras (behind player)
    this.magnetAura = this.add
      .image(0, 0, "magnet-aura")
      .setVisible(false)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(0.85);
    this.shieldAura = this.add
      .image(0, 0, "shield-aura")
      .setVisible(false)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(0.9);
    this.superAura = this.add
      .image(0, 0, "super-aura")
      .setVisible(false)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(1);

    this.playerShadow = this.add
      .ellipse(PLAYER_X, GROUND_Y - 4, 76, 14, 0x000000, 0.34)
      .setDepth(7);

    this.player = this.physics.add
      .sprite(PLAYER_X, GROUND_Y - 80, "player-run1")
      .setOrigin(0.5, 1);
    this.player.setScale(PLAYER_RUN_SCALE);
    this.player.setGravityY(GRAVITY);
    this.applyRunBody();
    this.player.setDepth(10);

    // Floor as a static physics body
    const floor = this.add.rectangle(
      GAME_WIDTH * 2,
      GROUND_Y + 20,
      GAME_WIDTH * 6,
      40,
      0x000000,
      0
    );
    this.physics.add.existing(floor, true);
    this.physics.add.collider(
      this.player,
      floor as unknown as Phaser.GameObjects.GameObject
    );

    // Speech bubble
    const sBg = this.add.image(0, 0, "speech-bubble").setScale(0.6);
    const sTxt = this.add
      .text(0, -10, "SIUUU!", {
        fontFamily: "sans-serif",
        fontSize: "20px",
        fontStyle: "bold",
        color: "#0b1020",
      })
      .setOrigin(0.5);
    this.speech = this.add.container(this.player.x + 80, this.player.y - 200, [sBg, sTxt]);
    this.speech.setVisible(false).setDepth(11);

    // Groups
    this.obstacles = this.physics.add.group();
    this.coins = this.physics.add.group();

    this.physics.add.overlap(this.player, this.obstacles, (_p, obs) => {
      this.handleObstacleHit(obs as Phaser.Physics.Arcade.Sprite);
    });
    this.physics.add.overlap(this.player, this.coins, (_p, c) => {
      this.handleCoinPickup(c as Phaser.Physics.Arcade.Sprite);
    });

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyJump = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyJumpAlt = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keySlide = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keySlideAlt = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.keySuper = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Listen for UI button events from UIScene
    this.game.events.on("ui:jump", this.tryJump, this);
    this.game.events.on("ui:slide", this.startSlide, this);
    this.game.events.on("ui:super", this.tryActivateSuper, this);
    this.game.events.on("ui:magnet", this.activateMagnet, this);
    this.game.events.on("ui:grant-shield", this.grantShield, this);

    // Particles for super run trail
    this.particles = this.add.particles(0, 0, "particle-spark", {
      lifespan: 400,
      speed: { min: -120, max: -40 },
      angle: { min: 160, max: 200 },
      gravityY: 0,
      scale: { start: 1, end: 0 },
      alpha: { start: 0.9, end: 0 },
      blendMode: Phaser.BlendModes.ADD,
      emitting: false,
    });
    this.particles.setDepth(9);

    // Show "GO!" then start; spawning kicks off after countdown
    this.cameras.main.setBackgroundColor("#0b1020");
    this.showStageIntro();
    this.startCountdown();

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off("ui:jump", this.tryJump, this);
      this.game.events.off("ui:slide", this.startSlide, this);
      this.game.events.off("ui:super", this.tryActivateSuper, this);
      this.game.events.off("ui:magnet", this.activateMagnet, this);
      this.game.events.off("ui:grant-shield", this.grantShield, this);
    });
  }

  private showStageIntro() {
    const label = this.add
      .text(GAME_WIDTH / 2, 128, `${this.stage.title.toUpperCase()} - ${this.stage.theme}`, {
        fontFamily: "sans-serif",
        fontSize: "30px",
        fontStyle: "bold",
        color: this.stage.accentHex,
        stroke: "#0b1020",
        strokeThickness: 7,
      })
      .setOrigin(0.5)
      .setDepth(40);
    const target = this.add
      .text(GAME_WIDTH / 2, 164, `TARGET ${this.stage.targetMeters}M / BOSS: ${this.stage.bossName}`, {
        fontFamily: "sans-serif",
        fontSize: "18px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#0b1020",
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setDepth(40);
    this.tweens.add({
      targets: [label, target],
      alpha: 0,
      y: "-=20",
      duration: 900,
      delay: 1700,
      ease: "Sine.inOut",
      onComplete: () => {
        label.destroy();
        target.destroy();
      },
    });
  }

  private startCountdown() {
    const cnt = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "3", {
        fontFamily: "sans-serif",
        fontSize: "180px",
        fontStyle: "bold",
        color: "#ffd23a",
        stroke: "#0b1020",
        strokeThickness: 12,
      })
      .setOrigin(0.5)
      .setDepth(50);

    let n = 3;
    const tick = () => {
      n--;
      if (n > 0) {
        cnt.setText(String(n));
        this.tweens.add({
          targets: cnt,
          scale: { from: 1.4, to: 1 },
          duration: 380,
          ease: "Back.out",
          onComplete: () => this.time.delayedCall(220, tick),
        });
      } else if (n === 0) {
        cnt.setText("GO!").setColor("#32d264");
        this.tweens.add({
          targets: cnt,
          scale: { from: 1.4, to: 1.6 },
          alpha: 0,
          duration: 700,
          ease: "Sine.inOut",
          onComplete: () => {
            cnt.destroy();
            this.gameStarted = true;
            // Start spawning obstacles & coins after countdown
            this.scheduleNextObstacle(1500);
            this.scheduleNextCoinPattern(700);
          },
        });
      }
    };
    this.tweens.add({
      targets: cnt,
      scale: { from: 1.4, to: 1 },
      duration: 380,
      ease: "Back.out",
      onComplete: () => this.time.delayedCall(280, tick),
    });
  }

  private scheduleNextObstacle(delayMs?: number) {
    if (this.gameOver) return;
    // Start gentle, ramp difficulty over distance
    const baseDelay = Math.max(700, 2200 - this.distance / 4 - this.stage.index * 120);
    const delay = delayMs ?? Phaser.Math.Between(baseDelay - 200, baseDelay + 900);
    this.time.delayedCall(delay, () => {
      if (!this.gameOver) {
        this.spawnObstacle();
        this.scheduleNextObstacle();
      }
    });
  }

  private scheduleNextCoinPattern(delayMs?: number) {
    if (this.gameOver) return;
    const delay = delayMs ?? Phaser.Math.Between(1300, 2400);
    this.time.delayedCall(delay, () => {
      if (!this.gameOver) {
        this.spawnCoinPattern();
        this.scheduleNextCoinPattern();
      }
    });
  }

  private updatePlayerShadow() {
    if (!this.playerShadow || !this.player) return;
    const air = Math.max(0, GROUND_Y - this.player.y);
    const liftScale = Phaser.Math.Clamp(1 - air / 360, 0.45, 1);
    const slideScale = this.sliding ? 1.34 : 1;
    this.playerShadow
      .setPosition(this.player.x, GROUND_Y - 4)
      .setScale(liftScale * slideScale, liftScale * 0.78)
      .setAlpha(0.16 + liftScale * 0.22);
  }

  private spawnObstacle() {
    const kind = this.pickObstacleKind();
    const spec = OBSTACLES[kind];

    const obs = this.physics.add.sprite(
      GAME_WIDTH + 200,
      GROUND_Y - spec.liftOffset,
      spec.textureKey
    );
    obs.setOrigin(0.5, 1);
    obs.setScale(spec.scale);
    obs.setDepth(8);
    obs.body!.allowGravity = false;
    const body = obs.body as Phaser.Physics.Arcade.Body;
    body.setSize(obs.width * spec.bodyW, obs.height * spec.bodyH, false);
    body.setOffset(
      (obs.width - obs.width * spec.bodyW) / 2,
      Math.max(0, obs.height - obs.height * spec.bodyH - spec.bodyOffsetY)
    );

    obs.setData("spec", spec);
    obs.setData("scored", false);
    if (spec.avoidance === "slide") {
      const hint = this.add
        .text(obs.x, obs.y - obs.displayHeight - 18, "SLIDE!", {
          fontFamily: "sans-serif",
          fontSize: "28px",
          fontStyle: "bold",
          color: "#32d264",
          stroke: "#0b1020",
          strokeThickness: 6,
        })
        .setOrigin(0.5)
        .setDepth(12);
      this.tweens.add({
        targets: hint,
        y: hint.y - 10,
        scale: { from: 1, to: 1.12 },
        duration: 420,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut",
      });
      obs.setData("hint", hint);
    }
    this.obstacles.add(obs);
  }

  private pickObstacleKind(): ObstacleKind {
    const effectiveDistance = this.distance + this.stage.index * 85;
    const available = OBSTACLE_KINDS.filter(
      (kind) => effectiveDistance >= OBSTACLES[kind].minDistance
    );
    const pool = available.length > 0 ? available : OBSTACLE_KINDS;
    const totalWeight = pool.reduce(
      (sum, kind) => sum + OBSTACLES[kind].weight,
      0
    );
    let roll = Phaser.Math.FloatBetween(0, totalWeight);
    for (const kind of pool) {
      roll -= OBSTACLES[kind].weight;
      if (roll <= 0) return kind;
    }
    return pool[pool.length - 1];
  }

  private spawnCoinPattern() {
    // Patterns: line, arc, zigzag
    const patterns = ["line", "arc", "zigzag"] as const;
    const pat = patterns[Phaser.Math.Between(0, patterns.length - 1)];
    const startX = GAME_WIDTH + 100;
    const baseY = GROUND_Y - 130;
    const spacing = 60;
    const count = Phaser.Math.Between(5, 9);

    for (let i = 0; i < count; i++) {
      const x = startX + i * spacing;
      let y = baseY;
      if (pat === "arc") {
        const t = i / (count - 1);
        y = baseY - Math.sin(t * Math.PI) * 90;
      } else if (pat === "zigzag") {
        y = baseY + (i % 2 === 0 ? 0 : -60);
      }
      this.spawnCoin(x, y);
    }
  }

  private spawnCoin(x: number, y: number) {
    const coin = this.physics.add.sprite(x, y, "coin-0");
    coin.setOrigin(0.5);
    coin.setScale(0.52);
    coin.body!.allowGravity = false;
    coin.setDepth(9);
    const body = coin.body as Phaser.Physics.Arcade.Body;
    body.setCircle(20);
    body.setOffset(12, 12);
    coin.setData("collected", false);
    this.coins.add(coin);
  }

  private tryJump() {
    if (!this.gameStarted || this.gameOver) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (this.sliding) return;
    if (body.blocked.down || body.touching.down) {
      body.setVelocityY(JUMP_VELOCITY);
      this.player.setTexture("player-jump");
      // Slight forward tilt for jump pose (since we have one player image)
      this.player.setRotation(0.18);
      this.cameras.main.shake(80, 0.002);
    }
  }

  private startSlide() {
    if (!this.gameStarted || this.gameOver) return;
    if (this.sliding) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (!(body.blocked.down || body.touching.down)) {
      // mid-air slide = fast fall
      body.setVelocityY(800);
      return;
    }
    this.sliding = true;
    this.slideTimer = SLIDE_DURATION;
    this.player.setTexture("player-slide");
    this.player.setScale(PLAYER_RUN_SCALE);
    this.player.setRotation(0);
    this.applySlideBody();
  }

  private applyRunBody() {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    // Collision covers torso + legs while keeping facial/arm motion forgiving.
    const w = 70;
    const h = 125;
    body.setSize(w, h, false);
    body.setOffset(
      (this.player.width - w) / 2,
      Math.max(0, this.player.height - h)
    );
  }

  private applySlideBody() {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const w = 110;
    const h = 55;
    body.setSize(w, h, false);
    body.setOffset(
      (this.player.width - w) / 2,
      Math.max(0, this.player.height - h)
    );
  }

  private endSlide() {
    if (!this.sliding) return;
    this.sliding = false;
    this.applyRunBody();
    this.player.setTexture("player-run1");
    this.player.setScale(PLAYER_RUN_SCALE);
    this.player.setRotation(0);
  }

  private activateMagnet(durationMs: number) {
    if (this.gameOver) return;
    this.magnetActive = true;
    this.magnetRemaining = Math.max(this.magnetRemaining, durationMs);
  }

  private grantShield() {
    if (this.gameOver) return;
    this.shieldCharges++;
  }

  private tryActivateSuper() {
    if (!this.gameStarted || this.gameOver) return;
    if (this.superActive) return;
    if (this.madMeter < 100) return;
    this.superActive = true;
    this.superRemaining = SUPER_DURATION * this.character.superDurationMultiplier;
    this.madMeter = 100; // start full
    this.player.setTint(0xfff5b8);
    this.cameras.main.flash(180, 255, 240, 180);
    this.cameras.main.shake(150, 0.005);
    this.particles.start();
    this.showSpeech();

    this.game.events.emit("hud:super-state", true);
  }

  private endSuper() {
    this.superActive = false;
    this.superRemaining = 0;
    this.madMeter = 0;
    this.player.clearTint();
    this.particles.stop();
    this.hideSpeech();
    this.game.events.emit("hud:super-state", false);
  }

  private showSpeech() {
    this.speech.setVisible(true).setAlpha(0).setScale(0.5);
    this.tweens.add({
      targets: this.speech,
      alpha: 1,
      scale: 1,
      duration: 200,
      ease: "Back.out",
    });
  }

  private hideSpeech() {
    this.tweens.add({
      targets: this.speech,
      alpha: 0,
      scale: 0.7,
      duration: 200,
      onComplete: () => this.speech.setVisible(false),
    });
  }

  private handleObstacleHit(obs: Phaser.Physics.Arcade.Sprite) {
    if (this.gameOver) return;

    if (this.superActive) {
      // Smash through
      this.cameras.main.shake(120, 0.01);
      this.spawnHitBurst(obs.x, obs.y - obs.displayHeight / 2);
      this.destroyObstacle(obs);
      return;
    }

    const spec = obs.getData("spec") as ObstacleSpec | undefined;
    if (spec && this.isAvoidingObstacle(spec, obs)) {
      return;
    }

    if (this.shieldCharges > 0) {
      this.shieldCharges--;
      this.cameras.main.flash(220, 80, 180, 255);
      this.cameras.main.shake(140, 0.008);
      // Quick shield ring flash
      const ring = this.add
        .image(this.player.x, this.player.y - 70, "shield-aura")
        .setBlendMode(Phaser.BlendModes.ADD)
        .setAlpha(1);
      this.tweens.add({
        targets: ring,
        alpha: 0,
        scale: 1.4,
        duration: 380,
        onComplete: () => ring.destroy(),
      });
      this.spawnHitBurst(obs.x, obs.y - obs.displayHeight / 2);
      this.destroyObstacle(obs);
      return;
    }

    this.triggerGameOver(obs);
  }

  private destroyObstacle(obs: Phaser.Physics.Arcade.Sprite) {
    const hint = obs.getData("hint") as Phaser.GameObjects.Text | undefined;
    if (hint && hint.active) {
      this.tweens.killTweensOf(hint);
      hint.destroy();
    }
    obs.destroy();
  }

  private isAvoidingObstacle(
    spec: ObstacleSpec,
    obs: Phaser.Physics.Arcade.Sprite
  ) {
    if (this.sliding && (spec.avoidance === "slide" || spec.avoidance === "both")) {
      return true;
    }
    if (spec.avoidance !== "jump" && spec.avoidance !== "both") {
      return false;
    }

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    const obstacleBody = obs.body as Phaser.Physics.Arcade.Body;
    return playerBody.bottom < obstacleBody.top + 18;
  }

  private spawnHitBurst(x: number, y: number) {
    const burst = this.add.particles(x, y, "particle-spark", {
      lifespan: 500,
      speed: { min: 200, max: 600 },
      angle: { min: 0, max: 360 },
      gravityY: 800,
      scale: { start: 1.4, end: 0 },
      alpha: { start: 1, end: 0 },
      quantity: 30,
      blendMode: Phaser.BlendModes.ADD,
    });
    burst.explode(30, x, y);
    this.time.delayedCall(700, () => burst.destroy());
  }

  private handleCoinPickup(coin: Phaser.Physics.Arcade.Sprite) {
    if (this.gameOver) return;
    if (coin.getData("collected")) return;
    coin.setData("collected", true);
    this.coinsCollected++;
    this.score += Math.round(COIN_VALUE * this.perks.scoreMultiplier);
    const madGain =
      MAD_METER_FILL_PER_COIN *
      this.character.madGainMultiplier *
      (1 + this.perks.madFillBonus);
    this.madMeter = Math.min(100, this.madMeter + madGain);
    this.game.events.emit("hud:coins", this.coinsCollected);
    this.game.events.emit("hud:mad", this.madMeter);

    this.tweens.add({
      targets: coin,
      scale: 0,
      alpha: 0,
      y: coin.y - 40,
      duration: 220,
      ease: "Sine.inOut",
      onComplete: () => coin.destroy(),
    });

    // Quick spark
    const spark = this.add
      .image(coin.x, coin.y, "particle-spark")
      .setScale(2)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: spark,
      scale: 0,
      alpha: 0,
      duration: 280,
      onComplete: () => spark.destroy(),
    });
  }

  private triggerGameOver(obs?: Phaser.Physics.Arcade.Sprite) {
    if (this.gameOver) return;
    this.gameOver = true;
    this.cameras.main.shake(280, 0.018);
    this.cameras.main.flash(300, 255, 60, 60);
    this.particles.stop();

    // Knockback
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(-180, -500);
    body.allowGravity = true;
    this.player.setTexture("player-jump");

    if (obs) {
      this.spawnHitBurst(obs.x, obs.y - obs.displayHeight / 2);
    }

    // Update best
    const finalScore = Math.floor(this.score);
    if (finalScore > this.best) {
      this.best = finalScore;
      localStorage.setItem("fmr-best", String(this.best));
    }
    this.score = finalScore;

    // Update daily progress
    const newDaily = this.dailyChallengeProgress + Math.floor(this.distance);
    localStorage.setItem("fmr-daily-progress", String(newDaily));

    // Save total coins
    const totalCoins = Number(localStorage.getItem("fmr-coins") ?? 0) + this.coinsCollected;
    localStorage.setItem("fmr-coins", String(totalCoins));

    this.time.delayedCall(900, () => {
      this.scene.stop("UIScene");
      this.scene.start("GameOverScene", {
        characterId: this.character.id,
        stageId: this.stage.id,
        perks: this.perks,
        score: this.score,
        distance: this.totalDistanceBefore + Math.floor(this.distance),
        coins: this.coinsCollected,
        best: this.best,
        totalDistance: this.totalDistanceBefore + Math.floor(this.distance),
      });
    });
  }

  private showBossWarning() {
    const boss = this.add
      .text(GAME_WIDTH / 2, 220, `${this.stage.bossName.toUpperCase()} ENTERS THE MATCH`, {
        fontFamily: "sans-serif",
        fontSize: "34px",
        fontStyle: "bold",
        color: "#ff3845",
        stroke: "#0b1020",
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setDepth(55)
      .setAlpha(0);
    this.cameras.main.shake(220, 0.006);
    this.tweens.add({
      targets: boss,
      alpha: 1,
      scale: { from: 0.82, to: 1 },
      duration: 260,
      ease: "Back.out",
      yoyo: true,
      hold: 720,
      onComplete: () => boss.destroy(),
    });
  }

  private triggerStageComplete() {
    if (this.stageComplete || this.gameOver) return;
    this.stageComplete = true;
    this.gameOver = true;
    this.particles.stop();
    this.cameras.main.flash(260, 255, 220, 80);
    this.cameras.main.shake(160, 0.004);

    const finalScore = Math.floor(this.score);
    if (finalScore > this.best) {
      this.best = finalScore;
      localStorage.setItem("fmr-best", String(this.best));
    }
    this.score = finalScore;

    const stageDistance = Math.floor(this.stage.targetMeters);
    const totalDistance = this.totalDistanceBefore + stageDistance;
    const newDaily = this.dailyChallengeProgress + stageDistance;
    localStorage.setItem("fmr-daily-progress", String(newDaily));

    const nextStage = getNextStage(this.stage.id);
    if (!nextStage) {
      const totalCoins =
        Number(localStorage.getItem("fmr-coins") ?? 0) + this.coinsCollected;
      localStorage.setItem("fmr-coins", String(totalCoins));
    }

    const result = {
      characterId: this.character.id,
      stageId: this.stage.id,
      nextStageId: nextStage?.id,
      perks: this.perks,
      score: this.score,
      stageScore: this.score,
      coins: this.coinsCollected,
      distance: stageDistance,
      totalDistance,
    };

    const label = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, nextStage ? "STAGE CLEAR!" : "CUP WON!", {
        fontFamily: "sans-serif",
        fontSize: "72px",
        fontStyle: "bold",
        color: nextStage ? "#32d264" : "#ffd23a",
        stroke: "#0b1020",
        strokeThickness: 10,
      })
      .setOrigin(0.5)
      .setDepth(70);
    this.tweens.add({
      targets: label,
      scale: { from: 0.72, to: 1 },
      duration: 360,
      ease: "Back.out",
    });

    this.time.delayedCall(1100, () => {
      this.scene.stop("UIScene");
      this.scene.start(nextStage ? "StageCompleteScene" : "TrophyScene", result);
    });
  }

  update(_time: number, delta: number) {
    const dt = delta / 1000;
    this.updatePlayerShadow();

    if (!this.gameStarted) {
      this.runFrameTimer += delta;
      if (this.runFrameTimer > 110) {
        this.runFrameTimer = 0;
        this.runFrame = (this.runFrame + 1) % 4;
        if (!this.sliding) this.player.setTexture(`player-run${this.runFrame + 1}`);
      }
      return;
    }

    if (this.gameOver) {
      // let player fall; nothing else moves
      return;
    }

    // Speed ramp
    const speedTarget = this.superActive ? Math.min(MAX_SPEED, this.speed + 240) : this.speed;
    this.speed = Math.min(MAX_SPEED, this.speed + SPEED_RAMP * dt);

    // Distance tracks run progress; score comes from coins and obstacle clears.
    this.distance += (speedTarget * dt) / 10; // 10px == 1m
    this.game.events.emit("hud:distance", this.distance);
    this.game.events.emit("hud:score", this.score, this.best);

    if (
      this.stage.id === "final" &&
      !this.bossWarningShown &&
      this.distance >= this.stage.targetMeters * 0.72
    ) {
      this.bossWarningShown = true;
      this.showBossWarning();
    }

    if (!this.stageComplete && this.distance >= this.stage.targetMeters) {
      this.triggerStageComplete();
      return;
    }

    // Daily challenge runtime progress
    const dailyNow = this.dailyChallengeProgress + Math.floor(this.distance);
    this.game.events.emit("hud:daily", dailyNow);

    // Background scroll
    this.skyBg.tilePositionX += speedTarget * 0.05 * dt;
    this.stadiumBg.tilePositionX += speedTarget * 0.25 * dt;
    this.groundBg.tilePositionX += speedTarget * 1 * dt;

    // Move obstacles & coins manually
    const moveX = -speedTarget * dt;
    const obstacleChildren = this.obstacles
      .getChildren()
      .slice() as Phaser.Physics.Arcade.Sprite[];
    for (const o of obstacleChildren) {
      if (!o || !o.active || !o.body) continue;
      o.x += moveX;
      const hint = o.getData("hint") as Phaser.GameObjects.Text | undefined;
      if (hint && hint.active) {
        hint.setPosition(o.x, o.y - o.displayHeight - 18);
      }
      if (!o.getData("scored") && o.x + o.displayWidth / 2 < PLAYER_X - 20) {
        o.setData("scored", true);
        const spec = o.getData("spec") as ObstacleSpec | undefined;
        this.score += Math.round((spec?.clearScore ?? 25) * this.perks.scoreMultiplier);
      }
      if (o.x < -240) {
        this.destroyObstacle(o);
      }
    }

    const coinChildren = this.coins
      .getChildren()
      .slice() as Phaser.Physics.Arcade.Sprite[];
    const f = Math.floor((this.time.now / 110) % 6);
    for (const co of coinChildren) {
      if (!co || !co.active || !co.body) continue;
      co.x += moveX;
      co.setTexture(`coin-${f}`);
      if (this.magnetActive) {
        const dx = this.player.x - co.x;
        const dy = this.player.y - 80 - co.y;
        const d = Math.hypot(dx, dy);
        if (d > 0.001 && d < 320) {
          const pull = 600 * dt * (1 - d / 320 + 0.2);
          co.x += (dx / d) * pull;
          co.y += (dy / d) * pull;
        }
      }
      if (co.x < -100) {
        co.destroy();
      }
    }

    // Run animation cycle.
    const onGround = (this.player.body as Phaser.Physics.Arcade.Body).blocked.down;
    if (!this.sliding) {
      if (onGround) {
        // Reset rotation when landing
        if (this.player.rotation !== 0) this.player.setRotation(0);
        // Subtle running bob
        const bob = PLAYER_RUN_SCALE + Math.sin(this.time.now * 0.024) * 0.018;
        this.player.setScale(PLAYER_RUN_SCALE, bob);
        this.runFrameTimer += delta * (this.superActive ? 1.6 : 1);
        if (this.runFrameTimer > 110) {
          this.runFrameTimer = 0;
          this.runFrame = (this.runFrame + 1) % 4;
          this.player.setTexture(
            this.superActive ? "player-super" : `player-run${this.runFrame + 1}`
          );
        }
      } else {
        this.player.setTexture("player-jump");
      }
    }

    // Slide timer
    if (this.sliding) {
      this.slideTimer -= delta;
      if (this.slideTimer <= 0) this.endSlide();
    }

    // Input
    if (
      Phaser.Input.Keyboard.JustDown(this.keyJump) ||
      Phaser.Input.Keyboard.JustDown(this.keyJumpAlt)
    ) {
      this.tryJump();
    }
    if (
      Phaser.Input.Keyboard.JustDown(this.keySlide) ||
      Phaser.Input.Keyboard.JustDown(this.keySlideAlt)
    ) {
      this.startSlide();
    }
    if (Phaser.Input.Keyboard.JustDown(this.keySuper)) {
      this.tryActivateSuper();
    }

    // Auras
    if (this.superActive) {
      this.superAura
        .setVisible(true)
        .setPosition(this.player.x, this.player.y - 70)
        .setRotation(this.time.now * 0.005);
      this.particles.setPosition(this.player.x - 20, this.player.y - 60);

      this.superRemaining -= delta;
      this.madMeter = Math.max(0, this.madMeter - (MAD_METER_DRAIN_DURING_SUPER * dt));
      this.game.events.emit("hud:mad", this.madMeter);
      if (this.superRemaining <= 0 || this.madMeter <= 0) {
        this.endSuper();
      }
    } else {
      this.superAura.setVisible(false);
    }

    // Magnet aura
    if (this.magnetActive) {
      this.magnetAura
        .setVisible(true)
        .setPosition(this.player.x, this.player.y - 70)
        .setScale(1 + Math.sin(this.time.now * 0.004) * 0.08);
      this.magnetRemaining -= delta;
      if (this.magnetRemaining <= 0) {
        this.magnetActive = false;
      }
    } else {
      this.magnetAura.setVisible(false);
    }

    // Passive shield aura
    if (this.shieldCharges > 0 && !this.superActive) {
      this.shieldAura
        .setVisible(true)
        .setPosition(this.player.x, this.player.y - 70)
        .setAlpha(0.55 + Math.sin(this.time.now * 0.005) * 0.12);
    } else if (!this.superActive) {
      this.shieldAura.setVisible(false).setAlpha(0.9);
    }

    // Speech bubble follow
    if (this.speech.visible) {
      this.speech.setPosition(this.player.x + 80, this.player.y - 200);
    }

    // Constrain player to ground area (in case of glitches)
    if (this.player.y > GROUND_Y + 20) {
      this.player.y = GROUND_Y - 80;
    }
  }
}
