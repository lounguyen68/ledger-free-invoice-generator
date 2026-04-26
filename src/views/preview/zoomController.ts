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
  private invoiceEl: HTMLElement | null = null;
  private stage: HTMLElement | null = null;
  private outBtn: HTMLButtonElement | null = null;
  private inBtn: HTMLButtonElement | null = null;
  private fitBtn: HTMLButtonElement | null = null;
  private display: HTMLElement | null = null;
  private zoom = 1;
  private fitToWidth = false;

  start(): void {
    /* DOM queries deferred — invoice + zoom toolbar are mounted by
       AppController/InvoiceView before this controller's start() runs. */
    this.invoiceEl = document.getElementById("invoice");
    this.stage = document.querySelector(".preview-stage");
    this.outBtn = document.getElementById("zoom-out") as HTMLButtonElement | null;
    this.inBtn = document.getElementById("zoom-in") as HTMLButtonElement | null;
    this.fitBtn = document.getElementById("zoom-fit") as HTMLButtonElement | null;
    this.display = document.getElementById("zoom-display");

    /* Load stored zoom, otherwise fit-to-width on small screens, 100% on
       desktop. If a stored zoom would overflow the current (narrow)
       viewport, override to fit-to-width — never start with horizontal
       scroll on tablet/mobile. */
    const stored = this.load();
    if (stored !== null) {
      this.zoom = stored;
      this.fitToWidth = false;
      if (this.viewportTooNarrow()) {
        const fit = this.computeFit();
        if (this.zoom > fit + 0.001) this.fitToWidth = true;
      }
    } else if (this.viewportTooNarrow()) {
      this.fitToWidth = true;
    }

    this.outBtn?.addEventListener("click", () => this.adjust(-STEP));
    this.inBtn?.addEventListener("click", () => this.adjust(+STEP));
    this.fitBtn?.addEventListener("click", () => this.toggleFit());

    /* Ctrl/Cmd + scroll wheel = zoom (intuitive for desktop power users) */
    this.stage?.addEventListener("wheel", (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -STEP : +STEP;
      this.adjust(delta);
    }, { passive: false });

    /* Keyboard: + / - / 0 */
    document.addEventListener("keydown", (e) => {
      if (e.target instanceof HTMLElement
          && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA"
              || e.target.isContentEditable)) return;
      if (e.key === "+" || e.key === "=") { e.preventDefault(); this.adjust(+STEP); }
      else if (e.key === "-" || e.key === "_") { e.preventDefault(); this.adjust(-STEP); }
      else if (e.key === "0") { e.preventDefault(); this.set(1); }
    });

    /* Recompute fit-to-width on resize. If the user has a fixed zoom that
       would now overflow the (smaller) stage, silently downgrade to fit so
       the preview never has horizontal scrollbars on tablet/mobile. */
    window.addEventListener("resize", () => {
      if (this.fitToWidth) { this.apply(); return; }
      const fit = this.computeFit();
      if (this.zoom > fit + 0.001 && this.viewportTooNarrow()) {
        this.fitToWidth = true;
        this.apply();
      }
    });

    this.apply();
  }

  private adjust(delta: number): void {
    this.fitToWidth = false;
    this.set(this.zoom + delta);
  }

  private set(value: number): void {
    this.zoom = clamp(roundStep(value), MIN, MAX);
    this.fitToWidth = false;
    this.persist();
    this.apply();
  }

  private toggleFit(): void {
    /* Cycle: 100% → fit → 100% (so the button always has a clear next state) */
    if (Math.abs(this.zoom - 1) < 0.001 && !this.fitToWidth) {
      this.fitToWidth = true;
    } else {
      this.fitToWidth = false;
      this.zoom = 1;
    }
    this.persist();
    this.apply();
  }

  private apply(): void {
    if (!this.invoiceEl) return;
    let scale = this.zoom;
    if (this.fitToWidth) scale = this.computeFit();

    /* Use CSS variable so the .invoice size stays canonical and we wrap with
       a pseudo-spacer to reserve the scaled box's footprint in the layout. */
    this.invoiceEl.style.setProperty("--invoice-scale", String(scale));

    if (this.display) {
      this.display.textContent = this.fitToWidth
        ? `Fit · ${Math.round(scale * 100)}%`
        : `${Math.round(scale * 100)}%`;
    }
  }

  private computeFit(): number {
    if (!this.stage || !this.invoiceEl) return 1;
    /* Use the actual stage padding instead of a flat constant — this is
       reliable across breakpoints (12px on phones, 48px on desktop). */
    const cs = window.getComputedStyle(this.stage);
    const padX = parseFloat(cs.paddingLeft || "0") + parseFloat(cs.paddingRight || "0");
    const stageWidth = this.stage.clientWidth - padX;
    /* invoice native width is 8.5in. 8.5 * 96 = 816px @ default DPI. */
    const invoiceNativeWidth = 8.5 * 96;
    const fit = stageWidth / invoiceNativeWidth;
    /* Allow fit to go smaller than the manual MIN (down to 0.3) — a 360px
       phone needs ~0.42 just to fit, and we never want overflow at fit. */
    return clamp(fit, 0.3, 1.0);
  }

  private viewportTooNarrow(): boolean {
    /* invoice is 816px wide; below ~1024px the preview pane (after the
       editor drawer offset on tablet) doesn't have room for 100% scale
       without horizontal scroll — auto-fit is the friendlier default. */
    return window.innerWidth <= 1024;
  }

  private persist(): void {
    try {
      if (this.fitToWidth) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, String(this.zoom));
    } catch { /* ignore */ }
  }

  private load(): number | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const n = parseFloat(raw);
      return Number.isFinite(n) ? clamp(n, MIN, MAX) : null;
    } catch { return null; }
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
function roundStep(n: number): number {
  return Math.round(n * 10) / 10;
}
