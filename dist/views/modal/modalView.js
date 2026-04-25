import { modalCardHTML } from "./modalView.html.js";
export class ModalView {
    constructor() {
        this.root = null;
        this.previouslyFocused = null;
        this.currentResolve = null;
    }
    confirm(opts) {
        if (this.root)
            this.dismiss(false);
        return new Promise((resolve) => {
            this.currentResolve = resolve;
            this.previouslyFocused = document.activeElement ?? null;
            this.root = this.build(opts);
            document.body.appendChild(this.root);
            requestAnimationFrame(() => this.root?.classList.add("is-open"));
            requestAnimationFrame(() => {
                const ta = this.root?.querySelector("[data-modal-input]");
                if (ta)
                    ta.focus();
                else
                    this.root?.querySelector("[data-modal-confirm]")?.focus();
            });
        });
    }
    build(opts) {
        const overlay = document.createElement("div");
        overlay.className = "modal-overlay";
        overlay.setAttribute("role", "presentation");
        overlay.innerHTML = modalCardHTML(opts);
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay)
                this.dismiss(false);
        });
        overlay.querySelector("[data-modal-cancel]")?.addEventListener("click", () => this.dismiss(false));
        overlay.querySelector("[data-modal-confirm]")?.addEventListener("click", () => {
            if (opts.textarea) {
                const ta = overlay.querySelector("[data-modal-input]");
                const errEl = overlay.querySelector("[data-modal-error]");
                const value = ta?.value ?? "";
                const result = opts.textarea.onConfirm(value);
                if (result === false) {
                    if (errEl) {
                        errEl.textContent = "That doesn't look like a valid theme. Try again.";
                        errEl.removeAttribute("hidden");
                    }
                    ta?.focus();
                    return;
                }
            }
            this.dismiss(true);
        });
        overlay.querySelector("[data-modal-secondary]")?.addEventListener("click", async () => {
            await opts.secondary?.onClick();
        });
        overlay.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                this.dismiss(false);
                return;
            }
            if (e.key === "Tab")
                this.handleTab(e);
        });
        return overlay;
    }
    handleTab(e) {
        if (!this.root)
            return;
        const focusables = this.root.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
        if (focusables.length === 0)
            return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
            e.preventDefault();
            last.focus();
        }
        else if (!e.shiftKey && active === last) {
            e.preventDefault();
            first.focus();
        }
    }
    dismiss(value) {
        if (!this.root)
            return;
        const root = this.root;
        root.classList.remove("is-open");
        root.classList.add("is-closing");
        this.currentResolve?.(value);
        this.currentResolve = null;
        const cleanup = () => {
            root.removeEventListener("transitionend", cleanup);
            root.remove();
            if (this.root === root)
                this.root = null;
            this.previouslyFocused?.focus();
            this.previouslyFocused = null;
        };
        root.addEventListener("transitionend", cleanup, { once: true });
        setTimeout(cleanup, 320);
    }
}
