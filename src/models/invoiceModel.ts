import type { InvoiceData, InvoiceFields, Item } from "./types.js";
import type { CurrencyCode } from "./currency.js";
import { isCurrencyCode } from "./currency.js";
import { defaultInvoice } from "./defaults.js";

type ChangeKind = "field" | "items" | "currency" | "reset";

export type ChangeEventDetail = {
  kind: ChangeKind;
  data: InvoiceData;
};

const STORAGE_KEY = "ledger.invoice";

const clamp = (n: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, n));

export class InvoiceModel extends EventTarget {
  private data: InvoiceData;

  constructor(initial?: InvoiceData) {
    super();
    this.data = initial ?? InvoiceModel.load() ?? defaultInvoice();
  }

  getData(): InvoiceData { return this.data; }

  setField<K extends keyof InvoiceFields>(key: K, value: InvoiceFields[K]): void {
    this.data.fields[key] = value;
    this.persist();
    this.emit("field");
  }

  setFieldsFromForm(form: HTMLFormElement): void {
    const fd = new FormData(form);
    (Object.keys(this.data.fields) as (keyof InvoiceFields)[]).forEach((key) => {
      /* Out-of-band fields (file upload, sliders, position picker) are NOT
         driven by the form's input event — skip to avoid the type system
         rejecting numeric/enum assignments and to avoid clobbering them. */
      if (key === "logo" || key === "logoLayout"
          || key === "logoWidth" || key === "logoHeight") return;
      const v = fd.get(key);
      if (typeof v !== "string") return;
      /* All remaining keys are string-typed; double-cast through unknown
         because InvoiceFields contains numeric fields too. */
      (this.data.fields as unknown as Record<string, string>)[key] = v;
    });
    this.persist();
    this.emit("field");
  }

  setLogo(dataUrl: string): void {
    this.data.fields.logo = dataUrl;
    this.persist();
    this.emit("field");
  }

  setLogoLayout(layout: InvoiceFields["logoLayout"]): void {
    if (this.data.fields.logoLayout === layout) return;
    this.data.fields.logoLayout = layout;
    this.persist();
    this.emit("field");
  }

  setLogoSize(width?: number, height?: number): void {
    if (typeof width === "number" && Number.isFinite(width)) {
      this.data.fields.logoWidth = clamp(width, 0.8, 4);
    }
    if (typeof height === "number" && Number.isFinite(height)) {
      this.data.fields.logoHeight = clamp(height, 0.4, 2);
    }
    this.persist();
    this.emit("field");
  }

  addItem(): void {
    this.data.items.push({ description: "", amount: 0 });
    this.persist();
    this.emit("items");
  }

  removeItem(index: number): void {
    this.data.items.splice(index, 1);
    this.persist();
    this.emit("items");
  }

  updateItem(index: number, patch: Partial<Item>): void {
    const cur = this.data.items[index];
    if (!cur) return;
    Object.assign(cur, patch);
    this.persist();
    this.emit("items");
  }

  setCurrency(code: CurrencyCode): void {
    if (this.data.currency === code) return;
    this.data.currency = code;
    this.persist();
    this.emit("currency");
  }

  total(): number {
    return this.data.items.reduce(
      (sum, it) => sum + (Number.isFinite(it.amount) ? it.amount : 0),
      0,
    );
  }

  reset(next: InvoiceData): void {
    this.data = next;
    this.persist();
    this.emit("reset");
  }

  subscribe(listener: (detail: ChangeEventDetail) => void): () => void {
    const handler = (e: Event) => listener((e as CustomEvent<ChangeEventDetail>).detail);
    this.addEventListener("change", handler);
    return () => this.removeEventListener("change", handler);
  }

  private persist(): void {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data)); } catch { /* ignore */ }
  }

  private static load(): InvoiceData | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.fields || !Array.isArray(parsed?.items)) return null;
      /* Backwards-compat for fields added in later versions. */
      if (!isCurrencyCode(parsed.currency)) parsed.currency = "USD";
      const f = parsed.fields;
      if (typeof f.logo !== "string") f.logo = "";
      if (!["stacked-left", "inline-left", "right", "centered"].includes(f.logoLayout)) {
        f.logoLayout = "stacked-left";
      }
      if (typeof f.logoWidth !== "number" || !Number.isFinite(f.logoWidth)) f.logoWidth = 1.6;
      if (typeof f.logoHeight !== "number" || !Number.isFinite(f.logoHeight)) f.logoHeight = 0.8;
      return parsed as InvoiceData;
    } catch {
      return null;
    }
  }

  private emit(kind: ChangeKind): void {
    this.dispatchEvent(new CustomEvent<ChangeEventDetail>("change", { detail: { kind, data: this.data } }));
  }
}
