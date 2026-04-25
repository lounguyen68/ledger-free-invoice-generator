/* ─────────────────────────────────────────────────────────────
   Theme tokens — drive every visual aspect of the invoice via CSS vars.
   10 presets + free customization per token.
   ───────────────────────────────────────────────────────────── */

export type FontFamily =
  | "general-sans"
  | "inter-tight"
  | "fraunces"
  | "playfair"
  | "newsreader"
  | "crimson-pro"
  | "archivo"
  | "archivo-narrow"
  | "ibm-plex-mono"
  | "jetbrains-mono"
  | "geist"
  | "instrument-serif";

export const FONT_OPTIONS: ReadonlyArray<{ id: FontFamily; label: string; stack: string; kind: "sans" | "serif" | "mono" }> = [
  { id: "general-sans", label: "General Sans", stack: '"General Sans", system-ui, sans-serif', kind: "sans" },
  { id: "inter-tight", label: "Inter Tight", stack: '"Inter Tight", system-ui, sans-serif', kind: "sans" },
  { id: "geist", label: "Geist", stack: '"Geist", system-ui, sans-serif', kind: "sans" },
  { id: "archivo", label: "Archivo", stack: '"Archivo", system-ui, sans-serif', kind: "sans" },
  { id: "archivo-narrow", label: "Archivo Narrow", stack: '"Archivo Narrow", "Archivo", sans-serif', kind: "sans" },
  { id: "fraunces", label: "Fraunces", stack: '"Fraunces", Georgia, serif', kind: "serif" },
  { id: "playfair", label: "Playfair Display", stack: '"Playfair Display", Georgia, serif', kind: "serif" },
  { id: "newsreader", label: "Newsreader", stack: '"Newsreader", Georgia, serif', kind: "serif" },
  { id: "crimson-pro", label: "Crimson Pro", stack: '"Crimson Pro", Georgia, serif', kind: "serif" },
  { id: "instrument-serif", label: "Instrument Serif", stack: '"Instrument Serif", Georgia, serif', kind: "serif" },
  { id: "ibm-plex-mono", label: "IBM Plex Mono", stack: '"IBM Plex Mono", ui-monospace, monospace', kind: "mono" },
  { id: "jetbrains-mono", label: "JetBrains Mono", stack: '"JetBrains Mono", ui-monospace, monospace', kind: "mono" },
];

export type Density = "compact" | "comfortable" | "loose";
export type RuleWeight = "hairline" | "standard" | "heavy" | "double";
export type TotalStyle = "inverted" | "outlined" | "underlined";
export type FigureStyle = "lining" | "oldstyle" | "tabular";

export type Theme = {
  /* identity */
  id: string;
  name: string;
  tagline: string;

  /* color */
  paper: string;        // background of the invoice page
  ink: string;          // primary text + rules
  inkSoft: string;
  inkMute: string;
  accent: string;       // section labels, decorative
  accentInk: string;    // text color when on accent background

  /* type */
  displayFont: FontFamily;
  bodyFont: FontFamily;
  monoFont: FontFamily;
  displayWeight: number;     // 400-900
  displayItalic: boolean;
  letterSpacing: number;     // -0.02 .. 0.05  (em)
  figureStyle: FigureStyle;

  /* rhythm */
  density: Density;          // padding scale
  rule: RuleWeight;          // border weights
  radius: number;            // 0..8 px
  totalStyle: TotalStyle;

  /* invoice title size */
  titleScale: number;        // 0.7..1.4
};

