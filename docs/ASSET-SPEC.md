# Football Madness Run — Asset Specification Sheet

> **Mục đích:** Tài liệu mô tả CHÍNH XÁC kích thước, format, naming convention của mọi asset trong game. Dùng để:
> 1. Đặt asset designer/AI gen ra đúng spec ngay từ đầu (không phải sửa)
> 2. Tái sử dụng workflow cho game side-scroller khác sau này
>
> **Phiên bản:** v1 (2026-05)
> **Format chuẩn:** PNG-32 (RGBA), nền trong suốt 100%, không có viền glow/shadow ngoài asset

---

## 1. Canvas & Layout Zones

### Canvas chính
- **Kích thước thiết kế:** `1280 × 720` (16:9 landscape)
- **Render mode:** Phaser pixel-art (nearest-neighbor scaling)
- **Asset DPI:** thiết kế ở `2×` (tức là asset gốc to gấp đôi rồi Phaser tự scale xuống — sharp trên màn hình HiDPI)

### Layout zones (1280×720)

```
┌──────────────────────────────────────────────────────────────┐  y=0
│ HUD TOP (cao 80px) — score, distance, coin, pause           │
├──────────────────────────────────────────────────────────────┤  y=80
│                                                              │
│ PLAYFIELD (cao 520px)                                        │
│ - Background parallax 3 lớp                                  │
│ - Player + obstacle + coin spawn ở đây                       │
│                                                              │
│                                                              │
├──────────────────────────────────────────────────────────────┤  y=600
│ GROUND (cao 40px) — grass + dirt + line marking              │
├──────────────────────────────────────────────────────────────┤  y=640
│ HUD BOTTOM (cao 80px) — controls + meters + boosts           │
└──────────────────────────────────────────────────────────────┘  y=720
   x=0 ──────────────────────────────────────────────────────── x=1280
```

**Ground line:** `y = 600` (vị trí chân player chạm đất)
**Player baseline:** chân player tại `y = 600`, đầu player tại `y ≈ 432` (player cao ~168px hiển thị)
**Player X (vị trí cố định khi chạy):** `x = 220`

---

## 2. Naming Convention

```
{loại}_{biến_thể}_{frame}.png

Ví dụ:
- player_ronardo_run_1.png       (player tên Ronardo, frame chạy 1)
- player_ronardo_jump.png        (player tên Ronardo, pose nhảy)
- obs_var.png                    (obstacle VAR)
- obs_fifa_corruption.png        (obstacle FIFA Corruption)
- icon_coin.png                  (icon coin nhỏ HUD)
- bg_stadium_far.png             (BG xa nhất, lớp 1)
- bg_stadium_mid.png             (BG giữa, lớp 2)
- bg_stadium_near.png            (BG gần nhất, lớp 3)
- ui_btn_jump.png                (nút jump bottom HUD)
```

**Quy tắc:**
- Chữ thường, dấu `_`, không có khoảng trắng / dấu tiếng Việt
- Frame của animation: hậu tố số `_1`, `_2`, `_3`, ...
- Tất cả PNG có alpha channel (RGBA), không có color matte (background trắng/xanh)

---

## 3. Player Character

> **Pivot:** đáy giữa (bottom-center), tức là điểm `(width/2, height)` của ảnh
> **Trade-off:** Để chân player chạm đất chuẩn, sprite cần có chân ở dòng dưới cùng, không có khoảng trống bên dưới

### Kích thước per character (yêu cầu cho mỗi nhân vật)

| Pose | File | Size (px) | Yêu cầu |
|---|---|---|---|
| Run cycle | `player_{name}_run_1.png` → `_run_4.png` | 200 × 280 | 4 frame, anim 12fps, loop |
| Jump | `player_{name}_jump.png` | 200 × 280 | Pose tay giơ + chân co lên |
| Slide | `player_{name}_slide.png` | 280 × 160 | Pose ngang, chân duỗi trước |
| Super | `player_{name}_super.png` | 240 × 280 | Pose mạnh mẽ, hào quang quanh người |
| Hurt | `player_{name}_hurt.png` | 200 × 280 | Pose ngã/đau, dùng khi game over |
| Idle (menu) | `player_{name}_idle.png` | 200 × 280 | Pose đứng tay chống hông, dùng ở menu |

