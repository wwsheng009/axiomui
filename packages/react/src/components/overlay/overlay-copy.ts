export interface OverlayCopy {
  choose: string;
  closePopover: string;
  closeSuggestions: string;
  keepCustomValueHint: string;
  noMatchingItems: string;
  openSuggestions: string;
  searchPlaceholder: string;
  selectPlaceholder: string;
  selected: string;
}

function isChineseLocale(locale: string) {
  return locale.toLowerCase().startsWith("zh");
}

export function getOverlayCopy(locale: string): OverlayCopy {
  if (isChineseLocale(locale)) {
    return {
      choose: "选择",
      closePopover: "关闭弹层",
      closeSuggestions: "关闭建议",
      keepCustomValueHint: "按 Enter 保留当前输入。",
      noMatchingItems: "没有匹配项。",
      openSuggestions: "打开建议",
      searchPlaceholder: "输入以搜索",
      selectPlaceholder: "请选择",
      selected: "已选",
    };
  }

  return {
    choose: "Choose",
    closePopover: "Close popover",
    closeSuggestions: "Close suggestions",
    keepCustomValueHint: "Press Enter to keep your text.",
    noMatchingItems: "No matching items.",
    openSuggestions: "Open suggestions",
    searchPlaceholder: "Type to search",
    selectPlaceholder: "Select",
    selected: "Selected",
  };
}

export function getOverlayEmptyState(locale: string, allowCustomValue = false) {
  const copy = getOverlayCopy(locale);

  if (!allowCustomValue) {
    return copy.noMatchingItems;
  }

  return isChineseLocale(locale)
    ? `${copy.noMatchingItems}${copy.keepCustomValueHint}`
    : `${copy.noMatchingItems} ${copy.keepCustomValueHint}`;
}

export function getRemoveValueButtonLabel(valueLabel: string, locale: string) {
  return isChineseLocale(locale) ? `移除${valueLabel}` : `Remove ${valueLabel}`;
}

export function getOverflowValueSummary(
  valueLabels: string[],
  overflowCount: number,
  locale: string,
) {
  if (overflowCount <= 0) {
    return "";
  }

  if (isChineseLocale(locale)) {
    return valueLabels.length
      ? `还有 ${overflowCount} 项已选：${valueLabels.join("、")}`
      : `还有 ${overflowCount} 项已选`;
  }

  return valueLabels.length
    ? `${overflowCount} more selected: ${valueLabels.join(", ")}`
    : `${overflowCount} more selected`;
}
