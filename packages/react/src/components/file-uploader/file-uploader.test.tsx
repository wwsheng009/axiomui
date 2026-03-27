import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LocaleProvider } from "../../providers/locale-provider";
import { FileUploader } from "./file-uploader";

describe("FileUploader", () => {
  it("adds files from the browse input and updates the queue", async () => {
    const user = userEvent.setup();
    const handleFilesAdd = vi.fn();
    const handleItemsChange = vi.fn();
    const { container } = render(
      <FileUploader
        acceptedFileTypes={["CSV", "XLSX"]}
        label="Attachments"
        onFilesAdd={handleFilesAdd}
        onItemsChange={handleItemsChange}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("No files in queue");
    await user.click(screen.getByRole("button", { name: /browse files/i }));

    const nativeInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement | null;

    expect(nativeInput).not.toBeNull();

    const budgetFile = new File(["budget"], "budget.csv", { type: "text/csv" });
    const outlookFile = new File(["outlook"], "outlook.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    fireEvent.change(nativeInput!, {
      target: { files: [budgetFile, outlookFile] },
    });

    expect(screen.getByText("budget.csv")).toBeInTheDocument();
    expect(screen.getByText("outlook.xlsx")).toBeInTheDocument();
    expect(screen.getByText("2 files in queue")).toBeInTheDocument();
    expect(handleFilesAdd).toHaveBeenCalledTimes(1);
    expect(handleItemsChange).toHaveBeenCalledTimes(1);
  });

  it("accepts dropped files and supports retry plus remove flows", async () => {
    const user = userEvent.setup();
    const handleItemRemove = vi.fn();
    const handleItemRetry = vi.fn();

    render(
      <FileUploader
        defaultItems={[
          {
            id: "failed-budget",
            message: "Virus scan failed.",
            name: "budget.csv",
            size: 1536,
            status: "error",
          },
        ]}
        label="Attachments"
        onItemRemove={handleItemRemove}
        onItemRetry={handleItemRetry}
      />,
    );

    const dropzone = screen
      .getByText("Drag files here")
      .closest(".ax-upload-dropzone") as HTMLDivElement | null;
    const droppedFile = new File(["forecast"], "forecast.csv", { type: "text/csv" });

    expect(dropzone).not.toBeNull();

    fireEvent.drop(dropzone!, {
      dataTransfer: {
        dropEffect: "copy",
        files: [droppedFile],
        types: ["Files"],
      },
    });

    expect(screen.getByText("forecast.csv")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /retry/i }));
    expect(handleItemRetry).toHaveBeenCalledTimes(1);
    expect(screen.getAllByText("Queued")).toHaveLength(2);
    expect(screen.queryByText("Virus scan failed.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /remove budget.csv/i }));
    expect(handleItemRemove).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("budget.csv")).not.toBeInTheDocument();
  });

  it("links error help text to the browse button and localizes queue summary", () => {
    render(
      <LocaleProvider locale="zh-CN">
        <FileUploader
          defaultItems={[
            {
              id: "report",
              name: "report.csv",
              size: 2048,
              status: "queued",
            },
          ]}
          description="支持拖拽与选择文件。"
          label="附件"
          message="请先移除失败文件。"
          valueState="error"
        />
      </LocaleProvider>,
    );

    const browseButton = screen.getByRole("button", { name: "选择文件" });
    const description = screen.getByText("支持拖拽与选择文件。");
    const message = screen.getByText("请先移除失败文件。");

    expect(screen.getByText("1个文件")).toBeInTheDocument();
    expect(browseButton).toHaveAttribute(
      "aria-describedby",
      `${description.getAttribute("id")} ${message.getAttribute("id")}`,
    );
    expect(browseButton).toHaveAttribute("aria-invalid", "true");
  });
});