**Tổng 9 file PNG per character.**

### Display size in game
- Run/jump/idle: scale `0.6×` → hiển thị `120 × 168 px` trên canvas
- Slide: scale `0.6×` → hiển thị `168 × 96 px`
- Super: scale `0.7×` → hiển thị `168 × 196 px` (to hơn 1 chút khi super)

### Yêu cầu chất lượng
- Style: 2D cartoon/chibi, line art rõ, color block đầy đủ
- Nền: 100% trong suốt (alpha = 0)
- KHÔNG có drop shadow / glow / outer effect baked vào (mình add programmatically)
- KHÔNG có speech bubble / tia phát sáng (cái này gây lỗi tách nền lần trước)
- Trang phục: rõ ràng, tỉ lệ thân/chân/đầu nhất quán giữa 9 pose
- Mặt: mắt + miệng + lông mày visible (không che bằng tóc đổ xuống)

### Ý tưởng character set (tùy bạn quyết)
1. **Ronardo** (#7 áo vàng/xanh, tóc cắt sát, mồm há SIUU) — default
2. **Massi** (#10 áo trắng/xanh, tóc dài bồng, expression cool)
3. **Mbape** (#9 áo xanh dương, da đậm, expression tự tin)
4. **Halaand** (#11 áo vàng, tóc dài blonde, expression bậm trợn)
5. **Locky** (random goalkeeper áo đen, găng tay vàng — bonus character)

---

## 4. Background (Parallax 3 lớp)

> **Trade-off:** Mỗi lớp tile lặp được horizontal (seamless tile). Edge trái + phải PHẢI khớp pixel.

| Lớp | File | Size (px) | Tốc độ parallax | Nội dung |
|---|---|---|---|---|
| Far (lớp 1) | `bg_stadium_far.png` | 1280 × 400 | 0.2× | Dome stadium + đèn pha + sky đêm, gradient mờ |
| Mid (lớp 2) | `bg_stadium_mid.png` | 1280 × 400 | 0.5× | Khán đài + đám đông + billboard, alpha top |
| Near (lớp 3) | `bg_stadium_near.png` | 1280 × 200 | 1.0× (=ground speed) | Cờ tam giác bunting + fence + rào | 

**Yêu cầu chung:**
- Top edge fade ra alpha=0 (để layer dưới blend mượt)
- Bottom edge cứng (cắt thẳng) để tile với ground
- KHÔNG vẽ player/obstacle/HUD vào BG
- Style: night stadium, nhiều đèn vàng + đèn xanh + confetti
- Color palette: gradient từ #0a1135 (xa) → #1a2348 (giữa) → #2a3a78 (gần)

### Ground tile
- File: `ground_grass.png`
- Size: `256 × 80`
- Tile horizontal seamless
- Nội dung: grass texture xanh + 1 line trắng mỏng (line bóng) + dirt dưới chân

---

## 5. Obstacles

> **Pivot:** đáy giữa (bottom-center)
> **Yêu cầu:** PNG trong suốt, không drop shadow

| Tên | File | Size (px) | Display scale | Type (jump/slide/both) | Mô tả |
|---|---|---|---|---|---|
| VAR | `obs_var.png` | 200 × 240 | 0.55× → 110×132 | both | Biển báo VAR đỏ trắng, dùng cho cả jump và slide |
| FIFA Corruption | `obs_fifa_corruption.png` | 240 × 220 | 0.55× → 132×121 | jump | Người Arab + bao tiền $, "FIFA" trên bao |
| Injury Card | `obs_injury_card.png` | 180 × 260 | 0.50× → 90×130 | jump | Thẻ đỏ "99 INJURY" có chân cẳng |
| Hate Poop | `obs_hate.png` | 220 × 180 | 0.55× → 121×99 | jump | Đống phân + emoji 💢 + dấu thumbs-down |
| Yellow Card *(mới)* | `obs_yellow_card.png` | 180 × 260 | 0.50× → 90×130 | jump | Thẻ vàng + còi trọng tài |
| Banana Peel *(mới)* | `obs_banana.png` | 160 × 80 | 0.55× → 88×44 | jump (low) | Vỏ chuối trên cỏ, force slide hoặc jump thấp |
| Drone *(mới)* | `obs_drone.png` | 200 × 120 | 0.55× → 110×66 | slide-only | Drone trinh sát bay cao, BUỘC phải slide |

**Type semantic:**
- `jump` → chỉ né được bằng jump
- `slide` → chỉ né được bằng slide
- `both` → né được bằng cả hai

### Spawn vertical
- Obstacles `jump`: spawn ở `y = 600` (chân chạm đất)
- Obstacles `slide-only` (drone): spawn ở `y = 540` (treo lơ lửng cao đầu player)

---

## 6. Coins & Collectibles

| Tên | File | Size (px) | Yêu cầu |
|---|---|---|---|
| Coin spin | `coin_sheet.png` | 384 × 64 (6 frame, mỗi frame 64×64) | Sprite sheet ngang, anim 12fps loop |
| Coin pickup sparkle | `fx_coin_pickup.png` | 128 × 32 (4 frame 32×32) | Particle burst khi pickup |
| Gem (rare, +5x) *(mới)* | `gem_blue.png`, `gem_purple.png` | 64 × 64 | Static, hiếm 5% spawn |
| Trophy (goal) | `trophy.png` | 200 × 220 | Static, dùng ở menu + end of level |

---

## 7. Power-ups

> **Display size:** 64×64 ở HUD, 80×80 khi spawn pickup trên field

| Tên | File | Size (px) | Effect |
|---|---|---|---|
| Magnet | `powerup_magnet.png` | 80 × 80 | Hút coin trong radius 200px (8s) |
| Shield | `powerup_shield.png` | 80 × 80 | Đỡ 1 hit, vỡ |
| Boots x2 | `powerup_boots.png` | 80 × 80 | Tăng coin score x2 (10s) |
| Slow Motion *(mới)* | `powerup_slowmo.png` | 80 × 80 | Slow game 0.5× (5s) |
| Multiplier x3 *(mới)* | `powerup_x3.png` | 80 × 80 | Score x3 (8s) |

---

## 8. UI Elements

### Logo & Brand
| Asset | File | Size (px) | Dùng ở |
|---|---|---|---|
| Logo lớn | `logo_full.png` | 800 × 200 | Menu screen, center |
| Logo nhỏ HUD | `logo_badge.png` | 120 × 60 | Top-left corner in-game (optional) |
| Tagline | có thể text-only, không cần asset | — | "Endless Run · Football Satire" |

### HUD elements
| Asset | File | Size (px) | Position |
|---|---|---|---|
| Coin icon | `icon_coin.png` | 32 × 32 | HUD top, kế bên số coin |
| Heart (life) | `icon_heart.png` | 32 × 32 | HUD top (nếu thêm hệ lives) |
| Distance icon | `icon_distance.png` | 32 × 32 | HUD top, kế bên distance |
| Pause button | `icon_pause.png` | 48 × 48 | HUD top-right |
| Mad Meter face | `face_mad_meter.png` | 48 × 48 | HUD bottom, kế bên thanh meter |

### Bottom HUD buttons (touch + click)
| Asset | File | Size (px) | Action |
|---|---|---|---|
| Slide button | `btn_slide.png` | 96 × 96 | Press → slide |
| Jump button | `btn_jump.png` | 96 × 96 | Press → jump |
| Super button | `btn_super.png` | 120 × 120 | Hold → super (cần Mad Meter full) |
| Slide button pressed | `btn_slide_p.png` | 96 × 96 | State active |
| Jump button pressed | `btn_jump_p.png` | 96 × 96 | State active |

### Panel backgrounds (optional, có thể vẽ procedural)
| Asset | File | Size (px) |
|---|---|---|
| Panel small (Mad Meter) | `panel_meter.png` | 280 × 90 |
| Panel small (Boosts) | `panel_boosts.png` | 180 × 90 |
| Panel medium (Daily Challenge) | `panel_daily.png` | 320 × 90 |

### Misc icons
| Asset | File | Size (px) |
|---|---|---|
| Calendar (Daily Challenge) | `icon_calendar.png` | 48 × 48 |
| Checkpoint dot (filled) | `dot_filled.png` | 24 × 24 |
| Checkpoint dot (empty) | `dot_empty.png` | 24 × 24 |
| Star (rating) | `icon_star.png` | 32 × 32 |

---

## 9. Sounds & Music

### Format
- **BGM (music):** `.mp3`, loop seamless, 128kbps, mono OK
- **SFX (effects):** `.mp3`, short (< 1s), 192kbps, mono OK

### List
| Asset | File | Length | Mô tả |
|---|---|---|---|
| BGM Menu | `bgm_menu.mp3` | 30-60s loop | Nhạc nền menu, vibe World Cup hype |
| BGM Game (normal) | `bgm_game.mp3` | 60s loop | Nhạc nền chạy, beat nhanh upbeat |
| BGM Super | `bgm_super.mp3` | 8s | Nhạc khi bật Super mode, intense |
| SFX Jump | `sfx_jump.mp3` | 0.3s | Tiếng "boing" |
| SFX Slide | `sfx_slide.mp3` | 0.4s | Tiếng "swooosh" |
| SFX Coin | `sfx_coin.mp3` | 0.2s | Tiếng "cling" |
| SFX Coin combo | `sfx_coin_combo.mp3` | 0.4s | Tiếng "cling-cling-cling" cao dần |
| SFX Powerup pickup | `sfx_powerup.mp3` | 0.5s | Tiếng "shiine" |
| SFX Hit (game over) | `sfx_hit.mp3` | 0.6s | Tiếng "crash" + còi |
| SFX Super activate | `sfx_super_start.mp3` | 0.5s | Tiếng "WHOOSH + STUUU" |
| SFX Checkpoint | `sfx_checkpoint.mp3` | 0.4s | Tiếng "ding!" |
| SFX Button click | `sfx_click.mp3` | 0.15s | Tiếng "tap" |
| SFX Countdown beep | `sfx_countdown.mp3` | 0.3s | Tiếng "beep" của 3-2-1 |
| SFX Go | `sfx_go.mp3` | 0.5s | Tiếng "GO!" của GO countdown |

**Nguồn miễn phí thương mại:**
- https://freesound.org (CC0 + CC-BY)
- https://opengameart.org/content/library-of-game-sounds
- https://pixabay.com/sound-effects/
- https://itch.io/game-assets/free/tag-sounds

---

## 10. Level/Map theme (cho v6 mở rộng)

> Mỗi level đổi BG + ground + obstacle palette, gameplay giữ nguyên

| Level | Theme | BG file prefix | Ground file | Obstacle set |
|---|---|---|---|---|
| 1 | Stadium đêm (default) | `bg_stadium_*.png` | `ground_grass.png` | VAR, Corruption, Injury, Hate |
| 2 | Sa mạc Qatar | `bg_desert_*.png` | `ground_sand.png` | VAR, Banana, Drone, Hate |
| 3 | Tuyết Nga | `bg_snow_*.png` | `ground_snow.png` | VAR, Drone, Banana, Yellow Card |
| 4 | Đường phố Paris | `bg_city_*.png` | `ground_road.png` | VAR, Hate, Yellow Card, Drone |
| 5 | Cúp Final | `bg_final_*.png` | `ground_field.png` | All obstacles, speed cao + trophy spawn |

**Asset BG cho mỗi level:** giống stadium → far/mid/near 3 lớp, cùng size 1280×400/400/200.
**Asset ground:** 256×80 tile.

---

## 11. Generation Prompts (cho Midjourney / DALL-E / Stable Diffusion)

> Copy paste prompt → gen → upscale → tách nền với rembg/photoshop → kiểm tra size khớp spec

### Player (chibi football character)
```
2D game sprite, chibi style, cartoon footballer, full body front view,
running pose, big head proportional, yellow #7 jersey, blue shorts, green boots,
short brown hair, expressive face with eyes wide and mouth open shouting,
transparent background, no shadow, pixel art clean lines, 200x280 px,
character sheet style, single character isolated
```

### Background (stadium night)
```
2D game background, side view stadium at night, parallax layer,
massive dome with stadium lights, crowd silhouettes, country flags bunting,
purple-blue gradient sky, neon yellow stadium lights, confetti falling,
seamless horizontal tile, no characters, no foreground objects,
cartoon style, 1280x400 px, transparent top edge
```

### Obstacle (VAR sign)
```
2D game obstacle sprite, VAR video referee sign, red and white striped barricade,
hexagon stop sign on top reading "VAR", standing on ground level,
cartoon style, transparent background, no shadow, 200x240 px,
isolated single object
```

---

## 12. Delivery Format

**Khi bạn gen xong asset, gửi cho mình theo cấu trúc:**

```
assets-delivery/
├── characters/
│   ├── ronardo/
│   │   ├── player_ronardo_run_1.png
│   │   ├── player_ronardo_run_2.png
│   │   ├── ... (9 file)
│   ├── massi/
│   │   ├── (9 file)
│   └── mbape/
│       └── (9 file)
├── backgrounds/
│   ├── bg_stadium_far.png
│   ├── bg_stadium_mid.png
│   ├── bg_stadium_near.png
│   └── ground_grass.png
├── obstacles/
│   ├── obs_var.png
│   ├── obs_fifa_corruption.png
│   ├── obs_injury_card.png
│   ├── obs_hate.png
│   └── obs_drone.png
├── coins/
│   ├── coin_sheet.png
│   └── fx_coin_pickup.png
├── powerups/
│   ├── powerup_magnet.png
│   ├── powerup_shield.png
│   └── powerup_boots.png
├── ui/
│   ├── logo_full.png
│   ├── icon_coin.png
│   ├── icon_distance.png
│   ├── btn_jump.png
│   ├── btn_slide.png
│   └── btn_super.png
└── sounds/
    ├── bgm_menu.mp3
    ├── bgm_game.mp3
    ├── sfx_jump.mp3
    └── (... các file khác)
```

**Format:** ZIP file hoặc Google Drive link. Mình sẽ tải về `/public/assets/` đúng cấu trúc + load qua manifest.

---

## Checklist trước khi gửi asset

- [ ] Tất cả PNG có alpha channel (không có nền trắng/đen)
- [ ] Tất cả file PNG dùng `_` không dùng khoảng trắng / dấu tiếng Việt trong tên
- [ ] Size khớp spec ±5px (Phaser handle scale runtime)
- [ ] Player 9 pose mỗi character — KHÔNG thiếu pose nào
- [ ] BG 3 lớp tile được seamless (test bằng cách paste 2 copy cạnh nhau, không có seam)
- [ ] Obstacle có pivot đáy giữa (chân chạm ground)
- [ ] Coin sheet 6 frame strip ngang, mỗi frame 64×64
- [ ] Sound .mp3 dưới 200KB mỗi file, BGM loop seamless

Done = mình implement v6 sạch sẽ trong 1-2 giờ.
