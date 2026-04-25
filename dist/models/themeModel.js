import { PRESETS, DEFAULT_PRESET_ID, findPreset, DENSITY_PADDING, RULE_WIDTH, RULE_STYLE, FONT_OPTIONS, figuresToFontVariant, } from "./theme.js";
const STORAGE_KEY = "ledger.theme";
export class ThemeModel extends EventTarget {
    constructor() {
        super();
        const stored = ThemeModel.load();
        if (stored) {
            this.current = stored.theme;
            this.presetId = stored.presetId;
        }
        else {
            const preset = findPreset(DEFAULT_PRESET_ID);
            this.current = { ...preset };
            this.presetId = preset.id;
        }
    }
    get() { return this.current; }
    getPresetId() { return this.presetId; }
    isDirty() {
        const preset = findPreset(this.presetId);
        if (!preset)
            return true;
        return JSON.stringify(preset) !== JSON.stringify({ ...this.current, id: preset.id, name: preset.name, tagline: preset.tagline });
    }
    selectPreset(id) {
        const preset = findPreset(id);
        if (!preset)
            return;
        this.current = { ...preset };
        this.presetId = id;
        this.persist();
        this.emit();
    }
    patch(partial) {
        this.current = { ...this.current, ...partial };
        this.persist();
        this.emit();
    }
    resetToPreset() {
        const preset = findPreset(this.presetId);
        if (!preset)
            return;
        this.current = { ...preset };
        this.persist();
        this.emit();
    }
    toJSON() {
        return JSON.stringify({ presetId: this.presetId, theme: this.current }, null, 2);
    }
    /**
     * Parse and apply a theme exported from another browser.
     * Accepts either:
     *   - the full export shape `{ presetId, theme: {...} }`
     *   - just the inner Theme `{...}` (in case user copied only the theme)
     * Returns `true` on success, `false` if the JSON was invalid or didn't
     * contain enough recognisable fields. Caller should surface an error.
     */
    importJSON(raw) {
        let parsed;
        try {
            parsed = JSON.parse(raw);
        }
        catch {
            return false;
        }
        if (!parsed || typeof parsed !== "object")
            return false;
        /* Unwrap full export shape if present */
        let presetId;
        let themeCandidate;
        const obj = parsed;
        if ("theme" in obj && typeof obj["theme"] === "object" && obj["theme"]) {
            themeCandidate = obj["theme"];
            if (typeof obj["presetId"] === "string")
                presetId = obj["presetId"];
        }
        else {
            themeCandidate = obj;
        }
        /* Minimum recognisable fields — must look like a Theme */
        if (typeof themeCandidate["paper"] !== "string"
            || typeof themeCandidate["ink"] !== "string"
            || typeof themeCandidate["accent"] !== "string") {
            return false;
        }
        /* Merge over defaults so missing newer fields don't blow up */
        const fallback = findPreset(presetId ?? DEFAULT_PRESET_ID) ?? findPreset(DEFAULT_PRESET_ID);
        this.current = { ...fallback, ...themeCandidate };
        this.presetId = presetId && findPreset(presetId) ? presetId : "classic";
        this.persist();
        this.emit();
        return true;
    }
    subscribe(listener) {
        const handler = (e) => listener(e.detail);
        this.addEventListener("change", handler);
        return () => this.removeEventListener("change", handler);
    }
    /** Apply theme to a target element as inline CSS custom properties. */
    applyTo(target) {
        const t = this.current;
        const display = FONT_OPTIONS.find((f) => f.id === t.displayFont)?.stack ?? "serif";
        const body = FONT_OPTIONS.find((f) => f.id === t.bodyFont)?.stack ?? "serif";
        const mono = FONT_OPTIONS.find((f) => f.id === t.monoFont)?.stack ?? "monospace";
        const vars = {
            "--paper": t.paper,
            "--ink": t.ink,
            "--ink-soft": t.inkSoft,
            "--ink-mute": t.inkMute,
            "--accent": t.accent,
            "--accent-ink": t.accentInk,
            "--font-display": display,
            "--font-body": body,
            "--font-mono": mono,
            "--display-weight": String(t.displayWeight),
            "--display-style": t.displayItalic ? "italic" : "normal",
            "--letter-spacing": `${t.letterSpacing}em`,
            "--num-figures": figuresToFontVariant(t.figureStyle),
            "--padding": DENSITY_PADDING[t.density],
            "--rule-width": RULE_WIDTH[t.rule],
            "--rule-style": RULE_STYLE[t.rule],
            "--radius": `${t.radius}px`,
            "--title-scale": String(t.titleScale),
        };
        Object.entries(vars).forEach(([k, v]) => target.style.setProperty(k, v));
        /* total-style class */
        target.classList.remove("total--inverted", "total--outlined", "total--underlined");
        target.classList.add(`total--${t.totalStyle}`);
        /* preset id class for opt-in decorative tweaks (e.g. ledger ✦ glyph) */
        PRESETS.forEach((p) => target.classList.remove(`preset--${p.id}`));
        target.classList.add(`preset--${this.presetId}`);
    }
    persist() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ presetId: this.presetId, theme: this.current }));
        }
        catch { /* ignore */ }
    }
    emit() {
        this.dispatchEvent(new CustomEvent("change", { detail: this.current }));
    }
    static load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw)
                return null;
            const parsed = JSON.parse(raw);
            if (typeof parsed?.presetId !== "string" || typeof parsed?.theme !== "object")
                return null;
            return { presetId: parsed.presetId, theme: parsed.theme };
        }
        catch {
            return null;
        }
    }
}
