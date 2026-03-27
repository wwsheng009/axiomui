import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { LocaleProvider } from "../../providers/locale-provider";
import { MultiComboBox } from "./multi-combo-box";

describe("MultiComboBox", () => {
  it("filters items, selects multiple values, and syncs token removal", async () => {
    const user = userEvent.setup();

    render(
      <MultiComboBox
        label="Owners"
        items={[
          { value: "mia", label: "Mia Chen" },
          { value: "avery", label: "Avery Kim" },
          { value: "noah", label: "Noah Patel" },
        ]}
        placeholder="All owners"
      />,
    );

    const input = screen.getByRole("combobox", { name: /owners/i });

    await user.click(input);
    await user.type(input, "Mi");
    expect(screen.getByRole("option", { name: /mia chen/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /avery kim/i })).not.toBeInTheDocument();

    await user.keyboard("{ArrowDown}{Enter}");
    expect(
      screen.getByRole("button", { name: /remove mia chen/i }),
    ).toBeInTheDocument();
    expect(input).toHaveValue("");
    await waitFor(() => {
      expect(input).toHaveFocus();
    });

    await user.type(input, "No");
    expect(screen.getByRole("option", { name: /noah patel/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /mia chen/i })).not.toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(
      screen.getByRole("button", { name: /remove noah patel/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /remove mia chen/i }));
    expect(
      screen.queryByRole("button", { name: /remove mia chen/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove noah patel/i }),
    ).toBeInTheDocument();
  });

  it("localizes default overlay copy for zh-CN", async () => {
    const user = userEvent.setup();

    render(
      <LocaleProvider locale="zh-CN">
        <MultiComboBox
          label="负责人"
          items={[
            { value: "mia", label: "Mia Chen" },
            { value: "avery", label: "Avery Kim" },
          ]}
        />
      </LocaleProvider>,
    );

    const input = screen.getByRole("combobox", { name: /负责人/i });
    expect(input).toHaveAttribute("placeholder", "输入以搜索");
    expect(screen.getByRole("button", { name: "打开建议" })).toBeInTheDocument();

    await user.click(input);
    expect(screen.getAllByText("选择")).toHaveLength(2);

    await user.keyboard("{ArrowDown}{Enter}");

    expect(screen.getByRole("button", { name: "移除Avery Kim" })).toBeInTheDocument();
    expect(screen.getByText("已选")).toBeInTheDocument();
  });

  it("marks the field invalid and summarizes truncated tokens", () => {
    render(
      <MultiComboBox
        defaultValues={["mia", "avery", "noah"]}
        description="Select at least two reviewers."
        items={[
          { value: "mia", label: "Mia Chen" },
          { value: "avery", label: "Avery Kim" },
          { value: "noah", label: "Noah Patel" },
        ]}
        label="Review owners"
        maxVisibleValues={1}
        message="Review owners are required."
        valueState="error"
      />,
    );

    const input = screen.getByRole("combobox", { name: /review owners/i });
    const description = screen.getByText(/select at least two reviewers/i);
    const message = screen.getByText(/review owners are required/i);
    const overflow = screen.getByText("+2");

    expect(input).toHaveAttribute(
      "aria-describedby",
      `${description.getAttribute("id")} ${message.getAttribute("id")}`,
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(overflow).toHaveAttribute(
      "aria-label",
      "2 more selected: Avery Kim, Noah Patel",
    );
    expect(overflow).toHaveAttribute(
      "title",
      "2 more selected: Avery Kim, Noah Patel",
    );
  });
});
