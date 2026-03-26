import { useEffect } from "react";

import {
  type SavedVariant,
  type VariantSyncReviewSection,
  type VariantSyncReviewState,
  type VariantSyncReviewWorkspaceCard,
  type VariantSyncSnapshot,
} from "@axiomui/react";

import {
  type WorklistVariantKey,
  type WorklistVariantPreset,
} from "./demo-data";

interface ReviewDialogProps {
  localSnapshot: VariantSyncSnapshot<
    WorklistVariantPreset,
    WorklistVariantKey
  >;
  onApplyMerge: () => boolean;
  onClose: () => void;
  onOverwriteRemote: () => Promise<boolean>;
  onReplaceLocal: () => boolean;
  reviewSections: VariantSyncReviewSection[];
  reviewState: VariantSyncReviewState<
    WorklistVariantPreset,
    WorklistVariantKey
  > | null;
  startupVariantLabel: string;
  workspaceCards: VariantSyncReviewWorkspaceCard[];
}

interface UseDocsVariantReviewDialogControllerOptions {
  onCloseManageVariants: () => void;
  onOpenManageVariants: () => void;
  reviewDialogProps: ReviewDialogProps;
  savedVariants: Array<SavedVariant<WorklistVariantPreset>>;
  startupVariantLabel: string;
}

export function useDocsVariantReviewDialogController({
  onCloseManageVariants,
  onOpenManageVariants,
  reviewDialogProps,
  savedVariants,
  startupVariantLabel,
}: UseDocsVariantReviewDialogControllerOptions) {
  useEffect(() => {
    if (reviewDialogProps.reviewState) {
      onCloseManageVariants();
    }
  }, [reviewDialogProps.reviewState]);

  function closeVariantSyncReviewDialog() {
    reviewDialogProps.onClose();
    onOpenManageVariants();
  }

  function applyReviewedVariantMerge() {
    if (reviewDialogProps.onApplyMerge()) {
      onOpenManageVariants();
    }
  }

  async function overwriteRemoteAfterSyncReview() {
    if (await reviewDialogProps.onOverwriteRemote()) {
      onOpenManageVariants();
    }
  }

  function replaceLocalAfterSyncReview() {
    if (reviewDialogProps.onReplaceLocal()) {
      onOpenManageVariants();
    }
  }

  return {
    reviewState: reviewDialogProps.reviewState,
    worklistVariantSyncReviewDialogProps: {
      localSnapshot: reviewDialogProps.localSnapshot,
      reviewSections: reviewDialogProps.reviewSections,
      reviewState: reviewDialogProps.reviewState,
      savedVariants,
      startupVariantLabel,
      workspaceCards: reviewDialogProps.workspaceCards,
      onApplyMerge: applyReviewedVariantMerge,
      onClose: closeVariantSyncReviewDialog,
      onOverwriteRemote: () => {
        void overwriteRemoteAfterSyncReview();
      },
      onReplaceLocal: replaceLocalAfterSyncReview,
    },
  };
}
