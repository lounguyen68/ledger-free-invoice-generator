import { tabRailHTML } from "./tabsView.html.js";

export type TabId = "theme" | "compose" | "export";

const TABS: ReadonlyArray<TabId> = ["theme", "compose", "export"];
const STORAGE_KEY = "ledger.tab";

const HEADERS: Record<TabId, { eyebrow: string; title: string; lede: string }> = {
  theme:   { eyebrow: "§01 · theme",   title: "Pick a style. Bend it.",       lede: "Start with a preset, then push every token until it's yours." },
  compose: { eyebrow: "§02 · compose", title: "Set the figures.",             lede: "Type into the ledger. The page on the right composes itself." },
  export:  { eyebrow: "§03 · export",  title: "Take it with you.",            lede: "Download a PDF, copy the theme, share the JSON." },
};

export class TabsView {
  private rail!: HTMLElement;
  private headerEl!: HTMLElement;
  private bodyEls!: Record<TabId, HTMLElement>;
  private current: TabId;

  constructor() {
    this.current = TabsView.load() ?? "theme";
  }

  mount(host: HTMLElement): void {
    host.innerHTML = tabRailHTML();
    this.rail = host.querySelector("#tab-rail") as HTMLElement;
    this.headerEl = host.querySelector("#tab-panel-header") as HTMLElement;
    this.bodyEls = {
      theme:   host.querySelector("#tab-theme") as HTMLElement,
      compose: host.querySelector("#tab-compose") as HTMLElement,
      export:  host.querySelector("#tab-export") as HTMLElement,
    };

    this.rail.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".tab-btn");
      if (!btn) return;
      const id = btn.dataset["tab"] as TabId | undefined;
      if (id && TABS.includes(id)) this.activate(id);
    });

    this.rail.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const idx = TABS.indexOf(this.current);
      const dir = (e.key === "ArrowDown" || e.key === "ArrowRight") ? 1 : -1;
      const next = TABS[(idx + dir + TABS.length) % TABS.length];
      if (next) this.activate(next);
    });

    this.activate(this.current);
  }

  /** Returns the host elements for sub-views (theme/compose/export tabs)
      to mount into. Called by AppController after this.mount(). */
  getTabHosts(): Record<TabId, HTMLElement> {
    return this.bodyEls;
  }

  activate(id: TabId): void {
    this.current = id;
    this.rail.querySelectorAll<HTMLButtonElement>(".tab-btn").forEach((btn) => {
      const selected = btn.dataset["tab"] === id;
      btn.setAttribute("aria-selected", selected ? "true" : "false");
      btn.tabIndex = selected ? 0 : -1;
    });

    (Object.keys(this.bodyEls) as TabId[]).forEach((key) => {
      this.bodyEls[key].hidden = key !== id;
    });

    const h = HEADERS[id];
    this.headerEl.innerHTML = `
      <span class="tab-panel-eyebrow">${h.eyebrow}</span>
      <h2 class="tab-panel-title">${h.title}</h2>
      <p class="tab-panel-lede">${h.lede}</p>
    `;

    try { localStorage.setItem(STORAGE_KEY, id); } catch { /* ignore */ }
  }

  private static load(): TabId | null {
    try {
      const v = localStorage.getItem(STORAGE_KEY) as TabId | null;
      return v && (TABS as readonly string[]).includes(v) ? v : null;
    } catch { return null; }
  }
}
