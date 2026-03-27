import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { LocaleProvider } from "../../providers/locale-provider";
import { ComboBox } from "./combo-box";

describe("ComboBox", () => {
  it("filters options and commits the highlighted option from the keyboard", async () => {
    const user = userEvent.setup();

    render(
      <ComboBox
        label="Owner"
        items={[
          { value: "mia", label: "Mia Chen" },
          { value: "avery", label: "Avery Kim" },
          { value: "noah", label: "Noah Patel" },
        ]}
        placeholder="Search owners"
      />,
    );

    const input = screen.getByRole("combobox", { name: /owner/i });

    await user.click(input);
    await user.type(input, "Aver");
    await screen.findByRole("listbox");
    await user.keyboard("{ArrowDown}{Enter}");

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    expect(input).toHaveValue("Avery Kim");
  });

  it("localizes default overlay copy for zh-CN", async () => {
    const user = userEvent.setup();

    render(
      <LocaleProvider locale="zh-CN">
        <ComboBox
          allowCustomValue
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
    expect(screen.getByRole("button", { name: "关闭建议" })).toBeInTheDocument();

    await user.type(input, "zzz");
    expect(screen.getByText("没有匹配项。按 Enter 保留当前输入。")).toBeInTheDocument();
  });

  it("restores focus to the input after closing suggestions with Escape", async () => {
    const user = userEvent.setup();

    render(
      <ComboBox
        label="Owner"
        items={[
          { value: "mia", label: "Mia Chen" },
          { value: "avery", label: "Avery Kim" },
          { value: "noah", label: "Noah Patel" },
        ]}
      />,
    );

    const input = screen.getByRole("combobox", { name: /owner/i });

    await user.click(input);
    await screen.findByRole("listbox");
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  });

  it("closes on outside click and keeps focus on the next target", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <ComboBox
          label="Owner"
          items={[
            { value: "mia", label: "Mia Chen" },
            { value: "avery", label: "Avery Kim" },
            { value: "noah", label: "Noah Patel" },
          ]}
        />
        <button type="button">Next control</button>
      </div>,
    );

    const input = screen.getByRole("combobox", { name: /owner/i });
    const nextControl = screen.getByRole("button", { name: /next control/i });

    await user.click(input);
    await screen.findByRole("listbox");
    await user.click(nextControl);

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(nextControl).toHaveFocus();
    });
    expect(input).not.toHaveFocus();
  });

  it("exposes helper copy and invalid semantics on the field input", () => {
    render(
      <ComboBox
        label="Owner"
        description="Search the owner catalog."
        items={[
          { value: "mia", label: "Mia Chen" },
          { value: "avery", label: "Avery Kim" },
        ]}
        message="Choose an owner before saving."
        valueState="error"
      />,
    );

    const input = screen.getByRole("combobox", { name: /owner/i });
    const description = screen.getByText(/search the owner catalog/i);
    const message = screen.getByText(/choose an owner before saving/i);

    expect(input).toHaveAttribute(
      "aria-describedby",
      `${description.getAttribute("id")} ${message.getAttribute("id")}`,
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});
