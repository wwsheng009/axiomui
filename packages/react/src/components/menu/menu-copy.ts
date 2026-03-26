export interface MenuCopy {
  back: string;
}

function isChineseLocale(locale: string) {
  return locale.toLowerCase().startsWith("zh");
}

export function getMenuCopy(locale: string): MenuCopy {
  if (isChineseLocale(locale)) {
    return {
      back: "返回",
    };
  }

  return {
    back: "Back",
  };
}
