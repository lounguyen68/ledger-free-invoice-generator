import type { ThemeModel } from "../../models/themeModel.js";
import type { Theme } from "../../models/theme.js";
import type { ModalView } from "../modal/modalView.js";
import { themeTabHTML } from "./themeView.html.js";

export class ThemeView {
  private root!: HTMLElement;

  constructor(private model: ThemeModel, private modal?: ModalView) {}

  mount(host: HTMLElement): void {
    this.root = host;
    this.root.innerHTML = themeTabHTML(this.model.getPresetId());
    this.bindEvents();
    this.syncControls();
    this.model.subscribe(() => this.syncControls());
  }

  private bindEvents(): void {
    this.root.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;

      const preset = target.closest<HTMLButtonElement>("[data-preset]");
      if (preset) {
        const id = preset.dataset["preset"];
        if (id) this.model.selectPreset(id);
        return;
      }

      if (target.closest('[data-action="reset"]')) {
        this.model.resetToPreset();
        return;
      }

      if (target.closest('[data-action="import-theme"]')) {
        this.openImportModal();
        return;
      }

      const seg = target.closest<HTMLButtonElement>(".segmented button");
      if (seg) {
        const group = seg.closest<HTMLElement>("[data-control]");
        const value = seg.dataset["value"];
        const control = group?.dataset["control"];
        if (control && value) this.applyPatch(control, value);
        return;
      }

      const toggle = target.closest<HTMLButtonElement>('.toggle[data-control]');
      if (toggle) {
        const control = toggle.dataset["control"];
        const next = toggle.getAttribute("aria-pressed") !== "true";
        if (control) this.applyPatch(control, next);
      }
    });

    this.root.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement;
      const control = target.dataset["control"];
      const controlText = (target.dataset as DOMStringMap)["controlText"];
      if (control) {
        let value: string | number = target.value;
        if (target.type === "range") value = parseFloat(target.value);
        if (target.type === "color") value = target.value;
        this.applyPatch(control, value);
      } else if (controlText) {
        const val = (target.value || "").trim();
        if (/^#([0-9a-fA-F]{3}){1,2}$/.test(val)) this.applyPatch(controlText, val);
      }
    });
  }

  private applyPatch(key: string, value: string | number | boolean): void {
    if (key === "displayWeight" && typeof value === "string") value = parseInt(value, 10);
    this.model.patch({ [key]: value } as Partial<Theme>);
  }

  private async openImportModal(): Promise<void> {
    if (!this.modal) return;
    await this.modal.confirm({
      eyebrow: "§ import theme",
      title: "Paste theme JSON.",
      bodyHTML: `Bring a theme over from another browser — paste the JSON you copied from <em>Export → Copy theme JSON</em>. The current theme will be replaced.`,
      confirmLabel: "Apply theme",
      cancelLabel: "Cancel",
      textarea: {
        rows: 9,
        placeholder: '{ "presetId": "ledger", "theme": { … } }',
        onConfirm: (value) => {
          const trimmed = value.trim();
          if (!trimmed) return false;
          return this.model.importJSON(trimmed);
        },
      },
    });
  }

  private syncControls(): void {
    const t = this.model.get();
    const presetId = this.model.getPresetId();

    this.root.querySelectorAll<HTMLButtonElement>("[data-preset]").forEach((btn) => {
      btn.setAttribute("aria-checked", btn.dataset["preset"] === presetId ? "true" : "false");
    });

    (["paper", "ink", "inkSoft", "inkMute", "accent", "accentInk"] as (keyof Theme)[]).forEach((k) => {
      const colorIn = this.root.querySelector<HTMLInputElement>(`input[type="color"][data-control="${k}"]`);
      const textIn = this.root.querySelector<HTMLInputElement>(`input[data-control-text="${k}"]`);
      const v = t[k] as string;
      if (colorIn) colorIn.value = v;
      if (textIn) textIn.value = v.toUpperCase();
    });

    (["displayFont", "bodyFont", "monoFont"] as const).forEach((k) => {
      const sel = this.root.querySelector<HTMLSelectElement>(`select[data-control="${k}"]`);
      if (sel) sel.value = t[k];
    });

    this.setSlider("displayWeight", t.displayWeight, String(t.displayWeight));
    this.setSlider("letterSpacing", t.letterSpacing, `${(t.letterSpacing * 1000 / 10).toFixed(1)}%`);
    this.setSlider("titleScale", t.titleScale, `${t.titleScale.toFixed(2)}×`);
    this.setSlider("radius", t.radius, `${t.radius}px`);

    const italicBtn = this.root.querySelector<HTMLButtonElement>('.toggle[data-control="displayItalic"]');
    if (italicBtn) italicBtn.setAttribute("aria-pressed", t.displayItalic ? "true" : "false");

    this.setSegmented("figureStyle", t.figureStyle);
    this.setSegmented("density", t.density);
    this.setSegmented("rule", t.rule);
    this.setSegmented("totalStyle", t.totalStyle);
  }

  private setSlider(key: string, value: number, displayText: string): void {
    const input = this.root.querySelector<HTMLInputElement>(`input[type="range"][data-control="${key}"]`);
    const label = this.root.querySelector<HTMLElement>(`[data-display="${key}"]`);
    if (input) input.value = String(value);
    if (label) label.textContent = displayText;
  }

  private setSegmented(key: string, value: string): void {
    const group = this.root.querySelector<HTMLElement>(`.segmented[data-control="${key}"]`);
    if (!group) return;
    group.querySelectorAll<HTMLButtonElement>("button").forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset["value"] === value ? "true" : "false");
    });
  }
}
