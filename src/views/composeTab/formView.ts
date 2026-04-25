import type { InvoiceModel } from "../../models/invoiceModel.js";
import type { InvoiceFields, LogoLayout } from "../../models/types.js";
import type { CurrencyCode } from "../../models/currency.js";
import { CURRENCIES, isCurrencyCode } from "../../models/currency.js";
import { escapeAttr } from "../../models/format.js";
import { composeFormHTML } from "./formView.html.js";

const MAX_LOGO_BYTES = 1024 * 1024; // 1 MB hard cap (localStorage budget is ~5 MB)
const VALID_LAYOUTS: ReadonlyArray<LogoLayout> = ["stacked-left", "inline-left", "right", "centered"];

export class FormView {
  private form!: HTMLFormElement;
  private itemsContainer!: HTMLDivElement;
  private addBtn!: HTMLButtonElement;
  private currencySelect!: HTMLSelectElement | null;

  private dropzone!: HTMLElement | null;
  private logoInput!: HTMLInputElement | null;
  private dropzoneEmpty!: HTMLElement | null;
  private dropzoneFilled!: HTMLElement | null;
  private logoPreviewImg!: HTMLImageElement | null;
  private logoReplaceBtn!: HTMLButtonElement | null;
  private logoRemoveBtn!: HTMLButtonElement | null;
  private logoError!: HTMLElement | null;
  private logoControls!: HTMLElement | null;
  private logoWidthInput!: HTMLInputElement | null;
  private logoHeightInput!: HTMLInputElement | null;
  private logoWidthDisplay!: HTMLElement | null;
  private logoHeightDisplay!: HTMLElement | null;
  private positionPicker!: HTMLElement | null;

  private suppressItemsRender = false;

  constructor(private model: InvoiceModel) {}

  mount(host: HTMLElement): void {
    host.innerHTML = composeFormHTML();

    this.form = host.querySelector("#invoice-form") as HTMLFormElement;
    this.itemsContainer = host.querySelector("#items") as HTMLDivElement;
    this.addBtn = host.querySelector("#add-item") as HTMLButtonElement;
    this.currencySelect = host.querySelector("#currency-select") as HTMLSelectElement | null;

    this.dropzone = host.querySelector("#logo-dropzone");
    this.logoInput = host.querySelector("#logo-input") as HTMLInputElement | null;
    this.dropzoneEmpty = this.dropzone?.querySelector(".dropzone-empty") ?? null;
    this.dropzoneFilled = this.dropzone?.querySelector(".dropzone-filled") ?? null;
    this.logoPreviewImg = host.querySelector("#logo-preview-img") as HTMLImageElement | null;
    this.logoReplaceBtn = host.querySelector("#logo-replace") as HTMLButtonElement | null;
    this.logoRemoveBtn = host.querySelector("#logo-remove") as HTMLButtonElement | null;
    this.logoError = host.querySelector("#logo-error");
    this.logoControls = host.querySelector("#logo-controls");
    this.logoWidthInput = host.querySelector("#logo-width") as HTMLInputElement | null;
    this.logoHeightInput = host.querySelector("#logo-height") as HTMLInputElement | null;
    this.logoWidthDisplay = host.querySelector("#logo-width-display");
    this.logoHeightDisplay = host.querySelector("#logo-height-display");
    this.positionPicker = host.querySelector(".position-picker");

    this.syncFieldsFromModel();
    this.renderItems();
    this.populateCurrency();
    this.syncCurrency();
    this.bindLogo();
    this.syncLogo();

    this.form.addEventListener("input", (e) => {
      const target = e.target as HTMLElement;
      // Item rows handle their own input — skip to avoid double work
      if (target.closest(".item-row")) return;
      // Currency select dispatches its own change handler, don't double-process
      if (target === this.currencySelect) return;
      this.model.setFieldsFromForm(this.form);
    });

    this.addBtn.addEventListener("click", () => this.model.addItem());

    this.currencySelect?.addEventListener("change", () => {
      const v = this.currencySelect?.value;
      if (isCurrencyCode(v)) this.model.setCurrency(v as CurrencyCode);
    });

    this.model.subscribe((detail) => {
      if (detail.kind === "items") {
        if (this.suppressItemsRender) return;
        this.renderItems();
      }
      if (detail.kind === "currency" || detail.kind === "reset") {
        this.syncCurrency();
      }
      if (detail.kind === "field" || detail.kind === "reset") {
        this.syncLogo();
      }
      if (detail.kind === "reset") {
        this.syncFieldsFromModel();
        this.renderItems();
      }
    });
  }

