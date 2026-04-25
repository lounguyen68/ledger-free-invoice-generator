import { FONT_OPTIONS } from "../../models/theme.js";
/** A single preset thumbnail card in the Theme tab grid. */
export const presetCardHTML = (p, index, isActive) => {
    const fontStack = FONT_OPTIONS.find((f) => f.id === p.displayFont)?.stack ?? "serif";
    const num = String(index + 1).padStart(2, "0");
    return `
    <button type="button" class="preset-card" data-preset="${p.id}"
            role="radio" aria-checked="${isActive ? "true" : "false"}">
      <span class="preset-thumb" style="background:${p.paper};color:${p.ink};font-family:${fontStack}">
        <span class="preset-num">${num}</span>
        <span class="preset-thumb-mark" style="font-weight:${p.displayWeight};font-style:${p.displayItalic ? "italic" : "normal"};color:${p.ink}">${p.id === "mono" ? "&gt; INVOICE" : "INVOICE"}</span>
        <span class="preset-thumb-rules" style="color:${p.ink}">
          <span></span><span></span><span></span><span></span>
        </span>
      </span>
      <span class="preset-meta">
        <span class="preset-name">${p.name}</span>
        <span class="preset-tag">${p.tagline}</span>
      </span>
    </button>
  `;
};
