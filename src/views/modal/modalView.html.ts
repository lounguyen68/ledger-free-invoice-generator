import type { ConfirmOptions } from "./modalView.js";

const escapeAttr = (s: string): string => s.replace(/"/g, "&quot;");

export const modalCardHTML = (opts: ConfirmOptions): string => {
  const bodyHTML = opts.bodyHTML
    ? `<div class="modal-body" id="modal-body">${opts.bodyHTML}</div>`
    : opts.body
      ? `<p class="modal-body" id="modal-body">${opts.body}</p>`
      : "";

  const textareaHTML = opts.textarea
    ? `<textarea class="modal-textarea" data-modal-input
                 rows="${opts.textarea.rows ?? 8}"
                 placeholder="${escapeAttr(opts.textarea.placeholder ?? "")}"
                 spellcheck="false" autocomplete="off"></textarea>
       <p class="modal-error" data-modal-error hidden></p>`
    : "";

  const cancelBtn = opts.cancelHidden
    ? ""
    : `<button type="button" class="btn btn-ghost" data-modal-cancel>${opts.cancelLabel ?? "Cancel"}</button>`;

  const secondaryBtn = opts.secondary
    ? `<button type="button" class="btn" data-modal-secondary>${opts.secondary.label}</button>`
    : "";

  return `
    <div class="modal-card" role="dialog" aria-modal="true"
         aria-labelledby="modal-title" aria-describedby="modal-body">
      ${opts.eyebrow ? `<span class="modal-eyebrow">${opts.eyebrow}</span>` : ""}
      <h2 class="modal-title" id="modal-title">${opts.title}</h2>
      ${bodyHTML}
      ${textareaHTML}
      <div class="modal-divider" aria-hidden="true">
        <span></span><span class="modal-glyph">✦</span><span></span>
      </div>
      <div class="modal-actions">
        ${cancelBtn}
        ${secondaryBtn}
        <button type="button"
                class="btn ${opts.destructive ? "btn-destructive" : "btn-primary"}"
                data-modal-confirm>
          ${opts.confirmLabel ?? "Confirm"}
        </button>
      </div>
    </div>
  `;
};
