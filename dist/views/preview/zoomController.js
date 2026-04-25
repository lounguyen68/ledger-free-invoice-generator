/**
 * Zoom the invoice preview while keeping its physical size fixed at 8.5 × 11 in.
 * We never resize the .invoice element itself — that would break print-fidelity.
 * Instead we apply a CSS scale transform on a wrapper, and let the surrounding
 * pane scroll to reveal the rest of the page. Same PDF, viewed at any zoom.
 */
const STORAGE_KEY = "ledger.zoom";
const MIN = 0.4;
const MAX = 2.0;
const STEP = 0.1;
const FIT_PADDING = 64; // px breathing room when fitting
export class ZoomController {
    constructor() {
        this.invoiceEl = null;
        this.stage = null;
        this.outBtn = null;
        this.inBtn = null;
        this.fitBtn = null;
        this.display = null;
        this.zoom = 1;
        this.fitToWidth = false;
    }
    start() {
        /* DOM queries deferred — invoice + zoom toolbar are mounted by
           AppController/InvoiceView before this controller's start() runs. */
        this.invoiceEl = document.getElementById("invoice");
        this.stage = document.querySelector(".preview-stage");
        this.outBtn = document.getElementById("zoom-out");
        this.inBtn = document.getElementById("zoom-in");
        this.fitBtn = document.getElementById("zoom-fit");
        this.display = document.getElementById("zoom-display");
        /* Load stored zoom, otherwise fit-to-width on small screens, 100% on desktop */
        const stored = this.load();
        if (stored !== null) {
            this.zoom = stored;
            this.fitToWidth = false;
        }
        else if (this.viewportTooNarrow()) {
            this.fitToWidth = true;
        }
        this.outBtn?.addEventListener("click", () => this.adjust(-STEP));
        this.inBtn?.addEventListener("click", () => this.adjust(+STEP));
        this.fitBtn?.addEventListener("click", () => this.toggleFit());
        /* Ctrl/Cmd + scroll wheel = zoom (intuitive for desktop power users) */
        this.stage?.addEventListener("wheel", (e) => {
            if (!(e.ctrlKey || e.metaKey))
                return;
            e.preventDefault();
            const delta = e.deltaY > 0 ? -STEP : +STEP;
            this.adjust(delta);
        }, { passive: false });
        /* Keyboard: + / - / 0 */
        document.addEventListener("keydown", (e) => {
            if (e.target instanceof HTMLElement
                && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA"
                    || e.target.isContentEditable))
                return;
            if (e.key === "+" || e.key === "=") {
                e.preventDefault();
                this.adjust(+STEP);
            }
            else if (e.key === "-" || e.key === "_") {
                e.preventDefault();
                this.adjust(-STEP);
            }
            else if (e.key === "0") {
                e.preventDefault();
                this.set(1);
            }
        });
        /* Recompute fit-to-width on resize */
        window.addEventListener("resize", () => {
            if (this.fitToWidth)
                this.apply();
        });
        this.apply();
    }
    adjust(delta) {
        this.fitToWidth = false;
        this.set(this.zoom + delta);
    }
    set(value) {
        this.zoom = clamp(roundStep(value), MIN, MAX);
        this.fitToWidth = false;
        this.persist();
        this.apply();
    }
    toggleFit() {
        /* Cycle: 100% → fit → 100% (so the button always has a clear next state) */
        if (Math.abs(this.zoom - 1) < 0.001 && !this.fitToWidth) {
            this.fitToWidth = true;
        }
        else {
            this.fitToWidth = false;
            this.zoom = 1;
        }
        this.persist();
        this.apply();
    }
    apply() {
        if (!this.invoiceEl)
            return;
        let scale = this.zoom;
        if (this.fitToWidth)
            scale = this.computeFit();
        /* Use CSS variable so the .invoice size stays canonical and we wrap with
           a pseudo-spacer to reserve the scaled box's footprint in the layout. */
        this.invoiceEl.style.setProperty("--invoice-scale", String(scale));
        if (this.display) {
            this.display.textContent = this.fitToWidth
                ? `Fit · ${Math.round(scale * 100)}%`
                : `${Math.round(scale * 100)}%`;
        }
    }
    computeFit() {
        if (!this.stage || !this.invoiceEl)
            return 1;
        const stageWidth = this.stage.clientWidth - FIT_PADDING;
        /* invoice native width is 8.5in. Use offsetWidth pre-transform — but the
           transform may already be applied. Use a known constant: 8.5in in px =
           8.5 * 96 = 816 (assuming the browser's default 96 DPI). */
        const invoiceNativeWidth = 8.5 * 96;
        const fit = stageWidth / invoiceNativeWidth;
        return clamp(fit, MIN, 1.0);
    }
    viewportTooNarrow() {
        /* invoice is 816px wide + ~96px padding on either side = ~1008px */
        return window.innerWidth < 980;
    }
    persist() {
        try {
            if (this.fitToWidth)
                localStorage.removeItem(STORAGE_KEY);
            else
                localStorage.setItem(STORAGE_KEY, String(this.zoom));
        }
        catch { /* ignore */ }
    }
    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw)
                return null;
            const n = parseFloat(raw);
            return Number.isFinite(n) ? clamp(n, MIN, MAX) : null;
        }
        catch {
            return null;
        }
    }
}
function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
}
function roundStep(n) {
    return Math.round(n * 10) / 10;
}
