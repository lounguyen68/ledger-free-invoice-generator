import { modalCardHTML } from "./modalView.html.js";

/**
 * Custom in-app confirm modal that matches Ledger's aesthetic.
 * Replaces window.confirm() — paper card, Fraunces italic title, oxblood
 * accent for destructive actions, hairline frame, focus-trapped.
 */

export type ConfirmOptions = {
  eyebrow?: string;
  title: string;
  body?: string;
  bodyHTML?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  cancelHidden?: boolean;
  secondary?: { label: string; onClick: () => void | Promise<void> };
  textarea?: {
    placeholder?: string;
    rows?: number;
    onConfirm: (value: string) => boolean | void;
  };
};

export class ModalView {
  private root: HTMLElement | null = null;
  private previouslyFocused: HTMLElement | null = null;
  private currentResolve: ((value: boolean) => void) | null = null;

  confirm(opts: ConfirmOptions): Promise<boolean> {
    if (this.root) this.dismiss(false);

    return new Promise<boolean>((resolve) => {
      this.currentResolve = resolve;
      this.previouslyFocused = (document.activeElement as HTMLElement) ?? null;
      this.root = this.build(opts);
      document.body.appendChild(this.root);
      requestAnimationFrame(() => this.root?.classList.add("is-open"));
      requestAnimationFrame(() => {
        const ta = this.root?.querySelector<HTMLTextAreaElement>("[data-modal-input]");
        if (ta) ta.focus();
        else this.root?.querySelector<HTMLButtonElement>("[data-modal-confirm]")?.focus();
      });
    });
  }

  private build(opts: ConfirmOptions): HTMLElement {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.setAttribute("role", "presentation");
    overlay.innerHTML = modalCardHTML(opts);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) this.dismiss(false);
    });

    overlay.querySelector("[data-modal-cancel]")?.addEventListener("click", () => this.dismiss(false));

    overlay.querySelector("[data-modal-confirm]")?.addEventListener("click", () => {
      if (opts.textarea) {
        const ta = overlay.querySelector<HTMLTextAreaElement>("[data-modal-input]");
        const errEl = overlay.querySelector<HTMLElement>("[data-modal-error]");
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
      if (e.key === "Tab") this.handleTab(e);
    });

    return overlay;
  }

  private handleTab(e: KeyboardEvent): void {
    if (!this.root) return;
    const focusables = this.root.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  private dismiss(value: boolean): void {
    if (!this.root) return;
    const root = this.root;
    root.classList.remove("is-open");
    root.classList.add("is-closing");
    this.currentResolve?.(value);
    this.currentResolve = null;

    const cleanup = (): void => {
      root.removeEventListener("transitionend", cleanup);
      root.remove();
      if (this.root === root) this.root = null;
      this.previouslyFocused?.focus();
      this.previouslyFocused = null;
    };
    root.addEventListener("transitionend", cleanup, { once: true });
    setTimeout(cleanup, 320);
  }
}