export const PRESETS: ReadonlyArray<Theme> = [
  {
    id: "classic",
    name: "Classic",
    tagline: "Strict black-on-white. Photocopy-safe.",
    paper: "#ffffff", ink: "#000000", inkSoft: "#1a1a1a", inkMute: "#4a4a4a",
    accent: "#000000", accentInk: "#ffffff",
    displayFont: "crimson-pro", bodyFont: "crimson-pro", monoFont: "jetbrains-mono",
    displayWeight: 700, displayItalic: false, letterSpacing: -0.01, figureStyle: "lining",
    density: "comfortable", rule: "standard", radius: 0, totalStyle: "outlined",
    titleScale: 0.85,
  },
  {
    id: "ledger",
    name: "Ledger",
    tagline: "Parchment editorial. Oxblood accents.",
    paper: "#faf5e9", ink: "#1a1612", inkSoft: "#2c241d", inkMute: "#6b5e4e",
    accent: "#8b2e1f", accentInk: "#faf5e9",
    displayFont: "fraunces", bodyFont: "newsreader", monoFont: "jetbrains-mono",
    displayWeight: 800, displayItalic: false, letterSpacing: -0.025, figureStyle: "oldstyle",
    density: "comfortable", rule: "hairline", radius: 0, totalStyle: "inverted",
    titleScale: 1.1,
  },
  {
    id: "bauhaus",
    name: "Bauhaus",
    tagline: "Geometric, primary, unflinching.",
    paper: "#ffffff", ink: "#0a0a0a", inkSoft: "#1a1a1a", inkMute: "#5a5a5a",
    accent: "#c83737", accentInk: "#ffffff",
    displayFont: "archivo", bodyFont: "archivo", monoFont: "jetbrains-mono",
    displayWeight: 800, displayItalic: false, letterSpacing: -0.03, figureStyle: "lining",
    density: "comfortable", rule: "heavy", radius: 0, totalStyle: "underlined",
    titleScale: 1.15,
  },
  {
    id: "gazette",
    name: "Gazette",
    tagline: "Newspaper masthead. Italic display.",
    paper: "#fafaf6", ink: "#111111", inkSoft: "#222222", inkMute: "#666666",
    accent: "#111111", accentInk: "#fafaf6",
    displayFont: "playfair", bodyFont: "newsreader", monoFont: "jetbrains-mono",
    displayWeight: 900, displayItalic: true, letterSpacing: -0.03, figureStyle: "oldstyle",
    density: "loose", rule: "double", radius: 0, totalStyle: "outlined",
    titleScale: 1.2,
  },
  {
    id: "mono",
    name: "Mono",
    tagline: "Terminal. Receipt. Repo README.",
    paper: "#ffffff", ink: "#000000", inkSoft: "#1a1a1a", inkMute: "#555555",
    accent: "#000000", accentInk: "#ffffff",
    displayFont: "ibm-plex-mono", bodyFont: "ibm-plex-mono", monoFont: "ibm-plex-mono",
    displayWeight: 600, displayItalic: false, letterSpacing: 0, figureStyle: "tabular",
    density: "compact", rule: "hairline", radius: 0, totalStyle: "outlined",
    titleScale: 0.7,
  },
  {
    id: "linen",
    name: "Linen",
    tagline: "Soft beige. Sage rule. Quiet.",
    paper: "#f4efe5", ink: "#2a2823", inkSoft: "#3a3833", inkMute: "#7a766a",
    accent: "#5a6650", accentInk: "#f4efe5",
    displayFont: "instrument-serif", bodyFont: "newsreader", monoFont: "jetbrains-mono",
    displayWeight: 400, displayItalic: false, letterSpacing: -0.02, figureStyle: "oldstyle",
    density: "loose", rule: "hairline", radius: 0, totalStyle: "outlined",
    titleScale: 1.25,
  },
  {
    id: "marine",
    name: "Marine",
    tagline: "Navy & brass. Formal correspondence.",
    paper: "#f6f3ec", ink: "#0e2a3a", inkSoft: "#1d3a4a", inkMute: "#4a6070",
    accent: "#a37a3a", accentInk: "#f6f3ec",
    displayFont: "fraunces", bodyFont: "newsreader", monoFont: "jetbrains-mono",
    displayWeight: 700, displayItalic: false, letterSpacing: -0.02, figureStyle: "oldstyle",
    density: "comfortable", rule: "standard", radius: 2, totalStyle: "inverted",
    titleScale: 1.05,
  },
  {
    id: "carbon",
    name: "Carbon",
    tagline: "Minimal gray. Geist. Restrained.",
    paper: "#fafafa", ink: "#0a0a0a", inkSoft: "#262626", inkMute: "#737373",
    accent: "#0a0a0a", accentInk: "#fafafa",
    displayFont: "geist", bodyFont: "geist", monoFont: "jetbrains-mono",
    displayWeight: 600, displayItalic: false, letterSpacing: -0.025, figureStyle: "tabular",
    density: "comfortable", rule: "hairline", radius: 4, totalStyle: "underlined",
    titleScale: 0.95,
  },
  {
    id: "riso",
    name: "Riso",
    tagline: "Two-color zine. Risograph energy.",
    paper: "#fff8ee", ink: "#1f2a8a", inkSoft: "#2a3596", inkMute: "#5a6db5",
    accent: "#e63946", accentInk: "#fff8ee",
    displayFont: "archivo", bodyFont: "archivo", monoFont: "ibm-plex-mono",
    displayWeight: 800, displayItalic: false, letterSpacing: -0.02, figureStyle: "lining",
    density: "comfortable", rule: "heavy", radius: 0, totalStyle: "underlined",
    titleScale: 1.1,
  },
  {
    id: "noir",
    name: "Noir",
    tagline: "Inverse. Cream ink on charcoal.",
    paper: "#1a1612", ink: "#f4ede0", inkSoft: "#d6cebd", inkMute: "#8a7e6a",
    accent: "#a37a3a", accentInk: "#1a1612",
    displayFont: "fraunces", bodyFont: "newsreader", monoFont: "jetbrains-mono",
    displayWeight: 700, displayItalic: true, letterSpacing: -0.02, figureStyle: "oldstyle",
    density: "comfortable", rule: "hairline", radius: 0, totalStyle: "inverted",
    titleScale: 1.05,
  },
  {
    id: "botanica",
    name: "Botanica",
    tagline: "Apothecary green. Quiet, herbal.",
    paper: "#f5f1e3", ink: "#1f3a2a", inkSoft: "#2c4a3a", inkMute: "#5a7065",
    accent: "#7a5028", accentInk: "#f5f1e3",
    displayFont: "instrument-serif", bodyFont: "newsreader", monoFont: "jetbrains-mono",
    displayWeight: 400, displayItalic: true, letterSpacing: -0.025, figureStyle: "oldstyle",
    density: "loose", rule: "hairline", radius: 0, totalStyle: "outlined",
    titleScale: 1.2,
  },
  {
    id: "atomic",
    name: "Atomic",
    tagline: "Mid-century. Orange burst, hard rules.",
    paper: "#fbf2dd", ink: "#1a1410", inkSoft: "#2a221a", inkMute: "#665a4a",
    accent: "#e8651a", accentInk: "#fbf2dd",
    displayFont: "archivo", bodyFont: "archivo", monoFont: "jetbrains-mono",
    displayWeight: 800, displayItalic: false, letterSpacing: -0.035, figureStyle: "lining",
    density: "comfortable", rule: "double", radius: 0, totalStyle: "inverted",
    titleScale: 1.15,
  },
];

export function findPreset(id: string): Theme | undefined {
  return PRESETS.find((p) => p.id === id);
}

export const DEFAULT_PRESET_ID = "classic";

/* density → invoice padding (inches) */
export const DENSITY_PADDING: Record<Density, string> = {
  compact: "0.5in",
  comfortable: "0.7in",
  loose: "0.9in",
};

/* rule → border-width (px) */
export const RULE_WIDTH: Record<RuleWeight, string> = {
  hairline: "0.5px",
  standard: "1px",
  heavy: "2px",
  double: "3px",
};

export const RULE_STYLE: Record<RuleWeight, string> = {
  hairline: "solid",
  standard: "solid",
  heavy: "solid",
  double: "double",
};

export function figuresToFontVariant(fig: FigureStyle): string {
  switch (fig) {
    case "lining": return "lining-nums";
    case "oldstyle": return "oldstyle-nums";
    case "tabular": return "tabular-nums lining-nums";
  }
}
