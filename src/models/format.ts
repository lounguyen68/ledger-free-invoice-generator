import type { CurrencyCode } from "./currency.js";
import { findCurrency } from "./currency.js";

export function formatCurrency(n: number, code: CurrencyCode = "USD"): string {
  const c = findCurrency(code);
  /* JPY, KRW, VND don't use minor units (no decimals).
     For everything else we want exactly 2 decimal places. */
  const noDecimals = code === "JPY" || code === "KRW" || code === "VND";
  return n.toLocaleString(c.locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits: noDecimals ? 0 : 2,
    maximumFractionDigits: noDecimals ? 0 : 2,
  });
}

export function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

export function sanitizeFilename(s: string): string {
  return s.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "invoice";
}
