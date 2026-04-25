import { PRESETS, FONT_OPTIONS } from "../../models/theme.js";
import { presetCardHTML } from "./presetCard.html.js";
const colorRow = (key, label) => `
  <div class="control-row">
    <span class="control-label">${label}</span>
    <span class="control-value">
      <span class="swatch-control">
        <input type="color" data-control="${key}" />
        <input type="text" data-control-text="${key}" maxlength="9" />
      </span>
    </span>
  </div>
`;
export const themeTabHTML = (activePresetId) => `
  <div class="theme-toolbar">
    <span class="control-group-label">Presets</span>
    <button type="button" class="btn-link" data-action="import-theme">
      <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
        <path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
              d="M12 4 V16 M7 11 L12 16 L17 11 M5 20 H19"/>
      </svg>
      Import JSON
    </button>
  </div>

  <div class="preset-grid" role="radiogroup" aria-label="Theme presets">
    ${PRESETS.map((p, i) => presetCardHTML(p, i, p.id === activePresetId)).join("")}
  </div>

  <div class="customize-section">
    <div class="customize-head">
      <h3>Customize</h3>
      <button type="button" class="btn-reset" data-action="reset">Reset to preset</button>
    </div>

    <div class="control-group">
      <span class="control-group-label">Color</span>
      ${colorRow("paper", "Paper")}
      ${colorRow("ink", "Ink")}
      ${colorRow("inkSoft", "Ink soft")}
      ${colorRow("inkMute", "Ink muted")}
      ${colorRow("accent", "Accent")}
      ${colorRow("accentInk", "Accent ink")}
    </div>

    <div class="control-group">
      <span class="control-group-label">Typography</span>
      <div class="control-row">
        <span class="control-label">Display</span>
        <span class="control-value">
          <div class="select-control">
            <select data-control="displayFont">
              ${FONT_OPTIONS.map((f) => `<option value="${f.id}">${f.label}</option>`).join("")}
            </select>
          </div>
        </span>
      </div>
      <div class="control-row">
        <span class="control-label">Body</span>
        <span class="control-value">
          <div class="select-control">
            <select data-control="bodyFont">
              ${FONT_OPTIONS.map((f) => `<option value="${f.id}">${f.label}</option>`).join("")}
            </select>
          </div>
        </span>
      </div>
      <div class="control-row">
        <span class="control-label">Mono</span>
        <span class="control-value">
          <div class="select-control">
            <select data-control="monoFont">
              ${FONT_OPTIONS.filter((f) => f.kind === "mono").map((f) => `<option value="${f.id}">${f.label}</option>`).join("")}
            </select>
          </div>
        </span>
      </div>
      <div class="control-row">
        <span class="control-label">Display weight</span>
        <span class="control-value">
          <div class="slider-control">
            <input type="range" data-control="displayWeight" min="300" max="900" step="100" />
            <span class="slider-value" data-display="displayWeight">700</span>
          </div>
        </span>
      </div>
      <div class="control-row">
        <span class="control-label">Display italic</span>
        <span class="control-value">
          <button type="button" class="toggle" data-control="displayItalic" aria-pressed="false"></button>
        </span>
      </div>
      <div class="control-row">
        <span class="control-label">Letter spacing</span>
        <span class="control-value">
          <div class="slider-control">
            <input type="range" data-control="letterSpacing" min="-0.05" max="0.05" step="0.005" />
            <span class="slider-value" data-display="letterSpacing">0</span>
          </div>
        </span>
      </div>
      <div class="control-row">
        <span class="control-label">Title size</span>
        <span class="control-value">
          <div class="slider-control">
            <input type="range" data-control="titleScale" min="0.7" max="1.4" step="0.05" />
            <span class="slider-value" data-display="titleScale">1.0×</span>
          </div>
        </span>
      </div>
      <div class="control-row">
        <span class="control-label">Figures</span>
        <span class="control-value">
          <div class="segmented" data-control="figureStyle" role="group">
            <button type="button" data-value="lining">Lining</button>
            <button type="button" data-value="oldstyle">Oldstyle</button>
            <button type="button" data-value="tabular">Tabular</button>
          </div>
        </span>
      </div>
    </div>

    <div class="control-group">
      <span class="control-group-label">Layout</span>
      <div class="control-row">
        <span class="control-label">Density</span>
        <span class="control-value">
          <div class="segmented" data-control="density" role="group">
            <button type="button" data-value="compact">Compact</button>
            <button type="button" data-value="comfortable">Comfortable</button>
            <button type="button" data-value="loose">Loose</button>
          </div>
        </span>
      </div>
      <div class="control-row">
        <span class="control-label">Rules</span>
        <span class="control-value">
          <div class="segmented" data-control="rule" role="group">
            <button type="button" data-value="hairline">Hair</button>
            <button type="button" data-value="standard">Std</button>
            <button type="button" data-value="heavy">Heavy</button>
            <button type="button" data-value="double">Double</button>
          </div>
        </span>
      </div>
      <div class="control-row">
        <span class="control-label">Total bar</span>
        <span class="control-value">
          <div class="segmented" data-control="totalStyle" role="group">
            <button type="button" data-value="outlined">Outline</button>
            <button type="button" data-value="inverted">Inverted</button>
            <button type="button" data-value="underlined">Underline</button>
          </div>
        </span>
      </div>
      <div class="control-row">
        <span class="control-label">Radius</span>
        <span class="control-value">
          <div class="slider-control">
            <input type="range" data-control="radius" min="0" max="12" step="1" />
            <span class="slider-value" data-display="radius">0px</span>
          </div>
        </span>
      </div>
    </div>
  </div>
`;
