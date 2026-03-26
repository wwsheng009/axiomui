import { useState } from "react";

import {
  AppShell,
  LocaleProvider,
  ThemeProvider,
  Button,
  Input,
  type AxiomDensity,
  type AxiomDirection,
  type AxiomThemeName,
} from "@axiomui/react";

import {
  localeLabelByValue,
  localeOptions,
  themeLabelByValue,
  themeOptions,
  type LocaleCode,
} from "./docs-app-config";
import { DocsHeroSection } from "./docs-hero-section";
import {
  FieldAndTabsDemoSections,
  FormGridDialogDemoSection,
  ThemeAndButtonDemoSections,
} from "./foundation-demo-sections";
import { OverlayDemoSections } from "./overlay-demo-sections";
import {
  DynamicPageDemoSection,
  ObjectPageDemoSection,
  SplitLayoutDemoSection,
} from "./shell-page-sections";
import { useDocsWorklistController } from "./use-docs-worklist-controller";
import { WorklistFilterManagementSection } from "./worklist-advanced/worklist-page-sections";
import { WorklistResultsSection } from "./worklist-advanced/worklist-results-section";
import {
  ManageLocalViewsDialog,
  RenameLocalViewDialog,
  SaveWorklistViewDialog,
  WorkspaceDraftDialog,
  WorklistVariantSyncReviewDialog,
  WorklistVariantTransferDialog,
} from "./worklist-advanced/worklist-variant-dialogs";

export function App() {
  const [theme, setTheme] = useState<AxiomThemeName>("horizon");
  const [density, setDensity] = useState<AxiomDensity>("cozy");
  const [direction, setDirection] = useState<AxiomDirection>("ltr");
  const [locale, setLocale] = useState<LocaleCode>("en-US");
  const themeLabel = themeLabelByValue[theme];
  const localeLabel = localeLabelByValue[locale];
  const {
    closeWorkspaceDraftDialog,
    manageLocalViewsDialogProps,
    openWorkspaceDraftDialog,
    renameLocalViewDialogProps,
    saveWorklistViewDialogProps,
    selectedRowCount,
    worklistFilterManagementProps,
    worklistResultsProps,
    worklistVariantSyncReviewDialogProps,
    worklistVariantTransferDialogProps,
    workspaceDraftDialogProps,
  } = useDocsWorklistController({
    densityLabel: density,
    locale,
    localeLabel,
    themeLabel,
  });

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

            <FieldAndTabsDemoSections
              locale={locale}
              selectedRowCount={selectedRowCount}
            />

            <WorklistFilterManagementSection {...worklistFilterManagementProps} />

            <WorklistResultsSection {...worklistResultsProps} />

            <FormGridDialogDemoSection onOpenDialog={openWorkspaceDraftDialog} />

            <DynamicPageDemoSection />

            <ObjectPageDemoSection />

            <SplitLayoutDemoSection locale={locale} />
          </div>
        </AppShell>

        <SaveWorklistViewDialog {...saveWorklistViewDialogProps} />

        <ManageLocalViewsDialog {...manageLocalViewsDialogProps} />

        <WorklistVariantSyncReviewDialog
          {...worklistVariantSyncReviewDialogProps}
        />

        <RenameLocalViewDialog {...renameLocalViewDialogProps} />

        <WorklistVariantTransferDialog {...worklistVariantTransferDialogProps} />

        <WorkspaceDraftDialog
          {...workspaceDraftDialogProps}
          onClose={closeWorkspaceDraftDialog}
        />
      </ThemeProvider>
    </LocaleProvider>
  );
}
