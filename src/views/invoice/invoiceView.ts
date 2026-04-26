import type { InvoiceModel } from "../../models/invoiceModel.js";
import type { ThemeModel } from "../../models/themeModel.js";
import type { InvoiceFields } from "../../models/types.js";
import { BANK_RAILS } from "../../models/bankRails.js";
import { escapeHtml, formatCurrency } from "../../models/format.js";
import { invoiceHTML } from "./invoiceView.html.js";

export class InvoiceView {
  private root!: HTMLElement;
  private body!: HTMLTableSectionElement;
  private totalCell!: HTMLTableCellElement;

  constructor(private model: InvoiceModel, private theme: ThemeModel) {}

  get element(): HTMLElement { return this.root; }

  mount(host: HTMLElement): void {
    host.innerHTML = invoiceHTML();
    this.root = host.querySelector("#invoice") as HTMLElement;
    this.body = host.querySelector("#items-body") as HTMLTableSectionElement;
    this.totalCell = host.querySelector("#total-cell") as HTMLTableCellElement;

    this.renderFields();
    this.renderItems();
    this.applyTheme();

    this.model.subscribe((detail) => {
      if (detail.kind === "field" || detail.kind === "reset") this.renderFields();
      if (detail.kind === "items" || detail.kind === "currency" || detail.kind === "reset") this.renderItems();
    });

    this.theme.subscribe(() => this.applyTheme());
  }

  private renderFields(): void {
    const fields = this.model.getData().fields;
    const stringFields = fields as unknown as Record<string, string>;
    this.renderBankBlock(fields);
    this.root.querySelectorAll<HTMLElement>("[data-bind]").forEach((el) => {
      const key = el.dataset["bind"];
      if (!key) return;
      const value = stringFields[key] ?? "";
      const placeholder = el.dataset["placeholder"] ?? "";
      if (value.trim() === "" && placeholder) {
        el.textContent = placeholder;
        el.classList.add("is-placeholder");
      } else {
        el.textContent = value;
        el.classList.remove("is-placeholder");
      }
    });

    /* logo: only the slot matching the current layout receives a src */
    const url = fields.logo;
    const layoutSlot = this.layoutToSlot(fields.logoLayout);
    this.root.querySelectorAll<HTMLImageElement>("[data-bind-src='logo']").forEach((img) => {
      const isActiveSlot = img.classList.contains(`sender-logo--${layoutSlot}`);
      if (url && isActiveSlot) {
        img.src = url;
        img.removeAttribute("hidden");
      } else {
        img.removeAttribute("src");
        img.setAttribute("hidden", "");
      }
    });

    ["stacked", "inline", "right", "centered"].forEach((c) => {
      this.root.classList.remove(`logo-layout--${c}`);
    });
    if (url) this.root.classList.add(`logo-layout--${layoutSlot}`);

    this.root.style.setProperty("--logo-width", `${fields.logoWidth}in`);
    this.root.style.setProperty("--logo-height", `${fields.logoHeight}in`);
  }

  /** Rebuild the FROM-box bank lines for the active rail. Empty values are
   *  skipped so a half-filled rail doesn't print a row of orphan labels. */
  private renderBankBlock(fields: InvoiceFields): void {
    const slot = this.root.querySelector<HTMLElement>("[data-bank-print]");
    if (!slot) return;
    const rail = BANK_RAILS[fields.bankRail];
    const lines: string[] = [];
    for (const spec of rail.fields) {
      const raw = (fields as unknown as Record<string, string>)[spec.key] ?? "";
      const v = raw.trim();
      if (!v) continue;
      const label = spec.printLabel ? `${escapeHtml(spec.printLabel)}: ` : "";
      lines.push(`<div>${label}<span>${escapeHtml(v)}</span></div>`);
    }
    slot.innerHTML = lines.join("");
  }

  private layoutToSlot(layout: string): "stacked" | "inline" | "right" | "centered" {
    switch (layout) {
      case "inline-left":  return "inline";
      case "right":        return "right";
      case "centered":     return "centered";
      case "stacked-left":
      default:             return "stacked";
    }
  }

  private renderItems(): void {
    const data = this.model.getData();
    const { items, currency } = data;
    this.body.innerHTML = "";
    items.forEach((item) => {
      const tr = document.createElement("tr");
      const tdDesc = document.createElement("td");
      tdDesc.textContent = item.description;
      const tdAmt = document.createElement("td");
      tdAmt.className = "col-amount";
      tdAmt.textContent = formatCurrency(item.amount, currency);
      tr.appendChild(tdDesc);
      tr.appendChild(tdAmt);
      this.body.appendChild(tr);
    });
    this.totalCell.textContent = formatCurrency(this.model.total(), currency);
  }

  private applyTheme(): void {
    this.theme.applyTo(this.root);
    this.root.style.animation = "none";
    void this.root.offsetWidth;
    this.root.style.animation = "";
  }
}
