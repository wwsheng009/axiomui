import {
  type AxiomDensity,
} from "@axiomui/react";

import type { LocaleCode } from "./docs-app-config";
import {
  FieldAndTabsDemoSections,
  FormGridDialogDemoSection,
} from "./foundation-demo-sections";
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

interface DocsOperationsSectionSetProps {
  densityLabel: AxiomDensity;
  locale: LocaleCode;
  localeLabel: string;
  themeLabel: string;
}

export default function DocsOperationsSectionSet({
  densityLabel,
  locale,
  localeLabel,
  themeLabel,
}: DocsOperationsSectionSetProps) {
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
    densityLabel,
    locale,
    localeLabel,
    themeLabel,
  });

  return (
    <>
      <FieldAndTabsDemoSections
        locale={locale}
        selectedRowCount={selectedRowCount}
      />

      <WorklistFilterManagementSection {...worklistFilterManagementProps} />

      <WorklistResultsSection {...worklistResultsProps} />

      <FormGridDialogDemoSection onOpenDialog={openWorkspaceDraftDialog} />

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
    </>
  );
}
