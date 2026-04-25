/* Currency catalogue — 12 most common, ordered by ubiquity. */

export type CurrencyCode =
  | "USD" | "EUR" | "GBP" | "JPY" | "CNY"
  | "VND" | "AUD" | "CAD" | "CHF" | "SGD"
  | "INR" | "KRW";

export type CurrencyOption = {
  code: CurrencyCode;
  label: string;     // human-readable, used in dropdown
  symbol: string;    // displayed inline
  locale: string;    // BCP-47 locale for formatting
};

export const CURRENCIES: ReadonlyArray<CurrencyOption> = [
  { code: "USD", label: "US Dollar",        symbol: "$",   locale: "en-US" },
  { code: "EUR", label: "Euro",             symbol: "€",   locale: "en-IE" },
  { code: "GBP", label: "British Pound",    symbol: "£",   locale: "en-GB" },
  { code: "JPY", label: "Japanese Yen",     symbol: "¥",   locale: "ja-JP" },
  { code: "CNY", label: "Chinese Yuan",     symbol: "¥",   locale: "zh-CN" },
  { code: "VND", label: "Vietnamese Dong",  symbol: "₫",   locale: "vi-VN" },
  { code: "AUD", label: "Australian Dollar",symbol: "A$",  locale: "en-AU" },
  { code: "CAD", label: "Canadian Dollar",  symbol: "C$",  locale: "en-CA" },
  { code: "CHF", label: "Swiss Franc",      symbol: "CHF", locale: "de-CH" },
  { code: "SGD", label: "Singapore Dollar", symbol: "S$",  locale: "en-SG" },
  { code: "INR", label: "Indian Rupee",     symbol: "₹",   locale: "en-IN" },
  { code: "KRW", label: "Korean Won",       symbol: "₩",   locale: "ko-KR" },
];

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === "string" && CURRENCIES.some((c) => c.code === value);
}

export function findCurrency(code: CurrencyCode): CurrencyOption {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]!;
}
