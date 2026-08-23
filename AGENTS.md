# Repository Guidelines

## Project Structure & Module Organization

This repository is a build-free static site. `index.html` defines the Japanese-language page and accessible document structure; `styles.css` contains the responsive layout and visual system; and `app.js` implements D3 map rendering, filtering, search, zoom, and country details. Editorial classifications, notes, and source links live in `data/countries.js`, while `data/world.geojson` supplies boundaries. `vendor/d3.v7.min.js` is a checked-in third-party dependency and should not be hand-edited. GitHub Pages deployment is configured in `.github/workflows/deploy-pages.yml`.

## Build, Test, and Development Commands

No build or package installation is required.

```bash
python3 -m http.server 8000
node --check app.js
node --check data/countries.js
python3 -m json.tool data/world.geojson >/dev/null
```

The first command serves the project at `http://localhost:8000`; use HTTP because the map is loaded with `fetch()`. The remaining commands check JavaScript syntax and GeoJSON validity. Pushing `main` triggers the GitHub Pages workflow.

## Coding Style & Naming Conventions

Follow the existing two-space indentation. JavaScript uses strict mode, double quotes, semicolons, trailing commas in multiline structures, `camelCase` identifiers, and uppercase constants such as `CATEGORY_META`. Use `kebab-case` for CSS classes and custom properties. Keep HTML semantic, preserve Japanese UI copy, and include appropriate `aria-*` attributes for interactive controls. Prefer small, focused edits; do not reformat vendored or GeoJSON files unnecessarily.

## Testing Guidelines

There is no automated test framework or coverage target. Before submitting, run the syntax checks above and manually test the site at desktop and narrow viewport widths. Verify map loading, country selection, category counts and filters, Japanese/English/code search, zoom controls, external source links, keyboard focus, and the browser console. Data changes should preserve 195 headline countries and keep Taiwan and Kosovo supplemental unless project scope changes.

## Commit & Pull Request Guidelines

Recent commits use concise, imperative, sentence-case subjects, for example `Configure public Pages URL`. Keep each commit limited to one logical change. Pull requests should explain the user-visible or data impact, list validation performed, and link relevant issues or authoritative legal sources. Include screenshots for layout or styling changes and call out classification, scope, or reviewed-date changes explicitly.
