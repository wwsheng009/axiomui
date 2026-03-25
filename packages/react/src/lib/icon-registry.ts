export interface IconDefinition {
  path: string | string[];
  rtlMirror?: boolean;
  strokeLinecap?: "butt" | "round" | "square";
  strokeLinejoin?: "bevel" | "miter" | "round";
  strokeWidth?: number;
  viewBox?: string;
}

export type IconRegistryInput = Record<string, IconDefinition>;

const iconRegistry = new Map<string, IconDefinition>();

const defaultIcons: IconRegistryInput = {
  plus: {
    path: ["M12 5v14", "M5 12h14"],
  },
  close: {
    path: ["M6 6l12 12", "M18 6 6 18"],
  },
  search: {
    path: ["M11 19a8 8 0 1 1 5.3-14l4.2 4.2"],
  },
  information: {
    path: [
      "M12 17v-5",
      "M12 8h.01",
      "M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0z",
    ],
  },
  success: {
    path: [
      "m9 12 2 2 4-4",
      "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
    ],
  },
  warning: {
    path: ["M12 3 21 19H3L12 3zm0 5v5", "M12 16h.01"],
  },
  error: {
    path: [
      "M7.86 3.5h8.28L20.5 7.86v8.28L16.14 20.5H7.86L3.5 16.14V7.86L7.86 3.5z",
      "M9 9l6 6",
      "M15 9l-6 6",
    ],
  },
  menu: {
    path: ["M4 7h16", "M4 12h16", "M4 17h16"],
  },
  person: {
    path: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M5 20a7 7 0 0 1 14 0"],
  },
  calendar: {
    path: [
      "M7 3v3",
      "M17 3v3",
      "M5 8h14",
      "M5 6h14a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1z",
    ],
  },
  "chevron-down": {
    path: "m6 9 6 6 6-6",
  },
  "chevron-left": {
    path: "m15 18-6-6 6-6",
    rtlMirror: true,
  },
  "chevron-right": {
    path: "m9 18 6-6-6-6",
    rtlMirror: true,
  },
};

export function registerIcons(icons: IconRegistryInput) {
  Object.entries(icons).forEach(([name, icon]) => {
    iconRegistry.set(name, icon);
  });
}

export function getIconDefinition(name: string) {
  return iconRegistry.get(name);
}

export function hasIcon(name: string) {
  return iconRegistry.has(name);
}

export function getRegisteredIcons() {
  return Object.fromEntries(iconRegistry.entries());
}

registerIcons(defaultIcons);
