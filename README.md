# Football Madness Run

2D football parody endless runner built with Next.js, Phaser, TypeScript, and Tailwind.

The player runs through a stadium route, jumps or slides past football-themed obstacles, collects coins, fills the Mad Meter, and chases the Globe Cup.

## Current Stack

- Next.js 16.2.4 App Router
- Phaser 3.86.0
- React 19
- TypeScript
- Static export enabled in `next.config.ts`

## Run Locally

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

Production build:

```bash
npm run lint
npm run build
```

## Gameplay Controls

- `SPACE` or `ArrowUp`: jump
- `S` or `ArrowDown`: slide
- `E`: activate Super when Mad Meter is full
- Touch HUD buttons work for mobile landscape play

## Project Docs

- `docs/WORKFLOW.md`: 4-phase development workflow for v6.
- `docs/ASSET-SPEC.md`: exact asset size, naming, and delivery spec.
- `TEST-REPORT.md`: previous Devin test report for the deployed build.

## Current Baseline

The local v6 baseline uses deterministic procedural textures for player, stadium, ground, obstacles, coins, trophy, and UI. This keeps the game visually consistent while waiting for an `ASSET-SPEC.md` compliant asset delivery.

Important current fixes:

- Score is decoupled from distance.
- The duplicate `SURVIVE THE MADNESS` HUD bar has been removed.
- HUD progress redraw no longer creates a new text object every frame.
- Main menu speech bubble no longer overlaps the How To Play panel.
- Procedural player scale and slide collision have been retuned.

## Next Milestones

1. Add `app/game/assets/manifest.ts`.
2. Refactor `PreloadScene` to load from manifest when real assets are delivered.
3. Add slide-only obstacle support, starting with `obs_drone`.
4. Add sound manager and mute toggle.
5. Add character select, shop, and daily challenge variants.

