import { InvoiceModel } from "../models/invoiceModel.js";
import { ThemeModel } from "../models/themeModel.js";
import { defaultInvoice } from "../models/defaults.js";
import { HeaderView } from "../views/header/headerView.js";
import { TabsView } from "../views/tabRail/tabsView.js";
import { ThemeView } from "../views/themeTab/themeView.js";
import { FormView } from "../views/composeTab/formView.js";
import { ExportTabView } from "../views/exportTab/exportTabView.js";
import { InvoiceView } from "../views/invoice/invoiceView.js";
import { ModalView } from "../views/modal/modalView.js";
import { DrawerController } from "../views/drawer/drawerController.js";
import { PreviewController } from "../views/preview/previewController.js";
import { ZoomController } from "../views/preview/zoomController.js";
import { previewChromeHTML, previewPaneHTML } from "../views/preview/preview.html.js";
import { PdfController } from "./pdfController.js";

/**
 * Boots the editor app. Mounts every view component into its slot in
 * `app.html`'s shell, then wires up the cross-cutting controllers
 * (drawer, preview, zoom, PDF, modal).
 */
export class AppController {
  private invoice: InvoiceModel;
  private theme: ThemeModel;
  private modal: ModalView;

  private header: HeaderView;
  private tabs: TabsView;
  private themeView: ThemeView;
  private form: FormView;
  private exportView: ExportTabView;
  private invoiceView: InvoiceView;

  private pdf: PdfController;
  private drawers: DrawerController;
  private preview: PreviewController;
  private zoom: ZoomController;

  constructor() {
    this.invoice = new InvoiceModel();
    this.theme = new ThemeModel();
    this.modal = new ModalView();

    this.header = new HeaderView();
    this.tabs = new TabsView();
    this.themeView = new ThemeView(this.theme, this.modal);
    this.form = new FormView(this.invoice);
    this.invoiceView = new InvoiceView(this.invoice, this.theme);
    this.pdf = new PdfController(this.invoice, this.theme, document.body, this.modal);
    this.exportView = new ExportTabView(this.theme, this.modal, () => this.pdf.export());

    this.drawers = new DrawerController();
    this.preview = new PreviewController();
    this.zoom = new ZoomController();
  }

  start(): void {
    /* 1. Mount the static shell pieces (header + drawer + preview chrome) */
    this.mountShell();

    /* 2. Mount component views into their hosts */
    const tabRailHost = document.getElementById("tab-rail-host") as HTMLElement;
    this.tabs.mount(tabRailHost);

    const tabHosts = this.tabs.getTabHosts();
    this.themeView.mount(tabHosts.theme);
    this.form.mount(tabHosts.compose);
    this.exportView.mount(tabHosts.export);

    const previewStage = document.getElementById("preview-stage") as HTMLElement;
    this.invoiceView.mount(previewStage);

    /* 3. Wire cross-cutting controllers (now that DOM exists) */
    this.drawers.start();
    this.preview.start();
    this.zoom.start();
    this.pdf.mount();
    this.bindHeaderReset();
  }

  private mountShell(): void {
    const headerHost = document.getElementById("app-header-host") as HTMLElement;
    this.header.mount(headerHost);

    /* Preview chrome (FAB, scrim, zoom toolbar) and the preview pane go
       into the editor layout shell where the markup is just empty hosts. */
    const previewHost = document.getElementById("preview-host") as HTMLElement;
    previewHost.innerHTML = previewChromeHTML() + previewPaneHTML();
  }

  private bindHeaderReset(): void {
    const btn = document.getElementById("reset-btn") as HTMLButtonElement | null;
    if (!btn) return;
    btn.addEventListener("click", async () => {
      const ok = await this.modal.confirm({
        eyebrow: "§ reset",
        title: "Clear the composition?",
        body: "Every field and every line item returns to its default. Your selected theme stays put.",
        confirmLabel: "Reset content",
        cancelLabel: "Keep editing",
        destructive: true,
      });
      if (ok) this.invoice.reset(defaultInvoice());
    });
  }
}
