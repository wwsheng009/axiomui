import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useState,
} from "react";

import { cx } from "../lib/cx";
import type { AxiomDensity, AxiomDirection, AxiomThemeName } from "../types/theme";

export interface ThemeContextValue {
  density: AxiomDensity;
  direction: AxiomDirection;
  setDensity: (density: AxiomDensity) => void;
  setDirection: (direction: AxiomDirection) => void;
  setTheme: (theme: AxiomThemeName) => void;
  theme: AxiomThemeName;
}

export interface ThemeProviderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "dir"> {
  children?: ReactNode;
  defaultDensity?: AxiomDensity;
  defaultDirection?: AxiomDirection;
  defaultTheme?: AxiomThemeName;
  density?: AxiomDensity;
  direction?: AxiomDirection;
  onDensityChange?: (density: AxiomDensity) => void;
  onDirectionChange?: (direction: AxiomDirection) => void;
  onThemeChange?: (theme: AxiomThemeName) => void;
  theme?: AxiomThemeName;
}

const defaultThemeContextValue: ThemeContextValue = {
  density: "cozy",
  direction: "ltr",
  setDensity: () => undefined,
  setDirection: () => undefined,
  setTheme: () => undefined,
  theme: "horizon",
};

export const ThemeContext = createContext<ThemeContextValue>(defaultThemeContextValue);

export function ThemeProvider({
  children,
  className,
  defaultDensity = "cozy",
  defaultDirection = "ltr",
  defaultTheme = "horizon",
  density: densityProp,
  direction: directionProp,
  onDensityChange,
  onDirectionChange,
  onThemeChange,
  theme: themeProp,
  ...props
}: ThemeProviderProps) {
  const [densityState, setDensityState] = useState(defaultDensity);
  const [directionState, setDirectionState] = useState(defaultDirection);
  const [themeState, setThemeState] = useState(defaultTheme);

  const density = densityProp ?? densityState;
  const direction = directionProp ?? directionState;
  const theme = themeProp ?? themeState;

  function setDensity(nextDensity: AxiomDensity) {
    if (densityProp === undefined) {
      setDensityState(nextDensity);
    }

    onDensityChange?.(nextDensity);
  }

  function setDirection(nextDirection: AxiomDirection) {
    if (directionProp === undefined) {
      setDirectionState(nextDirection);
    }

    onDirectionChange?.(nextDirection);
  }

  function setTheme(nextTheme: AxiomThemeName) {
    if (themeProp === undefined) {
      setThemeState(nextTheme);
    }

    onThemeChange?.(nextTheme);
  }

  return (
    <ThemeContext.Provider
      value={{
        density,
        direction,
        setDensity,
        setDirection,
        setTheme,
        theme,
      }}
    >
      <div
        className={cx("ax-theme-provider", className)}
        data-axiom-density={density}
        data-axiom-theme={theme}
        dir={direction}
        {...props}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
