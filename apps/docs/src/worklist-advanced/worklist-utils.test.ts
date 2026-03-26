import { describe, expect, it } from "vitest";

import {
  areDateRangeValuesEqual,
  formatWorklistDateLabel,
  formatWorklistDateRangeLabel,
  formatWorklistScheduleLabel,
  formatWorklistTimeLabel,
  matchesDateRangeFilter,
  matchesTimeFromFilter,
  normalizeDateRangeValue,
  normalizeTimeValue,
} from "./worklist-utils";

describe("worklist-utils", () => {
  it("normalizes date ranges and compares them safely", () => {
    const left = normalizeDateRangeValue({ start: "2026-04-01" });
    const right = normalizeDateRangeValue({ end: "", start: "2026-04-01" });

    expect(left).toEqual({ end: "", start: "2026-04-01" });
    expect(areDateRangeValuesEqual(left, right)).toBe(true);
  });

  it("normalizes canonical time values and rejects invalid ones", () => {
    expect(normalizeTimeValue("13:30")).toBe("13:30");
    expect(normalizeTimeValue("09:30:00")).toBe("09:30:00");
    expect(normalizeTimeValue("25:30")).toBe("");
    expect(normalizeTimeValue("下午 1:30")).toBe("");
  });

  it("applies date and time filters inclusively", () => {
    expect(
      matchesDateRangeFilter("2026-04-18", {
        end: "2026-04-18",
        start: "2026-04-01",
      }),
    ).toBe(true);
    expect(
      matchesDateRangeFilter("2026-03-31", {
        end: "",
        start: "2026-04-01",
      }),
    ).toBe(false);
    expect(matchesTimeFromFilter("13:30", "13:30")).toBe(true);
    expect(matchesTimeFromFilter("13:15", "13:30")).toBe(false);
  });

  it("formats zh-CN range and empty time labels with localized copy", () => {
    expect(
      formatWorklistDateRangeLabel(
        { end: "2026-04-18", start: "2026-04-01" },
        "zh-CN",
      ),
    ).toContain("至");
    expect(formatWorklistDateRangeLabel({ end: "", start: "" }, "zh-CN")).toBe(
      "任意日期",
    );
    expect(formatWorklistTimeLabel("", "zh-CN")).toBe("任意时间");
  });

  it("returns localized fallback labels for invalid and partial values", () => {
    expect(formatWorklistDateLabel("", "zh-CN")).toBe("未知日期");
    expect(
      formatWorklistDateRangeLabel({ end: "", start: "2026-04-01" }, "en-US"),
    ).toMatch(/^From /);
    expect(
      formatWorklistDateRangeLabel({ end: "2026-04-18", start: "" }, "zh-CN"),
    ).toMatch(/^截至 /);
  });

  it("formats combined schedule labels for en-US", () => {
    const label = formatWorklistScheduleLabel(
      {
        targetDate: "2026-04-18",
        targetTime: "13:30",
      },
      "en-US",
    );

    expect(label).toContain("2026");
    expect(label).toMatch(/1:30/);
  });
});
