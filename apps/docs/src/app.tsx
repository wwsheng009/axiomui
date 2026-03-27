import { useState } from "react";

import {
  AppShell,
  Button,
  Input,
  LocaleProvider,
  ThemeProvider,
  type AxiomDensity,
  type AxiomDirection,
  type AxiomThemeName,
} from "@axiomui/react";

import { DeferredDocsModule } from "./deferred-docs-module";
import {
  localeLabelByValue,
  localeOptions,
  themeLabelByValue,
  themeOptions,
  type LocaleCode,
} from "./docs-app-config";
import { DocsHeroSection } from "./docs-hero-section";
import { ThemeAndButtonDemoSections } from "./foundation-demo-sections";
import { OverlayDemoSections } from "./overlay-demo-sections";

const loadDocsOperationsSectionSet = () => import("./docs-operations-section-set");
const loadDocsShellSectionSet = () => import("./docs-shell-section-set");
const loadDocsChartSectionSet = () => import("./docs-chart-section-set");

export function App() {
  const [theme, setTheme] = useState<AxiomThemeName>("horizon");
  const [density, setDensity] = useState<AxiomDensity>("cozy");
  const [direction, setDirection] = useState<AxiomDirection>("ltr");
  const [locale, setLocale] = useState<LocaleCode>("en-US");
  const themeLabel = themeLabelByValue[theme];
  const localeLabel = localeLabelByValue[locale];

  return (
    <LocaleProvider locale={locale}>
      <ThemeProvider
        className="docs-app"
        density={density}
        direction={direction}
        theme={theme}
      >
        <AppShell
          brand={<span className="docs-brand-mark">AX</span>}
          primaryTitle="AxiomUI"
          secondaryTitle="React workspace inspired by SAP UI5 Horizon"
          search={
            <Input
              aria-label="Search AxiomUI"
              placeholder="Search tokens, layouts and components"
              endAdornment={<span className="docs-kbd">CTRL K</span>}
            />
          }
          actions={
            <>
              <Button variant="transparent">Tokens</Button>
              <Button variant="transparent">Layouts</Button>
              <Button variant="transparent">Patterns</Button>
              <Button variant="transparent">Inbox 3</Button>
            </>
          }
          meta={
            <div className="docs-shell-meta-group">
              <span className="docs-shell-indicator">{themeLabel}</span>
              <span className="docs-shell-indicator docs-shell-indicator--brand">
                Workspace
              </span>
              <Button variant="transparent">Profile</Button>
            </div>
          }
        >
          <div className="docs-stack">
            <DocsHeroSection
              density={density}
              direction={direction}
              locale={locale}
              localeLabel={localeLabel}
              localeOptions={localeOptions}
              theme={theme}
              themeLabel={themeLabel}
              themeOptions={themeOptions}
              onDensityChange={setDensity}
              onDirectionChange={setDirection}
              onLocaleChange={(nextLocale) => setLocale(nextLocale as LocaleCode)}
              onThemeChange={setTheme}
            />

            <ThemeAndButtonDemoSections />

            <OverlayDemoSections />

            <DeferredDocsModule
              componentProps={{
                densityLabel: density,
                locale,
                localeLabel,
                themeLabel,
              }}
              description="Form fields, advanced filters, worklist walkthroughs and related dialogs now load as a deferred operations bundle."
              heading="Loading operations demos"
              loader={loadDocsOperationsSectionSet}
              minHeight="56rem"
            />

            <DeferredDocsModule
              componentProps={{ locale }}
              description="Shell, object page and workspace layout demos now load when the reader approaches the shell section block."
              heading="Loading shell demos"
              loader={loadDocsShellSectionSet}
              minHeight="60rem"
            />

            <DeferredDocsModule
              componentProps={{}}
              description="Chart primitives, KPI cards and Chart Lab scenarios now load as a dedicated deferred chart bundle."
              heading="Loading chart demos"
              loader={loadDocsChartSectionSet}
              minHeight="72rem"
            />
          </div>
        </AppShell>
      </ThemeProvider>
    </LocaleProvider>
  );
}
