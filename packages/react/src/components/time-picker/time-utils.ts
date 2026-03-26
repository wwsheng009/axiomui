export interface TimeParts {
  hour: number;
  minute: number;
  second: number;
}

export interface TimeDayPeriodLabels {
  am: string;
  pm: string;
}

type DayPeriodKind = "am" | "pm";

const timeValuePattern = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;

function createFormatter(locale: string, format: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale, {
    ...format,
    timeZone: "UTC",
  });
}

function createTimeDate(parts: TimeParts) {
  return new Date(Date.UTC(2000, 0, 1, parts.hour, parts.minute, parts.second, 0));
}

function normalizeInput(value: string) {
  return value.normalize("NFKC").trim();
}

function normalizeToken(value: string) {
  return normalizeInput(value)
    .toLowerCase()
    .replace(/[.\u3002]/g, "")
    .replace(/\s+/g, "");
}

function isValidRange(value: number, min: number, max: number) {
  return Number.isInteger(value) && value >= min && value <= max;
}

function coerceStep(step: number | undefined) {
  if (!Number.isFinite(step)) {
    return 1;
  }

  return Math.min(59, Math.max(1, Math.trunc(step!)));
}

function buildDayPeriodLookup(labels: TimeDayPeriodLabels) {
  const lookup = new Map<string, DayPeriodKind>();

  const variants: Array<[string, DayPeriodKind]> = [
    [labels.am, "am"],
    [labels.pm, "pm"],
    ["am", "am"],
    ["pm", "pm"],
    ["a.m", "am"],
    ["p.m", "pm"],
    ["a.m.", "am"],
    ["p.m.", "pm"],
  ];

  variants.forEach(([value, kind]) => {
    const token = normalizeToken(value);

    if (token) {
      lookup.set(token, kind);
    }
  });

  return lookup;
}

export function resolveTimeFormatOptions(
  format: Intl.DateTimeFormatOptions | undefined,
  secondStep: number | undefined,
) {
  return {
    hour: "numeric",
    minute: "2-digit",
    ...(secondStep !== undefined ? { second: "2-digit" } : {}),
    ...format,
  } satisfies Intl.DateTimeFormatOptions;
}

export function resolveHourCycle(
  locale: string,
  format: Intl.DateTimeFormatOptions,
) {
  return createFormatter(locale, format).resolvedOptions().hourCycle;
}

export function usesMeridiem(hourCycle: string | undefined) {
  return hourCycle === "h11" || hourCycle === "h12";
}

export function usesSeconds(format: Intl.DateTimeFormatOptions) {
  return format.second !== undefined;
}

export function parseTimeValue(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const match = value.trim().match(timeValuePattern);

  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = match[3] ? Number(match[3]) : 0;

  if (
    !isValidRange(hour, 0, 23) ||
    !isValidRange(minute, 0, 59) ||
    !isValidRange(second, 0, 59)
  ) {
    return null;
  }

  return { hour, minute, second } satisfies TimeParts;
}

