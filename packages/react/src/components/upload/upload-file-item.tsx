import { type HTMLAttributes } from "react";

import { cx } from "../../lib/cx";
import { useLocale } from "../../providers/locale-provider";
import { Button } from "../button/button";
import { Icon } from "../icon/icon";
import {
  getUploadActionLabel,
  getUploadCopy,
  getUploadStatusText,
} from "./upload-copy";
import {
  canRemoveUploadFile,
  canRetryUploadFile,
  getUploadFileTone,
  normalizeUploadProgress,
} from "./upload-state";
import type { UploadFileItem } from "./upload-types";

export interface UploadFileItemViewProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  hideActions?: boolean;
  item: UploadFileItem;
  onRemove?: (item: UploadFileItem) => void;
  onRetry?: (item: UploadFileItem) => void;
}

function getStatusIconName(item: UploadFileItem) {
  if (item.status === "success") {
    return "success";
  }

  if (item.status === "error") {
    return "error";
  }

  if (item.status === "canceled") {
    return "close";
  }

  return "information";
}

function formatFileSize(
  size: number | undefined,
  locale: string,
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string,
) {
  const copy = getUploadCopy(locale);

  if (size === undefined || size < 0 || !Number.isFinite(size)) {
    return copy.sizeUnavailable;
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  let value = size;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const minimumFractionDigits = unitIndex === 0 ? 0 : value >= 10 ? 0 : 1;

  return `${formatNumber(value, {
    maximumFractionDigits: 1,
    minimumFractionDigits,
  })} ${units[unitIndex]}`;
}

export function UploadFileItemView({
  className,
  hideActions = false,
  item,
  onRemove,
  onRetry,
  ...props
}: UploadFileItemViewProps) {
  const { formatNumber, locale } = useLocale();
  const progress = normalizeUploadProgress(item.progress);
  const tone = getUploadFileTone(item.status);
  const statusText = getUploadStatusText(item.status, locale, progress);
  const sizeText = formatFileSize(item.size, locale, formatNumber);
  const canRetry = Boolean(onRetry) && canRetryUploadFile(item);
  const canRemove = Boolean(onRemove) && canRemoveUploadFile(item);

  return (
    <div
      className={cx("ax-upload-file-item", className)}
      data-status={item.status}
      data-tone={tone}
      role="group"
      aria-label={item.name}
      {...props}
    >
      <div className="ax-upload-file-item__header">
        <div className="ax-upload-file-item__identity">
          <span className="ax-upload-file-item__status-icon" aria-hidden="true">
            <Icon name={getStatusIconName(item)} size="1rem" />
          </span>
          <div className="ax-upload-file-item__title-block">
            <strong className="ax-upload-file-item__title">{item.name}</strong>
            <span className="ax-upload-file-item__meta">
              {sizeText}
              {item.mediaType ? ` · ${item.mediaType}` : ""}
            </span>
          </div>
        </div>

        {!hideActions && (canRetry || canRemove) ? (
          <div className="ax-upload-file-item__actions">
            {canRetry ? (
              <Button
                variant="transparent"
                onClick={() => onRetry?.(item)}
              >
                {getUploadCopy(locale).retryFile}
              </Button>
            ) : null}
            {canRemove ? (
              <Button
                aria-label={getUploadActionLabel("remove", item.name, locale)}
                iconName="close"
                variant="transparent"
                onClick={() => onRemove?.(item)}
              />
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="ax-upload-file-item__status-row">
        <span className="ax-upload-file-item__status-text">{statusText}</span>
        {progress !== undefined ? (
          <span className="ax-upload-file-item__progress-text">
            {getUploadCopy(locale).progress}: {progress}%
          </span>
        ) : null}
      </div>

      {progress !== undefined ? (
        <div
          className="ax-upload-file-item__progress"
          role="progressbar"
          aria-label={statusText}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span
            className="ax-upload-file-item__progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}

      {item.message ? (
        <div className="ax-upload-file-item__message">{item.message}</div>
      ) : null}
    </div>
  );
}
