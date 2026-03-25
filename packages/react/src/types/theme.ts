export const axiomThemeNames = [
  "horizon",
  "horizon_dark",
  "horizon_hcb",
  "horizon_hcw",
  "fiori_3",
  "fiori_3_dark",
] as const;

export type AxiomThemeName = (typeof axiomThemeNames)[number];

export const axiomDensities = ["cozy", "compact"] as const;

export type AxiomDensity = (typeof axiomDensities)[number];

export const axiomDirections = ["ltr", "rtl"] as const;

export type AxiomDirection = (typeof axiomDirections)[number];

export function isAxiomThemeName(value: unknown): value is AxiomThemeName {
  return typeof value === "string" && axiomThemeNames.includes(value as AxiomThemeName);
}

export function isAxiomDensity(value: unknown): value is AxiomDensity {
  return typeof value === "string" && axiomDensities.includes(value as AxiomDensity);
}

export function isAxiomDirection(value: unknown): value is AxiomDirection {
  return typeof value === "string" && axiomDirections.includes(value as AxiomDirection);
}
