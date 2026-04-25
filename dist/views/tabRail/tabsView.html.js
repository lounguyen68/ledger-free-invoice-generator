/**
 * Vertical tab rail (Theme · Compose · Export). Becomes a horizontal
 * bottom bar inside the edit drawer on phones — see tabsView.css.
 */
export const tabRailHTML = () => `
  <nav id="tab-rail" class="tab-rail" role="tablist" aria-orientation="vertical" aria-label="Editor sections">
    <button type="button" class="tab-btn" role="tab"
            data-tab="theme" aria-selected="true" aria-controls="tab-theme" tabindex="0">
      <span class="tab-btn-num">01</span>
      <span class="tab-btn-icon">§</span>
      <span>Theme</span>
    </button>
    <button type="button" class="tab-btn" role="tab"
            data-tab="compose" aria-selected="false" aria-controls="tab-compose" tabindex="-1">
      <span class="tab-btn-num">02</span>
      <span class="tab-btn-icon">✎</span>
      <span>Compose</span>
    </button>
    <button type="button" class="tab-btn" role="tab"
            data-tab="export" aria-selected="false" aria-controls="tab-export" tabindex="-1">
      <span class="tab-btn-num">03</span>
      <span class="tab-btn-icon">↓</span>
      <span>Export</span>
    </button>
  </nav>

  <section class="tab-panel" aria-label="Tab content">
    <div id="tab-panel-header" class="tab-panel-header"></div>
    <div class="tab-panel-body">
      <div id="tab-theme" role="tabpanel"></div>
      <div id="tab-compose" role="tabpanel" hidden></div>
      <div id="tab-export" role="tabpanel" hidden></div>
    </div>
  </section>
`;
