
# Campaign Pacing Calculator Widget

Embed-ready widget using **Create React App** + **r2wc** (React → Web Component) with **no Shadow DOM** so it inherits your host site's styles.

## Quick Start

```bash
npm install
npm run build
# Outputs to build/, then copies to docs/ and creates stable filenames:
# docs/static/js/main.js and docs/static/css/main.css
```

## Publish on GitHub Pages

1. Commit and push to GitHub.
2. In your repo settings: **Pages** → **Branch: `main`** → **Folder: `/docs`**.
3. Your stable script URL will be:
   `https://<your-username>.github.io/<repo>/static/js/main.js`

## Embed Snippet

```html
<script defer src="https://<your-username>.github.io/<repo>/static/js/main.js"></script>
<r2wc-pacing-calculator config='{"currency":"USD","decimals":2}'></r2wc-pacing-calculator>
```

> The `postbuild` script copies the hashed CRA assets into `docs/static/*` and additionally creates **stable** filenames:
> `main.js` and `main.css`. This allows a predictable embed URL.

## Config

- `currency` (default: `USD`) — any ISO currency code supported by `Intl.NumberFormat`.
- `decimals` (default: `0`) — number of fractional digits for currency formatting.

Example:
```html
<r2wc-pacing-calculator config='{"currency":"EUR","decimals":2}'></r2wc-pacing-calculator>
```

## Dev Notes

- r2wc is configured with `{ shadow: false }` so the element inherits host styles.
- The component does **not** auto-mount anywhere; it only defines a custom element.
- All UI is grayscale to avoid host palette clashes.
