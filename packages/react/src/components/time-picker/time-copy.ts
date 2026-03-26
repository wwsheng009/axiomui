export interface TimeCopy {
  applyTime: string;
  closeTimePicker: string;
  decrementUnit: (unitLabel: string) => string;
  hourColumn: string;
  incrementUnit: (unitLabel: string) => string;
  invalidTime: string;
  meridiemColumn: string;
  minuteColumn: string;
  numericInput: (unitLabel: string) => string;
  openTimePicker: string;
  secondColumn: string;
  selectHour: (valueLabel: string) => string;
  selectMeridiem: (valueLabel: string) => string;
  selectMinute: (valueLabel: string) => string;
  selectSecond: (valueLabel: string) => string;
  selectTime: string;
}

function isChineseLocale(locale: string) {
  return locale.toLowerCase().startsWith("zh");
}

export function getTimeCopy(locale: string): TimeCopy {
  if (isChineseLocale(locale)) {
    return {
      applyTime: "应用时间",
      closeTimePicker: "关闭时间选择器",
      decrementUnit: (unitLabel) => `减少${unitLabel}`,
      hourColumn: "小时",
      incrementUnit: (unitLabel) => `增加${unitLabel}`,
      invalidTime: "请输入符合当前格式和步进规则的有效时间。",
      meridiemColumn: "上下午",
      minuteColumn: "分钟",
      numericInput: (unitLabel) => `输入${unitLabel}`,
      openTimePicker: "打开时间选择器",
      secondColumn: "秒",
      selectHour: (valueLabel) => `选择小时 ${valueLabel}`,
      selectMeridiem: (valueLabel) => `选择时段 ${valueLabel}`,
      selectMinute: (valueLabel) => `选择分钟 ${valueLabel}`,
      selectSecond: (valueLabel) => `选择秒 ${valueLabel}`,
      selectTime: "请选择时间",
    };
  }

  return {
    applyTime: "Apply time",
    closeTimePicker: "Close time picker",
    decrementUnit: (unitLabel) => `Decrease ${unitLabel.toLowerCase()}`,
    hourColumn: "Hour",
    incrementUnit: (unitLabel) => `Increase ${unitLabel.toLowerCase()}`,
    invalidTime: "Enter a valid time that matches the current format and step values.",
    meridiemColumn: "AM or PM",
    minuteColumn: "Minute",
    numericInput: (unitLabel) => `${unitLabel} input`,
    openTimePicker: "Open time picker",
    secondColumn: "Second",
    selectHour: (valueLabel) => `Select hour ${valueLabel}`,
    selectMeridiem: (valueLabel) => `Select period ${valueLabel}`,
    selectMinute: (valueLabel) => `Select minute ${valueLabel}`,
    selectSecond: (valueLabel) => `Select second ${valueLabel}`,
    selectTime: "Select time",
  };
}
