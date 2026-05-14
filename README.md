# Devin Game Starter

A reusable **2D game starter template** built with **Phaser 3** + **Next.js 16** +
**TypeScript** + **Tailwind**. Clone it as a template, swap out the example
assets, and ship.

> This template is forked and stripped down from
> [Football Madness Run](https://github.com/tamle6868/football-madness-run).
> It keeps everything that's reusable across games (scene flow, scale
> handling, HUD layout, procedural asset pipeline, anti-blur texture pre-resize)
> and replaces all game-specific branding with generic placeholders.

---

## What you get out of the box

- **Full game loop**: Boot → Preload → Intro → Main Menu → Character Select
  → Game + UI overlay → Game Over.
- **Procedural-first asset pipeline.** Every visual (player, obstacles,
  coins, trophy, logo, backgrounds, UI panels) is generated with Canvas2D
  and committed as a Phaser texture. **No external PNG/SFX required to
  run.** Swap in your own art later by replacing `create*Texture(this)`
  calls with `this.load.image(...)` in `PreloadScene`.
- **Mobile-responsive baked in.** A conditional Phaser scale mode
  (`FIT` vs `ENVELOP`) detects the viewport aspect ratio at startup so
  the game fills modern phone-landscape screens **without black bars**,
  while keeping the full HUD visible on desktop. See
  [`app/game/index.ts`](app/game/index.ts).
- **Anti-blur texture pipeline.** A `preResize()` helper in `PreloadScene`
  pre-rasterizes high-detail sprites to their exact display size so the
  GPU never has to scale them at runtime — eliminating the "blurry sprite
  while moving" artifact on high-DPI screens.
- **6-character roster** with passive/super skills, fully data-driven via
  [`app/game/config/characters.ts`](app/game/config/characters.ts).
- **HUD, route progress, daily challenge, super-meter, boosts panels**
  pre-wired in `UIScene` — drop your own metrics in.
- **Rotate-to-landscape overlay** for mobile portrait users.
- **Static export** (`out/` folder) ready to deploy to Vercel / Netlify /
  Cloudflare Pages / GitHub Pages.

---

## Quick start

```bash
# 1. Use this template on GitHub  →  "Use this template" (top of page)
#    or clone directly:
git clone https://github.com/tamle6868/devin-game-starter my-new-game
cd my-new-game

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev
# → http://localhost:3000

# 4. Build for production
npm run build
```

---

## Project structure

```
app/
├── components/
│   └── GameClient.tsx        ← React mount point for Phaser
├── game/
│   ├── index.ts              ← Phaser game config (scale mode, scenes)
│   ├── constants.ts          ← Canvas size, safe zone, gameplay tuning
│   ├── assets/
│   │   ├── background.ts     ← Procedural sky / stadium / ground
│   │   ├── obstacles.ts      ← Procedural obstacles, coins, trophy
│   │   ├── player.ts         ← Procedural player sprites
│   │   ├── ui.ts             ← Procedural logo, panels, speech bubble
│   │   ├── utils.ts          ← commitCanvasAsTexture, rounded(), Rand
│   │   └── manifest.ts       ← Obstacle spawn rules
│   ├── config/
│   │   └── characters.ts     ← Character roster (passives, supers)
│   ├── scenes/
│   │   ├── BootScene.ts
│   │   ├── PreloadScene.ts   ← Generates / loads textures
│   │   ├── IntroScene.ts
│   │   ├── MainMenuScene.ts
│   │   ├── CharacterSelectScene.ts
│   │   ├── GameScene.ts      ← Core gameplay loop
│   │   ├── UIScene.ts        ← HUD overlay
│   │   └── GameOverScene.ts
│   └── visuals/
│       └── stadiumBand.ts    ← Procedural crowd / ad band texture
├── globals.css               ← Tailwind + rotate overlay styles
├── layout.tsx
└── page.tsx                  ← Mounts <GameClient/> + rotate overlay
```

---

## Customizing for your game

See **[BOOTSTRAP.md](./BOOTSTRAP.md)** for a step-by-step checklist of what
to change when starting a new game.

See **[LESSONS.md](./LESSONS.md)** for the hard-won lessons that shaped
this template (anti-blur pipeline, why FIT vs ENVELOP matters, procedural
fallback strategy, etc.).

---

## Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start the Next.js dev server (port 3000) |
| `npm run build`    | Production build to `.next` / `out/`     |
| `npm run start`    | Serve the production build               |
| `npm run lint`     | ESLint                                   |
| `npm run typecheck`| TypeScript with `--noEmit`               |

---

## License

MIT
