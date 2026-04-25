import { sanitizeFilename } from "../models/format.js";
import { detectInAppBrowser } from "../models/inAppBrowser.js";
/**
 * PDF "export" via the browser's native print dialog.
 *
 * Rationale: html2pdf.js relies on html2canvas which screenshots the DOM,
 * losing vector text, search, copy/paste — and choking on modern CSS
 * (color-mix, dashed borders, ::after z-index, fonts loaded async).
 * window.print() uses the browser's own layout engine: vector PDF, sharp
 * text, every CSS feature renders identically to the on-screen preview.
 *
 * Caveat: in-app browsers (Facebook, Instagram, TikTok, Zalo, etc.) often
 * suppress or break the print API — so we detect those and show a modal
 * asking the user to open the page in their real system browser.
 */
export class PdfController {
    constructor(model, theme, _invoiceEl, modal) {
        this.model = model;
        this.theme = theme;
        this.modal = modal;
        this.button = null;
        void _invoiceEl; // accepted for API compatibility, not used by print()
    }
    mount() {
        /* Header is mounted by HeaderView before this; query then. */
        this.button = document.getElementById("download-btn");
        this.button?.addEventListener("click", () => this.export());
    }
    /** Public so other views (e.g. ExportTabView) can trigger the export. */
    async export() {
        /* In-app browsers (Facebook, Instagram, TikTok, Zalo, etc.) often
           suppress window.print() — warn the user before we even try. */
        const detection = detectInAppBrowser();
        if ((detection.isInApp || detection.printMissing) && this.modal) {
            const ok = await this.showInAppWarning(detection.appName);
            if (!ok)
                return;
            /* User chose to try anyway — fall through to the print attempt. */
        }
        const data = this.model.getData();
        const presetName = this.theme.getPresetId();
        const filename = `invoice-${sanitizeFilename(data.fields.invoiceNumber)}-${presetName}`;
        /* The browser's print dialog pre-fills the "Save as PDF" filename from
           document.title. Swap it for the invoice name, fire the dialog, restore. */
        const originalTitle = document.title;
        document.title = filename;
        /* On tablet/mobile the edit drawer can be open when the user taps
           Export — close it so it doesn't bleed into the printed PDF. */
        document.body.classList.remove("edit-open");
        document.getElementById("edit-drawer")?.classList.remove("is-open");
        document.getElementById("edit-scrim")?.classList.remove("is-open");
        document.getElementById("edit-fab")?.setAttribute("aria-expanded", "false");
        /* Wait one frame so any pending DOM updates flush before we screenshot. */
        requestAnimationFrame(() => {
            window.print();
            /* Restore on the next tick — most browsers fire afterprint synchronously
               after the dialog closes, but a microtask is safer. */
            setTimeout(() => { document.title = originalTitle; }, 0);
        });
    }
    /**
     * Show the in-app-browser warning. Returns `true` if the user wants to
     * try printing anyway, `false` if they dismissed.
     */
    async showInAppWarning(appName) {
        if (!this.modal)
            return true;
        const url = window.location.href;
        const friendly = appName
            ? `It looks like you opened this from <strong>${appName}</strong>'s in-app browser.`
            : `Your current browser may not support saving to PDF.`;
        const ok = await this.modal.confirm({
            eyebrow: "§ open in browser",
            title: "Save as PDF needs a real browser.",
            bodyHTML: `${friendly} In-app browsers usually don't expose the "Save as PDF" option in their print dialog. <br/><br/>For best results, copy this link and open it in <em>Safari, Chrome, or any system browser</em>, then tap Export PDF again.`,
            confirmLabel: "Try anyway",
            cancelLabel: "Got it",
            secondary: {
                label: "Copy link",
                onClick: async () => {
                    try {
                        await navigator.clipboard.writeText(url);
                    }
                    catch {
                        /* older WebViews may block clipboard.writeText — fall back silently */
                    }
                },
            },
        });
        return ok;
    }
}
