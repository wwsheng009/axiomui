import { useState } from "react";

import { type SavedVariant } from "@axiomui/react";

import {
  type WorklistGroupKey,
  type WorklistVariantKey,
  type WorklistVariantPreset,
} from "./demo-data";
import {
  createSavedVariantsExportPayload,
  parseSavedVariantsImportPayload,
} from "./worklist-advanced/worklist-persistence";
import {
  renameSavedWorklistVariants,
  resolveImportedSavedVariants,
} from "./worklist-advanced/worklist-variant-dialog-state";

interface VariantFormState {
  key?: string;
  label: string;
  description: string;
}

interface VariantTransferState {
  mode: "export" | "import";
  value: string;
  error?: string;
}

interface UseDocsSavedViewFormControllerOptions {
  activeGroupBy: WorklistGroupKey | undefined;
  activeSavedVariant: SavedVariant<WorklistVariantPreset> | undefined;
  activeVariantLabel: string;
  currentVariantPreset: WorklistVariantPreset;
  onPendingVariantSelection: (variantKey: string) => void;
  onReturnToManageVariants: () => void;
  onSuspendManageVariants: () => void;
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
}

export function useDocsSavedViewFormController({
  activeGroupBy,
  activeSavedVariant,
  activeVariantLabel,
  currentVariantPreset,
  onPendingVariantSelection,
  onReturnToManageVariants,
  onSuspendManageVariants,
  replaceSavedWorklistVariants,
  saveWorklistVariant,
  savedWorklistVariants,
  setStartupVariantKey,
  startupVariantKey,
  startupVariantLabel,
}: UseDocsSavedViewFormControllerOptions) {
  const [saveVariantDialogOpen, setSaveVariantDialogOpen] = useState(false);
  const [renameVariantFormState, setRenameVariantFormState] =
    useState<VariantFormState | null>(null);
  const [variantTransferState, setVariantTransferState] =
    useState<VariantTransferState | null>(null);
  const [variantFormState, setVariantFormState] = useState<VariantFormState>({
    label: "",
    description: "",
  });
  const canSaveVariant = Boolean(variantFormState.label.trim());
  const canRenameVariant = Boolean(renameVariantFormState?.label.trim());
  const canImportSavedVariants = Boolean(variantTransferState?.value.trim());

  function updateVariantForm<Key extends keyof VariantFormState>(
    key: Key,
    value: VariantFormState[Key],
  ) {
    setVariantFormState((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  }

  function openSaveVariantDialog() {
    setVariantFormState({
      key: activeSavedVariant?.key,
      label: activeSavedVariant?.label ?? `${activeVariantLabel} copy`,
      description: activeSavedVariant?.description ?? "",
    });
    setSaveVariantDialogOpen(true);
  }

  function closeSaveVariantDialog() {
    setSaveVariantDialogOpen(false);
    setVariantFormState({
      label: "",
      description: "",
    });
  }

  function saveCurrentVariant(mode: "create" | "update") {
    const nextVariantKey = saveWorklistVariant({
      key: mode === "update" ? variantFormState.key : undefined,
      label: variantFormState.label,
      description: variantFormState.description,
      preset: currentVariantPreset,
    });

    closeSaveVariantDialog();
    onPendingVariantSelection(nextVariantKey);
  }

  function updateRenameVariantForm<Key extends keyof VariantFormState>(
    key: Key,
    value: VariantFormState[Key],
  ) {
    setRenameVariantFormState((currentState) =>
      currentState
        ? {
            ...currentState,
            [key]: value,
          }
        : currentState,
    );
  }

  function openRenameVariantDialog(variant: SavedVariant<WorklistVariantPreset>) {
    onSuspendManageVariants();
    setRenameVariantFormState({
      key: variant.key,
      label: variant.label,
      description: variant.description ?? "",
    });
  }

  function closeRenameVariantDialog() {
    setRenameVariantFormState(null);
    onReturnToManageVariants();
  }

  function saveRenamedVariant() {
    if (!renameVariantFormState?.key) {
      return;
    }

    replaceSavedWorklistVariants(
      renameSavedWorklistVariants(savedWorklistVariants, {
        description: renameVariantFormState.description,
        key: renameVariantFormState.key,
        label: renameVariantFormState.label,
        updatedAt: new Date().toISOString(),
      }),
    );
    closeRenameVariantDialog();
  }

  function closeVariantTransferDialog() {
    setVariantTransferState(null);
    onReturnToManageVariants();
  }

  function openExportVariantsDialog() {
    onSuspendManageVariants();
    setVariantTransferState({
      mode: "export",
      value: createSavedVariantsExportPayload(startupVariantKey, savedWorklistVariants),
    });
  }

  function openImportVariantsDialog() {
    onSuspendManageVariants();
    setVariantTransferState({
      mode: "import",
      value: "",
    });
  }

  function updateVariantTransferValue(value: string) {
    setVariantTransferState((currentState) =>
      currentState
        ? {
            ...currentState,
            error: undefined,
            value,
          }
        : currentState,
    );
  }

  function importSavedVariants() {
    if (!variantTransferState || variantTransferState.mode !== "import") {
      return;
    }

    const parsedPayload = parseSavedVariantsImportPayload(variantTransferState.value);

    if ("error" in parsedPayload) {
      setVariantTransferState((currentState) =>
        currentState
          ? {
              ...currentState,
              error: parsedPayload.error,
            }
          : currentState,
      );
      return;
    }

    const { mergedVariants, nextStartupVariantKey } = resolveImportedSavedVariants({
      currentStartupVariantKey: startupVariantKey,
      importedStartupVariantKey: parsedPayload.startupVariantKey,
      importedVariants: parsedPayload.variants,
      savedVariants: savedWorklistVariants,
    });

    replaceSavedWorklistVariants(mergedVariants);
    setStartupVariantKey(nextStartupVariantKey);

    closeVariantTransferDialog();
  }

  return {
    openSaveVariantDialog,
    openRenameVariantDialog,
    openExportVariantsDialog,
    openImportVariantsDialog,
    saveWorklistViewDialogProps: {
      activeGroupBy,
      activeSavedVariant,
      canSaveVariant,
      currentVariantPreset,
      open: saveVariantDialogOpen,
      value: variantFormState,
      onClose: closeSaveVariantDialog,
      onDescriptionChange: (value: string) => updateVariantForm("description", value),
      onLabelChange: (value: string) => updateVariantForm("label", value),
      onSaveCreate: () => saveCurrentVariant("create"),
      onSaveUpdate: () => saveCurrentVariant("update"),
    },
    renameLocalViewDialogProps: {
      canRenameVariant,
      open: renameVariantFormState !== null,
      value: renameVariantFormState,
      onClose: closeRenameVariantDialog,
      onDescriptionChange: (value: string) =>
        updateRenameVariantForm("description", value),
      onLabelChange: (value: string) => updateRenameVariantForm("label", value),
      onSave: saveRenamedVariant,
    },
    worklistVariantTransferDialogProps: {
      canImportSavedVariants,
      open: variantTransferState !== null,
      savedVariantsCount: savedWorklistVariants.length,
      startupVariantLabel,
      value: variantTransferState,
      onClose: closeVariantTransferDialog,
      onImport: importSavedVariants,
      onValueChange: updateVariantTransferValue,
    },
  };
}
