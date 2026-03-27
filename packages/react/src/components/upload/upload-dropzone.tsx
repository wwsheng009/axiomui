import {
  forwardRef,
  useState,
  type DragEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { cx } from "../../lib/cx";
import { useLocale } from "../../providers/locale-provider";
import { Icon } from "../icon/icon";
import { getUploadCopy, getUploadDropzoneHint } from "./upload-copy";
import { normalizeUploadDropOperation } from "./upload-state";
import type { UploadDropPayload } from "./upload-types";

export interface UploadDropzoneProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onDrop"> {
  acceptedFileTypes?: string[];
  allowMultiple?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  hint?: ReactNode;
  icon?: ReactNode;
  label?: ReactNode;
  onDragActiveChange?: (active: boolean) => void;
  onFilesDrop?: (
    payload: UploadDropPayload,
    event: DragEvent<HTMLDivElement>,
  ) => void;
  readOnly?: boolean;
}

function hasDraggedFiles(event: DragEvent<HTMLDivElement>) {
  return Array.from(event.dataTransfer?.types ?? []).includes("Files");
}

export const UploadDropzone = forwardRef<HTMLDivElement, UploadDropzoneProps>(
  function UploadDropzone(
    {
      acceptedFileTypes,
      allowMultiple = true,
      className,
      description,
      disabled,
      hint,
      icon,
      label,
      onDragEnter,
      onDragActiveChange,
      onDragLeave,
      onDragOver,
      onFilesDrop,
      readOnly,
      role = "group",
      ...props
    },
    ref,
  ) {
    const { locale } = useLocale();
    const copy = getUploadCopy(locale);
    const [dragActive, setDragActive] = useState(false);

    const resolvedLabel = label ?? copy.dropzoneLabel;
    const resolvedHint =
      hint ??
      getUploadDropzoneHint(
        locale,
        disabled ? "disabled" : readOnly ? "readOnly" : dragActive ? "active" : "idle",
      );
    const resolvedIcon = icon ?? <Icon name="plus" size="1.25rem" />;

    function setDragState(nextValue: boolean) {
      setDragActive(nextValue);
      onDragActiveChange?.(nextValue);
    }

    function resetDragState() {
      if (dragActive) {
        setDragState(false);
      }
    }

    function handleDragEnter(event: DragEvent<HTMLDivElement>) {
      onDragEnter?.(event);

      if (event.defaultPrevented || disabled || readOnly || !hasDraggedFiles(event)) {
        return;
      }

      event.preventDefault();
      setDragState(true);
    }

    function handleDragLeave(event: DragEvent<HTMLDivElement>) {
      onDragLeave?.(event);

      if (event.defaultPrevented || !dragActive) {
        return;
      }

      if (
        event.relatedTarget instanceof Node &&
        event.currentTarget.contains(event.relatedTarget)
      ) {
        return;
      }

      resetDragState();
    }

    function handleDragOver(event: DragEvent<HTMLDivElement>) {
      onDragOver?.(event);

      if (event.defaultPrevented || disabled || readOnly || !hasDraggedFiles(event)) {
        return;
      }

      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";

      if (!dragActive) {
        setDragState(true);
      }
    }

    function handleDrop(event: DragEvent<HTMLDivElement>) {
      resetDragState();

      if (event.defaultPrevented || disabled || readOnly || !hasDraggedFiles(event)) {
        return;
      }

      event.preventDefault();

      const droppedFiles = Array.from(event.dataTransfer.files ?? []);

      if (!droppedFiles.length) {
        return;
      }

      onFilesDrop?.(
        {
          files: allowMultiple ? droppedFiles : droppedFiles.slice(0, 1),
          operation: normalizeUploadDropOperation(
            event.dataTransfer.dropEffect || event.dataTransfer.effectAllowed,
          ),
        },
        event,
      );
    }

    return (
      <div
        ref={ref}
        className={cx("ax-upload-dropzone", className)}
        data-disabled={disabled}
        data-drag-active={dragActive || undefined}
        data-readonly={readOnly}
        aria-disabled={disabled || readOnly ? true : undefined}
        role={role}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        {...props}
      >
        <div className="ax-upload-dropzone__icon" aria-hidden="true">
          {resolvedIcon}
        </div>
        <div className="ax-upload-dropzone__body">
          <strong className="ax-upload-dropzone__label">{resolvedLabel}</strong>
          <span className="ax-upload-dropzone__hint">{resolvedHint}</span>
          {description ? (
            <span className="ax-upload-dropzone__description">{description}</span>
          ) : null}
          {acceptedFileTypes?.length ? (
            <span className="ax-upload-dropzone__meta">
              {copy.acceptedTypes}: {acceptedFileTypes.join(", ")}
            </span>
          ) : null}
        </div>
      </div>
    );
  },
);
