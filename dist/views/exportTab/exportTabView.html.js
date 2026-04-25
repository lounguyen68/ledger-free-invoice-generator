export const exportTabHTML = () => `
  <div class="export-action">
    <div class="export-action-head">
      <h4>Export PDF</h4>
      <button type="button" class="btn btn-primary" data-action="export-pdf">
        <span class="btn-glyph">↓</span>Export PDF
      </button>
    </div>
    <p>Opens your browser's print dialog. Pick <strong>Save as PDF</strong> as the destination — the filename is pre-filled. US Letter, vector text, no watermark, no upload.</p>
  </div>

  <div class="export-action">
    <div class="export-action-head">
      <h4>Copy theme JSON</h4>
      <button type="button" class="btn" data-action="copy-json">
        <span class="btn-glyph">⎘</span><span data-copy-label>Copy</span>
      </button>
    </div>
    <p>Theme tokens as JSON — paste into another browser to restore the same look.</p>
    <pre class="theme-json" data-json></pre>
  </div>

  <div class="export-action">
    <div class="export-action-head">
      <h4>Reset everything</h4>
      <button type="button" class="btn btn-ghost" data-action="reset-all">
        <span class="btn-glyph">↺</span>Reset
      </button>
    </div>
    <p>Restore default invoice content and Classic theme. Local data is cleared.</p>
  </div>
`;
