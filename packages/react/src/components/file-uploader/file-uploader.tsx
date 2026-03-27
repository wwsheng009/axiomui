import {
  forwardRef,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { cx } from "../../lib/cx";
import { useLocale } from "../../providers/locale-provider";
import { Button } from "../button/button";
import type { ValueState } from "../input/input";
import {
  getUploadCopy,
  getUploadQueueSummary,
} from "../upload/upload-copy";
import { UploadDropzone } from "../upload/upload-dropzone";
import { UploadFileItemView } from "../upload/upload-file-item";
import type { UploadFileItem } from "../upload/upload-types";

export type FileUploaderSource = "browse" | "drop";

export interface FileUploaderProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "defaultValue" | "onChange"
  > {
  accept?: string;
  acceptedFileTypes?: string[];
  allowMultiple?: boolean;
  browseLabel?: ReactNode;
  createItemFromFile?: (
    file: File,
    options: { index: number; source: FileUploaderSource },
  ) => UploadFileItem;
  defaultItems?: UploadFileItem[];
  description?: string;
  disabled?: boolean;
  dropzoneDescription?: ReactNode;
  dropzoneHint?: ReactNode;
  dropzoneLabel?: ReactNode;
  emptyState?: ReactNode;
  items?: UploadFileItem[];
  label?: string;
  message?: string;
  name?: string;
  onFilesAdd?: (
    items: UploadFileItem[],
    files: File[],
    source: FileUploaderSource,
  ) => void;
  onItemRemove?: (item: UploadFileItem, nextItems: UploadFileItem[]) => void;
  onItemsChange?: (items: UploadFileItem[]) => void;
  onItemRetry?: (item: UploadFileItem, nextItems: UploadFileItem[]) => void;
  readOnly?: boolean;
  valueState?: ValueState;
}

function buildUploadItemId(file: File, index: number, source: FileUploaderSource) {
  return `${source}-${file.name}-${file.lastModified}-${file.size}-${index}`;
}

function createDefaultUploadItem(
  file: File,
  index: number,
  source: FileUploaderSource,
): UploadFileItem {
  return {
    id: buildUploadItemId(file, index, source),
    mediaType: file.type || undefined,
    name: file.name,
    progress: 0,
    size: file.size,
    status: "queued",
  };
}

export const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(
  function FileUploader(
    {
      accept,
      acceptedFileTypes,
      allowMultiple = true,
      browseLabel,
      className,
      createItemFromFile,
      defaultItems = [],
      description,
      disabled,
      dropzoneDescription,
      dropzoneHint,
      dropzoneLabel,
      emptyState,
      id,
      items,
      label,
      message,
      name,
      onFilesAdd,
      onItemRemove,
      onItemsChange,
      onItemRetry,
      readOnly,
      valueState = "none",
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const controlId = id ?? generatedId;
    const descriptionId = description ? `${controlId}-description` : undefined;
    const messageId = message ? `${controlId}-message` : undefined;
    const describedBy = [descriptionId, messageId].filter(Boolean).join(" ") || undefined;
    const [internalItems, setInternalItems] = useState(defaultItems);
    const resolvedItems = items ?? internalItems;
    const { formatNumber, locale } = useLocale();
    const copy = useMemo(() => getUploadCopy(locale), [locale]);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const resolvedBrowseLabel = browseLabel ?? copy.browseFiles;

    function assignInput(node: HTMLInputElement | null) {
      inputRef.current = node;

      if (typeof ref === "function") {
        ref(node);
        return;
      }

      if (ref) {
        (ref as { current: HTMLInputElement | null }).current = node;
      }
    }

    function setNextItems(nextItems: UploadFileItem[]) {
      if (items === undefined) {
        setInternalItems(nextItems);
      }

      onItemsChange?.(nextItems);
    }

    function appendFiles(files: File[], source: FileUploaderSource) {
      const resolvedFiles = allowMultiple ? files : files.slice(0, 1);

      if (!resolvedFiles.length) {
        return;
      }

      const nextItemsToAdd = resolvedFiles.map((file, index) =>
        createItemFromFile?.(file, { index, source }) ??
        createDefaultUploadItem(file, index, source),
      );
      const nextItems = allowMultiple
        ? [...resolvedItems, ...nextItemsToAdd]
        : nextItemsToAdd;

      setNextItems(nextItems);
      onFilesAdd?.(nextItemsToAdd, resolvedFiles, source);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }

    function handleBrowseButtonClick() {
      if (disabled || readOnly) {
        return;
      }

      inputRef.current?.click();
    }

    function handleRemoveItem(item: UploadFileItem) {
      const nextItems = resolvedItems.filter((entry) => entry.id !== item.id);

      setNextItems(nextItems);
      onItemRemove?.(item, nextItems);
    }

    function handleRetryItem(item: UploadFileItem) {
      const nextItems = resolvedItems.map((entry) =>
        entry.id === item.id
          ? { ...entry, message: undefined, progress: 0, status: "queued" as const }
          : entry,
      );
      const nextItem = nextItems.find((entry) => entry.id === item.id) ?? item;

      setNextItems(nextItems);
      onItemRetry?.(nextItem, nextItems);
    }

    return (
      <div
        className={cx("ax-file-uploader", className)}
        data-disabled={disabled}
        data-readonly={readOnly}
        data-value-state={valueState}
        {...props}
      >
        {label ? (
          <div className="ax-file-uploader__label-row">
            <label className="ax-file-uploader__label" htmlFor={`${controlId}-native`}>
              {label}
            </label>
            {description ? (
              <span className="ax-file-uploader__description" id={descriptionId}>
                {description}
              </span>
            ) : null}
          </div>
        ) : description ? (
          <span className="ax-file-uploader__description" id={descriptionId}>
            {description}
          </span>
        ) : null}

        <input
          ref={assignInput}
          id={`${controlId}-native`}
          className="ax-file-uploader__native"
          accept={accept}
          aria-hidden="true"
          disabled={disabled || readOnly}
          multiple={allowMultiple}
          name={name}
          tabIndex={-1}
          type="file"
          onChange={(event) => {
            appendFiles(Array.from(event.target.files ?? []), "browse");
          }}
        />

        <div className="ax-file-uploader__toolbar">
          <Button
            aria-describedby={describedBy}
            aria-invalid={valueState === "error" || undefined}
            className="ax-file-uploader__browse"
            disabled={disabled || readOnly}
            iconName="plus"
            onClick={handleBrowseButtonClick}
          >
            {resolvedBrowseLabel}
          </Button>
          <span className="ax-file-uploader__summary" aria-live="polite">
            {getUploadQueueSummary(resolvedItems.length, locale, formatNumber)}
          </span>
        </div>

        <UploadDropzone
          aria-describedby={describedBy}
          acceptedFileTypes={acceptedFileTypes}
          allowMultiple={allowMultiple}
          className="ax-file-uploader__dropzone"
          description={dropzoneDescription}
          disabled={disabled}
          hint={dropzoneHint}
          label={dropzoneLabel}
          onFilesDrop={({ files }) => appendFiles(files, "drop")}
          readOnly={readOnly}
        />

        {resolvedItems.length ? (
          <div className="ax-file-uploader__list" role="list">
            {resolvedItems.map((item) => (
              <div
                key={item.id}
                className="ax-file-uploader__list-item"
                role="listitem"
              >
                <UploadFileItemView
                  item={item}
                  onRemove={
                    readOnly || disabled || !onItemRemove && !onItemsChange && items !== undefined
                      ? undefined
                      : handleRemoveItem
                  }
                  onRetry={readOnly || disabled ? undefined : handleRetryItem}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="ax-file-uploader__empty" role="status">
            {emptyState ?? copy.noFilesInQueue}
          </div>
        )}

        {message ? (
          <span className="ax-file-uploader__support" id={messageId}>
            {message}
          </span>
        ) : null}
      </div>
    );
  },
);