  private bindLogo(): void {
    /* file input → model */
    this.logoInput?.addEventListener("change", () => {
      const file = this.logoInput?.files?.[0];
      if (!file) return;
      this.handleLogoFile(file);
      if (this.logoInput) this.logoInput.value = ""; // allow re-pick same file
    });

    /* dropzone — click to browse, keyboard activation */
    if (this.dropzone) {
      this.dropzone.addEventListener("click", (e) => {
        /* if user clicked the overlay icons, let those handlers run instead */
        const target = e.target as HTMLElement;
        if (target.closest(".dropzone-icon")) return;
        this.logoInput?.click();
      });
      this.dropzone.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        this.logoInput?.click();
      });

      /* drag & drop */
      const onDragEnter = (e: DragEvent): void => {
        e.preventDefault();
        this.dropzone?.classList.add("is-dragover");
      };
      const onDragLeave = (e: DragEvent): void => {
        if (e.target !== this.dropzone) return;
        this.dropzone?.classList.remove("is-dragover");
      };
      this.dropzone.addEventListener("dragenter", onDragEnter);
      this.dropzone.addEventListener("dragover", (e) => { e.preventDefault(); });
      this.dropzone.addEventListener("dragleave", onDragLeave);
      this.dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        this.dropzone?.classList.remove("is-dragover");
        const file = e.dataTransfer?.files?.[0];
        if (file) this.handleLogoFile(file);
      });
    }

    /* prevent the whole window from navigating when the user misses the zone */
    window.addEventListener("dragover", (e) => e.preventDefault());
    window.addEventListener("drop", (e) => {
      if ((e.target as HTMLElement)?.closest("#logo-dropzone")) return;
      e.preventDefault();
    });

    /* overlay icons */
    this.logoReplaceBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.logoInput?.click();
    });
    this.logoRemoveBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.model.setLogo("");
      this.clearLogoError();
    });

    /* position picker */
    this.positionPicker?.addEventListener("click", (e) => {
      const tile = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-layout]");
      if (!tile) return;
      const layout = tile.dataset["layout"];
      if (layout && (VALID_LAYOUTS as readonly string[]).includes(layout)) {
        this.model.setLogoLayout(layout as LogoLayout);
      }
    });

    /* sliders */
    this.logoWidthInput?.addEventListener("input", () => {
      const v = parseFloat(this.logoWidthInput?.value ?? "");
      if (Number.isFinite(v)) this.model.setLogoSize(v, undefined);
    });
    this.logoHeightInput?.addEventListener("input", () => {
      const v = parseFloat(this.logoHeightInput?.value ?? "");
      if (Number.isFinite(v)) this.model.setLogoSize(undefined, v);
    });
  }

  private handleLogoFile(file: File): void {
    if (!file.type.startsWith("image/")) {
      this.showLogoError("Please choose an image file (PNG, JPG, SVG, WebP).");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      const kb = Math.round(file.size / 1024);
      this.showLogoError(`File is ${kb} KB — keep it under 1024 KB so it fits in browser storage.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return;
      this.model.setLogo(result);
      this.clearLogoError();
    };
    reader.onerror = () => this.showLogoError("Couldn't read that file. Try another image.");
    reader.readAsDataURL(file);
  }

  private syncLogo(): void {
    const fields = this.model.getData().fields;
    const url = fields.logo;

    /* dropzone empty/filled state */
    if (this.dropzone) {
      this.dropzone.dataset["empty"] = url ? "false" : "true";
    }
    if (url && this.logoPreviewImg && this.dropzoneEmpty && this.dropzoneFilled) {
      this.logoPreviewImg.src = url;
      this.dropzoneEmpty.setAttribute("hidden", "");
      this.dropzoneFilled.removeAttribute("hidden");
    } else if (this.dropzoneEmpty && this.dropzoneFilled) {
      this.dropzoneEmpty.removeAttribute("hidden");
      this.dropzoneFilled.setAttribute("hidden", "");
      if (this.logoPreviewImg) this.logoPreviewImg.removeAttribute("src");
    }

    /* hide position/size controls when no logo */
    if (this.logoControls) {
      if (url) this.logoControls.removeAttribute("hidden");
      else this.logoControls.setAttribute("hidden", "");
    }

    /* sync position picker */
    this.positionPicker?.querySelectorAll<HTMLButtonElement>("[data-layout]").forEach((b) => {
      b.setAttribute("aria-checked", b.dataset["layout"] === fields.logoLayout ? "true" : "false");
    });

    /* sync sliders */
    if (this.logoWidthInput) this.logoWidthInput.value = String(fields.logoWidth);
    if (this.logoHeightInput) this.logoHeightInput.value = String(fields.logoHeight);
    if (this.logoWidthDisplay) this.logoWidthDisplay.textContent = `${fields.logoWidth.toFixed(1)} in`;
    if (this.logoHeightDisplay) this.logoHeightDisplay.textContent = `${fields.logoHeight.toFixed(1)} in`;
  }

  private showLogoError(msg: string): void {
    if (!this.logoError) return;
    this.logoError.textContent = msg;
    this.logoError.removeAttribute("hidden");
  }

  private clearLogoError(): void {
    if (!this.logoError) return;
    this.logoError.textContent = "";
    this.logoError.setAttribute("hidden", "");
  }

  private populateCurrency(): void {
    if (!this.currencySelect) return;
    this.currencySelect.innerHTML = CURRENCIES.map(
      (c) => `<option value="${c.code}">${c.code} · ${c.label} (${c.symbol})</option>`,
    ).join("");
  }

  private syncCurrency(): void {
    if (!this.currencySelect) return;
    this.currencySelect.value = this.model.getData().currency;
  }

  private syncFieldsFromModel(): void {
    const fields = this.model.getData().fields;
    (Object.keys(fields) as (keyof InvoiceFields)[]).forEach((key) => {
      /* logo + sliders + layout are not <input name="..."> bound — skip. */
      if (key === "logo" || key === "logoLayout"
          || key === "logoWidth" || key === "logoHeight") return;
      const el = this.form.elements.namedItem(key);
      const v = fields[key];
      if ((el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)
          && typeof v === "string") {
        el.value = v;
      }
    });
  }

  private renderItems(): void {
    const items = this.model.getData().items;
    this.itemsContainer.innerHTML = "";
    items.forEach((item, idx) => {
      const row = document.createElement("div");
      row.className = "item-row";
      row.innerHTML = `
        <input type="text" class="item-desc" placeholder="Description" value="${escapeAttr(item.description)}" />
        <input type="text" inputmode="decimal" autocomplete="off" class="item-amount"
               placeholder="0.00" value="${formatAmountForEdit(item.amount)}" />
        <button type="button" class="icon-btn item-remove" aria-label="Remove line">×</button>
      `;
      const desc = row.querySelector(".item-desc") as HTMLInputElement;
      const amount = row.querySelector(".item-amount") as HTMLInputElement;
      const remove = row.querySelector(".item-remove") as HTMLButtonElement;
      desc.addEventListener("input", () => {
        this.suppressItemsRender = true;
        this.model.updateItem(idx, { description: desc.value });
        this.suppressItemsRender = false;
      });
      amount.addEventListener("input", () => {
        this.suppressItemsRender = true;
        this.model.updateItem(idx, { amount: parseAmount(amount.value) });
        this.suppressItemsRender = false;
      });
      amount.addEventListener("blur", () => {
        amount.value = formatAmountForEdit(parseAmount(amount.value));
      });
      remove.addEventListener("click", () => this.model.removeItem(idx));
      this.itemsContainer.appendChild(row);
    });
  }
}

/** Strip currency symbols, commas, spaces; accept either `.` or `,` as decimal. */
function parseAmount(raw: string): number {
  if (!raw) return 0;
  let s = raw.replace(/[\s$£€¥₫,]/g, "");
  /* if there's exactly one comma and no dot, treat comma as decimal separator */
  if (!s.includes(".") && raw.includes(",") && raw.split(",").length === 2) {
    s = raw.replace(/[\s$£€¥₫]/g, "").replace(",", ".");
  }
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

/** Show the value back as a clean editable string (no $ or trailing zeros). */
function formatAmountForEdit(n: number): string {
  if (!Number.isFinite(n) || n === 0) return "";
  /* preserve up to 2 decimal places, drop trailing zeros */
  return n.toFixed(2).replace(/\.?0+$/, "");
}
