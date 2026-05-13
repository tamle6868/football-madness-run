import * as Phaser from "phaser";
import { Rand } from "../assets/utils";
import { GAME_WIDTH, GROUND_Y } from "../constants";

export function addCleanCrowdBand(
  scene: Phaser.Scene,
  topY = GROUND_Y - 128,
  bottomY = GROUND_Y - 14
) {
  const band = scene.add.graphics();
  const height = bottomY - topY;
  const rand = new Rand(93021);

  band.fillStyle(0x061021, 0.94);
  band.fillRect(0, topY, GAME_WIDTH, height);

  for (let row = 0; row < 8; row++) {
    const y = topY + 10 + row * 12;
    band.fillStyle(row % 2 === 0 ? 0x0b1f3d : 0x07162f, 0.72);
    band.fillRect(0, y, GAME_WIDTH, 10);
  }

  const shirtColors = [0xffd23a, 0x1d56c2, 0xff3845, 0x32d264, 0xe8edf8, 0xff9a3c];
  for (let y = topY + 16; y < bottomY - 22; y += 12) {
    for (let x = 0; x < GAME_WIDTH; x += 13) {
      if (rand.next() < 0.42) continue;
      band.fillStyle(rand.pick(shirtColors), rand.range(0.38, 0.78));
      band.fillRoundedRect(
        x + rand.range(-2, 2),
        y + rand.range(-2, 2),
        rand.range(4, 8),
        rand.range(5, 8),
        2
      );
    }
  }

  band.lineStyle(4, 0x2e6db8, 0.9);
  band.lineBetween(0, topY + 4, GAME_WIDTH, topY + 4);
  band.lineStyle(2, 0x77d6ff, 0.42);
  band.lineBetween(0, topY + 10, GAME_WIDTH, topY + 10);

  band.fillStyle(0x061021, 0.98);
  band.fillRect(0, bottomY - 28, GAME_WIDTH, 28);
  band.lineStyle(2, 0x143c7a, 0.9);
  band.lineBetween(0, bottomY - 28, GAME_WIDTH, bottomY - 28);

  const ads = ["MADNESS RUN", "SIUUU ZONE", "NO VAR", "SUPER MODE"];
  for (let x = 42, i = 0; x < GAME_WIDTH; x += 280, i++) {
    band.fillStyle(i % 2 === 0 ? 0x10245c : 0x173426, 0.9);
    band.fillRoundedRect(x, bottomY - 24, 220, 18, 3);
    const label = scene.add
      .text(x + 110, bottomY - 15, ads[i % ads.length], {
        fontFamily: "sans-serif",
        fontSize: "12px",
        fontStyle: "bold",
        color: "#ffd23a",
      })
      .setOrigin(0.5);
    label.setAlpha(0.86);
  }

  return band;
}
