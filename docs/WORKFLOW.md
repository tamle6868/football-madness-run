# Football Madness Run — Game Development Workflow

> **Mục đích:** Quy trình 4 phase để build (hoặc rebuild) 2D side-scroller hoàn chỉnh.
> Workflow này tái sử dụng được cho game endless runner / platformer khác.

---

## Tổng quan 4 phase

```
Phase A — SPEC           Phase B — IMPLEMENT       Phase C — POLISH        Phase D — META
   (1-2 ngày)               (2-3 ngày)               (1-2 ngày)             (2-3 ngày)
       │                        │                        │                       │
   ┌───┴───┐                ┌───┴───┐               ┌────┴────┐            ┌─────┴────┐
   │ Spec  │                │ Drop  │               │  Sound  │            │ Char     │
   │ canvas│                │ asset │               │  +VFX   │            │ select   │
   │ Asset │                │ load  │               │ +Tween  │            │ Level    │
   │ sheet │                │ tune  │               │ +Juicy  │            │ Shop     │
   │ Gen   │                │ scale │               │         │            │ Achieve  │
   │ ZIP   │                │ test  │               │         │            │ Daily    │
   └───┬───┘                └───┬───┘               └────┬────┘            └─────┬────┘
       │                        │                        │                       │
       ▼                        ▼                        ▼                       ▼
   ASSET-SPEC.md           Game ổn định            Game ngon ăn         Game đầy đủ feature
   (đã viết)               + assets thật           + sound + juicy      + replay value
```

---

## Phase A — SPEC (Đặc tả & Chuẩn bị Asset)

### Output:
- `docs/ASSET-SPEC.md` (đã có)
- ZIP file asset của bạn (`assets-delivery/`)

### Bước:
1. **Lock canvas + layout zones** — `1280×720`, HUD top 80px, HUD bottom 80px, playfield 520px
2. **Confirm scope:** số character, số level, có sound không, có character select không
3. **User gen asset** theo ASSET-SPEC.md (Midjourney / Photoshop / commission)
4. **User deliver ZIP** với cấu trúc folder chuẩn
5. **Devin verify size + format** (size khớp spec ±5px, alpha channel OK, naming chuẩn)

### Done criteria:
- [ ] User confirm scope (character count, level count, có/không sound)
- [ ] Devin nhận ZIP + verify pass

---

## Phase B — IMPLEMENT (Tích hợp Asset vào Game)

### Output:
- Phaser scene update với asset thật
- Asset manifest (`app/game/assets/manifest.ts`)
- Preview URL với gameplay cơ bản chạy được

### Bước:
1. **Unzip asset vào `/public/assets/`** đúng folder structure
2. **Tạo asset manifest** (TypeScript):
   ```typescript
   export const MANIFEST = {
     characters: {
       ronardo: { runFrames: 4, hasJump: true, hasSlide: true, ... },
       massi: { ... },
     },
     backgrounds: {
       stadium: { far: "bg_stadium_far.png", mid: "...", near: "..." },
       desert:  { far: "bg_desert_far.png",  mid: "...", near: "..." },
     },
     obstacles: [...],
     coins: {...},
     sounds: {...},
   };
   ```
3. **PreloadScene** load tất cả từ manifest (không hard-code path)
4. **GameScene refactor:**
   - Player class dùng generic `loadCharacter(name)` thay vì hard-code
   - BG class dùng generic `loadBackground(theme)` thay vì hard-code
   - Obstacle spawner dùng `obstacleSet[]` theo level
5. **Test 1 nhân vật + 1 BG + tất cả obstacle** trước, rồi mới mở rộng
6. **Refactor HUD** theo layout zones — không overlap nữa:
   - Top: SCORE (left) / DISTANCE + Route (center) / COIN + PAUSE (right)
   - Bottom: SLIDE / JUMP (left) / MAD METER (center) / BOOSTS / SUPER (right)
7. **Fix các bug từ v5:**
   - Bỏ "menu glow circle" rò vào game scene (cleanup MainMenuScene shutdown)
   - Bỏ score/distance duplicate value (decoupled: score tăng từ coin pickup, distance tăng từ time)
   - Remove "SURVIVE THE MADNESS" bar (gộp vào Mad Meter)

### Done criteria:
- [ ] 1 character + 1 BG + 4 obstacle chạy được trên preview
- [ ] HUD không overlap, đọc được rõ
- [ ] Player chạy/jump/slide chuẩn frame
- [ ] Score + Distance KHÔNG còn trùng giá trị
- [ ] CI lint pass

---

## Phase C — POLISH (Sound + VFX + Juicy)

### Output:
- BGM + SFX hoạt động đầy đủ
- Particle effects (coin pickup, dust trail, super activate)
- Tween animations (button press, score popup, screen shake)

### Bước:
1. **Sound system** (`SoundManager.ts`):
   - BGM crossfade khi đổi scene (menu → game → gameover)
   - SFX pool với volume mixer
   - Mute toggle (button + localStorage)
2. **Particle effects:**
   - Coin pickup: sparkle burst 4 frame
   - Dust trail under player feet khi chạy
   - Super activate: speed lines + glow + screen flash
   - Game over: explosion particle
3. **Tween animations:**
   - Score increment: tween từ old → new
   - HUD elements fade in 0.5s khi vào game
   - Button press: scale 0.9 → 1.0 với ease.Back
   - Screen shake 0.2s khi hit obstacle
   - Camera flash trắng khi super activate
