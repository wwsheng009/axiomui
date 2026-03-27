import { describe, expect, it } from "vitest";

import {
  canRemoveUploadFile,
  canRetryUploadFile,
  getUploadFileTone,
  isUploadFileStatus,
  isUploadTerminalStatus,
  normalizeUploadDropOperation,
  normalizeUploadProgress,
  uploadFileStatuses,
} from "./upload-state";

describe("upload-state", () => {
  it("exposes the supported upload statuses", () => {
    expect(uploadFileStatuses).toEqual([
      "queued",
      "uploading",
      "success",
      "error",
      "canceled",
    ]);
  });

  it("validates upload status values and tone mapping", () => {
    expect(isUploadFileStatus("uploading")).toBe(true);
    expect(isUploadFileStatus("archived")).toBe(false);
    expect(getUploadFileTone("success")).toBe("success");
    expect(getUploadFileTone("error")).toBe("error");
    expect(getUploadFileTone("canceled")).toBe("neutral");
  });

  it("recognizes terminal states and action availability", () => {
    expect(isUploadTerminalStatus("success")).toBe(true);
    expect(isUploadTerminalStatus("queued")).toBe(false);
    expect(canRetryUploadFile({ id: "a", name: "a.txt", status: "error" })).toBe(
      true,
    );
    expect(
      canRetryUploadFile({
        id: "b",
        name: "b.txt",
        status: "canceled",
        disabledActions: ["retry"],
      }),
    ).toBe(false);
    expect(
      canRemoveUploadFile({
        id: "c",
        name: "c.txt",
        status: "uploading",
        disabledActions: ["remove"],
      }),
    ).toBe(false);
  });

  it("normalizes progress values and drop operations", () => {
    expect(normalizeUploadProgress(undefined)).toBeUndefined();
    expect(normalizeUploadProgress(-12)).toBe(0);
    expect(normalizeUploadProgress(42.4)).toBe(42);
    expect(normalizeUploadProgress(142)).toBe(100);
    expect(normalizeUploadDropOperation("copyMove")).toBe("move");
    expect(normalizeUploadDropOperation("link")).toBe("link");
    expect(normalizeUploadDropOperation()).toBe("copy");
  });
});
