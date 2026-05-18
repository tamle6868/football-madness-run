# Football Madness Run — Handoff Document

> **Mục đích:** Tóm tắt trạng thái dự án để hand-off cho LLM khác (Codex, GPT-4, Claude, v.v.) hoặc developer mới tiếp tục công việc.
>
> **Cập nhật:** 2026-05 (sau v5)

---

## 1. Project Overview

**Tên:** Football Madness Run
**Thể loại:** 2D side-scrolling endless runner (web game)
**Theme:** Châm biếm bóng đá — cầu thủ chibi vượt qua thị phi (VAR, FIFA corruption, injury fraud, social media hate) để đến với cúp World Cup.

**Concept art gốc của user:** xem `docs/concept-references/` (chưa upload, có 2 ảnh: panorama 1672×941 + sprite sheet 1376×768)

## 2. Tech Stack

| Layer | Tech | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| Game engine | Phaser | 3.86.0 (ESM import via `import * as Phaser from "phaser"`) |
| Styling | Tailwind CSS | 4.x |
| Build | Next.js static export → `out/` | — |
| Deploy | devinapps.com (current) | — |
| Persistence | localStorage only (best score + daily progress) | — |
| Backend | KHÔNG có | — |
| Database | KHÔNG có | — |

**Quan trọng:** Đây là phiên bản Next.js 16, có breaking change. Đọc `node_modules/next/dist/docs/` trước khi sửa.

## 3. Repository

