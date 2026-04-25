/**
 * Floating chrome around the preview pane: edit FAB (opens drawer on
 * tablet/mobile), scrim (closes on click), and the always-visible zoom
 * toolbar.
 */
export const previewChromeHTML = () => `
  <button type="button" class="edit-fab" id="edit-fab" aria-controls="edit-drawer" aria-expanded="false" aria-label="Open editor">
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
            d="M14.5 4.5 L19.5 9.5 L9 20 L4 20 L4 15 Z M13 6 L18 11"/>
    </svg>
    <span class="edit-fab-label">Edit</span>
  </button>
  <div class="edit-scrim" id="edit-scrim" aria-hidden="true"></div>

  <div class="zoom-toolbar" role="toolbar" aria-label="Zoom controls">
    <button type="button" class="zoom-btn" id="zoom-out" aria-label="Zoom out" title="Zoom out (−)">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M5 12 L19 12"/>
      </svg>
    </button>
    <button type="button" class="zoom-fit" id="zoom-fit" aria-label="Fit to screen" title="Fit to screen">
      <span id="zoom-display">100%</span>
    </button>
    <button type="button" class="zoom-btn" id="zoom-in" aria-label="Zoom in" title="Zoom in (+)">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 5 L12 19 M5 12 L19 12"/>
      </svg>
    </button>
  </div>
`;
/** Pane shell — toolbar caption and the empty stage that the InvoiceView fills. */
export const previewPaneHTML = () => `
  <section class="preview-pane" id="preview-pane" aria-label="Invoice preview">
    <div class="preview-toolbar">
      <span class="preview-caption">
        <span class="cap-dot"></span>
        <span>letter · 8.5 × 11 in · live</span>
      </span>
    </div>
    <div class="preview-stage" id="preview-stage"></div>
  </section>
`;
