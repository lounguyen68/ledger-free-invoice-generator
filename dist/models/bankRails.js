/* Holder is shared by all rails — rendered as the heading inside the FROM box. */
const HOLDER = {
    key: "bankHolder",
    label: "Name with Bank",
    printLabel: "",
    placeholder: "Name with Bank",
};
export const BANK_RAILS = {
    local: {
        id: "local",
        title: "Local",
        hint: "Domestic transfer — no SWIFT required.",
        holder: HOLDER,
        fields: [
            { key: "accountNumber", label: "Account Number", printLabel: "Account number" },
            { key: "routingCode", label: "Routing Code", printLabel: "Routing code", placeholder: "ABA / Sort / BSB" },
            { key: "bankName", label: "Bank Name", printLabel: "Bank Name" },
            { key: "bankAddress", label: "Bank Address", printLabel: "Bank Address", placeholder: "Optional" },
            { key: "branch", label: "Branch", printLabel: "Branch", placeholder: "Optional" },
        ],
    },
    swift: {
        id: "swift",
        title: "SWIFT",
        hint: "International wire — full address required.",
        holder: HOLDER,
        fields: [
            { key: "swift", label: "SWIFT Code", printLabel: "SWIFT Code" },
            { key: "bankName", label: "Bank Name", printLabel: "Bank Name" },
            { key: "bankCountry", label: "Country", printLabel: "Country" },
            { key: "accountNumber", label: "Account Number", printLabel: "Account number" },
            { key: "payeeAddress", label: "Payee Address", printLabel: "Payee Address" },
            { key: "bankAddress", label: "Bank Address", printLabel: "Bank Address" },
        ],
    },
    iban: {
        id: "iban",
        title: "IBAN",
        hint: "SEPA / European transfer.",
        holder: HOLDER,
        fields: [
            { key: "iban", label: "IBAN", printLabel: "IBAN" },
            { key: "bic", label: "BIC", printLabel: "BIC" },
            { key: "bankName", label: "Bank Name", printLabel: "Bank Name" },
            { key: "bankCountry", label: "Country", printLabel: "Country" },
            { key: "bankAddress", label: "Bank Address", printLabel: "Bank Address", placeholder: "Optional" },
        ],
    },
};
export const BANK_RAIL_IDS = ["local", "swift", "iban"];
export function isBankRail(v) {
    return v === "local" || v === "swift" || v === "iban";
}
