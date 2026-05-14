# Bootstrap checklist

Follow these steps to turn the starter into **your game**. Every step is
optional, but doing them in order tends to be the fastest path.

---

## 1. Rename the project

- [ ] Edit `package.json` → change `"name"` from `"devin-game-starter"`.
- [ ] Edit `app/layout.tsx` → change `metadata.title` and `metadata.description`.
- [ ] Edit `app/page.tsx` → adjust the rotate-to-landscape overlay copy
      if you want a game-specific message.

## 2. Set canvas size & gameplay constants

File: `app/game/constants.ts`

- [ ] `GAME_HEIGHT` — base canvas height in pixels (default `720`).
      The width is computed from the viewport aspect ratio.
- [ ] `GROUND_Y`, `PLAYER_X` — vertical ground level and player horizontal
      anchor for runner / platformer games.
- [ ] `GRAVITY`, `JUMP_VELOCITY`, `SLIDE_DURATION` — physics tuning.
- [ ] `BASE_SPEED`, `MAX_SPEED`, `SPEED_RAMP` — scroll/auto-run speed.
- [ ] `COIN_VALUE`, `COIN_DISTANCE_VALUE` — scoring weights.
- [ ] `SUPER_DURATION`, `MAD_METER_*` — power-up tuning.
- [ ] `DAILY_CHALLENGE_TARGET` — how far the player must run to clear the
      daily challenge.
- [ ] `COLORS`, `PALETTE_HEX` — palette used by procedural textures.

## 3. Replace the character roster

File: `app/game/config/characters.ts`

- [ ] Change the `CharacterId` union and the entries in `CHARACTERS`.
- [ ] Set `status: "available"` on every character you want playable.
- [ ] Adjust `passiveName`, `passiveText`, `superName`, `superText`.
- [ ] Tune `madGainMultiplier` (Super-meter fill speed) and
      `superDurationMultiplier` (length of Super state).

## 4. Replace the visuals

The template ships with procedural placeholders so the game runs
**without any PNG files**. You replace them in two stages:

### 4a. Keep procedural, just restyle

Each procedural function is a Canvas2D drawing function. Edit them in
place:

- `app/game/assets/player.ts`   — `drawPlayer(ctx, pose)`
- `app/game/assets/obstacles.ts` — `createVarTexture`, `createInjuryCardTexture`, etc.
- `app/game/assets/background.ts` — `createSkyTexture`, `createStadiumTexture`, `createGroundTexture`
- `app/game/assets/ui.ts` — logo, panel, speech bubble, gauges
- `app/game/visuals/stadiumBand.ts` — crowd / ad band

### 4b. Swap in real PNG art

When you have art, the recommended pattern is:

```ts
// In app/game/scenes/PreloadScene.ts preload()
this.load.image("_raw_player-run1", "/assets/my-game/player_run1.png");

// In app/game/scenes/PreloadScene.ts create()
this.preResize("_raw_player-run1", "player-run1", 96, 120);
//                ^ raw key          ^ final key   ^ exact display size
```

The `preResize()` helper draws the PNG onto a Canvas at the **exact**
display size your scene uses, then registers it as a Phaser texture and
discards the raw PNG. This eliminates GPU upscaling and the resulting
"blurry sprite while moving" artifact on high-DPI screens.

Put your PNGs under `public/assets/<your-game>/`.

## 5. Rename obstacles

The example template has historical obstacle kinds (`var`, `corruption`,
`injury`, `hate`, `drone`) carried over from Football Madness Run. To
rename them:

- [ ] Edit the `ObstacleKind` union in `app/game/assets/manifest.ts`.
- [ ] Rename the texture keys in `app/game/scenes/PreloadScene.ts`
      `create()` (e.g. `createVarTexture` → your own).
- [ ] Update the `textureKey` field in each `OBSTACLES` entry to match.
- [ ] Search-and-replace any string references in `GameScene.ts` /
      `UIScene.ts`.

## 6. Customize UI text

Files: `app/game/scenes/IntroScene.ts`, `MainMenuScene.ts`,
`CharacterSelectScene.ts`, `UIScene.ts`, `GameOverScene.ts`.

- [ ] Title text (intro): "READY TO RUN?" → your title.
- [ ] Subtitle: "DODGE EVERYTHING. CHASE THE HIGH SCORE." → your tagline.
- [ ] Main menu "HOW TO PLAY" copy.
- [ ] Game Over flavor `tips`.
- [ ] HUD labels: `DAILY ROUTE`, `SURVIVE THE RUN`, `SUPER METER`,
      `DAILY CHALLENGE`, `BOOSTS`.

## 7. Adjust localStorage keys (optional)

The template uses `devin-game-*` keys (best score, character, coins,
daily progress). Search for `devin-game-` and rename if you want a
game-specific namespace.

## 8. Test on PC + mobile

- [ ] PC, e.g. 1280×720 — game should letterbox cleanly (FIT mode).
- [ ] Phone landscape, e.g. 844×390 (iPhone 12 Pro) — game should fill
      the entire viewport (ENVELOP mode). HUD elements positioned via
      `SAFE_ZONE` stay visible.
- [ ] Phone portrait — rotate-to-landscape overlay appears (see
      `globals.css` media query).

## 9. Deploy

`next build` produces a `.next` output suitable for any Vercel-style
host. For a fully-static export, add `output: "export"` in
`next.config.ts` and deploy the `out/` directory.

## 10. Add real audio (optional)

The template ships **without** audio. Add via:

```ts
// PreloadScene preload()
this.load.audio("jump", "/assets/my-game/jump.mp3");

// In GameScene
this.sound.play("jump", { volume: 0.4 });
```

---

That's it. The template gives you a working game out of the box; you
swap in your own gameplay rules, art, copy, and you've shipped.