- **GitHub:** https://github.com/tamle6868/football-madness-run
- **Default branch:** `main`
- **Live preview:** https://out-jlbyvdcf.devinapps.com
- **Commit ban đầu (v5):** [519008a](https://github.com/tamle6868/football-madness-run/commit/519008a)

## 4. Folder Structure

```
football-madness-run/
├── app/
│   ├── components/
│   │   └── GameClient.tsx          # Phaser mount component (client-only)
│   ├── game/
│   │   ├── index.ts                # Phaser config (pixelArt, scenes registration)
│   │   ├── constants.ts            # GAME_WIDTH/HEIGHT, GROUND_Y, PLAYER_X
│   │   ├── scenes/
│   │   │   ├── BootScene.ts        # First scene, init font
│   │   │   ├── PreloadScene.ts     # Load all assets, show loading bar
│   │   │   ├── MainMenuScene.ts    # Title + START button + demo player
│   │   │   ├── GameScene.ts        # Main gameplay (player, obstacles, coins)
│   │   │   ├── UIScene.ts          # HUD overlay (rendered above game)
│   │   │   └── GameOverScene.ts    # Modal with stats + retry
│   │   └── assets/
│   │       ├── imageLoader.ts      # PNG asset URL list
│   │       ├── player.ts           # Player sprite + animation factory
│   │       ├── obstacles.ts        # Obstacle factory
│   │       ├── background.ts       # BG layer factory
│   │       ├── ui.ts               # UI element factory
│   │       └── utils.ts            # Common helpers
│   ├── globals.css                 # Tailwind + custom (rotate-overlay style)
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main page (mount game + rotate overlay)
├── public/
│   └── assets/                     # PNG files loaded by Phaser
│       ├── player.png              # 201×251, big-head chibi #7
│       ├── bg_stadium_real.png     # 4140×520, panorama stadium
│       ├── bg_ground.png           # Grass tile
│       ├── coin_sheet.png          # 6 frame coin spin
│       ├── obs_var.png             # VAR obstacle
│       ├── obs_corruption.png      # FIFA Corruption
│       ├── obs_injury.png          # Injury Card
│       ├── obs_hate.png            # Hate Poop
│       ├── logo.png                # Title logo
│       └── trophy.png              # World Cup trophy
├── docs/
│   ├── ASSET-SPEC.md               # Asset specification (size, format, naming)
│   ├── WORKFLOW.md                 # 4-phase development workflow
│   └── HANDOFF.md                  # This file
├── AGENTS.md                       # Next.js 16 warning for LLMs
├── CLAUDE.md                       # → AGENTS.md alias
├── README.md
├── TEST-REPORT.md                  # v1 test report (outdated)
├── package.json
├── next.config.ts                  # Static export config
└── tsconfig.json
```

## 5. Current Game State (v5)

### Gameplay implemented
- [x] Player chạy với 1 pose (run cycle = 1 frame lặp lại với tween bob)
- [x] Player jump (SPACE)
- [x] Player slide (S)
- [x] Player super mode (E) — invincible 5s khi Mad Meter đầy
- [x] 4 obstacles spawn từ phải: VAR, FIFA Corruption, Injury Card, Hate Poop
- [x] Coin spawn theo pattern (line/arc/zigzag), animate 6 frame
- [x] Coin pickup tăng score + fill Mad Meter
- [x] Score increment by distance + coin
- [x] Best score lưu localStorage
- [x] Daily Challenge "Survive 1000m without hitting VAR" với progress lưu
- [x] Game Over modal với DISTANCE/SCORE/COINS/BEST + Retry button
- [x] Countdown 3-2-1-GO khi start
- [x] BG parallax 3 lớp (procedural sky + real stadium + grass tile)
- [x] HUD top: Score/Distance/Best/Coin/World Cup Route/Survive Madness
- [x] HUD bottom: Slide/Jump/Daily Challenge/Mad Meter/Boosts/Super buttons
- [x] Pixel-art crisp rendering (pixelArt: true mode)
- [x] Mobile portrait → show rotate-device overlay

### Bug đã biết (cần fix ở v6)
- [ ] **Player có "blue circle glow" ở menu state** — spotlight của MainMenuScene rò sang GameScene khi transition. Cần cleanup proper khi shutdown menu.
- [ ] **HUD layout chen chúc** — 8 elements (logo + score + best + distance + coin + route + survive bar + pause) ở top 100px, đọc không ra. Cần redesign zones.
- [ ] **Score và Distance value trùng nhau (Score=Distance bằng số)** — do logic tính score = distance × multiplier, nhưng multiplier = 1 nên trùng. Cần decouple.
- [ ] **Player sprite có viền màu artifact** — extraction từ panorama để lại 2-3px viền cyan/đen. Cần re-extract với mask kỹ hơn HOẶC user gen sprite mới đúng spec.
- [ ] **Stadium BG khá tối** — image gốc dark, mình giảm opacity HUD top để lights nhìn rõ. Có thể brighten BG.
- [ ] **Coin counter "0" floating awkwardly** ở giữa World Cup Route và edge phải.
- [ ] **"SURVIVE THE MADNESS" bar** tiny + redundant với Mad Meter.

## 6. Open Questions (cần user quyết)

### A. Core concept direction
Game này về cốt lõi là gì? Mình đề xuất 4 hướng:
- **A. Road to World Cup Campaign** — 5 stage (Qualifier → Group → R16 → Semi → Final), có ending = lift trophy
- **B. Endless Madness** — chạy mãi, high score chase (Subway Surfers style)
- **C. Career Mode** — multiple World Cup campaigns 2022/2026/2030
- **D. Boss Rush** — mỗi level kết bằng boss fight

User chưa chốt. Mình recommend A (Road to World Cup Campaign) vì khớp tagline gốc "EVENT: WORLD CUP ROUTE" và có ending rõ.

### B. Character count cho v6
- 1 character (Ronardo only) — simplest
- 3 character (+ Massi + Mbape)
- 5 character (+ Halaand + Locky goalkeeper)

### C. Sound style
- Realistic stadium (crowd cheer + cleat sound)
- Arcade/8-bit (chip-tune retro)
- Trap/Hype beat (modern hip-hop)

### D. Character names — bản quyền
- Parody hư cấu (Ronardo / Massi / Mbape) — an toàn pháp lý
- Tên thật (Ronaldo / Messi / Mbappé) — rủi ro

### E. Asset delivery
User sẽ tự gen asset theo `docs/ASSET-SPEC.md` rồi gửi ZIP, hoặc Devin/Codex tự gen?

## 7. Next Steps (Phase B của workflow)

Theo `docs/WORKFLOW.md`, Phase tiếp theo là **IMPLEMENT**:

1. User confirm core direction (A/B/C/D)
2. User confirm scope (character count, level count, sound)
3. User deliver asset ZIP theo ASSET-SPEC.md (hoặc Codex tự gen)
4. Implement:
   - Asset manifest (`app/game/assets/manifest.ts`)
   - Refactor PreloadScene load từ manifest
   - Refactor GameScene để support multi-character, multi-level
   - Redesign HUD theo layout zones (fix overlap)
   - Fix bugs đã list ở section 5
5. Test trên devinapps preview
6. Commit + PR

## 8. Useful Commands

### Local dev
```bash
cd /path/to/football-madness-run
npm install
npm run dev          # http://localhost:3000
npm run build        # build → out/
npm run lint
```

### Deploy
```bash
npm run build        # creates out/ folder
# devinapps deployment:
# cp -r out/* to deploy target
```

### Add new asset
1. Drop PNG to `public/assets/`
2. Add entry to `app/game/assets/imageLoader.ts`
3. Use `this.add.image(x, y, "key")` in scene

## 9. Architecture Decisions

### Why Phaser 3 (not Phaser 4 or PixiJS)
- Phaser 3 mature, large community, lots of plugins
- Phaser 4 (beta) breaks too many things for production
- PixiJS lower-level → would need to build scene management ourselves

### Why Next.js (not Vite or plain HTML)
- User asked for Next.js
- Static export = same deployable as Vite (no Node server needed)
- App Router future-proof
- Easier to add backend/API routes later if needed

### Why pixel-art mode
- User assets are raster bitmap (not vector)
- Bilinear interpolation made them blur at game scale
- Nearest-neighbor (pixelArt: true) keeps them crisp

### Why localStorage (no DB)
- Game is single-player, score is local
- No login/multiplayer/leaderboard requested
- Adding DB = +backend + +auth + +hosting = scope creep
- Can add Supabase later if leaderboard requested

## 10. Contact / Original Conversation

User: hoangnhuthao2803 (hoangnhuthao2803@gmail.com)
GitHub: tamle6868
Vietnamese language preference.

Original Devin session: https://app.devin.ai/sessions/abc7926cc38a49c5b6cd6cac71732858
