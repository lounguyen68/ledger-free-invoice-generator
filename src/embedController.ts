import type { InvoiceData } from "./models/types.js";
import type { InvoiceModel } from "./models/invoiceModel.js";
import type { ThemeModel } from "./models/themeModel.js";

type LedgerInboundMessage =
  | { type: "LEDGER_SET_DATA"; invoice: InvoiceData; themeId: string }
  | { type: "LEDGER_PRINT" }
  | { type: "LEDGER_GET_DATA" };

type LedgerOutboundMessage =
  | { type: "LEDGER_READY" }
  | { type: "LEDGER_DATA"; invoice: InvoiceData; themeId: string };

export function initEmbedMode(
  invoiceModel: InvoiceModel,
  themeModel: ThemeModel,
): void {
  document.body.classList.add("embed-mode");

  window.parent.postMessage(
    { type: "LEDGER_READY" } satisfies LedgerOutboundMessage,
    "*",
  );

  window.addEventListener("message", (e: MessageEvent) => {
    const msg = e.data as LedgerInboundMessage;
    switch (msg?.type) {
      case "LEDGER_SET_DATA":
        invoiceModel.setData(msg.invoice);
        themeModel.applyPreset(msg.themeId);
        break;

      case "LEDGER_PRINT":
        window.print();
        break;

      case "LEDGER_GET_DATA":
        window.parent.postMessage(
          {
            type: "LEDGER_DATA",
            invoice: invoiceModel.getData(),
            themeId: themeModel.getCurrentPresetId(),
          } satisfies LedgerOutboundMessage,
          "*",
        );
        break;
    }
  });
}