export function serializeTimeParts(parts: TimeParts, includeSeconds: boolean) {
  const baseValue = `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;

  if (!includeSeconds) {
    return baseValue;
  }

  return `${baseValue}:${String(parts.second).padStart(2, "0")}`;
}

export function formatTimeParts(
  parts: TimeParts,
  locale: string,
  format: Intl.DateTimeFormatOptions,
) {
  return createFormatter(locale, format).format(createTimeDate(parts));
}

export function formatTimeValue(
  value: string,
  locale: string,
  format: Intl.DateTimeFormatOptions,
) {
  const parsedValue = parseTimeValue(value);

  return parsedValue ? formatTimeParts(parsedValue, locale, format) : "";
}

export function createTimePlaceholder(
  locale: string,
  format: Intl.DateTimeFormatOptions,
) {
  const hourCycle = resolveHourCycle(locale, format);
  const meridiem = usesMeridiem(hourCycle);
  const sampleTime = createTimeDate({
    hour: meridiem ? 9 : 13,
    minute: 5,
    second: usesSeconds(format) ? 7 : 0,
  });

  return createFormatter(locale, format)
    .formatToParts(sampleTime)
    .map((part) => {
      if (part.type === "hour") {
        if (part.value.length > 1) {
          return meridiem ? "hh" : "HH";
        }

        return meridiem ? "h" : "H";
      }

      if (part.type === "minute") {
        return "mm";
      }

      if (part.type === "second") {
        return "ss";
      }

      return part.value;
    })
    .join("");
}

export function getDayPeriodLabels(
  locale: string,
  format: Intl.DateTimeFormatOptions,
): TimeDayPeriodLabels {
  const formatter = createFormatter(locale, {
    hour: "numeric",
    hour12: true,
    ...format,
  });
  const morning = formatter
    .formatToParts(createTimeDate({ hour: 1, minute: 0, second: 0 }))
    .find((part) => part.type === "dayPeriod")?.value;
  const evening = formatter
    .formatToParts(createTimeDate({ hour: 13, minute: 0, second: 0 }))
    .find((part) => part.type === "dayPeriod")?.value;

  return {
    am: morning ?? "AM",
    pm: evening ?? "PM",
  };
}

export function parseTimeInput(
  value: string,
  locale: string,
  format: Intl.DateTimeFormatOptions,
) {
  const normalizedValue = normalizeInput(value);

  if (!normalizedValue) {
    return null;
  }

  const dayPeriodLabels = getDayPeriodLabels(locale, format);
  const dayPeriodLookup = buildDayPeriodLookup(dayPeriodLabels);
  const compactValue = normalizeToken(normalizedValue);
  let detectedDayPeriod: DayPeriodKind | null = null;

  dayPeriodLookup.forEach((kind, token) => {
    if (!detectedDayPeriod && compactValue.includes(token)) {
      detectedDayPeriod = kind;
    }
  });

  const numericParts = normalizedValue.match(/\d+/g) ?? [];

  if (numericParts.length === 0 || numericParts.length > 3) {
    return null;
  }

  let hourPart = numericParts[0] ?? "";
  let minutePart = numericParts[1] ?? "0";
  let secondPart = numericParts[2] ?? "0";
  let inputIncludesSeconds = numericParts.length >= 3;

  if (numericParts.length === 1) {
    if (hourPart.length === 3 || hourPart.length === 4) {
      minutePart = hourPart.slice(-2);
      hourPart = hourPart.slice(0, -2);
    } else if (hourPart.length === 5 || hourPart.length === 6) {
      inputIncludesSeconds = true;
      secondPart = hourPart.slice(-2);
      minutePart = hourPart.slice(-4, -2);
      hourPart = hourPart.slice(0, -4);
    }
  }

  const hour = Number(hourPart);
  const minute = Number(minutePart);
  const second = Number(secondPart);

  if (!Number.isFinite(hour) || !isValidRange(minute, 0, 59) || !isValidRange(second, 0, 59)) {
    return null;
  }

  if (!usesSeconds(format) && inputIncludesSeconds) {
    return null;
  }

  if (detectedDayPeriod) {
    if (!isValidRange(hour, 1, 12)) {
      return null;
    }

    return {
      hour: detectedDayPeriod === "pm" ? (hour % 12) + 12 : hour % 12,
      minute,
      second,
    } satisfies TimeParts;
  }

  if (!isValidRange(hour, 0, 23)) {
    return null;
  }

  return { hour, minute, second } satisfies TimeParts;
}

export function isTimeAllowed(
  parts: TimeParts,
  minuteStep: number | undefined,
  secondStep: number | undefined,
  includeSeconds: boolean,
) {
  const resolvedMinuteStep = coerceStep(minuteStep);
  const resolvedSecondStep = coerceStep(secondStep);

  if (parts.minute % resolvedMinuteStep !== 0) {
    return false;
  }

  if (!includeSeconds && parts.second !== 0) {
    return false;
  }

  if (includeSeconds && parts.second % resolvedSecondStep !== 0) {
    return false;
  }

  return true;
}

export function buildTimeUnitOptions(maxValue: number, step: number | undefined) {
  const resolvedStep = coerceStep(step);
  const values: number[] = [];

  for (let currentValue = 0; currentValue <= maxValue; currentValue += resolvedStep) {
    values.push(currentValue);
  }

  return values;
}

export function snapTimePartsToSteps(
  parts: TimeParts,
  minuteStep: number | undefined,
  secondStep: number | undefined,
  includeSeconds: boolean,
) {
  const resolvedMinuteStep = coerceStep(minuteStep);
  const resolvedSecondStep = coerceStep(secondStep);

  return {
    hour: parts.hour,
    minute: Math.floor(parts.minute / resolvedMinuteStep) * resolvedMinuteStep,
    second: includeSeconds
      ? Math.floor(parts.second / resolvedSecondStep) * resolvedSecondStep
      : 0,
  } satisfies TimeParts;
}

export function createDefaultTimeParts(
  minuteStep: number | undefined,
  secondStep: number | undefined,
  includeSeconds: boolean,
) {
  return snapTimePartsToSteps(
    { hour: 0, minute: 0, second: 0 },
    minuteStep,
    secondStep,
    includeSeconds,
  );
}

export function getDisplayHour(hour: number, meridiem: boolean) {
  if (!meridiem) {
    return hour;
  }

  const normalizedHour = hour % 12;

  return normalizedHour === 0 ? 12 : normalizedHour;
}

export function updateHourFromDisplayValue(
  currentValue: TimeParts,
  nextDisplayHour: number,
  meridiem: boolean,
) {
  if (!meridiem) {
    return {
      ...currentValue,
      hour: nextDisplayHour,
    } satisfies TimeParts;
  }

  const isPm = currentValue.hour >= 12;
  const normalizedHour = nextDisplayHour % 12;

  return {
    ...currentValue,
    hour: isPm ? normalizedHour + 12 : normalizedHour,
  } satisfies TimeParts;
}

export function updateDayPeriod(
  currentValue: TimeParts,
  nextPeriod: DayPeriodKind,
) {
  const displayHour = getDisplayHour(currentValue.hour, true);

  return {
    ...currentValue,
    hour: nextPeriod === "pm" ? (displayHour % 12) + 12 : displayHour % 12,
  } satisfies TimeParts;
}
