import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LocaleProvider } from "../../providers/locale-provider";
import { UploadFileItemView } from "./upload-file-item";

describe("UploadFileItemView", () => {
  it("renders error state details and invokes retry or remove callbacks", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const onRetry = vi.fn();
    const item = {
      id: "budget",
      message: "Virus scan failed.",
      name: "budget.csv",
      size: 1536,
      status: "error" as const,
    };

    render(
      <UploadFileItemView item={item} onRemove={onRemove} onRetry={onRetry} />,
    );

    expect(screen.getByText("budget.csv")).toBeInTheDocument();
    expect(screen.getByText("Upload failed")).toBeInTheDocument();
    expect(screen.getByText("Virus scan failed.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /retry/i }));
    await user.click(screen.getByRole("button", { name: /remove budget.csv/i }));

    expect(onRetry).toHaveBeenCalledWith(item);
    expect(onRemove).toHaveBeenCalledWith(item);
  });

  it("renders progress and localized action labels", () => {
    render(
      <LocaleProvider locale="zh-CN">
        <UploadFileItemView
          item={{
            id: "forecast",
            mediaType: "CSV",
            name: "forecast.csv",
            progress: 42,
            size: 2048,
            status: "uploading",
          }}
          onRemove={vi.fn()}
        />
      </LocaleProvider>,
    );

    expect(screen.getByText("上传中 (42%)")).toBeInTheDocument();
    expect(screen.getByText(/CSV/)).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "42");
    expect(
      screen.getByRole("button", { name: /移除 forecast.csv/i }),
    ).toBeInTheDocument();
  });
});
