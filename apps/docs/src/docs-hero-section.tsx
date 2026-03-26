import {
  Button,
  type AxiomDensity,
  type AxiomDirection,
  type AxiomThemeName,
} from "@axiomui/react";

import { DocsLocalePreview } from "./worklist-advanced/worklist-display";

interface DocsHeroSectionProps {
  density: AxiomDensity;
  direction: AxiomDirection;
  locale: string;
  localeLabel: string;
  localeOptions: Array<{ label: string; value: string }>;
  onDensityChange: (density: AxiomDensity) => void;
  onDirectionChange: (direction: AxiomDirection) => void;
  onLocaleChange: (locale: string) => void;
  onThemeChange: (theme: AxiomThemeName) => void;
  theme: AxiomThemeName;
  themeLabel: string;
  themeOptions: Array<{ label: string; value: AxiomThemeName }>;
}

export function DocsHeroSection({
  density,
  direction,
  locale,
  localeLabel,
  localeOptions,
  onDensityChange,
  onDirectionChange,
  onLocaleChange,
  onThemeChange,
  theme,
  themeLabel,
  themeOptions,
}: DocsHeroSectionProps) {
  return (
    <section className="docs-hero">
      <div className="docs-hero__content">
        <span className="docs-eyebrow">Horizon-inspired component system</span>
        <h1 className="docs-hero__title">
          Initialize a UI5-fluent workspace, not a pile of disconnected widgets.
        </h1>
        <p className="docs-hero__copy">
          AxiomUI now starts from the same layered idea we extracted from UI5:
          foundation tokens, semantic aliases, React primitives and a docs app
          to validate density, states and layout behavior together.
        </p>

        <div className="docs-action-row">
          <Button iconName="plus" variant="emphasized">
            Create package
          </Button>
          <Button variant="default">Open analysis assets</Button>
        </div>

        <div className="docs-controls">
          <div className="docs-control-block">
            <span className="docs-control-label">Theme</span>
            <div className="docs-toggle-row">
              {themeOptions.map((option) => (
                <Button
                  key={option.value}
                  selected={theme === option.value}
                  variant="transparent"
                  onClick={() => onThemeChange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="docs-control-block">
            <span className="docs-control-label">Density</span>
            <div className="docs-toggle-row">
              <Button
                selected={density === "cozy"}
                variant="transparent"
                onClick={() => onDensityChange("cozy")}
              >
                Cozy
              </Button>
              <Button
                selected={density === "compact"}
                variant="transparent"
                onClick={() => onDensityChange("compact")}
              >
                Compact
              </Button>
            </div>
          </div>

          <div className="docs-control-block">
            <span className="docs-control-label">Direction</span>
            <div className="docs-toggle-row">
              <Button
                selected={direction === "ltr"}
                variant="transparent"
                onClick={() => onDirectionChange("ltr")}
              >
                LTR
              </Button>
              <Button
                selected={direction === "rtl"}
                variant="transparent"
                onClick={() => onDirectionChange("rtl")}
              >
                RTL
              </Button>
            </div>
          </div>

          <div className="docs-control-block">
            <span className="docs-control-label">Locale</span>
            <div className="docs-toggle-row">
              {localeOptions.map((option) => (
                <Button
                  key={option.value}
                  selected={locale === option.value}
                  variant="transparent"
                  onClick={() => onLocaleChange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="docs-hero__aside">
        <div className="docs-metric">
          <span className="docs-metric__label">Workspace split</span>
          <strong className="docs-metric__value">tokens + react + docs</strong>
        </div>
        <div className="docs-metric">
          <span className="docs-metric__label">Theme matrix</span>
          <strong className="docs-metric__value">{themeLabel}</strong>
        </div>
        <div className="docs-metric">
          <span className="docs-metric__label">Locale ready</span>
          <strong className="docs-metric__value">{localeLabel}</strong>
        </div>
        <div className="docs-metric">
          <span className="docs-metric__label">Core components</span>
          <strong className="docs-metric__value">
            Shell, Button, Input, Card, Tabs, Dialog, Table, Form Grid
          </strong>
        </div>
        <DocsLocalePreview />
      </div>
    </section>
  );
}
