/**
 * Manages the open/closed state of the Compose tab's drawers.
 *
 * Strategy:
 * 1. On first load (no stored state): pick a default set of open drawers based
 *    on the viewport's USABLE height (after subtracting headers, tabs, etc.).
 * 2. On subsequent loads: restore the user's last choice from localStorage.
 * 3. On narrow / short viewports: enable "accordion mode" — only one drawer
 *    open at a time, opening another auto-closes the rest.
 * 4. The "Expand all" / "Collapse all" rail buttons and meta previews are
 *    wired here so summaries can show a hint of what's inside when closed.
 */

const DRAWER_IDS = ["sender", "invoice", "bank", "for", "items", "footer"] as const;
type DrawerId = (typeof DRAWER_IDS)[number];

const STORAGE_KEY = "ledger.drawers";

/* approximate height each open drawer takes when expanded (typical content) */
const DRAWER_HEIGHTS: Record<DrawerId, number> = {
  sender:  520,  // bigger because of logo dropzone + position picker + sliders
  invoice: 200,
  bank:    520,
  for:     150,
  items:   320,
  footer:  340,
};

/* fixed UI chrome height that drawers compete with */
const CHROME_HEIGHT = 220; // header + tab header + tab-rail-bottom etc.

export class DrawerController {
  private drawers: HTMLDetailsElement[] = [];
  private mediaShortQuery: MediaQueryList;
  private mediaPhoneQuery: MediaQueryList;

  constructor() {
    /* DOM queries deferred to start() — drawers are rendered by FormView
       which mounts after this controller is constructed. */
    this.mediaShortQuery = window.matchMedia("(max-height: 760px)");
    this.mediaPhoneQuery = window.matchMedia("(max-width: 720px)");
  }

  start(): void {
    this.drawers = Array.from(document.querySelectorAll<HTMLDetailsElement>(".drawer"));
    this.applyInitialState();
    this.bindToggle();
    this.bindRailButtons();
    this.updateAllMeta();

    /* re-render meta previews whenever the form changes */
    document.getElementById("invoice-form")?.addEventListener("input", () => {
      this.updateAllMeta();
    });
    /* items add/remove doesn't fire `input` on the form — observe the list */
    const itemsEl = document.getElementById("items");
    if (itemsEl) {
      new MutationObserver(() => this.updateAllMeta())
        .observe(itemsEl, { childList: true });
    }

    /* respond to viewport resize: if user goes from desktop to mobile, switch
       to accordion mode (close all but the most recently opened). */
    const onResize = (): void => {
      if (this.isAccordion()) this.enforceAccordion();
    };
    this.mediaShortQuery.addEventListener("change", onResize);
    this.mediaPhoneQuery.addEventListener("change", onResize);
  }

  /* ── initial state ─────────────────────────────────────────── */

  private applyInitialState(): void {
    const stored = this.loadState();
    if (stored) {
      this.drawers.forEach((d) => {
        const id = d.dataset["drawer"] as DrawerId;
        d.open = stored.includes(id);
      });
      /* if user is on a narrow/short device but has multiple open from a
         previous desktop session, collapse to just the first one */
      if (this.isAccordion()) this.enforceAccordion();
      return;
    }

    /* no stored state — derive from available height */
    const budget = window.innerHeight - CHROME_HEIGHT;
    /* always open §01 first */
    let used = 0;
    const opening = new Set<DrawerId>();

    for (const id of DRAWER_IDS) {
      const cost = DRAWER_HEIGHTS[id];
      if (opening.size === 0 || used + cost <= budget) {
        opening.add(id);
        used += cost;
      } else {
        break;
      }
    }

    /* on accordion-mode viewports, only the very first drawer */
    if (this.isAccordion()) {
      opening.clear();
      opening.add("sender");
    }

    this.drawers.forEach((d) => {
      const id = d.dataset["drawer"] as DrawerId;
      d.open = opening.has(id);
    });
    this.persist();
  }

  /* ── toggle logic ──────────────────────────────────────────── */

  private bindToggle(): void {
    this.drawers.forEach((d) => {
      d.addEventListener("toggle", () => {
        if (this.suppressToggle) return;
        if (d.open && this.isAccordion()) this.closeOthers(d);
        this.persist();
      });
    });
  }

  private suppressToggle = false;

  private closeOthers(keep: HTMLDetailsElement): void {
    this.suppressToggle = true;
    this.drawers.forEach((d) => {
      if (d !== keep) d.open = false;
    });
    this.suppressToggle = false;
  }

  private enforceAccordion(): void {
    const openOnes = this.drawers.filter((d) => d.open);
    if (openOnes.length <= 1) return;
    const keep = openOnes[0]!;
    this.suppressToggle = true;
    this.drawers.forEach((d) => {
      if (d !== keep) d.open = false;
    });
    this.suppressToggle = false;
    this.persist();
  }

  /* ── rail buttons ──────────────────────────────────────────── */

  private bindRailButtons(): void {
    document.querySelectorAll<HTMLButtonElement>("[data-drawer-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset["drawerAction"];
        if (action === "expand") this.expandAll();
        if (action === "collapse") this.collapseAll();
      });
    });
  }

  private expandAll(): void {
    this.suppressToggle = true;
    this.drawers.forEach((d) => { d.open = true; });
    this.suppressToggle = false;
    /* in accordion mode, expanding all isn't sensible — keep just the first */
    if (this.isAccordion()) this.enforceAccordion();
    this.persist();
  }

  private collapseAll(): void {
    this.suppressToggle = true;
    this.drawers.forEach((d) => { d.open = false; });
    this.suppressToggle = false;
    this.persist();
  }

  /* ── meta previews ─────────────────────────────────────────── */

  private updateAllMeta(): void {
    this.drawers.forEach((d) => this.updateMeta(d));
  }

  private updateMeta(drawer: HTMLDetailsElement): void {
    const id = drawer.dataset["drawer"] as DrawerId;
    const slot = drawer.querySelector<HTMLElement>("[data-drawer-meta]");
    if (!slot) return;
    slot.textContent = this.metaFor(id);
  }

  private metaFor(id: DrawerId): string {
    const get = (name: string): string => {
      const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);
      return (el?.value ?? "").trim();
    };

    switch (id) {
      case "sender": {
        return get("senderName") || "—";
      }
      case "invoice": {
        const n = get("invoiceNumber");
        return n ? `#${n}` : "—";
      }
      case "bank": {
        return get("bankName") || "—";
      }
      case "for": {
        return get("forSubject") || "—";
      }
      case "items": {
        const rows = document.querySelectorAll(".item-row").length;
        return rows === 0 ? "0 lines" : `${rows} ${rows === 1 ? "line" : "lines"}`;
      }
      case "footer": {
        const prep = get("preparedBy");
        const appr = get("approvedBy");
        if (prep && appr) return `${prep} · ${appr}`;
        return prep || appr || "—";
      }
    }
  }

  /* ── helpers ───────────────────────────────────────────────── */

  private isAccordion(): boolean {
    return this.mediaShortQuery.matches || this.mediaPhoneQuery.matches;
  }

  private persist(): void {
    const open = this.drawers
      .filter((d) => d.open)
      .map((d) => d.dataset["drawer"])
      .filter((s): s is string => Boolean(s));
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(open)); } catch { /* ignore */ }
  }

  private loadState(): DrawerId[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return null;
      return parsed.filter((v): v is DrawerId =>
        typeof v === "string" && (DRAWER_IDS as readonly string[]).includes(v));
    } catch {
      return null;
    }
  }
}
