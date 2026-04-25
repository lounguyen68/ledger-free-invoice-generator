/**
 * Editor header — sticky brand row at the top of the app.
 * Renders the brand mark, breadcrumb, GitHub icon, and primary actions.
 */
const GITHUB_URL = "https://github.com/spacingmind/ledger-invoice-generator";
export const headerHTML = () => `
  <header class="app-header" role="banner">
    <a class="brand" href="./" aria-label="Ledger — home">
      <svg class="brand-logo" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="3" y="3" width="58" height="58" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
        <text x="32" y="46" text-anchor="middle" font-family="Fraunces, Georgia, serif"
              font-style="italic" font-weight="700" font-size="44" fill="currentColor">§</text>
        <line x1="14" y1="54" x2="50" y2="54" stroke="currentColor" stroke-width="0.6"/>
      </svg>
      <span class="brand-name">Ledger</span>
    </a>

    <div class="app-breadcrumb">
      <a href="./">Home</a>
      <span class="sep">/</span>
      <span>Editor</span>
    </div>

    <div class="app-actions">
      <a href="${GITHUB_URL}" class="icon-link" rel="noopener" aria-label="View source on GitHub">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-1.95c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.12v3.14c0 .31.21.68.8.56A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/>
        </svg>
      </a>
      <button id="reset-btn" class="btn btn-ghost" type="button">
        <span class="btn-glyph">↺</span><span class="btn-label">Reset</span>
      </button>
      <button id="download-btn" class="btn btn-primary" type="button">
        <span class="btn-glyph">↓</span><span class="btn-label">Export PDF</span>
      </button>
    </div>
  </header>
`;
