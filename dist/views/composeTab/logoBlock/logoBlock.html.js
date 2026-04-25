/** Logo dropzone + position picker + size sliders. */
export const logoBlockHTML = () => `
  <div class="logo-block">
    <div class="logo-block-head">
      <span class="logo-block-title">Logo</span>
      <span class="logo-block-hint">PNG · JPG · SVG · WebP · max 1 MB</span>
    </div>

    <div class="dropzone" id="logo-dropzone" data-empty="true" tabindex="0"
         role="button" aria-label="Upload logo: drop a file here or press Enter to browse">
      <input id="logo-input" type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" hidden />

      <div class="dropzone-empty">
        <svg class="dropzone-glyph" viewBox="0 0 48 48" aria-hidden="true">
          <rect x="6" y="6" width="36" height="36" rx="1" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3"/>
          <path d="M24 32 V18 M18 24 L24 18 L30 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="dropzone-text"><strong>Drop</strong> a file here<br/>or click to browse</span>
      </div>

      <div class="dropzone-filled" hidden>
        <img id="logo-preview-img" alt="" />
        <div class="dropzone-overlay">
          <button type="button" class="dropzone-icon" id="logo-replace" aria-label="Replace logo" title="Replace">
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
                    d="M4 12a8 8 0 0 1 14-5.3L20 9 M20 4v5h-5 M20 12a8 8 0 0 1-14 5.3L4 15 M4 20v-5h5"/>
            </svg>
          </button>
          <button type="button" class="dropzone-icon dropzone-icon--danger" id="logo-remove" aria-label="Remove logo" title="Remove">
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                    d="M6 6 L18 18 M18 6 L6 18"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <p class="logo-error" id="logo-error" hidden></p>

    <div class="logo-position-block" id="logo-controls" hidden>
      <span class="control-group-label">Position</span>
      <div class="position-picker" role="radiogroup" aria-label="Logo position">
        <button type="button" class="position-tile" data-layout="stacked-left"
                role="radio" aria-checked="false" title="Stacked, top-left">
          <svg viewBox="0 0 60 40" aria-hidden="true">
            <rect x="0.5" y="0.5" width="59" height="39" fill="none" stroke="currentColor" stroke-width="0.8"/>
            <rect class="pos-logo" x="4" y="4" width="14" height="8" fill="currentColor"/>
            <line class="pos-line" x1="4" y1="16" x2="22" y2="16" stroke="currentColor" stroke-width="0.8"/>
            <line class="pos-line" x1="4" y1="20" x2="18" y2="20" stroke="currentColor" stroke-width="0.8"/>
            <line class="pos-line" x1="4" y1="24" x2="22" y2="24" stroke="currentColor" stroke-width="0.8"/>
            <text x="56" y="13" font-size="9" font-weight="700" text-anchor="end" font-family="serif" fill="currentColor">Aa</text>
          </svg>
          <span class="position-label">Stacked</span>
        </button>
        <button type="button" class="position-tile" data-layout="inline-left"
                role="radio" aria-checked="false" title="Inline with sender, top-left">
          <svg viewBox="0 0 60 40" aria-hidden="true">
            <rect x="0.5" y="0.5" width="59" height="39" fill="none" stroke="currentColor" stroke-width="0.8"/>
            <rect class="pos-logo" x="4" y="6" width="10" height="12" fill="currentColor"/>
            <line class="pos-line" x1="17" y1="8" x2="32" y2="8" stroke="currentColor" stroke-width="0.8"/>
            <line class="pos-line" x1="17" y1="12" x2="28" y2="12" stroke="currentColor" stroke-width="0.8"/>
            <line class="pos-line" x1="17" y1="16" x2="32" y2="16" stroke="currentColor" stroke-width="0.8"/>
            <text x="56" y="13" font-size="9" font-weight="700" text-anchor="end" font-family="serif" fill="currentColor">Aa</text>
          </svg>
          <span class="position-label">Inline</span>
        </button>
        <button type="button" class="position-tile" data-layout="right"
                role="radio" aria-checked="false" title="Top right">
          <svg viewBox="0 0 60 40" aria-hidden="true">
            <rect x="0.5" y="0.5" width="59" height="39" fill="none" stroke="currentColor" stroke-width="0.8"/>
            <line class="pos-line" x1="4" y1="6" x2="22" y2="6" stroke="currentColor" stroke-width="0.8"/>
            <line class="pos-line" x1="4" y1="10" x2="18" y2="10" stroke="currentColor" stroke-width="0.8"/>
            <line class="pos-line" x1="4" y1="14" x2="22" y2="14" stroke="currentColor" stroke-width="0.8"/>
            <rect class="pos-logo" x="42" y="4" width="14" height="10" fill="currentColor"/>
          </svg>
          <span class="position-label">Top right</span>
        </button>
        <button type="button" class="position-tile" data-layout="centered"
                role="radio" aria-checked="false" title="Centered banner above sender">
          <svg viewBox="0 0 60 40" aria-hidden="true">
            <rect x="0.5" y="0.5" width="59" height="39" fill="none" stroke="currentColor" stroke-width="0.8"/>
            <rect class="pos-logo" x="22" y="4" width="16" height="8" fill="currentColor"/>
            <line class="pos-line" x1="4" y1="20" x2="22" y2="20" stroke="currentColor" stroke-width="0.8"/>
            <line class="pos-line" x1="4" y1="24" x2="18" y2="24" stroke="currentColor" stroke-width="0.8"/>
            <text x="56" y="27" font-size="9" font-weight="700" text-anchor="end" font-family="serif" fill="currentColor">Aa</text>
          </svg>
          <span class="position-label">Centered</span>
        </button>
      </div>

      <div class="control-row">
        <span class="control-label">Width</span>
        <span class="control-value">
          <div class="slider-control">
            <input type="range" id="logo-width" min="0.8" max="4" step="0.1" />
            <span class="slider-value" id="logo-width-display">1.6 in</span>
          </div>
        </span>
      </div>
      <div class="control-row">
        <span class="control-label">Max height</span>
        <span class="control-value">
          <div class="slider-control">
            <input type="range" id="logo-height" min="0.4" max="2" step="0.1" />
            <span class="slider-value" id="logo-height-display">0.8 in</span>
          </div>
        </span>
      </div>
    </div>
  </div>
`;
