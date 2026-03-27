import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LocaleProvider } from "../../providers/locale-provider";
import { UploadDropzone } from "./upload-dropzone";

describe("UploadDropzone", () => {
  it("renders locale-aware copy, toggles drag state, and emits dropped files", () => {
    const onFilesDrop = vi.fn();
    const onDragActiveChange = vi.fn();

    render(
      <LocaleProvider locale="zh-CN">
        <UploadDropzone
          acceptedFileTypes={["CSV", "XLSX"]}
          onDragActiveChange={onDragActiveChange}
          onFilesDrop={onFilesDrop}
        />
      </LocaleProvider>,
    );

    const dropzone = screen.getByRole("group");

    expect(screen.getByText("将文件拖到此处")).toBeInTheDocument();
    expect(screen.getByText(/支持类型: CSV, XLSX/i)).toBeInTheDocument();

    fireEvent.dragEnter(dropzone, {
      dataTransfer: { types: ["Files"] },
    });

    expect(dropzone).toHaveAttribute("data-drag-active", "true");
    expect(screen.getByText("松开以添加文件")).toBeInTheDocument();
    expect(onDragActiveChange).toHaveBeenCalledWith(true);

    const file = new File(["amount"], "budget.csv", { type: "text/csv" });

    fireEvent.drop(dropzone, {
      dataTransfer: {
        dropEffect: "move",
        files: [file],
        types: ["Files"],
      },
    });

    expect(onFilesDrop).toHaveBeenCalledTimes(1);
    expect(onFilesDrop.mock.calls[0][0].operation).toBe("move");
    expect(onFilesDrop.mock.calls[0][0].files).toHaveLength(1);
    expect(onFilesDrop.mock.calls[0][0].files[0].name).toBe("budget.csv");
    expect(dropzone).not.toHaveAttribute("data-drag-active");
    expect(onDragActiveChange).toHaveBeenLastCalledWith(false);
  });

  it("ignores drop interactions when disabled", () => {
    const onFilesDrop = vi.fn();

    render(<UploadDropzone disabled onFilesDrop={onFilesDrop} />);

    const dropzone = screen.getByRole("group");
    const file = new File(["hello"], "notes.txt", { type: "text/plain" });

    fireEvent.dragEnter(dropzone, {
      dataTransfer: { types: ["Files"] },
    });
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
        types: ["Files"],
      },
    });

    expect(dropzone).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByText("Upload area is disabled")).toBeInTheDocument();
    expect(onFilesDrop).not.toHaveBeenCalled();
  });
});
