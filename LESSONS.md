# Lessons learned

The hard-won lessons from shipping
[Football Madness Run](https://github.com/tamle6868/football-madness-run)
that shaped this template. Read this before deviating from the
architecture.

---

## 1. Phaser ESM import pattern

```ts
// ✅ Correct
import * as Phaser from "phaser";

// ❌ Wrong — works in CJS, breaks in ESM bundlers (Next.js / Vite)
import Phaser from "phaser";
```

Phaser's published `package.json` declares no default export under the
`exports` field. With Next.js 16's Turbopack the default-import form
sometimes resolves to `undefined`. Always use the namespace import.

## 2. Scale mode: FIT vs ENVELOP — neither is universally right

| Mode    | Behavior                                                       | Pros                                    | Cons                                                       |
| ------- | -------------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------- |
| FIT     | Preserves aspect ratio, adds black bars                        | Whole canvas visible, no clipping       | Black bars (top/bottom on PC, left/right on phone landscape) |
| ENVELOP | Fills viewport, crops canvas to fit                            | Fills phone landscape edge-to-edge      | HUD near canvas edges gets clipped on wide viewports        |
| RESIZE  | Canvas size = viewport size, scene reflows on every resize     | Truly responsive                        | Every scene must reposition its objects on resize — large refactor |

The template uses a **conditional**: FIT for viewports close to 16:9
(desktop), ENVELOP for viewports significantly wider (modern phone
landscape, ultrawide monitors). All HUD elements live inside the
`SAFE_ZONE` defined in `constants.ts` so ENVELOP clipping never hides
them. See `pickScaleMode()` in `app/game/index.ts`.

## 3. Anti-blur: pre-resize PNGs to exact display size

Phaser uploads a texture to the GPU at the PNG's native resolution. If
you draw it at a smaller size with `setScale()` or `setDisplaySize()`,
the GPU resamples it every frame — and on high-DPI screens with
`devicePixelRatio > 1` you'll see a soft / blurry sprite, especially
during motion.

The fix: pre-rasterize the PNG onto a `CanvasTexture` at the exact
pixel dimensions you'll display it, then register that as the texture
Phaser uses. See `preResize()` in `PreloadScene.ts`. Apply this to
detail-heavy sprites (player, large obstacles). Background tile sprites
loaded at native size do **not** need it.

```ts
this.load.image("_raw_player-run1", "/assets/my-game/player_run1.png");
// ... in create()
this.preResize("_raw_player-run1", "player-run1", 96, 120);
```

## 4. Backgrounds: prefer procedural over panorama PNG

Football Madness Run originally shipped large panorama PNGs for the
sky / stadium / ground layers. They had **confetti, bright floodlights,
flag bunting, and crowd patterns baked into the pixels** — and combined
with motion blur and chromatic UI elements, the result physically
fatigued players' eyes within a minute or two of play.

The fix that stuck: **draw the background procedurally** (Canvas2D into
a CanvasTexture), keep it simple, and avoid the following on layers that
scroll:
- Additive (`globalCompositeOperation = "lighter"`) blends with HDR-like
  bright spots.
- High-frequency noise (small confetti dots, dense star fields).
- Sharp diagonal bunting/flag patterns that flicker as the layer scrolls.
- Highly saturated color blocks adjacent to bright lights.

See `app/game/assets/background.ts` for a tested calm pattern: gradient
sky + handful of subtle stars + two dim halos + dome silhouette + truss
suggestion. No `lighter` blends.

## 5. Procedural fallback first, PNG override later

Every gameplay-critical texture should have a procedural generator that
can stand in for the real art. Reasons:
- The template runs zero-asset out of the box (great for cloning).
- Designers can iterate on layout without waiting for art.
- If the artist hands you new sprites, you swap with one `load.image()`
  line — the procedural function is a useful reference for the expected
  silhouette / dimensions.

`commitCanvasAsTexture(scene, key, drawFn, w, h)` (see
`app/game/assets/utils.ts`) is the helper for all procedural drawing.

## 6. `pixelArt: false` for this style

```ts
render: {
  pixelArt: false,
  roundPixels: true,
  antialias: true,
}
```

`pixelArt: true` enables nearest-neighbor sampling. That's right for
intentional 8-bit pixel-art games. For procedural Canvas2D sprites and
gradient backgrounds, `pixelArt: false` + `antialias: true` looks much
better. `roundPixels: true` is kept on so sprites don't shimmer at
sub-pixel positions.

## 7. Don't `import Phaser from "phaser"` in scenes that get hot-reloaded

Next.js dev-mode HMR re-evaluates scene modules. If you import Phaser
inside a scene module rather than at the top of the entrypoint, you can
get multiple Phaser singletons in memory — symptom: tweens that don't
fire, physics objects with no `body`. Top-level imports only.

## 8. Game Over: data flows through scene-data, not globals

```ts
this.scene.start("GameOverScene", {
  distance: 212,
  score: 120,
  coins: 12,
  best: 120,
  isNewBest: true,
});
```

Avoid stashing run results on `window` or a singleton. Pass them as
scene data, then read them via `init(data)` in the receiving scene.

## 9. localStorage is your only persistence

The template uses localStorage for best score, selected character,
total coins, daily-challenge progress. Wrap reads in
`Number(localStorage.getItem("...") ?? 0)` so a missing key just
yields `0`. Namespace your keys (`devin-game-*` in this template) so
you don't clash with anything else on the same origin.

## 10. CI / deployment lessons

- Next.js 16 Turbopack is fast but strict. Run `npm run typecheck`
  before pushing — TS errors that compile locally can still fail Vercel
  builds.
- A static export (`output: "export"` in `next.config.ts`) is the
  cheapest deployment path: GitHub Pages, Cloudflare Pages,
  S3-behind-CloudFront, etc.
- For Vercel previews: deployment protection (401 on preview URLs) is
  on by default for non-prod. Production URLs are public.

## 11. Things that didn't work

- **`Scale.RESIZE` everywhere.** Tried it; every scene had to re-layout
  on every viewport change, lots of bugs around HUD positions. Conditional
  FIT/ENVELOP at startup was far less work and shipped 95% of the value.
- **Bigger panorama PNGs.** Players reported eye strain even with smaller
  panoramas. Procedural calm BG removed the symptom entirely.
- **`globalCompositeOperation: "lighter"`** for flashy effects. Looks
  cool in isolation, causes physical eye fatigue when combined with
  motion. Use `"source-over"` and pre-mix your highlight colors instead.
- **Trusting commit messages without verifying visuals.** When using
  AI assistants to refactor visuals, **always screenshot the production
  build after the change lands**. A commit titled "remove confetti" might
  not actually remove confetti.
