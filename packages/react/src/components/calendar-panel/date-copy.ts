export interface DateCopy {
  clearDateRange: string;
  closeCalendar: string;
  editEndDate: string;
  editStartDate: string;
  editingEndDate: string;
  editingStartDate: string;
  endDate: string;
  endLabel: string;
  nextMonth: string;
  openCalendar: string;
  parseRangeError: string;
  previousMonth: string;
  rangeOrderError: string;
  rangeSeparator: string;
  selectDateRange: string;
  selectEndDate: string;
  selectStartDate: string;
  startDate: string;
  startLabel: string;
}

function isChineseLocale(locale: string) {
  return locale.toLowerCase().startsWith("zh");
}

function appendLabel(baseLabel: string | undefined, suffix: string, locale: string) {
  if (!baseLabel) {
    return suffix;
  }

  return isChineseLocale(locale) ? `${baseLabel}${suffix}` : `${baseLabel} ${suffix}`;
}

export function getDateCopy(locale: string): DateCopy {
  if (isChineseLocale(locale)) {
    return {
      clearDateRange: "清除日期范围",
      closeCalendar: "关闭日历",
      editEndDate: "编辑结束日期",
      editStartDate: "编辑开始日期",
      editingEndDate: "正在编辑结束日期。",
      editingStartDate: "正在编辑开始日期。",
      endDate: "结束日期",
      endLabel: "结束",
      nextMonth: "下个月",
      openCalendar: "打开日历",
      parseRangeError: "请输入允许范围内的有效日期。",
      previousMonth: "上个月",
      rangeOrderError: "开始日期不能晚于结束日期。",
      rangeSeparator: "至",
      selectDateRange: "请选择开始和结束日期。",
      selectEndDate: "选择结束日期",
      selectStartDate: "选择开始日期",
      startDate: "开始日期",
      startLabel: "开始",
    };
  }

  return {
    clearDateRange: "Clear date range",
    closeCalendar: "Close calendar",
    editEndDate: "Edit end date",
    editStartDate: "Edit start date",
    editingEndDate: "Editing end date.",
    editingStartDate: "Editing start date.",
    endDate: "End date",
    endLabel: "End",
    nextMonth: "Next month",
    openCalendar: "Open calendar",
    parseRangeError: "Enter valid dates within the allowed range.",
    previousMonth: "Previous month",
    rangeOrderError: "Start date must be on or before end date.",
    rangeSeparator: "to",
    selectDateRange: "Select a start and end date.",
    selectEndDate: "Select end date",
    selectStartDate: "Select start date",
    startDate: "Start date",
    startLabel: "Start",
  };
}

export function getLabeledDateFieldName(
  label: string | undefined,
  which: "start" | "end",
  locale: string,
) {
  const copy = getDateCopy(locale);

  return appendLabel(label, which === "start" ? copy.startDate : copy.endDate, locale);
}

export function getRangeEndpointButtonLabel(
  which: "start" | "end",
  valueLabel: string,
  locale: string,
) {
  const copy = getDateCopy(locale);

  if (isChineseLocale(locale)) {
    return `${which === "start" ? copy.editStartDate : copy.editEndDate}：${valueLabel}`;
  }

  return `${which === "start" ? copy.editStartDate : copy.editEndDate}: ${valueLabel}`;
}

export function formatRangeSummaryBoundary(
  kind: "min" | "max" | "start" | "end",
  valueLabel: string,
  locale: string,
) {
  if (isChineseLocale(locale)) {
    if (kind === "min") {
      return `最早 ${valueLabel}`;
    }

    if (kind === "max") {
      return `最晚 ${valueLabel}`;
    }

    if (kind === "start") {
      return `从 ${valueLabel}`;
    }

    return `到 ${valueLabel}`;
  }

  if (kind === "min" || kind === "start") {
    return `From ${valueLabel}`;
  }

  return `Until ${valueLabel}`;
}
