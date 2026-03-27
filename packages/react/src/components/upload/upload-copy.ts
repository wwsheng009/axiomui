import type { UploadFileAction, UploadFileStatus } from "./upload-types";

export interface UploadCopy {
  acceptedTypes: string;
  browseFiles: string;
  canceled: string;
  disabledHint: string;
  dropzoneActive: string;
  dropzoneHint: string;
  dropzoneLabel: string;
  error: string;
  fileInQueue: string;
  filesInQueue: string;
  noFilesInQueue: string;
  progress: string;
  queued: string;
  readOnlyHint: string;
  removeFile: string;
  retryFile: string;
  sizeUnavailable: string;
  success: string;
  uploading: string;
}

function isChineseLocale(locale: string) {
  return locale.toLowerCase().startsWith("zh");
}

export function getUploadCopy(locale: string): UploadCopy {
  if (isChineseLocale(locale)) {
    return {
      acceptedTypes: "支持类型",
      browseFiles: "选择文件",
      canceled: "已取消",
      disabledHint: "上传区域已禁用",
      dropzoneActive: "松开以添加文件",
      dropzoneHint: "将文件拖到此区域。完整上传队列由 FileUploader 负责。",
      dropzoneLabel: "将文件拖到此处",
      error: "上传失败",
      fileInQueue: "个文件",
      filesInQueue: "个文件",
      noFilesInQueue: "当前没有待处理文件",
      progress: "进度",
      queued: "等待上传",
      readOnlyHint: "上传区域为只读",
      removeFile: "移除",
      retryFile: "重试",
      sizeUnavailable: "大小未知",
      success: "已上传",
      uploading: "上传中",
    };
  }

  return {
    acceptedTypes: "Accepted types",
    browseFiles: "Browse files",
    canceled: "Canceled",
    disabledHint: "Upload area is disabled",
    dropzoneActive: "Release to add files",
    dropzoneHint:
      "Drag files into this area. The complete upload queue is managed by FileUploader.",
    dropzoneLabel: "Drag files here",
    error: "Upload failed",
    fileInQueue: "file in queue",
    filesInQueue: "files in queue",
    noFilesInQueue: "No files in queue",
    progress: "Progress",
    queued: "Queued",
    readOnlyHint: "Upload area is read-only",
    removeFile: "Remove",
    retryFile: "Retry",
    sizeUnavailable: "Size unavailable",
    success: "Uploaded",
    uploading: "Uploading",
  };
}

export function getUploadDropzoneHint(
  locale: string,
  state: "idle" | "active" | "disabled" | "readOnly",
) {
  const copy = getUploadCopy(locale);

  if (state === "active") {
    return copy.dropzoneActive;
  }

  if (state === "disabled") {
    return copy.disabledHint;
  }

  if (state === "readOnly") {
    return copy.readOnlyHint;
  }

  return copy.dropzoneHint;
}

export function getUploadStatusText(
  status: UploadFileStatus,
  locale: string,
  progress?: number,
) {
  const copy = getUploadCopy(locale);

  if (status === "uploading" && progress !== undefined) {
    return isChineseLocale(locale)
      ? `${copy.uploading} (${progress}%)`
      : `${copy.uploading} (${progress}%)`;
  }

  if (status === "success") {
    return copy.success;
  }

  if (status === "error") {
    return copy.error;
  }

  if (status === "canceled") {
    return copy.canceled;
  }

  if (status === "uploading") {
    return copy.uploading;
  }

  return copy.queued;
}

export function getUploadActionLabel(
  action: UploadFileAction,
  fileLabel: string,
  locale: string,
) {
  const copy = getUploadCopy(locale);
  const actionLabel = action === "retry" ? copy.retryFile : copy.removeFile;

  return isChineseLocale(locale)
    ? `${actionLabel} ${fileLabel}`
    : `${actionLabel} ${fileLabel}`;
}

export function getUploadQueueSummary(
  fileCount: number,
  locale: string,
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string,
) {
  const copy = getUploadCopy(locale);

  if (fileCount <= 0) {
    return copy.noFilesInQueue;
  }

  const formattedCount = formatNumber(fileCount);

  if (isChineseLocale(locale)) {
    return `${formattedCount}${copy.filesInQueue}`;
  }

  return fileCount === 1
    ? `${formattedCount} ${copy.fileInQueue}`
    : `${formattedCount} ${copy.filesInQueue}`;
}
