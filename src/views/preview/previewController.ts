/**
 * Tablet/mobile: the preview is always visible (it IS the page); the editor
 * becomes a slide-in drawer summoned by the FAB. Desktop: the FAB and scrim
 * are hidden via CSS and this controller is essentially inert.
 */
export class PreviewController {
  private fab: HTMLButtonElement | null = null;
  private scrim: HTMLElement | null = null;
  private drawer: HTMLElement | null = null;
  private close: HTMLButtonElement | null = null;

  /** DOM queries deferred to start() — preview chrome is rendered by
      AppController.mountShell() which runs before start(). */
  start(): void {
    this.fab = document.getElementById("edit-fab") as HTMLButtonElement | null;
    this.scrim = document.getElementById("edit-scrim");
    this.drawer = document.getElementById("edit-drawer");
    this.close = document.getElementById("edit-drawer-close") as HTMLButtonElement | null;

    this.fab?.addEventListener("click", () => this.toggle());
    this.close?.addEventListener("click", () => this.setOpen(false));
    this.scrim?.addEventListener("click", () => this.setOpen(false));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) {
        e.preventDefault();
        this.setOpen(false);
      }
    });

    /* When the viewport crosses into desktop (≥1081px) the drawer becomes
       a normal grid cell. Force-close it to avoid stuck `is-open` state
       leaking into the desktop layout. */
    const desktopQuery = window.matchMedia("(min-width: 1081px)");
    const handleViewport = (mq: MediaQueryListEvent | MediaQueryList): void => {
      if (mq.matches && this.isOpen()) this.setOpen(false);
    };
    desktopQuery.addEventListener("change", handleViewport);
    handleViewport(desktopQuery); // run once at boot in case of stale state
  }

  private isOpen(): boolean {
    return this.drawer?.classList.contains("is-open") ?? false;
  }

  private toggle(): void {
    this.setOpen(!this.isOpen());
  }

  private setOpen(open: boolean): void {
    this.drawer?.classList.toggle("is-open", open);
    this.scrim?.classList.toggle("is-open", open);
    this.fab?.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("edit-open", open);
  }
}
