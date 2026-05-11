# Football Madness Run — Test Report

**Preview URL:** https://out-jlbyvdcf.devinapps.com
**Local repo:** `/home/ubuntu/repos/football-madness-run`
**Tech stack:** Next.js 16.2.4 (Turbopack, App Router, static export) + Phaser 3.86.0 + TypeScript + Tailwind. All visual assets are procedurally generated with Canvas/Phaser Graphics — no external image files.

## Verified gameplay

| # | Test | Result |
|---|------|--------|
| 1 | Main menu renders title, How To Play, demo player, Globe Cup, START | PASS |
| 2 | START click → 3-2-1-GO countdown → game scene loads | PASS |
| 3 | 3-layer parallax background (sky, stadium, ground) scrolls | PASS |
| 4 | Player runs, jumps on SPACE, lands cleanly | PASS |
| 5 | Obstacles spawn (VAR, FOOFA Corruption, Injury Card, Hate Poop) | PASS |
| 6 | Coins spawn (line/arc/zigzag patterns) and increment score on pickup | PASS |
| 7 | Score / Distance / Coins / Mad Meter HUD updates in real time | PASS |
| 8 | Speed ramps over time (BASE 380 → MAX 880 px/s) | PASS |
| 9 | Hitting an obstacle ends the run; shield blocks 1 hit | PASS |
| 10 | Game Over modal shows DISTANCE, SCORE, COINS, BEST + NEW BEST badge | PASS |
| 11 | RETRY click starts a fresh round; BEST score persists in localStorage | PASS |
| 12 | Daily Challenge progress persists across runs (localStorage) | PASS |
| 13 | SPACE no longer accidentally restarts the scene | PASS |
| 14 | SUPER ultimate (E key / button) | NOT TESTED — needs full Mad Meter (~25 coins in one run) |
| 15 | Slide (S key / button) | Implemented — tested briefly, hard to verify without slide-only obstacles |

## Key bugs found and fixed during testing

1. **`Phaser` default-export missing** in ESM build — switched all imports to `import * as Phaser from "phaser"`.
2. **GameScene constructor missing** — added `super("GameScene")`.
3. **Iterating physics groups while destroying** caused `Cannot read properties of undefined (reading 'active')` — refactored to snapshot via `getChildren().slice()` and iterate with `for..of`.
4. **BEST score formatted with EU decimal separator** — forced `toLocaleString("en-US")` and floored score before saving.
5. **Coin pickup after Game Over** added 10 to score but didn't update BEST — added `if (this.gameOver) return;` guard in `handleCoinPickup`.
6. **Obstacles spawned during countdown** and were already on top of the player when GO! fired — moved spawn scheduling to fire after countdown ends.
7. **MAJOR: Pressing SPACE in-game restarted the scene.** MainMenuScene & GameOverScene both had `keyboard.once("keydown-SPACE", …)` listeners. After scene transition, those `once` listeners were still firing in the next scene, calling `scene.start("GameScene")` and restarting the round. Fix: switched menus to ENTER-only (SPACE is reserved for jump in-game), added explicit SHUTDOWN cleanup, and added a 400 ms input cooldown on the Game Over scene to absorb leftover keystrokes from gameplay.

## Screenshots

### Main menu
![Main menu](https://app.devin.ai/attachments/fb61b15a-d131-4ea4-a869-53389f47a713/screenshot_da938786271d4ba2a2b8611773e9f19c.png)

### Mid-game (62M, parallax + coins streaming)
![Mid game](https://app.devin.ai/attachments/e9e20fcb-7ee9-4174-9095-e40346bdeec3/screenshot_e4857cd1fe25438481235709091eb55a.png)

### Game Over with NEW BEST SCORE
![Game over](https://app.devin.ai/attachments/acf0adc6-00eb-427b-8a7d-9971b3abe3ff/screenshot_a6a9b9fb559e4c1e9690f499d9552361.png)

### Hate (poop) obstacle approaching
![Hate](https://app.devin.ai/attachments/f4486aee-2ef0-4913-9d3d-b5a1a390f454/screenshot_6e4e968073e5431ebb4648fdbf5544bf.png)

## Performance

- Build: ~9s with Turbopack
- Bundle: 2 routes prerendered as static (`/` and `/_not-found`)
- Runtime: smooth 60fps in Chrome on the test VM
- localStorage: `fmr-best`, `fmr-daily-progress`

## Known limitations / future work

- SUPER mode threshold high — Mad Meter fills slowly (4% per coin). Tunable in `constants.ts`.
- Single character (MVP scope). No character select.
- Slide is currently cosmetic against ground obstacles; could add overhead obstacles requiring slide.
- No audio (sprites/music are out of MVP scope; engine supports both).
- Mobile touch controls present (slide/jump/super buttons in HUD) but only quick-tested on desktop.
