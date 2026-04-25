import { exportTabHTML } from "./exportTabView.html.js";
export class ExportTabView {
    constructor(theme, modal, onExportPdf) {
        this.theme = theme;
        this.modal = modal;
        this.onExportPdf = onExportPdf;
        this.jsonEl = null;
    }
    mount(host) {
        this.root = host;
        this.root.innerHTML = exportTabHTML();
        this.jsonEl = this.root.querySelector("[data-json]");
        this.refreshJSON();
        this.root.addEventListener("click", (e) => {
            const target = e.target;
            const action = target.closest("[data-action]")?.dataset["action"];
            if (!action)
                return;
            if (action === "export-pdf")
                this.onExportPdf();
            if (action === "copy-json")
                this.copy();
            if (action === "reset-all")
                this.resetAll();
        });
        this.theme.subscribe(() => this.refreshJSON());
    }
    refreshJSON() {
        if (this.jsonEl)
            this.jsonEl.textContent = this.theme.toJSON();
    }
    async copy() {
        const label = this.root.querySelector("[data-copy-label]");
        try {
            await navigator.clipboard.writeText(this.theme.toJSON());
            if (label) {
                const original = label.textContent ?? "Copy";
                label.textContent = "Copied ✓";
                setTimeout(() => { label.textContent = original; }, 1400);
            }
        }
        catch {
            if (label)
                label.textContent = "Copy failed";
        }
    }
    async resetAll() {
        const ok = await this.modal.confirm({
            eyebrow: "§ reset everything",
            title: "Wipe the slate clean?",
            body: "This clears every field, every line item, and your custom theme. Local data is removed and the page reloads. There is no undo.",
            confirmLabel: "Reset everything",
            cancelLabel: "Cancel",
            destructive: true,
        });
        if (!ok)
            return;
        try {
            localStorage.removeItem("ledger.invoice");
            localStorage.removeItem("ledger.theme");
        }
        catch { /* ignore */ }
        location.reload();
    }
}
