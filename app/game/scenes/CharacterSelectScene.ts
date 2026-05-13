import * as Phaser from "phaser";
import { CHARACTERS, DEFAULT_CHARACTER_ID, getCharacter } from "../config/characters";
import type { CharacterConfig, CharacterId } from "../config/characters";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  GROUND_Y,
  STADIUM_TOP_Y,
  STADIUM_VISIBLE_HEIGHT,
} from "../constants";
import { addCleanCrowdBand } from "../visuals/stadiumBand";

export class CharacterSelectScene extends Phaser.Scene {
  private selectedId: CharacterId = DEFAULT_CHARACTER_ID;
  private selectedPanel!: Phaser.GameObjects.Graphics;
  private selectedTitle!: Phaser.GameObjects.Text;
  private selectedPassive!: Phaser.GameObjects.Text;
  private selectedSuper!: Phaser.GameObjects.Text;
  private selectedPlayer!: Phaser.GameObjects.Image;

  constructor() {
    super("CharacterSelectScene");
  }

  create() {
    this.selectedId = getCharacter(
      localStorage.getItem("fmr-character") ?? DEFAULT_CHARACTER_ID
    ).id;

    this.drawBackground();

    this.add.image(140, 78, "logo").setScale(0.3).setOrigin(0.5);
    this.add
      .text(GAME_WIDTH / 2, 58, "CHOOSE YOUR MADNESS", {
        fontFamily: "sans-serif",
        fontSize: "46px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#0b1020",
        strokeThickness: 8,
      })
      .setOrigin(0.5);
    this.add
      .text(GAME_WIDTH / 2, 106, "Each legend has a different way to survive football chaos.", {
        fontFamily: "sans-serif",
        fontSize: "18px",
        color: "#a0d0ff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const startX = 90;
    const startY = 170;
    const cardW = 172;
    const cardH = 220;
    const gap = 22;
    CHARACTERS.forEach((character, index) => {
      const x = startX + index * (cardW + gap);
      this.drawCharacterCard(character, x, startY, cardW, cardH);
    });

    this.drawSelectedPanel();
    this.refreshSelectedPanel();

    this.makeButton(GAME_WIDTH / 2 - 120, 650, 230, 58, "START RUN", 0x32d264, () => {
      localStorage.setItem("fmr-character", this.selectedId);
      this.scene.start("GameScene", { characterId: this.selectedId });
      this.scene.launch("UIScene");
    });
    this.makeButton(GAME_WIDTH / 2 + 140, 650, 190, 58, "BACK", 0x1d56c2, () => {
      this.scene.start("MainMenuScene");
    });
  }

  private drawBackground() {
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
    stadium.tilePositionX = 160;
    addCleanCrowdBand(this);

    const ground = this.add.tileSprite(
      GAME_WIDTH / 2,
      GROUND_Y + (GAME_HEIGHT - GROUND_Y) / 2,
      GAME_WIDTH,
      GAME_HEIGHT - GROUND_Y,
      "bg-ground"
    );
    ground.tileScaleY = (GAME_HEIGHT - GROUND_Y) / 200;

    const dim = this.add.graphics();
    dim.fillStyle(0x000000, 0.42);
    dim.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }

  private drawCharacterCard(
    character: CharacterConfig,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    const isAvailable = character.status === "available";
    const card = this.add.graphics();
    const draw = (hover = false) => {
      const selected = this.selectedId === character.id;
      card.clear();
      card.fillStyle(selected ? 0x13244d : 0x0c1432, isAvailable ? 0.94 : 0.72);
      card.fillRoundedRect(x, y, w, h, 10);
      card.lineStyle(selected ? 4 : 2, selected ? character.accent : 0x6a8aff, hover ? 0.95 : 0.55);
      card.strokeRoundedRect(x, y, w, h, 10);
      card.fillStyle(character.accent, selected ? 0.92 : 0.45);
      card.fillRoundedRect(x + 10, y + 10, w - 20, 6, 3);
    };
    draw();

    if (character.id === "ronaldo") {
      const preview = this.add
        .image(x + w / 2, y + 112, "player-run1")
        .setScale(0.82)
        .setOrigin(0.5, 1);
      let frame = 0;
      this.time.addEvent({
        delay: 130,
        loop: true,
        callback: () => {
          frame = (frame + 1) % 4;
          preview.setTexture(`player-run${frame + 1}`);
        },
      });
    } else {
      const avatar = this.add.graphics();
      avatar.fillStyle(0x11182f, 1);
      avatar.fillRoundedRect(x + 39, y + 38, 94, 82, 12);
      avatar.lineStyle(2, character.accent, 0.7);
      avatar.strokeRoundedRect(x + 39, y + 38, 94, 82, 12);
      avatar.fillStyle(character.accent, 0.9);
      avatar.fillCircle(x + 86, y + 72, 24);
      this.add
        .text(x + 86, y + 72, character.shortName, {
          fontFamily: "sans-serif",
          fontSize: "18px",
          fontStyle: "bold",
          color: "#0b1020",
        })
        .setOrigin(0.5);
    }

    this.add
      .text(x + w / 2, y + 142, character.name.toUpperCase(), {
        fontFamily: "sans-serif",
        fontSize: "19px",
        fontStyle: "bold",
        color: isAvailable ? "#ffffff" : "#a0d0ff",
      })
      .setOrigin(0.5);
    this.add
      .text(x + w / 2, y + 169, character.superName.toUpperCase(), {
        fontFamily: "sans-serif",
        fontSize: "13px",
        fontStyle: "bold",
        color: character.accentHex,
        align: "center",
        wordWrap: { width: w - 18 },
      })
      .setOrigin(0.5);
    this.add
      .text(x + w / 2, y + 198, character.unlockText.toUpperCase(), {
        fontFamily: "sans-serif",
        fontSize: "12px",
        fontStyle: "bold",
        color: isAvailable ? "#32d264" : "#ff9a3c",
      })
      .setOrigin(0.5);

    const zone = this.add
      .zone(x + w / 2, y + h / 2, w, h)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    zone.on("pointerover", () => draw(true));
    zone.on("pointerout", () => draw(false));
    zone.on("pointerdown", () => {
      if (!isAvailable) {
        this.flashLocked(x + w / 2, y + h / 2, character.unlockText);
        return;
      }
      this.selectedId = character.id;
      this.refreshSelectedPanel();
      this.scene.restart();
    });
  }

  private drawSelectedPanel() {
    this.selectedPanel = this.add.graphics();
    this.selectedPlayer = this.add
      .image(235, 572, "player-super")
      .setScale(1.22)
      .setOrigin(0.5, 1)
      .setDepth(4);
    this.add.ellipse(235, 578, 120, 20, 0x000000, 0.35).setDepth(3);
    this.selectedTitle = this.add.text(420, 456, "", {
      fontFamily: "sans-serif",
      fontSize: "28px",
      fontStyle: "bold",
      color: "#ffffff",
    });
    this.selectedPassive = this.add.text(420, 502, "", {
      fontFamily: "sans-serif",
      fontSize: "17px",
      color: "#ffffff",
      wordWrap: { width: 600 },
    });
    this.selectedSuper = this.add.text(420, 552, "", {
      fontFamily: "sans-serif",
      fontSize: "17px",
      color: "#ffffff",
      wordWrap: { width: 600 },
    });
  }

  private refreshSelectedPanel() {
    const selected = getCharacter(this.selectedId);
    this.selectedPanel.clear();
    this.selectedPanel.fillStyle(0x0c1432, 0.9);
    this.selectedPanel.fillRoundedRect(150, 420, 980, 180, 14);
    this.selectedPanel.lineStyle(3, selected.accent, 0.8);
    this.selectedPanel.strokeRoundedRect(150, 420, 980, 180, 14);
    this.selectedPanel.fillStyle(selected.accent, 0.3);
    this.selectedPanel.fillRoundedRect(170, 440, 130, 10, 5);

    this.selectedTitle.setText(`${selected.name.toUpperCase()} - ${selected.superName}`);
    this.selectedTitle.setColor(selected.accentHex);
    this.selectedPassive.setText(`PASSIVE: ${selected.passiveName} - ${selected.passiveText}`);
    this.selectedSuper.setText(`SUPER: ${selected.superText}`);
    this.selectedPlayer.setTexture("player-super");
  }

  private flashLocked(x: number, y: number, text: string) {
    const label = this.add
      .text(x, y, text.toUpperCase(), {
        fontFamily: "sans-serif",
        fontSize: "18px",
        fontStyle: "bold",
        color: "#ff9a3c",
        stroke: "#0b1020",
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setDepth(30);
    this.tweens.add({
      targets: label,
      y: y - 34,
      alpha: 0,
      duration: 720,
      ease: "Sine.out",
      onComplete: () => label.destroy(),
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
