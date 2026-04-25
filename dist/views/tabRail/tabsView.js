import { tabRailHTML } from "./tabsView.html.js";
const TABS = ["theme", "compose", "export"];
const STORAGE_KEY = "ledger.tab";
const HEADERS = {
    theme: { eyebrow: "§01 · theme", title: "Pick a style. Bend it.", lede: "Start with a preset, then push every token until it's yours." },
    compose: { eyebrow: "§02 · compose", title: "Set the figures.", lede: "Type into the ledger. The page on the right composes itself." },
    export: { eyebrow: "§03 · export", title: "Take it with you.", lede: "Download a PDF, copy the theme, share the JSON." },
};
export class TabsView {
    constructor() {
        this.current = TabsView.load() ?? "theme";
    }
    mount(host) {
        host.innerHTML = tabRailHTML();
        this.rail = host.querySelector("#tab-rail");
        this.headerEl = host.querySelector("#tab-panel-header");
        this.bodyEls = {
            theme: host.querySelector("#tab-theme"),
            compose: host.querySelector("#tab-compose"),
            export: host.querySelector("#tab-export"),
        };
        this.rail.addEventListener("click", (e) => {
            const btn = e.target.closest(".tab-btn");
            if (!btn)
                return;
            const id = btn.dataset["tab"];
            if (id && TABS.includes(id))
                this.activate(id);
        });
        this.rail.addEventListener("keydown", (e) => {
            if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "ArrowRight" && e.key !== "ArrowLeft")
                return;
            e.preventDefault();
            const idx = TABS.indexOf(this.current);
            const dir = (e.key === "ArrowDown" || e.key === "ArrowRight") ? 1 : -1;
            const next = TABS[(idx + dir + TABS.length) % TABS.length];
            if (next)
                this.activate(next);
        });
        this.activate(this.current);
    }
    /** Returns the host elements for sub-views (theme/compose/export tabs)
        to mount into. Called by AppController after this.mount(). */
    getTabHosts() {
        return this.bodyEls;
    }
    activate(id) {
        this.current = id;
        this.rail.querySelectorAll(".tab-btn").forEach((btn) => {
            const selected = btn.dataset["tab"] === id;
            btn.setAttribute("aria-selected", selected ? "true" : "false");
            btn.tabIndex = selected ? 0 : -1;
        });
        Object.keys(this.bodyEls).forEach((key) => {
            this.bodyEls[key].hidden = key !== id;
        });
        const h = HEADERS[id];
        this.headerEl.innerHTML = `
      <span class="tab-panel-eyebrow">${h.eyebrow}</span>
      <h2 class="tab-panel-title">${h.title}</h2>
      <p class="tab-panel-lede">${h.lede}</p>
    `;
        try {
            localStorage.setItem(STORAGE_KEY, id);
        }
        catch { /* ignore */ }
    }
    static load() {
        try {
            const v = localStorage.getItem(STORAGE_KEY);
            return v && TABS.includes(v) ? v : null;
        }
        catch {
            return null;
        }
    }
}
