# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

CIVILIAN ACCESS ATLAS — a build-free, Japanese-language static site (D3 choropleth) classifying 195 countries (193 UN members + Palestine + Vatican) by the legal entry path for civilians to acquire firearms. Deployed to GitHub Pages (<https://katzkawai.org/kklab-gun-ownership/>) on every push to `main` via `.github/workflows/deploy-pages.yml`, which uploads the repo root as-is. `AGENTS.md` holds the contributor guidelines (style, testing checklist, commit/PR conventions) and is the authority on those topics.

## Commands

No build step, no package manager, no test framework.

```bash
python3 -m http.server 8000          # serve at http://localhost:8000 (must be HTTP — map is loaded via fetch())
node --check app.js                  # JS syntax check
node --check data/countries.js
python3 -m json.tool data/world.geojson >/dev/null   # GeoJSON validity
```

Data integrity check (no script is checked in; run inline):

```bash
node -e 'global.window={};require("./data/countries.js");const r=window.GUN_ATLAS_DATA;
const pairs=r.codePairs.trim().split(/\s+/);console.log("headline",pairs.length-r.supplementalCodes.split(/\s+/).length);'
```

Expected: `headline 195`. Also verify every code in `accessibleCodes`/`exceptionalCodes`/`prohibitedCodes`/`notes`/`markers`/`officialSources` appears in `codePairs`.

## Architecture

Three scripts load in order in `index.html`: `vendor/d3.v7.min.js` → `data/countries.js` (sets `window.GUN_ATLAS_DATA`) → `app.js` (an IIFE that reads that global). Everything else is static markup/CSS.

### Data model (`data/countries.js`)

The classification is **not** stored per-country. It is derived in `app.js` `categoryFor()` from membership in three whitespace-separated code lists, with **`purpose` as the default** for any code not listed:

| Category key | Source | UI label |
| --- | --- | --- |
| `accessible` | `accessibleCodes` | 一般要件 (A) |
| `exceptional` | `exceptionalCodes` | 例外的 (C) |
| `prohibited` | `prohibitedCodes` | 原則禁止 (D) |
| `purpose` | *everything else* | 目的限定 (B) |

Consequences: adding a country to `codePairs` silently makes it 目的限定; moving a country between categories means editing the lists, not a field. `codePairs` (`ISO3:ISO2`) is the master roster; `supplementalCodes` (`TWN XKX`) are shown but excluded from headline counts. Country names come from `Intl.DisplayNames` (ja/en) keyed on ISO2, overridden by `customNames`. `notes` (per-country Japanese summary), `officialSources` (primary-law URL; fallback is a Wikipedia anchor built from the English name), and `markers` (lon/lat for microstates too small to click) are all keyed by ISO3 and optional.

The category keys (`accessible`/`purpose`/`exceptional`/`prohibited`) are load-bearing across all three files: CSS custom properties and `.swatch-*`/`.country.*`/`.status-label.*` classes in `styles.css`, `data-filter`/`data-count` attributes in `index.html`, and `CATEGORY_META` in `app.js`. Renaming one requires touching all of them.

### Map (`app.js`)

`data/world.geojson` features carry ISO3 in `feature.id`; `geometryAliases` remaps non-standard IDs (`-99`→CYP, `OSA`→XKX, `SDS`→SSD, `ABV`→SOM). Antarctica (`ATA`) is dropped at load. Features with no matching country render as `.non-country`. The map is redrawn from scratch on resize (`ResizeObserver` → `drawMap()`), so all map state (`projection`, `zoomBehavior`, selection highlight) is recomputed there rather than patched. Selection state is mirrored via `data-code` attributes on paths, markers, and directory buttons.

## Editorial constraints

- Keep 195 headline countries; Taiwan/Kosovo stay supplemental unless scope changes.
- Any classification change should be reflected in `notes` where the country has one, and the reviewed date appears in **four** places: the header comment of `data/countries.js`, README (最終確認日), and `index.html` (hero "REVIEWED" block and footer).
- UI copy is Japanese; keep it that way. The category definitions are duplicated verbatim between `CATEGORY_META` in `app.js`, the `.legend-notes` block in `index.html`, and the README table — change all three together.
- Do not hand-edit `vendor/d3.v7.min.js` or reformat `data/world.geojson`.
