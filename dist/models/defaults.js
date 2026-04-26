/* Example invoice — fictional freelance designer billing a US client.
   All names, accounts, and addresses are dummy data for demonstration only. */
export const DEFAULT_FIELDS = {
    logo: "",
    logoLayout: "stacked-left",
    logoWidth: 1.6,
    logoHeight: 0.8,
    senderName: "Jane Doe Studio",
    senderAddress: "418 Spring Street, Suite 3B",
    senderCity: "Brooklyn, NY 11211",
    senderPhone: "+1 (212) 555-0142",
    invoiceNumber: "2026-0042",
    invoiceDate: "APRIL 26, 2026",
    bankRail: "swift",
    bankHolder: "Jane Doe",
    swift: "EXAMPLEXX",
    bankName: "First National Example Bank",
    bankCountry: "UNITED STATES",
    accountNumber: "0000 1234 5678",
    payeeAddress: "418 Spring Street, Suite 3B, Brooklyn, NY 11211",
    bankAddress: "200 Park Avenue, New York, NY 10166",
    routingCode: "",
    branch: "",
    iban: "",
    bic: "",
    forSubject: "Brand Identity Design — April 2026",
    paymentDetails: "Net 14. Wire transfer or ACH. Reference invoice number on payment.",
    preparedBy: "Jane Doe",
    preparedDate: "Apr 26, 2026",
    approvedBy: "",
    approvedDate: "",
};
export const DEFAULT_ITEMS = [
    { description: "1. Brand identity design — logo system & wordmark", amount: 3200 },
    { description: "2. Type system & color palette specification", amount: 1400 },
    { description: "3. Brand guidelines document (24 pages)", amount: 1800 },
    { description: "4. Revisions & client review (2 rounds)", amount: 600 },
];
export const PLACEHOLDERS = {
    senderName: "Full Name",
    bankHolder: "Name with Bank",
};
export function defaultInvoice() {
    return {
        fields: { ...DEFAULT_FIELDS },
        items: DEFAULT_ITEMS.map((i) => ({ ...i })),
        currency: "USD",
    };
}
