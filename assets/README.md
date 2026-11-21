# Basements & Basilisks — Image Assets

Place custom art inside these folders and assign paths in [`manifest.json`](./manifest.json) (or visually using **Asset Studio** at `tools/asset-studio.html` / the Title Screen button).

## Folder Layout
- `assets/heroes/<key>.png` — Hero portraits & card splash art (e.g., `arthur.png`, `cinder.png`, `dane.png`).
- `assets/enemies/<key>.png` — Enemy tokens & card portraits (e.g., `goblin.png`, `owlbear.png`, `nezznar.png`).
- `assets/items/<key>.png` — Square item icons (e.g., `flametongue.png`, `potion_healing.png`).
- `assets/maps/<theme_or_encounter>.png` — Battleground background art for themes (`forest`, `cave`, `tavern`, `dungeon`) or specific encounters (`owlbear`, `spider`, `forge`).

## Fallback & External Hosting
- Any empty entry (`""`) automatically falls back to the built-in procedural ink-and-parchment art.
- Set `"baseUrl"` in `manifest.json` (for example, a GitHub Raw or GitHub Pages URL) if you want single-file HTML exports to load artwork remotely without bloating the HTML file.
