import type {
  UploadDropOperation,
  UploadFileAction,
  UploadFileItem,
  UploadFileStatus,
} from "./upload-types";

export type UploadFileTone =
  | "information"
  | "success"
  | "warning"
  | "error"
  | "neutral";

export const uploadFileStatuses: UploadFileStatus[] = [
  "queued",
  "uploading",
  "success",
  "error",
  "canceled",
];

function resolveDisabledActions(
  value: UploadFileItem | UploadFileStatus,
  fallback: UploadFileAction[] = [],
) {
  return typeof value === "string" ? fallback : value.disabledActions ?? fallback;
}

function resolveStatus(value: UploadFileItem | UploadFileStatus) {
  return typeof value === "string" ? value : value.status;
}

export function isUploadFileStatus(value: string): value is UploadFileStatus {
  return uploadFileStatuses.includes(value as UploadFileStatus);
}

export function getUploadFileTone(status: UploadFileStatus): UploadFileTone {
  if (status === "success") {
    return "success";
  }

  if (status === "error") {
    return "error";
  }

  if (status === "canceled") {
    return "neutral";
  }

  return "information";
}

export function isUploadTerminalStatus(status: UploadFileStatus) {
  return status === "success" || status === "error" || status === "canceled";
}

export function canRetryUploadFile(
  value: UploadFileItem | UploadFileStatus,
  fallbackDisabledActions: UploadFileAction[] = [],
) {
  const status = resolveStatus(value);
  const disabledActions = resolveDisabledActions(value, fallbackDisabledActions);

  return (
    (status === "error" || status === "canceled") &&
    !disabledActions.includes("retry")
  );
}

export function canRemoveUploadFile(
  value: UploadFileItem | UploadFileStatus,
  fallbackDisabledActions: UploadFileAction[] = [],
) {
  const disabledActions = resolveDisabledActions(value, fallbackDisabledActions);

  return !disabledActions.includes("remove");
}

export function normalizeUploadProgress(progress?: number) {
  if (progress === undefined || !Number.isFinite(progress)) {
    return undefined;
  }

  return Math.min(100, Math.max(0, Math.round(progress)));
}

export function normalizeUploadDropOperation(
  value?: string | null,
): UploadDropOperation {
  const normalizedValue = value?.toLowerCase() ?? "";

  if (normalizedValue.includes("move")) {
    return "move";
  }

  if (normalizedValue.includes("link")) {
    return "link";
  }

  return "copy";
}
