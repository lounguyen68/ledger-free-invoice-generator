import type { CurrencyCode } from "./currency.js";

export type Item = { description: string; amount: number };

/** How the logo relates to the sender block in the invoice header. */
export type LogoLayout =
  | "stacked-left"   // logo on top, sender below — top-left
  | "inline-left"    // logo beside sender, same row — top-left
  | "right"          // logo top-right (replaces invoice title position)
  | "centered";      // logo top-center, full-width banner above sender

export type InvoiceFields = {
  /** Optional company/agency logo as a base64 data URL (or "" for none). */
  logo: string;
  /** How logo is composed with sender info. */
  logoLayout: LogoLayout;
  /** Logo width in inches (0.8 .. 4). */
  logoWidth: number;
  /** Logo max height in inches (0.4 .. 2). image aspect-ratio preserved via contain. */
  logoHeight: number;
  senderName: string;
  senderAddress: string;
  senderCity: string;
  senderPhone: string;
  invoiceNumber: string;
  invoiceDate: string;
  bankHolder: string;
  swift: string;
  bankName: string;
  bankCountry: string;
  accountNumber: string;
  payeeAddress: string;
  bankAddress: string;
  forSubject: string;
  paymentDetails: string;
  preparedBy: string;
  preparedDate: string;
  approvedBy: string;
  approvedDate: string;
};

export type InvoiceData = {
  fields: InvoiceFields;
  items: Item[];
  currency: CurrencyCode;
};
