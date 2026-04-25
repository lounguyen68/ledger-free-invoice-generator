import type { ThemeModel } from "../../models/themeModel.js";
import type { ModalView } from "../modal/modalView.js";
import { exportTabHTML } from "./exportTabView.html.js";

export class ExportTabView {
  private root!: HTMLElement;
  private jsonEl: HTMLPreElement | null = null;

  constructor(
    private theme: ThemeModel,
    private modal: ModalView,
    private onExportPdf: () => void,
  ) {}

  mount(host: HTMLElement): void {
    this.root = host;
    this.root.innerHTML = exportTabHTML();
    this.jsonEl = this.root.querySelector<HTMLPreElement>("[data-json]");
    this.refreshJSON();

    this.root.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const action = target.closest<HTMLButtonElement>("[data-action]")?.dataset["action"];
      if (!action) return;
      if (action === "export-pdf") this.onExportPdf();
      if (action === "copy-json") this.copy();
      if (action === "reset-all") this.resetAll();
    });

    this.theme.subscribe(() => this.refreshJSON());
  }

  private refreshJSON(): void {
    if (this.jsonEl) this.jsonEl.textContent = this.theme.toJSON();
  }

  private async copy(): Promise<void> {
    const label = this.root.querySelector<HTMLElement>("[data-copy-label]");
    try {
      await navigator.clipboard.writeText(this.theme.toJSON());
      if (label) {
        const original = label.textContent ?? "Copy";
        label.textContent = "Copied ✓";
        setTimeout(() => { label.textContent = original; }, 1400);
      }
    } catch {
      if (label) label.textContent = "Copy failed";
    }
  }

  private async resetAll(): Promise<void> {
    const ok = await this.modal.confirm({
      eyebrow: "§ reset everything",
      title: "Wipe the slate clean?",
      body: "This clears every field, every line item, and your custom theme. Local data is removed and the page reloads. There is no undo.",
      confirmLabel: "Reset everything",
      cancelLabel: "Cancel",
      destructive: true,
    });
    if (!ok) return;
    try {
      localStorage.removeItem("ledger.invoice");
      localStorage.removeItem("ledger.theme");
    } catch { /* ignore */ }
    location.reload();
  }
}
