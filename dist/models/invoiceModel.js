import { isCurrencyCode } from "./currency.js";
import { defaultInvoice } from "./defaults.js";
const STORAGE_KEY = "ledger.invoice";
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
export class InvoiceModel extends EventTarget {
    constructor(initial) {
        super();
        this.data = initial ?? InvoiceModel.load() ?? defaultInvoice();
    }
    getData() { return this.data; }
    setField(key, value) {
        this.data.fields[key] = value;
        this.persist();
        this.emit("field");
    }
    setFieldsFromForm(form) {
        const fd = new FormData(form);
        Object.keys(this.data.fields).forEach((key) => {
            /* Out-of-band fields (file upload, sliders, position picker) are NOT
               driven by the form's input event — skip to avoid the type system
               rejecting numeric/enum assignments and to avoid clobbering them. */
            if (key === "logo" || key === "logoLayout"
                || key === "logoWidth" || key === "logoHeight")
                return;
            const v = fd.get(key);
            if (typeof v !== "string")
                return;
            /* All remaining keys are string-typed; double-cast through unknown
               because InvoiceFields contains numeric fields too. */
            this.data.fields[key] = v;
        });
        this.persist();
        this.emit("field");
    }
    setLogo(dataUrl) {
        this.data.fields.logo = dataUrl;
        this.persist();
        this.emit("field");
    }
    setLogoLayout(layout) {
        if (this.data.fields.logoLayout === layout)
            return;
        this.data.fields.logoLayout = layout;
        this.persist();
        this.emit("field");
    }
    setLogoSize(width, height) {
        if (typeof width === "number" && Number.isFinite(width)) {
            this.data.fields.logoWidth = clamp(width, 0.8, 4);
        }
        if (typeof height === "number" && Number.isFinite(height)) {
            this.data.fields.logoHeight = clamp(height, 0.4, 2);
        }
        this.persist();
        this.emit("field");
    }
    addItem() {
        this.data.items.push({ description: "", amount: 0 });
        this.persist();
        this.emit("items");
    }
    removeItem(index) {
        this.data.items.splice(index, 1);
        this.persist();
        this.emit("items");
    }
    updateItem(index, patch) {
        const cur = this.data.items[index];
        if (!cur)
            return;
        Object.assign(cur, patch);
        this.persist();
        this.emit("items");
    }
    setCurrency(code) {
        if (this.data.currency === code)
            return;
        this.data.currency = code;
        this.persist();
        this.emit("currency");
    }
    total() {
        return this.data.items.reduce((sum, it) => sum + (Number.isFinite(it.amount) ? it.amount : 0), 0);
    }
    reset(next) {
        this.data = next;
        this.persist();
        this.emit("reset");
    }
    subscribe(listener) {
        const handler = (e) => listener(e.detail);
        this.addEventListener("change", handler);
        return () => this.removeEventListener("change", handler);
    }
    persist() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        }
        catch { /* ignore */ }
    }
    static load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw)
                return null;
            const parsed = JSON.parse(raw);
            if (!parsed?.fields || !Array.isArray(parsed?.items))
                return null;
            /* Backwards-compat for fields added in later versions. */
            if (!isCurrencyCode(parsed.currency))
                parsed.currency = "USD";
            const f = parsed.fields;
            if (typeof f.logo !== "string")
                f.logo = "";
            if (!["stacked-left", "inline-left", "right", "centered"].includes(f.logoLayout)) {
                f.logoLayout = "stacked-left";
            }
            if (typeof f.logoWidth !== "number" || !Number.isFinite(f.logoWidth))
                f.logoWidth = 1.6;
            if (typeof f.logoHeight !== "number" || !Number.isFinite(f.logoHeight))
                f.logoHeight = 0.8;
            return parsed;
        }
        catch {
            return null;
        }
    }
    emit(kind) {
        this.dispatchEvent(new CustomEvent("change", { detail: { kind, data: this.data } }));
    }
}
