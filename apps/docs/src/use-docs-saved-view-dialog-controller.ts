import { useEffect, useState } from "react";

import { type SavedVariant } from "@axiomui/react";

import {
  type WorklistGroupKey,
  type WorklistVariantKey,
  type WorklistVariantPreset,
} from "./demo-data";
import {
  moveSavedWorklistVariants,
  resolveDeletedVariantFallbacks,
} from "./worklist-advanced/worklist-variant-dialog-state";
import { useDocsSavedViewFormController } from "./use-docs-saved-view-form-controller";

interface UseDocsSavedViewDialogControllerOptions {
  activeGroupBy: WorklistGroupKey | undefined;
  activeSavedVariant: SavedVariant<WorklistVariantPreset> | undefined;
  activeVariant: WorklistVariantKey;
  activeVariantLabel: string;
  applyVariantSelection: (variantKey: WorklistVariantKey) => void;
  currentVariantPreset: WorklistVariantPreset;
  removeSavedWorklistVariant: (key: string) => void;
  replaceSavedWorklistVariants: (
    variants: Array<SavedVariant<WorklistVariantPreset>>,
  ) => void;
  saveWorklistVariant: (variant: {
    description?: string;
    key?: string;
    label: string;
    preset: WorklistVariantPreset;
  }) => string;
  savedWorklistVariants: Array<SavedVariant<WorklistVariantPreset>>;
  setStartupVariantKey: (variantKey: WorklistVariantKey) => void;
  startupVariantKey: WorklistVariantKey;
  startupVariantLabel: string;
  worklistVariants: Record<WorklistVariantKey, WorklistVariantPreset>;
}

export function useDocsSavedViewDialogController({
  activeGroupBy,
  activeSavedVariant,
  activeVariant,
  activeVariantLabel,
  applyVariantSelection,
  currentVariantPreset,
  removeSavedWorklistVariant,
  replaceSavedWorklistVariants,
  saveWorklistVariant,
  savedWorklistVariants,
  setStartupVariantKey,
  startupVariantKey,
  startupVariantLabel,
  worklistVariants,
}: UseDocsSavedViewDialogControllerOptions) {
  const [manageVariantsDialogOpen, setManageVariantsDialogOpen] = useState(false);
  const [pendingVariantSelection, setPendingVariantSelection] = useState<
    string | undefined
  >(undefined);
  const formController = useDocsSavedViewFormController({
    activeGroupBy,
    activeSavedVariant,
    activeVariantLabel,
    currentVariantPreset,
    onPendingVariantSelection: setPendingVariantSelection,
    onReturnToManageVariants: () => setManageVariantsDialogOpen(true),
    onSuspendManageVariants: () => setManageVariantsDialogOpen(false),
    replaceSavedWorklistVariants,
    saveWorklistVariant,
    savedWorklistVariants,
    setStartupVariantKey,
    startupVariantKey,
    startupVariantLabel,
  });

  useEffect(() => {
    if (pendingVariantSelection && pendingVariantSelection in worklistVariants) {
      applyVariantSelection(pendingVariantSelection as WorklistVariantKey);
      setPendingVariantSelection(undefined);
    }
  }, [applyVariantSelection, pendingVariantSelection, worklistVariants]);

  function duplicateSavedVariant(variant: SavedVariant<WorklistVariantPreset>) {
    const nextVariantKey = saveWorklistVariant({
      label: `${variant.label} copy`,
      description: variant.description,
      preset: variant.preset,
    });

    setPendingVariantSelection(nextVariantKey);
  }

  function moveSavedVariant(variantKey: string, direction: -1 | 1) {
    const nextVariants = moveSavedWorklistVariants(
      savedWorklistVariants,
      variantKey,
      direction,
    );

    if (nextVariants === savedWorklistVariants) {
      return;
    }

    replaceSavedWorklistVariants(nextVariants);
  }

  function deleteSavedVariant(variantKey: string) {
    const {
      nextActiveVariantKey,
      nextStartupVariantKey,
    } = resolveDeletedVariantFallbacks(
      variantKey,
      activeVariant,
      startupVariantKey,
    );

    removeSavedWorklistVariant(variantKey);

    if (nextActiveVariantKey) {
      applyVariantSelection(nextActiveVariantKey);
    }

    if (nextStartupVariantKey) {
      setStartupVariantKey(nextStartupVariantKey);
    }
  }

  return {
    openManageVariants: () => setManageVariantsDialogOpen(true),
    closeManageVariants: () => setManageVariantsDialogOpen(false),
    openSaveVariantDialog: formController.openSaveVariantDialog,
    saveWorklistViewDialogProps: formController.saveWorklistViewDialogProps,
    manageSavedViewDialogProps: {
      open: manageVariantsDialogOpen,
      onClose: () => setManageVariantsDialogOpen(false),
      onDeleteVariant: deleteSavedVariant,
      onDuplicateVariant: duplicateSavedVariant,
      onMoveVariant: moveSavedVariant,
      onOpenExport: formController.openExportVariantsDialog,
      onOpenImport: formController.openImportVariantsDialog,
      onRenameVariant: formController.openRenameVariantDialog,
      onSetStartupVariant: setStartupVariantKey,
    },
    renameLocalViewDialogProps: formController.renameLocalViewDialogProps,
    worklistVariantTransferDialogProps:
      formController.worklistVariantTransferDialogProps,
  };
}
