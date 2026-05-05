export function initEmbedMode(invoiceModel, themeModel) {
    document.body.classList.add("embed-mode");
    window.parent.postMessage({ type: "LEDGER_READY" }, "*");
    window.addEventListener("message", (e) => {
        const msg = e.data;
        switch (msg?.type) {
            case "LEDGER_SET_DATA":
                invoiceModel.setData(msg.invoice);
                themeModel.applyPreset(msg.themeId);
                break;
            case "LEDGER_PRINT":
                window.print();
                break;
            case "LEDGER_GET_DATA":
                window.parent.postMessage({
                    type: "LEDGER_DATA",
                    invoice: invoiceModel.getData(),
                    themeId: themeModel.getCurrentPresetId(),
                }, "*");
                break;
        }
    });
}