4. **Combo system:**
   - Pickup 3+ coin liên tiếp trong 1s → x2 multiplier hiện popup "+2 COMBO"
5. **Easing tweaks:**
   - Player jump curve: parabol mượt hơn
   - Slide: squash + ease.Sine
6. **Difficulty curve:**
   - Speed += 5 per 10s
   - Obstacle spawn rate giảm 0.1s per 30s
   - Mad Meter fill: coin/10 mỗi cái

### Done criteria:
- [ ] Sound đủ 14 SFX + 3 BGM, không lag, không vỡ tiếng
- [ ] Particle visible khi pickup coin
- [ ] Player jump animation nhìn "nặng" (squash khi tiếp đất)
- [ ] Có screen shake khi hit
- [ ] Combo system hoạt động

---

## Phase D — META (Character Select + Level + Shop + Daily)

### Output:
- Character select screen
- 5 level/map theme với BG khác nhau
- Shop dùng coin để unlock character + power-ups
- Daily Challenge variety (10+ challenge types)

### Bước:
1. **Character Select scene:**
   - Grid 5 character với card preview
   - Lock/Unlock state (unlock bằng coin hoặc đạt distance milestone)
   - Highlight selected, save selection vào localStorage
2. **Level select screen** (hoặc auto-progress qua checkpoint):
   - 5 level theme: Stadium, Sa mạc Qatar, Tuyết Nga, Paris, Final
   - Mỗi level có distance target (vd: level 1 = 0-500m, level 2 = 500-1500m, ...)
   - Khi đạt checkpoint, BG transition sang theme mới
3. **Shop scene:**
   - Tab Character: list 5 character, mỗi unlock 5000-20000 coin
   - Tab Power-up: buy Magnet/Shield/Boots, mỗi pack 100-500 coin
   - Tab Cosmetic: skin kit alternative cho character (áo đỏ, áo trắng, áo đen...)
4. **Daily Challenge system:**
   - Random 1 trong 10 challenge mỗi ngày:
     - "Run 1000m without hitting VAR"
     - "Collect 50 coins in 1 run"
     - "Hit 5 boosts in 1 run"
     - "Survive 30s in Super mode"
     - "Reach level 3 in 1 run"
     - "Run 500m without using Super"
     - "Pickup 3 Magnets"
     - "Don't slide for 200m"
     - "Get NEW BEST score"
     - "Run 5 days in a row" (longterm)
   - Reward 100-1000 coin
5. **Achievement system** (badge collection):
   - First Jump, 100 Jumps, 1000 Coins, 5km Distance, ...
   - Hiển thị notification toast khi unlock

### Done criteria:
- [ ] Character select có 5 character, save selection
- [ ] 5 level BG khác nhau, transition mượt
- [ ] Shop hoạt động, mua được character + powerup
- [ ] Daily Challenge refresh mỗi ngày (check date trong localStorage)
- [ ] Có ít nhất 10 achievement unlockable

---

## Reusability — Áp dụng cho game khác

Workflow này tái sử dụng được cho:
- **Subway Surfers clone** (chỉ đổi BG theme + character + obstacle skin)
- **Temple Run 2D** (đổi BG sang temple, obstacle sang spike trap, coin sang gem)
- **Mario-style platformer** (giữ Phase A-C, đổi Phase D: thêm level editor + checkpoint map)
- **Geometry Dash clone** (đổi physics, giữ asset pipeline)

**Để chuyển sang game khác:**
1. Copy `docs/ASSET-SPEC.md` → đổi size + content theo game mới
2. Copy `app/game/assets/manifest.ts` → đổi nội dung manifest
3. Copy `app/game/scenes/` → đổi GameScene logic (jump → flip, slide → dive, etc)
4. Giữ `SoundManager.ts`, `PreloadScene.ts` framework gốc

---

## Decision Points (cần user confirm)

Trước khi mình bắt đầu Phase B, cần bạn quyết:

### 1. Scope MVP v6
- [ ] **A. Minimal (chỉ fix bug):** 1 character (Ronardo) + 1 BG (Stadium) + 4 obstacle hiện tại + HUD redesign — 1 ngày
- [ ] **B. Solid (thêm sound):** A + sound system đầy đủ — 1.5 ngày
- [ ] **C. Full v6 (character + level):** B + 3 character + 3 level + shop — 3 ngày
- [ ] **D. Full + Meta:** C + Daily Challenge variety + Achievement — 4-5 ngày

### 2. Character count cho MVP v6
- 1 character (Ronardo only, simplest)
- 3 character (Ronardo + Massi + Mbape)
- 5 character (full set với Halaand + Locky goalkeeper)

### 3. Sound style
- Realistic stadium ambient (crowd cheer + cleat sound)
- Arcade/8-bit (chip-tune nhanh, retro)
- Trap/Hype beat (modern, hip-hop)

### 4. Mobile optimization priority
- [ ] Quan trọng (test ngay trên mobile mỗi build)
- [ ] Không quan trọng (test desktop trước, mobile sau)

### 5. Bản quyền character
- [ ] Parody hư cấu (Ronardo / Massi / Mbape) — an toàn pháp lý
- [ ] Tên thật (Ronaldo / Messi / Mbappé) — rủi ro nhưng giống concept
