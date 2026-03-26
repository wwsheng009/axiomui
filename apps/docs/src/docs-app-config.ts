import type {
  AxiomThemeName,
} from "@axiomui/react";

export type LocaleCode = "en-US" | "zh-CN";

export const themeOptions: Array<{ label: string; value: AxiomThemeName }> = [
  { label: "Horizon", value: "horizon" },
  { label: "Horizon Dark", value: "horizon_dark" },
  { label: "Horizon HCB", value: "horizon_hcb" },
  { label: "Horizon HCW", value: "horizon_hcw" },
  { label: "Fiori 3", value: "fiori_3" },
  { label: "Fiori 3 Dark", value: "fiori_3_dark" },
];

export const themeLabelByValue: Record<AxiomThemeName, string> = {
  horizon: "Horizon",
  horizon_dark: "Horizon Dark",
  horizon_hcb: "Horizon HCB",
  horizon_hcw: "Horizon HCW",
  fiori_3: "Fiori 3",
  fiori_3_dark: "Fiori 3 Dark",
};

export const localeOptions: Array<{ label: string; value: LocaleCode }> = [
  { label: "English", value: "en-US" },
  { label: "简体中文", value: "zh-CN" },
];

export const localeLabelByValue: Record<LocaleCode, string> = {
  "en-US": "English",
  "zh-CN": "简体中文",
};
