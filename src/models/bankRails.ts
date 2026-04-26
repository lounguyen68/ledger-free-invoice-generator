import type { BankRail, InvoiceFields } from "./types.js";

/** A single bank field as rendered both in the form (label) and on the
 *  invoice (printLabel). `printLabel` is what appears on the document next
 *  to the value — kept short so it sits well in the FROM box. */
export type BankFieldSpec = {
  key: keyof InvoiceFields;
  label: string;       // form label
  printLabel: string;  // invoice label (e.g. "SWIFT Code:", "Routing:")
  placeholder?: string;
};

/* Holder is shared by all rails — rendered as the heading inside the FROM box. */
const HOLDER: BankFieldSpec = {
  key: "bankHolder",
  label: "Name with Bank",
  printLabel: "",
  placeholder: "Name with Bank",
};

export const BANK_RAILS: Record<BankRail, {
  id: BankRail;
  title: string;
  hint: string;
  /** Holder shown above; the rest are listed in print order. */
  holder: BankFieldSpec;
  fields: BankFieldSpec[];
}> = {
  local: {
    id: "local",
    title: "Local",
    hint: "Domestic transfer — no SWIFT required.",
    holder: HOLDER,
    fields: [
      { key: "accountNumber", label: "Account Number", printLabel: "Account number" },
      { key: "routingCode",   label: "Routing Code",   printLabel: "Routing code",  placeholder: "ABA / Sort / BSB" },
      { key: "bankName",      label: "Bank Name",      printLabel: "Bank Name" },
      { key: "bankAddress",   label: "Bank Address",   printLabel: "Bank Address",  placeholder: "Optional" },
      { key: "branch",        label: "Branch",         printLabel: "Branch",        placeholder: "Optional" },
    ],
  },
  swift: {
    id: "swift",
    title: "SWIFT",
    hint: "International wire — full address required.",
    holder: HOLDER,
    fields: [
      { key: "swift",         label: "SWIFT Code",     printLabel: "SWIFT Code" },
      { key: "bankName",      label: "Bank Name",      printLabel: "Bank Name" },
      { key: "bankCountry",   label: "Country",        printLabel: "Country" },
      { key: "accountNumber", label: "Account Number", printLabel: "Account number" },
      { key: "payeeAddress",  label: "Payee Address",  printLabel: "Payee Address" },
      { key: "bankAddress",   label: "Bank Address",   printLabel: "Bank Address" },
    ],
  },
  iban: {
    id: "iban",
    title: "IBAN",
    hint: "SEPA / European transfer.",
    holder: HOLDER,
    fields: [
      { key: "iban",          label: "IBAN",           printLabel: "IBAN" },
      { key: "bic",           label: "BIC",            printLabel: "BIC" },
      { key: "bankName",      label: "Bank Name",      printLabel: "Bank Name" },
      { key: "bankCountry",   label: "Country",        printLabel: "Country" },
      { key: "bankAddress",   label: "Bank Address",   printLabel: "Bank Address",  placeholder: "Optional" },
    ],
  },
};

export const BANK_RAIL_IDS: BankRail[] = ["local", "swift", "iban"];

export function isBankRail(v: unknown): v is BankRail {
  return v === "local" || v === "swift" || v === "iban";
}
